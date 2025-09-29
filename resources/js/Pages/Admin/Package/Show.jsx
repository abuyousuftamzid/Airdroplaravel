import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function ShowPackage({ auth, package: packageData, additionalCharges, documents }) {
    const getStatusBadge = (status) => {
        const statusMap = {
            1: { label: 'Pre-alert', class: 'bg-yellow-100 text-yellow-800' },
            2: { label: 'In Transit', class: 'bg-blue-100 text-blue-800' },
            3: { label: 'Arrived', class: 'bg-green-100 text-green-800' },
            4: { label: 'Ready for Delivery', class: 'bg-purple-100 text-purple-800' },
            5: { label: 'Out for Delivery', class: 'bg-orange-100 text-orange-800' },
            6: { label: 'Delivered', class: 'bg-green-100 text-green-800' },
            7: { label: 'Exception', class: 'bg-red-100 text-red-800' },
            8: { label: 'Cancelled', class: 'bg-gray-100 text-gray-800' },
        };

        const statusInfo = statusMap[status] || { label: 'Unknown', class: 'bg-gray-100 text-gray-800' };

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.class}`}>
                {statusInfo.label}
            </span>
        );
    };

    const getShippingMethodBadge = (method) => {
        const methodMap = {
            'Airdrop Express': 'bg-orange-100 text-orange-800',
            'Airdrop Standard': 'bg-green-100 text-green-800',
            'Seadrop Standard': 'bg-blue-100 text-blue-800',
        };

        const badgeClass = methodMap[method] || 'bg-gray-100 text-gray-800';

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badgeClass}`}>
                {method || 'Standard'}
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Package Details - {packageData.package_tracking_code}
                    </h2>
                    <Link
                        href={route('admin.packages.index')}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                        Back to Packages
                    </Link>
                </div>
            }
        >
            <Head title={`Package ${packageData.package_tracking_code}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Package Overview */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Package Information</h3>
                                    <div className="space-y-2">
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">Tracking Code:</span>
                                            <div className="text-sm text-gray-900 font-mono">{packageData.package_tracking_code}</div>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">Courier Number:</span>
                                            <div className="text-sm text-gray-900">{packageData.package_couirer_number}</div>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">Invoice ID:</span>
                                            <div className="text-sm text-gray-900">{packageData.packages_invoice_id}</div>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">Status:</span>
                                            <div className="mt-1">{getStatusBadge(packageData.package_status)}</div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                                    <div className="space-y-2">
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">Consignee:</span>
                                            <div className="text-sm text-gray-900">{packageData.package_consignee}</div>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">Account Number:</span>
                                            <div className="text-sm text-gray-900">AIR-{packageData.package_user_account_number}</div>
                                        </div>
                                        {packageData.user && (
                                            <div>
                                                <span className="text-sm font-medium text-gray-500">Customer:</span>
                                                <div className="text-sm text-gray-900">
                                                    {packageData.user.user_first_name} {packageData.user.user_last_name}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h3>
                                    <div className="space-y-2">
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">Method:</span>
                                            <div className="mt-1">{getShippingMethodBadge(packageData.shipping_method)}</div>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">Courier:</span>
                                            <div className="text-sm text-gray-900">{packageData.package_shipper}</div>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">Merchant:</span>
                                            <div className="text-sm text-gray-900">{packageData.package_store}</div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Package Details</h3>
                                    <div className="space-y-2">
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">Value:</span>
                                            <div className="text-sm text-gray-900">${packageData.package_amount}</div>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">Weight:</span>
                                            <div className="text-sm text-gray-900">{packageData.package_weight} lbs</div>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">Pieces:</span>
                                            <div className="text-sm text-gray-900">{packageData.number_of_pieces}</div>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">Total Price:</span>
                                            <div className="text-sm text-gray-900 font-semibold">${packageData.package_total_price}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Package Description & Remarks */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 bg-white border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Description & Remarks</h3>
                                <div className="space-y-4">
                                    <div>
                                        <span className="text-sm font-medium text-gray-500">Description:</span>
                                        <div className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded">
                                            {packageData.package_description || 'No description provided'}
                                        </div>
                                    </div>
                                    {packageData.package_admin_remarks && (
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">Admin Remarks:</span>
                                            <div className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded">
                                                {packageData.package_admin_remarks}
                                            </div>
                                        </div>
                                    )}
                                    {packageData.pckaage_invoice && (
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">Invoice/Document:</span>
                                            <div className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded max-h-32 overflow-y-auto">
                                                <div dangerouslySetInnerHTML={{ __html: packageData.pckaage_invoice }} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Additional Charges */}
                        {additionalCharges && Object.keys(additionalCharges).length > 0 && (
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6 bg-white border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Charges Breakdown</h3>
                                    <div className="space-y-3">
                                        {Object.entries(additionalCharges).map(([key, value]) => (
                                            <div key={key} className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">{key}:</span>
                                                <span className="text-sm font-medium text-gray-900">${value}</span>
                                            </div>
                                        ))}
                                        <hr className="my-2" />
                                        <div className="flex justify-between items-center font-semibold">
                                            <span className="text-sm text-gray-900">Total Package Value:</span>
                                            <span className="text-sm text-gray-900">${packageData.package_total_price}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Physical Dimensions & Weight */}
                    {(packageData.package_length_array || packageData.total_weight_lbs || packageData.package_total_volume) && (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mt-6">
                            <div className="p-6 bg-white border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Physical Properties</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {packageData.package_length_array && (
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">Dimensions (L x W x H):</span>
                                            <div className="text-sm text-gray-900">
                                                {/* Note: This would need to be decoded from base64 in real implementation */}
                                                Available in encoded format
                                            </div>
                                        </div>
                                    )}
                                    {packageData.package_total_volume && (
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">Volume:</span>
                                            <div className="text-sm text-gray-900">{packageData.package_total_volume} ft³</div>
                                        </div>
                                    )}
                                    {packageData.total_weight_lbs && (
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">Total Weight:</span>
                                            <div className="text-sm text-gray-900">{packageData.total_weight_lbs} lbs</div>
                                        </div>
                                    )}
                                    {packageData.dimensions_lbs && (
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">Dimensional Weight:</span>
                                            <div className="text-sm text-gray-900">{packageData.dimensions_lbs} lbs</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Documents */}
                    {documents && documents.length > 0 && (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mt-6">
                            <div className="p-6 bg-white border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Documents</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {documents.map((doc) => (
                                        <div key={doc.doc_id} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {doc.doc_original_name || doc.doc_name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {doc.doc_type} • {Math.round(doc.doc_size / 1024)} KB
                                                    </p>
                                                </div>
                                                <a
                                                    href={`${doc.doc_path}${doc.doc_name}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="ml-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                >
                                                    View
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Timestamps */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mt-6">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <span className="text-sm font-medium text-gray-500">Created:</span>
                                    <div className="text-sm text-gray-900">
                                        {new Date(packageData.package_creation_date_time).toLocaleString()}
                                    </div>
                                </div>
                                {packageData.package_updated_date && (
                                    <div>
                                        <span className="text-sm font-medium text-gray-500">Last Updated:</span>
                                        <div className="text-sm text-gray-900">
                                            {new Date(packageData.package_updated_date).toLocaleString()}
                                        </div>
                                    </div>
                                )}
                                {packageData.package_updated_by && packageData.updatedBy && (
                                    <div>
                                        <span className="text-sm font-medium text-gray-500">Updated By:</span>
                                        <div className="text-sm text-gray-900">
                                            {packageData.updatedBy.user_first_name} {packageData.updatedBy.user_last_name}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center mt-6">
                        <Link
                            href={route('admin.packages.index')}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md text-sm font-medium"
                        >
                            ← Back to Packages
                        </Link>
                        <div className="space-x-3">
                            <Link
                                href={route('admin.packages.create')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium"
                            >
                                Edit Package
                            </Link>
                            <button
                                onClick={() => window.print()}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md text-sm font-medium"
                            >
                                Print
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
