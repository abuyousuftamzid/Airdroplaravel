<?php

namespace App\Modules\Admin\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Packages;
use App\Models\Orders;
use App\Models\ShippingRates;
use App\Models\User;
use App\Models\Documents;
use App\Models\PackageStatus;
use App\Modules\Admin\Services\PackageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Illuminate\Support\Str;

class PackageController extends Controller
{
    protected $packageService;

    public function __construct(PackageService $packageService)
    {
        $this->packageService = $packageService;
    }

    /**
     * Display the package creation form
     */
    public function create()
    {
        $orders = Orders::with('user')->orderBy('order_date_time', 'desc')->get();

        $shippingRates = $this->packageService->getShippingRatesForJS();

        // Get package shippers and merchants from the old system
        $packageShippers = $this->packageService->getPackageShippers();
        $packageMerchants = $this->packageService->getPackageMerchants();

        return Inertia::render('Admin/Package/Create', [
            'orders' => $orders,
            'shippingRates' => $shippingRates,
            'packageShippers' => $packageShippers,
            'packageMerchants' => $packageMerchants,
            'shippingMethods' => [
                'Airdrop Express',
                'Airdrop Standard',
                'Seadrop Standard'
            ]
        ]);
    }

    /**
     * Store a new package
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'package_couirer_number' => 'required|string|min:5|max:35',
            'package_user_account_number' => 'required|string',
            'package_consignee' => 'required|string',
            'package_shipper' => 'required|string',
            'package_store' => 'required|string',
            'package_description' => 'required|string',
            'package_amount' => 'required|numeric|min:0',
            'number_of_pieces' => 'required|integer|min:1',
            'package_weight' => 'required|numeric|min:0',
            'shipping_method' => 'required|string|in:Airdrop Express,Airdrop Standard,Seadrop Standard',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        try {
            // Check if courier number already exists
            $existingPackage = Packages::where('package_couirer_number', $request->package_couirer_number)->first();
            if ($existingPackage) {
                return back()->withErrors(['package_couirer_number' => 'Package with this courier number already exists.'])->withInput();
            }

            // Find user by account number
            $user = User::where('user_account_number', $request->package_user_account_number)->first();
            if (!$user) {
                return back()->withErrors(['package_user_account_number' => 'Customer with this account number not found.'])->withInput();
            }

            // Calculate shipping prices
            $shippingCalculation = $this->packageService->calculateShipping($request->all());

            // Handle file uploads
            $documentIds = [];
            if ($request->hasFile('preorder_invoice')) {
                $documentIds = $this->packageService->handleFileUploads($request->file('preorder_invoice'));
            }

            // Create package data
            $packageData = [
                'packages_invoice_id' => $this->packageService->generateInvoiceId(),
                'package_tracking_code' => $this->packageService->generateTrackingCode(),
                'package_couirer_number' => $request->package_couirer_number,
                'shipping_method' => $request->shipping_method,
                'package_description' => $request->package_description,
                'package_admin_remarks' => $request->package_admin_remarks,
                'package_shipper' => $request->package_shipper,
                'package_store' => $request->package_store,
                'package_weight' => $request->package_weight,
                'package_weight_kg' => $request->package_weight_kg ?? ($request->package_weight / 2.2046),
                'package_user_id' => $user->user_id,
                'package_shipper_id' => Auth::user()->user_id,
                'package_user_account_number' => $request->package_user_account_number,
                'package_amount' => $request->package_amount,
                'package_orignal_price' => $request->package_amount,
                'package_shipping_price' => $shippingCalculation['cif_value'],
                'package_total_price' => $shippingCalculation['total_price'],
                'package_additional_charges' => base64_encode(serialize($shippingCalculation['additional_charges'])),
                'package_consignee' => $request->package_consignee,
                'pckaage_invoice' => $request->pckaage_invoice ?? '',
                'package_document_id' => !empty($documentIds) ? base64_encode(serialize($documentIds)) : null,
                'number_of_pieces' => $request->number_of_pieces,
                'package_status' => 1, // Pre-alert status
                'dimensions_lbs' => $request->dimensions_lbs ?? 0,
                'total_weight_lbs' => $request->total_weight_lbs ?? $request->package_weight,
                'package_total_volume' => $request->total_volume ?? 0,
                'package_length_array' => $this->packageService->serializeDimensions($request),
                'package_custom_duty' => $request->package_custom_duty ?? 0,
                'package_creation_date_time' => now(),
                'send_notification_email' => $request->send_email === 'yes',
                'invoice_required' => $request->invoice_required ?? 'yes',
                'address_required' => $request->address_required === 'yes',
                'package_updated_by' => Auth::user()->user_id,
                'package_updated_date' => now(),
            ];

            $package = Packages::create($packageData);

            return redirect()->route('admin.packages.show', $package->package_tracking_code)
                ->with('success', 'Package created successfully!');

        } catch (\Exception $e) {
            Log::error('Package creation failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Package creation failed. Please try again.'])->withInput();
        }
    }

    /**
     * Update an existing package
     */
    public function update(Request $request, $packageId)
    {
        $validator = Validator::make($request->all(), [
            'package_user_account_number' => 'required|string',
            'package_consignee' => 'required|string',
            'package_shipper' => 'required|string',
            'package_store' => 'required|string',
            'package_description' => 'required|string',
            'package_amount' => 'required|numeric|min:0',
            'number_of_pieces' => 'required|integer|min:1',
            'package_weight' => 'required|numeric|min:0',
            'shipping_method' => 'required|string|in:Airdrop Express,Airdrop Standard,Seadrop Standard',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        try {
            $package = Packages::findOrFail($packageId);

            // Find user by account number
            $user = User::where('user_account_number', $request->package_user_account_number)->first();
            if (!$user) {
                return back()->withErrors(['package_user_account_number' => 'Customer with this account number not found.'])->withInput();
            }

            // Calculate shipping prices
            $shippingCalculation = $this->packageService->calculateShipping($request->all());

            // Handle file uploads if new files are provided
            $documentIds = [];
            if ($request->hasFile('preorder_invoice')) {
                $documentIds = $this->packageService->handleFileUploads($request->file('preorder_invoice'));
            }

            // Update package data
            $updateData = [
                'shipping_method' => $request->shipping_method,
                'package_description' => $request->package_description,
                'package_admin_remarks' => $request->package_admin_remarks,
                'package_shipper' => $request->package_shipper,
                'package_store' => $request->package_store,
                'package_weight' => $request->package_weight,
                'package_weight_kg' => $request->package_weight_kg ?? ($request->package_weight / 2.2046),
                'package_user_id' => $user->user_id,
                'package_user_account_number' => $request->package_user_account_number,
                'package_amount' => $request->package_amount,
                'package_orignal_price' => $request->package_amount,
                'package_shipping_price' => $shippingCalculation['cif_value'],
                'package_total_price' => $shippingCalculation['total_price'],
                'package_additional_charges' => base64_encode(serialize($shippingCalculation['additional_charges'])),
                'package_consignee' => $request->package_consignee,
                'number_of_pieces' => $request->number_of_pieces,
                'dimensions_lbs' => $request->dimensions_lbs ?? 0,
                'total_weight_lbs' => $request->total_weight_lbs ?? $request->package_weight,
                'package_total_volume' => $request->total_volume ?? 0,
                'package_length_array' => $this->packageService->serializeDimensions($request),
                'package_custom_duty' => $request->package_custom_duty ?? 0,
                'send_notification_email' => $request->send_email === 'yes',
                'address_required' => $request->address_required === 'yes',
                'package_updated_by' => Auth::user()->user_id,
                'package_updated_date' => now(),
            ];

            // Update invoice if provided
            if ($request->has('pckaage_invoice')) {
                $updateData['pckaage_invoice'] = $request->pckaage_invoice;
            }

            // Update document IDs if new files uploaded
            if (!empty($documentIds)) {
                $updateData['package_document_id'] = base64_encode(serialize($documentIds));
            }

            $package->update($updateData);

            return redirect()->route('admin.packages.show', $package->package_tracking_code)
                ->with('success', 'Package updated successfully!');

        } catch (\Exception $e) {
            Log::error('Package update failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Package update failed. Please try again.'])->withInput();
        }
    }

    /**
     * Search for package by courier number
     */
    public function findByCourierNumber(Request $request)
    {
        $courierNumber = $request->package_couirer_number;

        if (strlen($courierNumber) < 5) {
            return response()->json(['status' => '0', 'message' => 'Courier number too short']);
        }

        try {
            $package = $this->packageService->findPackageByCourierNumber($courierNumber);

            if (!$package) {
                return response()->json(['status' => '0', 'message' => 'Package not found']);
            }

            // Check if package already exists (duplicate)
            $existingCount = Packages::where('package_couirer_number', $courierNumber)->count();
            if ($existingCount > 1) {
                return response()->json([
                    'status' => '2',
                    'message' => 'Duplicate package found',
                    'tracking_code' => $package->package_tracking_code
                ]);
            }

            // Return package data for form population
            $packageData = $package->toArray();

            // Decode additional charges and dimensions
            if ($package->package_additional_charges) {
                $packageData['additional_charges'] = unserialize(base64_decode($package->package_additional_charges));
            }

            if ($package->package_length_array) {
                $packageData['dimensions'] = unserialize(base64_decode($package->package_length_array));
            }

            // Get document data if exists
            if ($package->package_document_id) {
                $docIds = unserialize(base64_decode($package->package_document_id));
                $documents = Documents::whereIn('doc_id', $docIds)->get();
                $packageData['doc_data'] = $documents->toArray();
            }

            // Get user address info
            if ($package->user) {
                $packageData['user_address_line_1'] = $package->user->user_address_line_1 ?? '';
            }

            $packageData['status'] = '1';

            return response()->json($packageData);

        } catch (\Exception $e) {
            Log::error('Package search failed: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Search failed']);
        }
    }

