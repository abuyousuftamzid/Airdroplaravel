import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Tabs, Tab, Box } from '@mui/material';

export default function CreatePackage({ auth, orders, shippingRates, packageShippers, packageMerchants, shippingMethods }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        package_couirer_number: '',
        package_user_account_number: '',
        package_consignee: '',
        package_shipper: '',
        package_store: '',
        package_description: '',
        package_admin_remarks: '',
        package_amount: '0.00',
        number_of_pieces: 1,
        package_weight: '0.00',
        package_weight_kg: '0.00',
        package_length: '0.00',
        package_width: '0.00',
        package_height: '0.00',
        total_volume: '0.000',
        dimensions_lbs: '0.00',
        total_weight_lbs: '0.00',
        package_custom_duty: '',
        shipping_method: 'Airdrop Standard',
        send_email: false,
        invoice_required: 'yes',
        address_required: false,
        incorrect_shipping_info: false,
        pckaage_invoice: '',
        preorder_invoice: null,
    });

    const [formMode, setFormMode] = useState('create'); // 'create' or 'update'
    const [packageFound, setPackageFound] = useState(false);
    const [courierMessage, setCourierMessage] = useState('');
    const [customerMessage, setCustomerMessage] = useState('');
    const [activeTab, setActiveTab] = useState('standard');
    const [showVolumeFields, setShowVolumeFields] = useState(false);
    const [showWeightFields, setShowWeightFields] = useState(true);
    const [showIncorrectShippingInfo, setShowIncorrectShippingInfo] = useState(true);
    const [isCalculating, setIsCalculating] = useState(false);
    const [packageId, setPackageId] = useState('');

    // Handle courier number lookup with debounce
    useEffect(() => {
        if (data.package_couirer_number.length >= 5) {
            const timeoutId = setTimeout(() => {
                handleCourierLookup(data.package_couirer_number);
            }, 500);
            return () => clearTimeout(timeoutId);
        } else {
            setCourierMessage('');
            setFormMode('create');
            setPackageFound(false);
        }
    }, [data.package_couirer_number]);

    // Handle customer account lookup
    useEffect(() => {
        if (data.package_user_account_number.length > 3) {
            handleCustomerLookup(data.package_user_account_number);
        }
    }, [data.package_user_account_number]);

    // Calculate volume when dimensions change
    useEffect(() => {
        if (data.package_length && data.package_width && data.package_height && data.number_of_pieces) {
            const volume = (parseFloat(data.package_length) * parseFloat(data.package_width) * parseFloat(data.package_height) / 1728) * parseInt(data.number_of_pieces);
            const dimensionsWeight = (parseFloat(data.package_length) * parseFloat(data.package_width) * parseFloat(data.package_height) / 139) * parseInt(data.number_of_pieces);

            setData(prev => ({
                ...prev,
                total_volume: volume.toFixed(3),
                dimensions_lbs: dimensionsWeight.toFixed(2),
                total_weight_lbs: Math.max(dimensionsWeight, parseFloat(data.package_weight) * parseInt(data.number_of_pieces)).toFixed(2)
            }));
        }
    }, [data.package_length, data.package_width, data.package_height, data.number_of_pieces, data.package_weight]);

    // Convert weight between lbs and kg
    useEffect(() => {
        if (data.package_weight) {
            const weightKg = (parseFloat(data.package_weight) / 2.2046).toFixed(2);
            setData(prev => ({ ...prev, package_weight_kg: weightKg }));
        }
    }, [data.package_weight]);

    const handleCourierLookup = async (courierNumber) => {
        try {
            const response = await fetch(route('admin.packages.find-by-courier'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                body: JSON.stringify({ package_couirer_number: courierNumber }),
            });

            const result = await response.json();

            if (result.status === '0') {
                // Package not found - clear form for new creation
                setCourierMessage('');
                setFormMode('create');
                setPackageFound(false);
                resetFormExceptCourier();
            } else if (result.status === '2') {
                // Duplicate package
                setCourierMessage(`Package already exists. <a href="/admin/packages/${result.tracking_code}" target="_blank">Click here to view the existing package</a>`);
                resetFormExceptCourier();
            } else if (result.package_id) {
                // Package found - populate form for update
                setCourierMessage('Package found!');
                setFormMode('update');
                setPackageFound(true);
                setPackageId(result.package_id);
                populateFormFromPackage(result);
            }
        } catch (error) {
            console.error('Courier lookup failed:', error);
            setCourierMessage('Error checking tracking number. Please try again.');
        }
    };

    const handleCustomerLookup = async (accountNumber) => {
        try {
            const response = await fetch(route('admin.packages.find-customer'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                body: JSON.stringify({ package_user_account_number: accountNumber }),
            });

            const result = await response.json();

            if (result.status === 'yes') {
                setData(prev => ({ ...prev, package_consignee: result.customer_name }));
                setCustomerMessage('');

                if (!result.customer_address) {
                    setData(prev => ({ ...prev, address_required: true }));
                    setCustomerMessage('Note: Notification email and message will be sent to the customer for uploading address updates and invoices.');
                }
            } else {
                setData(prev => ({ ...prev, package_consignee: 'No Consignee Found for Current account number!' }));
                setCustomerMessage('');
            }
        } catch (error) {
            console.error('Customer lookup failed:', error);
            setCustomerMessage('Error looking up customer. Please try again.');
        }
    };

    const resetFormExceptCourier = () => {
        const courierNumber = data.package_couirer_number;
        reset();
        setData(prev => ({ ...prev, package_couirer_number: courierNumber, shipping_method: 'Airdrop Standard' }));
    };

    const populateFormFromPackage = (packageData) => {
        setData(prev => ({
            ...prev,
            package_user_account_number: packageData.package_user_account_number || '',
            package_consignee: packageData.package_consignee || '',
            package_shipper: packageData.package_shipper || '',
            package_store: packageData.package_store || '',
            package_description: packageData.package_description || '',
            package_admin_remarks: packageData.package_admin_remarks || '',
            package_amount: (parseFloat(packageData.package_amount) || 0).toFixed(2),
            number_of_pieces: packageData.number_of_pieces || 1,
            package_weight: (parseFloat(packageData.package_weight) || 0).toFixed(2),
            package_weight_kg: (parseFloat(packageData.package_weight_kg) || 0).toFixed(2),
            package_length: (parseFloat(packageData.package_length) || 0).toFixed(2),
            package_width: (parseFloat(packageData.package_width) || 0).toFixed(2),
            package_height: (parseFloat(packageData.package_height) || 0).toFixed(2),
            total_volume: (parseFloat(packageData.total_volume) || 0).toFixed(3),
            dimensions_lbs: (parseFloat(packageData.dimensions_lbs) || 0).toFixed(2),
            total_weight_lbs: (parseFloat(packageData.total_weight_lbs) || 0).toFixed(2),
            package_custom_duty: packageData.package_custom_duty || '',
            shipping_method: packageData.shipping_method || 'Airdrop Standard',
            pckaage_invoice: packageData.pckaage_invoice || '',
            send_email: packageData.send_email === 'yes',
            address_required: packageData.address_required === 'yes',
        }));

        // Set active tab based on shipping method
        if (packageData.shipping_method === 'Airdrop Express') {
            handleShippingMethodChange('express', 'Airdrop Express');
        } else if (packageData.shipping_method === 'Seadrop Standard') {
            handleShippingMethodChange('seadrop', 'Seadrop Standard');
        } else {
            handleShippingMethodChange('standard', 'Airdrop Standard');
        }
    };

    const handleShippingMethodChange = (tab, methodName) => {
        setActiveTab(tab);
        setData(prev => ({ ...prev, shipping_method: methodName }));

        // Update UI based on shipping method
        switch (methodName) {
            case 'Airdrop Express':
                setShowVolumeFields(true);
                setShowWeightFields(true);
                setShowIncorrectShippingInfo(true);
                break;
            case 'Airdrop Standard':
                setShowVolumeFields(false);
                setShowWeightFields(true);
                setShowIncorrectShippingInfo(true);
                break;
            case 'Seadrop Standard':
                setShowVolumeFields(true);
                setShowWeightFields(false);
                setShowIncorrectShippingInfo(false);
                break;
            default:
                setShowVolumeFields(false);
                setShowWeightFields(true);
                setShowIncorrectShippingInfo(false);
        }
    };

    const handleCalculateAndSubmit = async () => {
        if (!validateForm()) return;

        setIsCalculating(true);

        try {
            // Calculate shipping first
            const calculationResponse = await fetch(route('admin.packages.calculate-shipping'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                body: JSON.stringify(data),
            });

            const calculation = await calculationResponse.json();

            if (calculation.error) {
                throw new Error('Shipping calculation failed');
            }

            // Submit the form
            if (formMode === 'create') {
                post(route('admin.packages.store'));
            } else {
                post(route('admin.packages.update', packageId), {
                    method: 'patch'
                });
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to process package. Please try again.');
        } finally {
            setIsCalculating(false);
        }
    };

    const validateForm = () => {
        if (!data.package_couirer_number || data.package_couirer_number.length < 5) {
            alert('Please enter a valid courier tracking number (minimum 5 characters).');
            return false;
        }

        if (!data.package_user_account_number) {
            alert('Please enter customer account number.');
            return false;
        }

        if (!data.package_shipper) {
            alert('Please select courier company.');
            return false;
        }

        if (!data.package_store) {
            alert('Please select merchant.');
            return false;
        }

        if (!data.package_description) {
            alert('Please enter package description.');
            return false;
        }

        if (!data.package_amount || parseFloat(data.package_amount) < 0) {
            alert('Please enter a valid package value.');
            return false;
        }

        if (!data.number_of_pieces || parseInt(data.number_of_pieces) < 1) {
            alert('Please enter number of pieces.');
            return false;
        }

        if (showWeightFields && (!data.package_weight || parseFloat(data.package_weight) <= 0)) {
            alert('Please enter package weight.');
            return false;
        }

        if (data.shipping_method === 'Seadrop Standard') {
            if (!data.package_length || parseFloat(data.package_length) <= 0) {
                alert('Please enter package length.');
                return false;
            }
            if (!data.package_width || parseFloat(data.package_width) <= 0) {
                alert('Please enter package width.');
                return false;
            }
            if (!data.package_height || parseFloat(data.package_height) <= 0) {
                alert('Please enter package height.');
                return false;
            }
        }

        return true;
    };

    const getTabClass = (tab) => {
        const baseClass = "nav-link";
        const activeClass = tab === activeTab ? " active" : "";
        return baseClass + activeClass;
    };

    const getTabContentClass = () => {
        return `tab-content ${activeTab}-tab`;
    };

    const getSubmitButtonClass = () => {
        return `btn btn-primary submit_btn ${activeTab}-tab`;
    };

    const getShippingMessage = () => {
        switch (data.shipping_method) {
            case 'Airdrop Express':
                return '1 to 2 business days after items are delivered to our warehouse.';
            case 'Airdrop Standard':
                return '2 to 5 business days after items are delivered to our warehouse.';
            case 'Seadrop Standard':
                return '5 to 10 business days after items are delivered to our warehouse.';
            default:
                return '';
        }
    };

    const getPageTitle = () => {
        switch (data.shipping_method) {
            case 'Airdrop Express':
                return formMode === 'create' ? 'Create Express Package' : 'Update Express Package';
            case 'Airdrop Standard':
                return formMode === 'create' ? 'Create AIR Package' : 'Update AIR Package';
            case 'Seadrop Standard':
                return formMode === 'create' ? 'Create Seadrop Package' : 'Update Seadrop Package';
            default:
                return formMode === 'create' ? 'Create Package' : 'Update Package';
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Create Package" />

            <div className="py-2">
                <div>
                    <h2 className="text-2xl leading-9 font-bold text-quaternary dark:text-dark-text-primary mb-6">
                        Package Creation
                    </h2>
                    <div className="bg-white dark:bg-dark-quaternary overflow-hidden shadow-card sm:rounded-lg">
                        <div className="p-6">
                            <form className="space-y-6">
                                {/* Courier Number Field */}
                                <div className="border-b border-gray-200 dark:border-charcoal pb-6">
                                    <label htmlFor="package_couirer_number" className="block text-sm font-medium text-gray-700">
                                        Courier Tracking Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="package_couirer_number"
                                        value={data.package_couirer_number}
                                        onChange={(e) => setData('package_couirer_number', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Courier tracking number"
                                        minLength="5"
                                        maxLength="35"
                                        required
                                    />
                                    {courierMessage && (
                                        <div className="mt-2 text-sm" dangerouslySetInnerHTML={{ __html: courierMessage }} />
                                    )}
                                    {errors.package_couirer_number && (
                                        <div className="mt-2 text-sm text-red-600">{errors.package_couirer_number}</div>
                                    )}
                                </div>

                                {/* Shipping Method Tabs */}
                                <Box sx={{ width: '100%' }}>
                                    <Tabs
                                        value={activeTab}
                                        onChange={(event, newValue) => {
                                            const methodMap = {
                                                'standard': 'Airdrop Standard',
                                                'seadrop': 'Seadrop Standard',
                                                'express': 'Airdrop Express'
                                            };
                                            handleShippingMethodChange(newValue, methodMap[newValue]);
                                        }}
                                        variant="fullWidth"
                                        sx={{
                                            '& .MuiTabs-indicator': {
                                                backgroundColor: '#1976d2',
                                            },
                                            '& .MuiTab-root': {
                                                textTransform: 'none',
                                                fontWeight: 500,
                                            },
                                        }}
                                    >
                                        <Tab label="AIR" value="standard" />
                                        <Tab label="SeaDrop" value="seadrop" />
                                        <Tab label="Express" value="express" />
                                    </Tabs>

                                    <Box sx={{ mt: 2, p: 3, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                                        <div className="text-sm text-quaternary dark:text-dark-text-secondary mb-4">
                                            {getShippingMessage()}
                                        </div>

                                        <h2 className="text-xl font-semibold text-quaternary dark:text-dark-text-primary mb-6">{getPageTitle()}</h2>
                                        <div className="border-b border-gray-200 dark:border-charcoal pb-6">
                                            {/* Customer and Consignee Information */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                <div>
                                                    <label htmlFor="package_user_account_number" className="block text-sm font-medium text-gray-700">
                                                        Customer Account Number <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="package_user_account_number"
                                                        value={data.package_user_account_number}
                                                        onChange={(e) => setData('package_user_account_number', e.target.value)}
                                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                        required
                                                    />
                                                    {errors.package_user_account_number && (
                                                        <div className="mt-2 text-sm text-red-600">{errors.package_user_account_number}</div>
                                                    )}
                                                </div>

                                                <div>
                                                    <label htmlFor="package_consignee" className="block text-sm font-medium text-gray-700">
                                                        Consignee <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="package_consignee"
                                                        value={data.package_consignee}
                                                        onChange={(e) => setData('package_consignee', e.target.value)}
                                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                        required
                                                    />
                                                    {customerMessage && (
                                                        <div className="mt-2 text-sm text-blue-600">{customerMessage}</div>
                                                    )}
                                                    {errors.package_consignee && (
                                                        <div className="mt-2 text-sm text-red-600">{errors.package_consignee}</div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Shipper and Merchant Information */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                <div>
                                                    <label htmlFor="package_shipper" className="block text-sm font-medium text-gray-700">
                                                        Courier Company <span className="text-red-500">*</span>
                                                    </label>
                                                    <select
                                                        id="package_shipper"
                                                        value={data.package_shipper}
                                                        onChange={(e) => setData('package_shipper', e.target.value)}
                                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                        required
                                                    >
                                                        <option value="">Choose option</option>
                                                        {packageShippers.map((shipper) => (
                                                            <option key={shipper} value={shipper}>
                                                                {shipper}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.package_shipper && (
                                                        <div className="mt-2 text-sm text-red-600">{errors.package_shipper}</div>
                                                    )}
                                                </div>

                                                <div>
                                                    <label htmlFor="package_store" className="block text-sm font-medium text-gray-700">
                                                        Merchant <span className="text-red-500">*</span>
                                                    </label>
                                                    <select
                                                        id="package_store"
                                                        value={data.package_store}
                                                        onChange={(e) => setData('package_store', e.target.value)}
                                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                        required
                                                    >
                                                        <option value="">Choose option</option>
                                                        {packageMerchants.map((merchant) => (
                                                            <option key={merchant} value={merchant}>
                                                                {merchant}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.package_store && (
                                                        <div className="mt-2 text-sm text-red-600">{errors.package_store}</div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Description and Custom Duty */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                                <div>
                                                    <label htmlFor="package_admin_remarks" className="block text-sm font-medium text-gray-700">
                                                        Remarks
                                                    </label>
                                                    <textarea
                                                        id="package_admin_remarks"
                                                        value={data.package_admin_remarks}
                                                        onChange={(e) => setData('package_admin_remarks', e.target.value)}
                                                        rows="3"
                                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                    />
                                                </div>

                                                <div>
                                                    <label htmlFor="package_description" className="block text-sm font-medium text-gray-700">
                                                        Package Description <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="package_description"
                                                        value={data.package_description}
                                                        onChange={(e) => setData('package_description', e.target.value)}
                                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                        required
                                                    />
                                                    {errors.package_description && (
                                                        <div className="mt-2 text-sm text-red-600">{errors.package_description}</div>
                                                    )}
                                                </div>

                                                <div>
                                                    <label htmlFor="package_custom_duty" className="block text-sm font-medium text-gray-700">
                                                        Custom Duty (%)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        id="package_custom_duty"
                                                        value={data.package_custom_duty}
                                                        onChange={(e) => setData('package_custom_duty', e.target.value)}
                                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                        step="0.01"
                                                        min="0"
                                                        max="100"
                                                    />
                                                </div>
                                            </div>

                                            {/* Package Details */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                <div>
                                                    <label htmlFor="number_of_pieces" className="block text-sm font-medium text-gray-700">
                                                        Number Of Pieces <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        id="number_of_pieces"
                                                        value={data.number_of_pieces}
                                                        onChange={(e) => setData('number_of_pieces', e.target.value)}
                                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                        min="1"
                                                        required
                                                    />
                                                    {errors.number_of_pieces && (
                                                        <div className="mt-2 text-sm text-red-600">{errors.number_of_pieces}</div>
                                                    )}
                                                </div>

                                                <div>
                                                    <label htmlFor="package_amount" className="block text-sm font-medium text-gray-700">
                                                        Package Value (USD) <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        id="package_amount"
                                                        value={data.package_amount}
                                                        onChange={(e) => setData('package_amount', e.target.value)}
                                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                        step="0.01"
                                                        min="0"
                                                        required
                                                    />
                                                    {errors.package_amount && (
                                                        <div className="mt-2 text-sm text-red-600">{errors.package_amount}</div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Package Dimensions (Conditional) */}
                                            {showVolumeFields && (
                                                <>
                                                    <div className="mb-4">
                                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Package Dimensions</h3>
                                                        <p className="text-sm text-gray-600 mb-4">
                                                            <strong>Note:</strong> Package Dimensions can be found in the product description of your online purchases.
                                                            Please note that all packages will be measured by the package dimensions, not item dimensions.
                                                        </p>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                        <div>
                                                            <label htmlFor="package_length" className="block text-sm font-medium text-gray-700">
                                                                Length (In) <span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                                type="number"
                                                                id="package_length"
                                                                value={data.package_length}
                                                                onChange={(e) => setData('package_length', e.target.value)}
                                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                                step="0.01"
                                                                min="0"
                                                                required={data.shipping_method === 'Seadrop Standard'}
                                                            />
                                                        </div>

                                                        <div>
                                                            <label htmlFor="package_width" className="block text-sm font-medium text-gray-700">
                                                                Width (In) <span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                                type="number"
                                                                id="package_width"
                                                                value={data.package_width}
                                                                onChange={(e) => setData('package_width', e.target.value)}
                                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                                step="0.01"
                                                                min="0"
                                                                required={data.shipping_method === 'Seadrop Standard'}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                        <div>
                                                            <label htmlFor="package_height" className="block text-sm font-medium text-gray-700">
                                                                Height (In) <span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                                type="number"
                                                                id="package_height"
                                                                value={data.package_height}
                                                                onChange={(e) => setData('package_height', e.target.value)}
                                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                                step="0.01"
                                                                min="0"
                                                                required={data.shipping_method === 'Seadrop Standard'}
                                                            />
                                                        </div>

                                                        <div>
                                                            <label htmlFor="total_volume" className="block text-sm font-medium text-gray-700">
                                                                Volume (ft³)
                                                            </label>
                                                            <input
                                                                type="text"
                                                                id="total_volume"
                                                                value={data.total_volume}
                                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-50"
                                                                readOnly
                                                            />
                                                            <p className="text-xs text-gray-500 mt-1">Length x Width x Height x Quantity</p>
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            {/* Weight Fields (Conditional) */}
                                            {showWeightFields && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                    <div>
                                                        <label htmlFor="package_weight" className="block text-sm font-medium text-gray-700">
                                                            Actual Weight (LBS) <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="number"
                                                            id="package_weight"
                                                            value={data.package_weight}
                                                            onChange={(e) => setData('package_weight', e.target.value)}
                                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                            step="0.01"
                                                            min="0"
                                                            required
                                                        />
                                                        {errors.package_weight && (
                                                            <div className="mt-2 text-sm text-red-600">{errors.package_weight}</div>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label htmlFor="package_weight_kg" className="block text-sm font-medium text-gray-700">
                                                            Actual Weight (KG)
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="package_weight_kg"
                                                            value={data.package_weight_kg}
                                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-50"
                                                            readOnly
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Additional Weight Info (for Express) */}
                                            {showVolumeFields && showWeightFields && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                    <div>
                                                        <label htmlFor="dimensions_lbs" className="block text-sm font-medium text-gray-700">
                                                            Dimensions Weight (LBS)
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="dimensions_lbs"
                                                            value={data.dimensions_lbs}
                                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-50"
                                                            readOnly
                                                        />
                                                    </div>

                                                    <div>
                                                        <label htmlFor="total_weight_lbs" className="block text-sm font-medium text-gray-700">
                                                            Total Weight (LBS)
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="total_weight_lbs"
                                                            value={data.total_weight_lbs}
                                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-50"
                                                            readOnly
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* File Upload */}
                                            <div className="mb-6">
                                                <label htmlFor="preorder_invoice" className="block text-sm font-medium text-gray-700">
                                                    Package Invoice
                                                </label>
                                                <input
                                                    type="file"
                                                    id="preorder_invoice"
                                                    multiple
                                                    accept="image/png, image/jpeg, image/jpg, application/pdf"
                                                    onChange={(e) => setData('preorder_invoice', e.target.files)}
                                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                />
                                            </div>

                                            {/* Incorrect Shipping Info Checkbox */}
                                            {showIncorrectShippingInfo && (
                                                <div className="mb-6">
                                                    <div className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            id="incorrect_shipping_info"
                                                            checked={data.incorrect_shipping_info}
                                                            onChange={(e) => setData('incorrect_shipping_info', e.target.checked)}
                                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                        />
                                                        <label htmlFor="incorrect_shipping_info" className="ml-2 block text-sm text-gray-900">
                                                            Incorrect/Missing Shipping Information (Name, Address) - Additional ${shippingRates.incorrectShippingInfo}
                                                        </label>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Copy and Paste Invoice */}
                                            <div className="mb-6">
                                                <label htmlFor="pckaage_invoice" className="block text-sm font-medium text-gray-700">
                                                    Copy And Paste Invoice/Document
                                                </label>
                                                <textarea
                                                    id="pckaage_invoice"
                                                    value={data.pckaage_invoice}
                                                    onChange={(e) => setData('pckaage_invoice', e.target.value)}
                                                    rows="6"
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                />
                                            </div>

                                            {/* Checkboxes */}
                                            <div className="space-y-4 mb-6">
                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id="send_email"
                                                        checked={data.send_email}
                                                        onChange={(e) => setData('send_email', e.target.checked)}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                    <label htmlFor="send_email" className="ml-2 block text-sm text-gray-900">
                                                        Send notification email
                                                    </label>
                                                </div>

                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id="address_required"
                                                        checked={data.address_required}
                                                        onChange={(e) => setData('address_required', e.target.checked)}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                    <label htmlFor="address_required" className="ml-2 block text-sm text-gray-900">
                                                        Address update required
                                                    </label>
                                                </div>
                                            </div>

                                            {/* Submit Button */}
                                            <div className="flex justify-end">
                                                <button
                                                    type="button"
                                                    onClick={handleCalculateAndSubmit}
                                                    disabled={processing || isCalculating}
                                                    className={`${getSubmitButtonClass()} px-6 py-3 text-white rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50`}
                                                >
                                                    {processing || isCalculating ? 'Processing...' : getPageTitle()}
                                                </button>
                                            </div>
                                        </div>
                                    </Box>
                                </Box>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
