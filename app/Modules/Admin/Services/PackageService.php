<?php

namespace App\Modules\Admin\Services;

use App\Models\Packages;
use App\Models\ShippingRates;
use App\Models\Documents;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PackageService
{
    /**
     * Package shippers array (from original PHP file)
     */
    private $packageShippers = [
        'FedEx', 'UPS', 'DHL', 'USPS', 'Amazon', 'TNT', 'Aramex', 'EMS', 'Canada Post',
        'Royal Mail', 'La Poste', 'Deutsche Post', 'Correos', 'PostNL', 'Poste Italiane',
        'Poczta Polska', 'Österreichische Post', 'Swiss Post', 'Australia Post', 'Japan Post',
        'SF Express', 'YTO Express', 'ZTO Express', 'Best Express', 'Yunda Express',
        'STO Express', 'TTK Express', 'Deppon Express', 'Enter Custom Name'
    ];

    /**
     * Package merchants array (from original PHP file)
     */
    private $packageMerchants = [
        'Amazon', 'eBay', 'Walmart', 'Target', 'Best Buy', 'Home Depot', 'Lowe\'s',
        'Macy\'s', 'JCPenney', 'Kohl\'s', 'Nordstrom', 'Saks Fifth Avenue', 'Neiman Marcus',
        'Bloomingdale\'s', 'Costco', 'Sam\'s Club', 'BJ\'s Wholesale Club', 'Kroger',
        'Safeway', 'Publix', 'CVS Pharmacy', 'Walgreens', 'Rite Aid', 'GameStop',
        'Barnes & Noble', 'Bed Bath & Beyond', 'Bath & Body Works', 'Victoria\'s Secret',
        'American Eagle', 'Abercrombie & Fitch', 'Hollister', 'Forever 21', 'H&M',
        'Zara', 'Nike', 'Adidas', 'Under Armour', 'Lululemon', 'REI', 'Dick\'s Sporting Goods',
        'Petco', 'PetSmart', 'Chewy', 'Overstock', 'Wayfair', 'Enter Custom Name'
    ];

    /**
     * Get package shippers
     */
    public function getPackageShippers()
    {
        return $this->packageShippers;
    }

    /**
     * Get package merchants
     */
    public function getPackageMerchants()
    {
        return $this->packageMerchants;
    }

    /**
     * Get shipping rates for JavaScript
     */
    public function getShippingRatesForJS()
    {
        $rates = ShippingRates::where('is_active', true)->get();

        $shippingRates = [
            'insuranceRate' => $this->getShippingRate('insurance_rate', 1.5),
            'fuelSurcharge' => $this->getShippingRate('fuel_surcharge', 1.0),
            'incorrectShippingInfo' => $this->getShippingRate('incorrect_shipping_info', 5.0),
            'halfLbRate' => $this->getShippingRate('half_lb_rate', 6.0),
            'firstLbRate' => $this->getShippingRate('first_lb_rate', 8.0),
            'additionalLbRate' => $this->getShippingRate('additional_lb_rate', 3.0),
            'overTwentyLbRate' => $this->getShippingRate('over_twenty_lb_rate', 2.5),
        ];

        return $shippingRates;
    }

    /**
     * Get specific shipping rate
     */
    private function getShippingRate($rateName, $default = 0)
    {
        $rate = ShippingRates::where('rate_name', $rateName)
            ->where('is_active', true)
            ->first();

        return $rate ? (float)$rate->rate_value : (float)$default;
    }

    /**
     * Calculate shipping costs
     */
    public function calculateShipping($data)
    {
        $shippingMethod = $data['shipping_method'];
        $packageAmount = (float)($data['package_amount'] ?? 0);
        $packageWeight = (float)($data['package_weight'] ?? 0);
        $numberOfPieces = (int)($data['number_of_pieces'] ?? 1);

        $rates = $this->getShippingRatesForJS();

        // Calculate insurance
        $insurance = $packageAmount > 0
            ? $rates['insuranceRate'] * ceil($packageAmount / 100)
            : $rates['insuranceRate'];

        $packageFreightPrice = 0;
        $totalCharges = 0;

        switch ($shippingMethod) {
            case 'Airdrop Express':
                return $this->calculateExpressShipping($data, $rates);

            case 'Airdrop Standard':
                return $this->calculateStandardShipping($data, $rates);

            case 'Seadrop Standard':
                return $this->calculateSeadropShipping($data, $rates);

            default:
                throw new \Exception('Invalid shipping method');
        }
    }

    /**
     * Calculate Express shipping
     */
    private function calculateExpressShipping($data, $rates)
    {
        $packageAmount = (float)($data['package_amount'] ?? 0);
        $packageWeight = (float)($data['package_weight'] ?? 0);
        $numberOfPieces = (int)($data['number_of_pieces'] ?? 1);
        $dimensionsLbs = (float)($data['dimensions_lbs'] ?? 0);

        $insurance = $packageAmount > 0
            ? $rates['insuranceRate'] * ceil($packageAmount / 100)
            : $rates['insuranceRate'];

        $realWeight = $packageWeight * $numberOfPieces;
        $effectiveWeight = max($dimensionsLbs, $realWeight);

        if ($effectiveWeight < 1) {
            $weight = round($effectiveWeight * 100) / 100;
        } else {
            $weight = ceil($effectiveWeight);
        }

        // Express shipping calculation
        if ($weight > 0 && $weight < 1) {
            $freightPrice = (3 * floor($weight)) + 6;
        } elseif ($weight >= 1 && $weight < 2) {
            $freightPrice = (3 * floor($weight)) + 5;
        } else {
            $freightPrice = (3 * floor($weight)) + 4; // cost_freight_express = 4
        }

        $shippingPrice = $freightPrice + $rates['fuelSurcharge'] + $insurance;

        // Add incorrect shipping info charge if applicable
        $incorrectShippingCharge = 0;
        if (isset($data['incorrect_shipping_info']) && $data['incorrect_shipping_info'] === 'yes') {
            $incorrectShippingCharge = $rates['incorrectShippingInfo'];
            $shippingPrice += $incorrectShippingCharge;
        }

        $totalCharges = $shippingPrice + $packageAmount;
        $cifValue = $totalCharges - $rates['fuelSurcharge'];

        $additionalCharges = [
            'Freight' => $freightPrice,
            'Insurance' => $insurance,
            'Fuel' => $rates['fuelSurcharge'],
            'Customs Duty' => 0
        ];

        if ($incorrectShippingCharge > 0) {
            $additionalCharges['Incorrect Shipping Info'] = $incorrectShippingCharge;
        }

        return [
            'freight_price' => $freightPrice,
            'insurance' => $insurance,
            'fuel_surcharge' => $rates['fuelSurcharge'],
            'shipping_price' => $shippingPrice,
            'total_price' => $totalCharges,
            'cif_value' => round($cifValue, 2),
            'additional_charges' => $additionalCharges,
            'total_weight_lbs' => $effectiveWeight
        ];
    }

    /**
     * Calculate Standard shipping
     */
    private function calculateStandardShipping($data, $rates)
    {
        $packageAmount = (float)($data['package_amount'] ?? 0);
        $packageWeight = (float)($data['package_weight'] ?? 0);
        $numberOfPieces = (int)($data['number_of_pieces'] ?? 1);

        $insurance = $packageAmount > 0
            ? $rates['insuranceRate'] * ceil($packageAmount / 100)
            : $rates['insuranceRate'];

        $singleWeight = $packageWeight;
        if ($singleWeight < 1) {
            $finalWeight = round($singleWeight * 100) / 100;
        } else {
            $finalWeight = ceil($singleWeight);
        }

        // Weight charge calculation
        $freightRate = 0;

        if ($finalWeight <= 0.5) {
            $freightRate = $rates['halfLbRate'];
        } elseif ($finalWeight > 0.5 && $finalWeight <= 1) {
            $freightRate = $rates['firstLbRate'];
        } elseif ($finalWeight > 1 && $finalWeight <= 20) {
            $roundedWeight = ceil($finalWeight);
            $freightRate = $rates['firstLbRate'] + ($rates['additionalLbRate'] * ($roundedWeight - 1));
        } else { // > 20 lbs
            $freightRate = $rates['firstLbRate'] + ($rates['additionalLbRate'] * 19);
            $extraWeight = $finalWeight - 20;
            $freightRate += ($rates['overTwentyLbRate'] * $extraWeight);
        }

        $packageFreightPrice = round($freightRate * $numberOfPieces, 2);
        $shippingPrice = $packageFreightPrice + $rates['fuelSurcharge'] + $insurance;

        // Add incorrect shipping info charge if applicable
        $incorrectShippingCharge = 0;
        if (isset($data['incorrect_shipping_info']) && $data['incorrect_shipping_info'] === 'yes') {
            $incorrectShippingCharge = $rates['incorrectShippingInfo'];
            $shippingPrice += $incorrectShippingCharge;
        }

        $totalCharges = $shippingPrice + $packageAmount;
        $cifValue = $totalCharges - $rates['fuelSurcharge'];

        $additionalCharges = [
            'Freight' => $packageFreightPrice,
            'Insurance' => $insurance,
            'Fuel' => $rates['fuelSurcharge'],
            'Customs Duty' => 0
        ];

        if ($incorrectShippingCharge > 0) {
            $additionalCharges['Incorrect Shipping Info'] = $incorrectShippingCharge;
        }

        return [
            'freight_price' => $packageFreightPrice,
            'insurance' => $insurance,
            'fuel_surcharge' => $rates['fuelSurcharge'],
            'shipping_price' => $shippingPrice,
            'total_price' => $totalCharges,
            'cif_value' => round($cifValue, 2),
            'additional_charges' => $additionalCharges,
            'total_weight_lbs' => $packageWeight * $numberOfPieces
        ];
    }

    /**
     * Calculate Seadrop shipping
     */
    private function calculateSeadropShipping($data, $rates)
    {
        $packageAmount = (float)($data['package_amount'] ?? 0);
        $totalVolume = (float)($data['total_volume'] ?? 0);

        $insurance = $packageAmount > 0
            ? ($packageAmount * 0.1)
            : $rates['insuranceRate'];

        $tariff = $packageAmount * 0.3; // 30% tariff

        $minVolume = max(1, $totalVolume);
        $volumeCharges = $minVolume * 9; // $9 per cubic foot

        $totalCharges = $volumeCharges + $insurance + $tariff + $packageAmount;
        $cifValue = $totalCharges - $rates['fuelSurcharge'];

        $additionalCharges = [
            'Freight' => $volumeCharges,
            'Insurance' => $insurance,
            'Fuel' => 0, // No fuel surcharge for Seadrop
            'Customs Duty' => $tariff
        ];

        return [
            'freight_price' => $volumeCharges,
            'insurance' => $insurance,
            'fuel_surcharge' => 0,
            'shipping_price' => $volumeCharges + $insurance + $tariff,
            'total_price' => $totalCharges,
            'cif_value' => round($cifValue, 2),
            'additional_charges' => $additionalCharges,
            'total_volume' => $totalVolume
        ];
    }

    /**
     * Generate unique tracking code
     */
    public function generateTrackingCode()
    {
        do {
            $trackingCode = 'AIR' . strtoupper(Str::random(8)) . rand(100, 999);
        } while (Packages::where('package_tracking_code', $trackingCode)->exists());

        return $trackingCode;
    }

    /**
     * Generate invoice ID
     */
    public function generateInvoiceId()
    {
        $lastPackage = Packages::orderBy('package_id', 'desc')->first();
        $nextId = $lastPackage ? $lastPackage->package_id + 1 : 1;

        return 'INV' . str_pad($nextId, 6, '0', STR_PAD_LEFT);
    }

    /**
     * Handle file uploads
     */
    public function handleFileUploads($files)
    {
        $documentIds = [];

        foreach ($files as $file) {
            if ($file->isValid()) {
                // Check file size (2MB limit)
                if ($file->getSize() > 2 * 1024 * 1024) {
                    throw new \Exception('File size exceeds 2MB limit');
                }

                // Generate unique filename
                $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();

                // Store file
                $path = $file->storeAs('package_documents', $filename, 'public');

                // Create document record
                $document = Documents::create([
                    'doc_name' => $filename,
                    'doc_path' => '/storage/',
                    'doc_original_name' => $file->getClientOriginalName(),
                    'doc_type' => $file->getClientMimeType(),
                    'doc_size' => $file->getSize(),
                    'created_at' => now(),
                ]);

                $documentIds[] = $document->doc_id;
            }
        }

        return $documentIds;
    }

    /**
     * Serialize package dimensions
     */
    public function serializeDimensions($data)
    {
        $dimensions = [
            'package_length' => $data['package_length'] ?? 0,
            'package_width' => $data['package_width'] ?? 0,
            'package_height' => $data['package_height'] ?? 0
        ];

        return base64_encode(serialize($dimensions));
    }

    /**
     * Find package by courier number
     */
    public function findPackageByCourierNumber($courierNumber)
    {
        $package = Packages::with(['user', 'packageStatus'])
            ->where('package_couirer_number', $courierNumber)
            ->first();

        // If not found, try substring (handle long courier numbers)
        if (!$package && strlen($courierNumber) > 25) {
            $shortCourierNumber = substr($courierNumber, 8);
            $package = Packages::with(['user', 'packageStatus'])
                ->where('package_couirer_number', $shortCourierNumber)
                ->first();
        }

        return $package;
    }
}