    /**
     * Find customer by account number
     */
    public function findCustomerByAccountNumber(Request $request)
    {
        $accountNumber = $request->package_user_account_number;

        try {
            $user = User::where('user_account_number', $accountNumber)->first();

            if (!$user) {
                return response()->json(['status' => 'no']);
            }

            return response()->json([
                'status' => 'yes',
                'customer_name' => $user->user_first_name . ' ' . $user->user_last_name,
                'customer_address' => $user->user_address_line_1 ?? ''
            ]);

        } catch (\Exception $e) {
            Log::error('Customer search failed: ' . $e->getMessage());
            return response()->json(['status' => 'error']);
        }
    }

    /**
     * Show package edit form
     */
    public function edit($packageId)
    {
        $package = Packages::with(['user', 'packageStatus', 'shipper'])
            ->findOrFail($packageId);

        // Decode additional charges if exists
        $additionalCharges = [];
        if ($package->package_additional_charges) {
            $additionalCharges = unserialize(base64_decode($package->package_additional_charges));
        }

        // Get package documents
        $documents = [];
        if ($package->package_document_id) {
            $docIds = unserialize(base64_decode($package->package_document_id));
            $documents = Documents::whereIn('doc_id', $docIds)->get();
        }

        // Get shipping rates and other data needed for editing
        $shippingRates = $this->packageService->getShippingRatesForJS();
        $packageShippers = $this->packageService->getPackageShippers();
        $packageMerchants = $this->packageService->getPackageMerchants();

        return Inertia::render('Admin/Package/Edit', [
            'package' => $package,
            'additionalCharges' => $additionalCharges,
            'documents' => $documents,
            'shippingRates' => $shippingRates,
            'packageShippers' => $packageShippers,
            'packageMerchants' => $packageMerchants,
            'shippingMethods' => [
                'Airdrop Express',
                'Airdrop Standard',
                'Seadrop Standard'
            ]
        ]);
    }

