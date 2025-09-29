import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function EmployeeRoleIndex({ roles, filters }) {
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [entriesPerPage, setEntriesPerPage] = useState(filters?.per_page || 10);

    const handleFilterChange = () => {
        router.post(route('admin.employees.roles.apply-filters'), {
            search: searchQuery,
            per_page: entriesPerPage,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleToggleRole = (moduleId, userType, currentValue) => {
        const newValue = currentValue === '1' ? '0' : '1';

        router.patch(route('admin.employees.roles.toggle'), {
            module_id: moduleId,
            user_type: userType,
            value: newValue
        }, {
            preserveScroll: true,
            onSuccess: () => {
                // Success message will be handled by backend
            }
        });
    };

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            handleFilterChange();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchQuery, entriesPerPage]);

    const handlePaginationClick = (url) => {
        if (!url) return;

        const urlParams = new URL(url, window.location.origin);
        const page = urlParams.searchParams.get('page');

        // Use simple GET request with only page parameter for pagination
        router.get(route('admin.employees.roles.index', { page: page }), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Define user type columns with their database field names
    const userTypes = [
        { key: 'Airdrop_Shipper', label: 'Shipper' },
        { key: 'Airdrop_Cashier', label: 'Customer Service' },
        { key: 'Airdrop_Supervisor', label: 'Supervisor' },
        { key: 'Airdrop_Manager', label: 'Manager' },
        { key: 'Airdrop_Operations_Supervisor', label: 'Operations Supervisor' },
        { key: 'Airdrop_Admin', label: 'Admin' },
    ];

    const getStatusButton = (value, moduleId, userType) => {
        const isEnabled = value === '1';
        return (
            <button
                onClick={() => handleToggleRole(moduleId, userType, value)}
                className={`px-3 py-1 text-white text-xs font-medium rounded transition-colors ${
                    isEnabled
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-red-500 hover:bg-red-600'
                }`}
            >
                {isEnabled ? 'Enabled' : 'Disabled'}
            </button>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Employee Role Management
                    </h2>
                </div>
            }
        >
            <Head title="Employee Role Management" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 ">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Filter Controls */}
                            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                                <div className="flex flex-wrap gap-4 items-center justify-between">
                                    <div className="flex flex-wrap gap-4 items-center">
                                        {/* Search Bar */}
                                        <div className="min-w-0">
                                            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                                                Search:
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="search"
                                                    type="text"
                                                    placeholder="Search modules..."
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    className="block w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                />
                                                {searchQuery && (
                                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                        <button
                                                            onClick={() => {
                                                                setSearchQuery('');
                                                                router.post(route('admin.employees.roles.clear-filters'), {}, {
                                                                    preserveState: true,
                                                                    preserveScroll: true,
                                                                });
                                                            }}
                                                            className="text-gray-400 hover:text-gray-600"
                                                        >
                                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Entries Per Page */}
                                    <div className="min-w-0">
                                        <label htmlFor="entries-per-page" className="block text-sm font-medium text-gray-700 mb-1">
                                            Show
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <select
                                                id="entries-per-page"
                                                value={entriesPerPage}
                                                onChange={(e) => setEntriesPerPage(parseInt(e.target.value))}
                                                className="block w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                            >
                                                <option value={5}>5</option>
                                                <option value={10}>10</option>
                                                <option value={25}>25</option>
                                                <option value={50}>50</option>
                                                <option value={100}>100</option>
                                            </select>
                                            <span className="text-sm text-gray-700">entries</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Roles Table */}
                            {(!roles.data || roles.data.length === 0) ? (
                                <div className="text-center py-12">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No roles found</h3>
                                    <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria.</p>
                                </div>
                            ) : (
                                <div className="w-full">
                                    <div className="overflow-x-auto">
                                        <table className="min-w-max w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12 sticky left-0 bg-gray-50 z-20">
                                                        S.N
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-12 bg-gray-50 z-20 min-w-[200px]">
                                                        Module Name
                                                    </th>
                                                    {userTypes.map((userType) => (
                                                        <th key={userType.key} className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center min-w-[140px]">
                                                            {userType.label}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {roles.data.map((role, index) => (
                                                    <tr key={role.module_id} className="hover:bg-gray-50">
                                                        {/* S.N Column */}
                                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 w-12 sticky left-0 bg-white z-10">
                                                            {roles.from + index}
                                                        </td>

                                                        {/* Module Name Column */}
                                                        <td className="px-4 py-4 whitespace-nowrap sticky left-12 bg-white z-10 min-w-[200px]">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {role.module_name}
                                                            </div>
                                                        </td>

                                                        {/* User Type Columns */}
                                                        {userTypes.map((userType) => (
                                                            <td key={userType.key} className="px-4 py-4 whitespace-nowrap text-center min-w-[140px]">
                                                                {getStatusButton(
                                                                    role[userType.key] || '0',
                                                                    role.module_id,
                                                                    userType.key
                                                                )}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination Controls */}
                                    {roles.links && roles.links.length > 3 && (
                                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                            <div className="flex-1 flex justify-between sm:hidden">
                                                {roles.prev_page_url && (
                                                    <button
                                                        onClick={() => handlePaginationClick(roles.prev_page_url)}
                                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                                                    >
                                                        Previous
                                                    </button>
                                                )}
                                                {roles.next_page_url && (
                                                    <button
                                                        onClick={() => handlePaginationClick(roles.next_page_url)}
                                                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                                                    >
                                                        Next
                                                    </button>
                                                )}
                                            </div>
                                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                                <div>
                                                    <p className="text-sm text-gray-700">
                                                        Showing{' '}
                                                        <span className="font-medium">{roles.from}</span>
                                                        {' '}to{' '}
                                                        <span className="font-medium">{roles.to}</span>
                                                        {' '}of{' '}
                                                        <span className="font-medium">{roles.total}</span>
                                                        {' '}results
                                                    </p>
                                                </div>
                                                <div>
                                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                                        {roles.links.map((link, index) => {
                                                            if (index === 0) {
                                                                // Previous button
                                                                return link.url ? (
                                                                    <button
                                                                        key={index}
                                                                        onClick={() => handlePaginationClick(link.url)}
                                                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                                                                    >
                                                                        <span className="sr-only">Previous</span>
                                                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                        </svg>
                                                                    </button>
                                                                ) : (
                                                                    <span key={index} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-gray-100 text-sm font-medium text-gray-400 cursor-not-allowed">
                                                                        <span className="sr-only">Previous</span>
                                                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                        </svg>
                                                                    </span>
                                                                );
                                                            } else if (index === roles.links.length - 1) {
                                                                // Next button
                                                                return link.url ? (
                                                                    <button
                                                                        key={index}
                                                                        onClick={() => handlePaginationClick(link.url)}
                                                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                                                                    >
                                                                        <span className="sr-only">Next</span>
                                                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                                        </svg>
                                                                    </button>
                                                                ) : (
                                                                    <span key={index} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-gray-100 text-sm font-medium text-gray-400 cursor-not-allowed">
                                                                        <span className="sr-only">Next</span>
                                                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                                        </svg>
                                                                    </span>
                                                                );
                                                            } else {
                                                                // Number buttons
                                                                return link.url ? (
                                                                    <button
                                                                        key={index}
                                                                        onClick={() => handlePaginationClick(link.url)}
                                                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                                            link.active
                                                                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700'
                                                                        }`}
                                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                                    />
                                                                ) : (
                                                                    <span
                                                                        key={index}
                                                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                                    />
                                                                );
                                                            }
                                                        })}
                                                    </nav>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