    /**
     * Show package details
     */
    public function show($trackingCode)
    {
        $package = Packages::with(['user', 'packageStatus', 'shipper'])
            ->where('package_tracking_code', $trackingCode)
            ->firstOrFail();

        // Decode additional charges if exists
        $additionalCharges = [];
        if ($package->package_additional_charges) {
            $additionalCharges = unserialize(base64_decode($package->package_additional_charges));
        }

        // Get package documents
        $documents = [];
        if ($package->package_document_id) {
            $docIds = unserialize(base64_decode($package->package_document_id));
            $documents = Documents::whereIn('doc_id', $docIds)->get();
        }

        return Inertia::render('Admin/Package/Show', [
            'package' => $package,
            'additionalCharges' => $additionalCharges,
            'documents' => $documents
        ]);
    }

    /**
     * List all packages with filtering and pagination
     */
    public function index(Request $request)
    {
        // Get package statuses for filter dropdown
        $packageStatuses = PackageStatus::orderBy('sort_by', 'asc')->get();

        // Get initial data for the page
        $initialData = $this->getPackageData($request, 1, 10);
        // dd($initialData);
        $totalCount = $this->getTotalPackagesCount();

        return Inertia::render('Admin/Package/Index', [
            'packageStatuses' => $packageStatuses,
            'initialData' => $initialData,
            'totalCount' => $totalCount,
            'filters' => [
                'package_status' => $request->get('package_status', ''),
                'pickup_location' => $request->get('pickup_location', ''),
                'from_creation_date' => $request->get('from_creation_date', ''),
                'to_creation_date' => $request->get('to_creation_date', ''),
                'from_update_date' => $request->get('from_update_date', ''),
                'to_update_date' => $request->get('to_update_date', ''),
                'package_status_date' => $request->get('package_status_date', ''),
                'package_type' => $request->get('package_type', 'ST'),
                'search' => $request->get('search', '')
            ]
        ]);
    }

    /**
     * Get packages data for DataTables server-side processing
     */
    public function getData(Request $request)
    {
        try {
            $draw = $request->get('draw', 1);
            $start = $request->get('start', 0);
            $length = $request->get('length', 10);

            // Handle search parameter properly
            $search = $request->get('search', []);
            $searchValue = '';
            if (is_array($search) && isset($search['value'])) {
                $searchValue = $search['value'];
            } elseif (is_string($search)) {
                $searchValue = $search;
            }

            // Also check for searchValue parameter directly (from our React component)
            if (empty($searchValue) && $request->has('searchValue')) {
                $searchValue = $request->get('searchValue', '');
            }

            // Handle order parameter properly
            $order = $request->get('order', []);
            $orderColumn = 0;
            $orderDir = 'desc';
            if (is_array($order) && isset($order[0])) {
                $orderColumn = $order[0]['column'] ?? 0;
                $orderDir = $order[0]['dir'] ?? 'desc';
            }

            // Get filter parameters - ensure all values are strings
            $filters = [
                'package_status' => (string) $request->get('package_status', ''),
                'pickup_location' => (string) $request->get('pickup_location', ''),
                'from_creation_date' => (string) $request->get('from_creation_date', ''),
                'to_creation_date' => (string) $request->get('to_creation_date', ''),
                'from_update_date' => (string) $request->get('from_update_date', ''),
                'to_update_date' => (string) $request->get('to_update_date', ''),
                'package_status_date' => (string) $request->get('package_status_date', ''),
                'package_type' => (string) $request->get('package_type', 'ST'),
                'search' => (string) $searchValue
            ];

            // Get total count without filters
            $totalRecords = $this->getTotalPackagesCount();

            // Get filtered count
            $totalFilteredRecords = $this->getFilteredPackagesCount($filters);

            // Get packages data
            $packages = $this->getPackagesData($filters, $start, $length, $orderColumn, $orderDir);

            // Format data for DataTables
            $formattedData = $this->formatPackagesForDataTable($packages);

            return response()->json([
                'draw' => intval($draw),
                'recordsTotal' => $totalRecords,
                'recordsFiltered' => $totalFilteredRecords,
                'data' => $formattedData
            ]);

        } catch (\Exception $e) {
            // Log error using simple error_log to avoid facade issues
            error_log('Package data fetch failed: ' . $e->getMessage());
            return response()->json([
                'draw' => intval($request->get('draw', 1)),
                'recordsTotal' => 0,
                'recordsFiltered' => 0,
                'data' => [],
                'error' => 'An error occurred while processing the request: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Export packages to CSV
     */
    public function exportCsv(Request $request)
    {
        try {
            // Handle search parameter - check both 'search' and direct parameter
            $searchValue = $request->get('search', '');

            // Get filter parameters - ensure all values are strings (same as getData method)
            $filters = [
                'package_status' => (string) $request->get('package_status', ''),
                'pickup_location' => (string) $request->get('pickup_location', ''),
                'from_creation_date' => (string) $request->get('from_creation_date', ''),
                'to_creation_date' => (string) $request->get('to_creation_date', ''),
                'from_update_date' => (string) $request->get('from_update_date', ''),
                'to_update_date' => (string) $request->get('to_update_date', ''),
                'package_status_date' => (string) $request->get('package_status_date', ''),
                'package_type' => (string) $request->get('package_type', 'ST'),
                'search' => (string) $searchValue
            ];

            // Get all packages matching filters (no pagination for export, larger limit)
            $packages = $this->getPackagesData($filters, 0, 50000, 7, 'desc');

            // Check if we have packages to export
            if ($packages->isEmpty()) {
                return response()->json([
                    'error' => 'No packages found matching the selected criteria'
                ], 404);
            }

            $csvData = $this->formatPackagesForCsv($packages);

            $filename = 'packages_export_' . date('Y-m-d_H-i-s') . '.csv';

            return response()->streamDownload(function () use ($csvData) {
                echo $csvData;
            }, $filename, [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="' . $filename . '"',
                'Cache-Control' => 'no-cache, no-store, must-revalidate',
                'Pragma' => 'no-cache',
                'Expires' => '0'
            ]);

        } catch (\Exception $e) {
            error_log('Package CSV export failed: ' . $e->getMessage());
            return response()->json([
                'error' => 'Export failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get shipping rates for JavaScript
     */
    public function getShippingRates()
    {
        return response()->json($this->packageService->getShippingRatesForJS());
    }

    /**
     * Calculate shipping cost
     */
    public function calculateShipping(Request $request)
    {
        try {
            $calculation = $this->packageService->calculateShipping($request->all());
            return response()->json($calculation);
        } catch (\Exception $e) {
            Log::error('Shipping calculation failed: ' . $e->getMessage());
            return response()->json(['error' => 'Calculation failed'], 500);
        }
    }

    /**
     * Get package data with filters and pagination
     */
    private function getPackageData(Request $request, $page = 1, $perPage = 10)
    {
        $filters = [
            'package_status' => $request->get('package_status', ''),
            'pickup_location' => $request->get('pickup_location', ''),
            'from_creation_date' => $request->get('from_creation_date', ''),
            'to_creation_date' => $request->get('to_creation_date', ''),
            'from_update_date' => $request->get('from_update_date', ''),
            'to_update_date' => $request->get('to_update_date', ''),
            'package_status_date' => $request->get('package_status_date', ''),
            'package_type' => $request->get('package_type', 'ST'),
            'search' => $request->get('search', '')
        ];
        // dd($filters);

        $start = ($page - 1) * $perPage;
        $packages = $this->getPackagesData($filters, $start, $perPage, 7, 'desc');

        return $this->formatPackagesForDataTable($packages);
    }

    /**
     * Get packages with filters, pagination, and sorting
     */
    private function getPackagesData($filters, $start, $length, $orderColumn, $orderDir)
    {
        try {
            $query = Packages::with(['user', 'packageStatus', 'shipper'])
                ->where('package_status', '!=', 1)
                ->where('status', 1);

            // Apply filters
            $this->applyFilters($query, $filters);

            // Apply search
            if (!empty($filters['search'])) {
                $searchTerm = $filters['search'];
                $query->where(function ($q) use ($searchTerm) {
                    $q->where('package_user_account_number', 'like', "%{$searchTerm}%")
                      ->orWhere('package_couirer_number', 'like', "%{$searchTerm}%")
                      ->orWhere('package_tracking_code', 'like', "%{$searchTerm}%")
                      ->orWhere('package_consignee', 'like', "%{$searchTerm}%");
                });
            }

            // Apply sorting
            $this->applySorting($query, $orderColumn, $orderDir);

            // Apply pagination and return results
            return $query->offset($start)->limit($length)->get();

        } catch (\Exception $e) {
            error_log('Error in getPackagesData: ' . $e->getMessage());
            return collect([]); // Return empty collection on error
        }
    }

    /**
     * Apply filters to the query
     */
    private function applyFilters($query, $filters)
    {
        // Package status filter - match old system format exactly
        if (!empty($filters['package_status']) && $filters['package_status'] !== 'all') {
            $statusId = str_replace('status_', '', $filters['package_status']);
            $query->where('package_status', $statusId);
        }

        // Pickup location filter - match old system LIKE pattern exactly
        if (!empty($filters['pickup_location']) && $filters['pickup_location'] !== 'all') {
            $query->where('pickup_location', 'like', $filters['pickup_location'] . '%');
        }

        // Update date range filter (from_date/to_date in old system maps to package_updated_date)
        if (!empty($filters['from_update_date'])) {
            $query->whereDate('package_updated_date', '>=', $filters['from_update_date']);
        }
        if (!empty($filters['to_update_date'])) {
            $query->whereDate('package_updated_date', '<=', $filters['to_update_date']);
        }

        // Creation date range filter (from_create_date/to_create_date in old system)
        if (!empty($filters['from_creation_date'])) {
            $query->whereDate('package_creation_date_time', '>=', $filters['from_creation_date']);
        }
        if (!empty($filters['to_creation_date'])) {
            $query->whereDate('package_creation_date_time', '<=', $filters['to_creation_date']);
        }

        // Package status updated date filter - exact date match like old system
        if (!empty($filters['package_status_date'])) {
            $query->whereDate('package_status_updated_date', $filters['package_status_date']);
        }

        // Package type filter - match old system logic exactly
        if (!empty($filters['package_type'])) {
            switch ($filters['package_type']) {
                case 'ES': // Express - match old system condition
                    $query->where(function ($q) {
                        $q->where('shipping_method', 'Airdrop Express')
                          ->orWhere('package_tracking_code', 'like', '%ES');
                    });
                    break;
                case 'SD': // SeaDrop - match old system condition
                    $query->where(function ($q) {
                        $q->where('shipping_method', 'Seadrop Standard')
                          ->orWhere('package_tracking_code', 'like', '%SD');
                    });
                    break;
                case 'ST': // Standard - match old system condition exactly
                default:
                    $query->where(function ($q) {
                        $q->where('shipping_method', 'Airdrop Standard')
                          ->orWhere(function ($subQ) {
                              $subQ->where('package_tracking_code', 'not like', '%SD')
                                   ->where('package_tracking_code', 'not like', '%ES');
                          });
                    });
                    break;
            }
        }
    }

    /**
     * Apply sorting to the query
     */
    private function applySorting($query, $orderColumn, $orderDir)
    {
        $validColumns = [
            'package_user_account_number',
            'package_consignee',
            'package_couirer_number',
            'package_tracking_code',
            'package_description',
            'package_status',
            'pickup_location',
            'package_creation_date_time',
            'package_updated_date',
            'package_weight'
        ];

        $columnMap = [
            0 => 'package_user_account_number',
            1 => 'package_consignee',
            2 => 'package_couirer_number',
            3 => 'package_tracking_code',
            4 => 'package_description',
            5 => 'package_status',
            6 => 'pickup_location',
            7 => 'package_creation_date_time',
            8 => 'package_updated_date',
            9 => 'package_weight'
        ];

        $sortColumn = $columnMap[$orderColumn] ?? 'package_creation_date_time';
        $sortDirection = strtoupper($orderDir) === 'ASC' ? 'ASC' : 'DESC';

        // dd($sortColumn, $sortDirection);

        if (in_array($sortColumn, $validColumns)) {
            $query->orderBy($sortColumn, $sortDirection);
        } else {
            $query->orderBy('package_creation_date_time', 'DESC')
                  ->orderBy('package_updated_date', 'DESC');
        }
    }

    /**
     * Get total packages count
     */
    private function getTotalPackagesCount()
    {
        return Packages::where('package_status', '!=', 1)
                      ->where('status', 1)
                      ->count();
    }

    /**
     * Get filtered packages count
     */
    private function getFilteredPackagesCount($filters)
    {
        $query = Packages::where('package_status', '!=', 1)
                        ->where('status', 1);

        $this->applyFilters($query, $filters);

        if (!empty($filters['search'])) {
            $searchTerm = $filters['search'];
            $query->where(function ($q) use ($searchTerm) {
                $q->where('package_user_account_number', 'like', "%{$searchTerm}%")
                  ->orWhere('package_couirer_number', 'like', "%{$searchTerm}%")
                  ->orWhere('package_tracking_code', 'like', "%{$searchTerm}%")
                  ->orWhere('package_consignee', 'like', "%{$searchTerm}%");
            });
        }

        return $query->count();
    }

    /**
     * Format packages for DataTables
     */
    private function formatPackagesForDataTable($packages)
    {
        return $packages->map(function ($package) {
            // Format account number as clickable link
            $accountNumber = '<a href="#" class="text-primary text-decoration-underline">#AIR-' . $package->package_user_account_number . '</a>';

            // Format courier number (truncate if too long)
            $courierNumber = $package->package_couirer_number;
            if (strlen($courierNumber) > 14) {
                $courierNumber = substr($courierNumber, 0, 12) . '..';
            }
            if (empty($courierNumber)) {
                $courierNumber = '-';
            }

            // Format package status with color
            $statusName = $package->packageStatus->package_status_name ?? 'Unknown';
            $statusColor = $package->packageStatus->color_code ?? '#000000';
            $packageStatus = '<span style="color: ' . $statusColor . ';"><b>' . $statusName . '</b></span>';

            // Add status update info if available
            if ($package->package_status_updated_by && $package->package_status_updated_date) {
                $updatedBy = is_numeric($package->package_status_updated_by)
                    ? $package->packageStatus->package_status_name ?? 'System'
                    : $package->package_status_updated_by;

                $packageStatus .= '<br/><small><span class="badge badge-success">' . $updatedBy . '</span> ' .
                                 '<span class="badge badge-success">' . $package->package_status_updated_date->format('d-M-Y H:i:s') . '</span></small>';
            }

            // Format tracking code as clickable link
            $trackingCode = '<a href="' . route('admin.packages.show', $package->package_tracking_code) . '" target="_blank" class="text-primary text-decoration-underline">' .
                           htmlspecialchars($package->package_tracking_code) . '</a>';

            // Format dates
            $creationDate = $package->package_creation_date_time
                ? (is_string($package->package_creation_date_time)
                    ? \Carbon\Carbon::parse($package->package_creation_date_time)->format('d-M-Y H:i:s')
                    : $package->package_creation_date_time->format('d-M-Y H:i:s'))
                : 'N/A';

            $updateDate = $package->package_updated_date
                ? (is_string($package->package_updated_date)
                    ? \Carbon\Carbon::parse($package->package_updated_date)->format('d-M-Y H:i:s')
                    : $package->package_updated_date->format('d-M-Y H:i:s'))
                : $creationDate;

            // Format weight
            $weight = $package->package_weight < 1 ? (float)$package->package_weight : $package->package_weight;
            $packageWeight = $weight . 'LBS';

            // Generate action buttons
            $actionButtons = $this->generateActionButtons($package);

            return [
                'package_user_account_number' => $accountNumber,
                'package_consignee' => strtoupper($package->package_consignee),
                'package_couirer_number' => $courierNumber,
                'package_tracking_code' => $trackingCode,
                'package_description' => $package->package_description,
                'package_status' => $packageStatus,
                'pickup_location' => $package->pickup_location,
                'package_creation_date_time' => $creationDate,
                'package_updated_date' => $updateDate,
                'package_weight' => $packageWeight,
                'action_btns' => $actionButtons
            ];
        });
    }

    /**
     * Generate action buttons for package
     */
    private function generateActionButtons($package)
    {
        $viewInvoice = '<a href="' . route('admin.packages.show', $package->package_tracking_code) . '" class="dropdown-item" target="_blank">View Invoice</a>';
        $packageNotes = '<a href="#" class="dropdown-item">Package Notes</a>';

        if ($package->package_status == 8) { // Delivered
            return '<div class="dropdown">
                        <button class="btn btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
                            Action <i class="fa fa-chevron-down"></i>
                        </button>
                        <div class="dropdown-menu">
                            ' . $viewInvoice . '
                            <div class="dropdown-divider"></div>
                            ' . $packageNotes . '
                        </div>
                    </div>';
        } else {
            $updatePackage = '<a href="' . route('admin.packages.edit', $package->package_id) . '" class="dropdown-item" target="_blank">Update Package</a>';
            $createLabel = '<a href="#" class="dropdown-item">Create Label</a>';
            $changeStatus = '<a href="#" class="dropdown-item">Change Status</a>';
            $addCharges = '<a href="#" class="dropdown-item">Add Charges</a>';

            return '<div class="dropdown">
                        <button class="btn btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
                            Action <i class="fa fa-chevron-down"></i>
                        </button>
                        <div class="dropdown-menu">
                            ' . $updatePackage . '
                            <div class="dropdown-divider"></div>
                            ' . $createLabel . '
                            <div class="dropdown-divider"></div>
                            ' . $changeStatus . '
                            <div class="dropdown-divider"></div>
                            ' . $viewInvoice . '
                            <div class="dropdown-divider"></div>
                            ' . $addCharges . '
                            <div class="dropdown-divider"></div>
                            ' . $packageNotes . '
                        </div>
                    </div>';
        }
    }

    /**
     * Format packages for CSV export
     */
    private function formatPackagesForCsv($packages)
    {
        $headers = [
            'Customer Account',
            'Customer Name',
            'Courier Number',
            'Tracking Code',
            'Package Description',
            'Package Status',
            'Pickup Location',
            'Creation Date',
            'Last Update Date',
            'Weight'
        ];

        $csvData = implode(',', $headers) . "\n";

        foreach ($packages as $package) {
            try {
                // Format dates for CSV with better null handling
                $creationDate = 'N/A';
                if ($package->package_creation_date_time) {
                    try {
                        $creationDate = is_string($package->package_creation_date_time)
                            ? \Carbon\Carbon::parse($package->package_creation_date_time)->format('d-M-Y H:i:s')
                            : $package->package_creation_date_time->format('d-M-Y H:i:s');
                    } catch (\Exception $e) {
                        $creationDate = 'Invalid Date';
                    }
                }

                $updateDate = '';
                if ($package->package_updated_date) {
                    try {
                        $updateDate = is_string($package->package_updated_date)
                            ? \Carbon\Carbon::parse($package->package_updated_date)->format('d-M-Y H:i:s')
                            : $package->package_updated_date->format('d-M-Y H:i:s');
                    } catch (\Exception $e) {
                        $updateDate = 'Invalid Date';
                    }
                }

                $row = [
                    '#AIR-' . ($package->package_user_account_number ?? ''),
                    strtoupper($package->package_consignee ?? ''),
                    $package->package_couirer_number ?? '',
                    $package->package_tracking_code ?? '',
                    $package->package_description ?? '',
                    ($package->packageStatus && $package->packageStatus->package_status_name)
                        ? $package->packageStatus->package_status_name
                        : 'Unknown',
                    $package->pickup_location ?? '',
                    $creationDate,
                    $updateDate,
                    ($package->package_weight ?? '0') . 'LBS'
                ];

                $csvData .= implode(',', array_map(function($field) {
                    return '"' . str_replace('"', '""', (string)$field) . '"';
                }, $row)) . "\n";

            } catch (\Exception $e) {
                error_log('Error formatting package for CSV: ' . $e->getMessage());
                // Skip this package and continue
                continue;
            }
        }

        return $csvData;
    }
}
