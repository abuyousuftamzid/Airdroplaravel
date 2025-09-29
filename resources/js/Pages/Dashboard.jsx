import { useState, useEffect, useRef } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ImageSliderCard from '@/Components/ImageSliderCard';
import WelcomeSection from '@/Components/WelcomeSection';
import { Paper, Box, Typography } from '@mui/material';
import { useTheme } from '@/Contexts/ThemeContext';

// Modern Card Component
function ModernCard({ icon, title, iconBgColor = 'linear-gradient(135deg, #e3f2fd, #bbdefb)' }) {
    const { isDark } = useTheme();

    return (
        <Paper
            elevation={0}
            sx={{
                p: '30px 27px',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: isDark ? '#1C252E' : 'white',
                borderRadius: '16px',
                boxShadow: isDark
                    ? '0 0 2px 0 rgba(0, 0, 0, 0.3), 0 12px 24px -4px rgba(0, 0, 0, 0.2)'
                    : '0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2
            }}>
                <Box sx={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    background: iconBgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    mb: 1
                }}>
                    {icon}
                </Box>

                <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                        fontWeight: 600,
                        color: isDark ? 'white' : '#1C252E', // 1C252E
                        fontSize: '14px',
                        lineHeight: '22px'
                    }}
                >
                    {title}
                </Typography>
            </Box>
        </Paper>
    );
}

// Mock data for dashboard components
const mockData = {
    user: {
        displayName: 'John Doe',
        email: 'john@example.com'
    },
    stats: {
        totalUsers: 18765,
        totalOrders: 4876,
        totalRevenue: 678,
        conversionRate: 48
    },
    featuredApps: [
        {
            id: 1,
            title: 'Analytics Dashboard',
            description: 'Track your business metrics',
            coverUrl: 'https://minimals.cc/assets/images/covers/cover_1.jpg'
        },
        {
            id: 2,
            title: 'E-commerce Platform',
            description: 'Manage your online store',
            coverUrl: 'https://minimals.cc/assets/images/covers/cover_2.jpg'
        }
    ],
    recentInvoices: [
        { id: 'INV-001', category: 'Web Design', price: '$1,200', status: 'Paid' },
        { id: 'INV-002', category: 'Development', price: '$2,500', status: 'Pending' },
        { id: 'INV-003', category: 'Consulting', price: '$800', status: 'Paid' }
    ]
};

// Widget Summary Component
function WidgetSummary({ title, value, percent, trend, icon, color = 'primary' }) {
    const colorClasses = {
        primary: 'bg-blue-500',
        success: 'bg-green-500',
        warning: 'bg-yellow-500',
        error: 'bg-red-500'
    };

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                    <div className="flex items-center mt-2">
                        <span className={`text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {trend > 0 ? '↗' : '↘'} {Math.abs(percent)}%
                        </span>
                        <span className="text-sm text-gray-500 ml-1">vs last month</span>
                    </div>
                </div>
                <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
                    <span className="text-white text-xl">{icon}</span>
                </div>
            </div>
        </Paper>
    );
}

// Welcome Section Component
function WelcomeSection2({ user, onSearch, searchQuery, setSearchQuery, showSearchDropdown, setShowSearchDropdown, searchResults }) {
    const searchRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearchDropdown(false);
            }
        };

        if (showSearchDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showSearchDropdown, setShowSearchDropdown]);

    return (
        <div className="bg-gradient-to-r from-gray-900 to-gray-800">
            <div className=" rounded-lg p-8 text-white overflow-visible h-full flex flex-col">
                <div className=" flex-1 flex flex-col justify-center">
                    <h1 className="text-3xl font-bold mb-2">
                        Welcome back 👋<br />
                        {user?.user_first_last_name || user?.displayName || 'User'}
                    </h1>
                    <p className="text-gray-300 mb-6 max-w-md">
                        If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything.
                    </p>
                    <div className="relative" ref={searchRef}>
                        {/* <form onSubmit={onSearch} className="relative">
                            <input
                                type="text"
                                placeholder="Search menu items..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowSearchDropdown(e.target.value.trim().length > 0);
                                }}
                                onFocus={() => setShowSearchDropdown(searchQuery.trim().length > 0)}
                                className="w-full px-4 py-2 pr-20 border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                    </button>
                        </form> */}

                        {/* Search Results Dropdown */}
                        {showSearchDropdown && searchResults.length > 0 && (
                            <Paper elevation={6} sx={{ position: 'absolute', top: '100%', left: 0, right: 0, mt: 1, zIndex: 9999, maxHeight: '20rem', overflowY: 'auto' }}>
                                <div className="p-2">
                                    <div className="text-xs text-gray-500 mb-2 px-2">
                                        {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                                    </div>
                                    {searchResults.map((result, index) => (
                                        <a
                                            key={index}
                                            href={result.href}
                                            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                                            onClick={() => {
                                                setShowSearchDropdown(false);
                                                setSearchQuery('');
                                            }}
                                        >
                                            <span className="mr-3 text-lg">{result.icon}</span>
                                            <div className="flex-1">
                                                <div className="font-medium">{result.name}</div>
                                                {result.parent && (
                                                    <div className="text-xs text-gray-500">in {result.parent}</div>
                                                )}
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </Paper>
                        )}

                        {/* No Results Message */}
                        {showSearchDropdown && searchQuery.trim() && searchResults.length === 0 && (
                            <Paper elevation={6} sx={{ position: 'absolute', top: '100%', left: 0, right: 0, mt: 1, zIndex: 9999 }}>
                                <div className="p-4 text-center text-gray-500 text-sm">
                                    No results found for "{searchQuery}"
                                </div>
                            </Paper>
                        )}
                    </div>
                </div>
                {/* <div className="absolute right-8 top-8 w-32 h-32 opacity-20">
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                        <span className="text-6xl font-bold text-gray-800">
                            {(user?.user_first_last_name || user?.displayName || 'User').charAt(0).toUpperCase()}
                        </span>
                    </div>
                </div> */}
            </div>
        </div>
    );
}

// Featured Apps Carousel Component
function FeaturedApps({ apps }) {
    return (
        <div className="bg-black rounded-lg overflow-hidden h-full flex flex-col">
            <div className="p-6 text-white flex-1 flex flex-col justify-center">
                <div className="mb-4">
                    <span className="text-blue-400 text-sm font-medium">Featured App</span>
                    <h3 className="text-xl font-semibold mt-1">{apps[0]?.title}</h3>
                    <p className="text-gray-300 text-sm mt-1">{apps[0]?.description}</p>
                </div>
            </div>
            <div className="h-32 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-white text-4xl">📱</span>
            </div>
        </div>
    );
}



export default function Dashboard({ stats, auth }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        setShowSearchDropdown(true);
        console.log('Searching for:', searchQuery);
    };

    // Navigation data for search (same as sidebar)
    const navigation = [
        {
            name: 'Dashboard',
            href: '/admin/dashboard',
            icon: '📊',
        },
        {
            name: 'More Options',
            icon: '🛠️',
            children: [
                { name: 'Package Management', href: '/packages/management' },
                { name: 'Update Package', href: '/packages/update' },
                { name: 'Package Reporting', href: '/packages/reporting' },
                { name: 'Create Package Label', href: '/packages/label/create' },
                { name: 'Update Package Status', href: '/packages/status/update' },
                { name: 'Delete Packages', href: '/packages/delete' },
            ]
        },
        {
            name: 'Containers',
            icon: '🗄️',
            children: [
                { name: 'Create Container', href: '/containers/create' },
                { name: 'Manage Containers', href: '/containers/manage' },
            ]
        },
        {
            name: 'Drop Alerts',
            icon: '📦',
            children: [
                { name: 'Create Drop Alert', href: '/drop-alerts/create' },
                { name: 'Manage Drop Alert Packages', href: '/drop-alerts/packages/manage' },
            ]
        },
        {
            name: 'Customers',
            icon: '🧑‍💼',
            children: [
                { name: 'Client Form', href: '/customers/client-form' },
                { name: 'Approve Document', href: '/customers/approve-document' },
                { name: 'Upload User Document', href: '/customers/upload-document' },
                { name: 'Document List', href: '/customers/documents' },
            ]
        },
        {
            name: 'More Account Options',
            icon: '📋',
            children: [
                { name: 'Account Activity Report', href: '/accounts/activity-report' },
                { name: 'Accounts with Similar Name', href: '/accounts/similar-name' },
            ]
        },
        {
            name: 'Employees',
            icon: '🧑‍💼',
            children: [
                { name: 'Add New Employee', href: '/employees/create' },
                { name: 'Manage User Role', href: '/employees/roles' },
                { name: 'Employee Management', href: '/employees/' },
                { name: 'Employee Data Lookup', href: '/employees/lookup' },
            ]
        },
        {
            name: 'Financial Reports',
            icon: '💰',
            children: [
                { name: 'Financial Reports', href: '/financial-reports' },
                { name: 'Refer Friend Management', href: '/refer-friend' },
                { name: 'Reports / Tickets', href: '/reports-tickets' },
                { name: 'Payment Gateways', href: '/payment-gateways' },
            ]
        },
        {
            name: 'Settings',
            icon: '⚙️',
            children: [
                { name: 'Update Warehouse Address', href: '/settings/warehouse-address' },
                { name: 'Update Master Password', href: '/settings/master-password' },
                { name: 'Exchange Rate', href: '/settings/exchange-rate' },
                { name: 'User Data Lookup', href: '/settings/user-lookup' },
                { name: 'Create New Branch', href: '/settings/branch/create' },
                { name: 'Manage Branch', href: '/settings/branch/manage' },
                { name: 'Shipper Package Management', href: '/settings/shipper-packages' },
                { name: 'Customer Management', href: '/settings/customer-management' },
                { name: 'Authorized User DataLookup', href: '/settings/authorized-user-lookup' },
                { name: "White List IP's", href: '/settings/whitelist-ips' },
                { name: 'Shipping Rates Management', href: '/settings/shipping-rates' },
            ]
        },
    ];

    // Filter search results
    const getSearchResults = () => {
        if (!searchQuery || !searchQuery.trim()) return [];

        const results = [];
        const searchLower = searchQuery.toLowerCase();

        navigation.forEach(item => {
            // Check main item
            if (item.name.toLowerCase().includes(searchLower)) {
                results.push({
                    name: item.name,
                    href: item.href,
                    icon: item.icon,
                    type: 'main'
                });
            }

            // Check children
            if (item.children) {
                item.children.forEach(child => {
                    if (child.name.toLowerCase().includes(searchLower)) {
                        results.push({
                            name: child.name,
                            href: child.href,
                            icon: item.icon,
                            parent: item.name,
                            type: 'child'
                        });
                    }
                });
            }
        });

        return results.slice(0, 8); // Limit to 8 results
    };

    const searchResults = getSearchResults();

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="py-2">
                <div>
                    {/* Welcome Section */}
                    <div className="flex flex-col lg:flex-row gap-6 mb-8">
                        <div className="lg:w-[67%]">
                            <WelcomeSection
                                user={auth?.user || mockData.user}
                                onSearch={handleSearch}
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                                showSearchDropdown={showSearchDropdown}
                                setShowSearchDropdown={setShowSearchDropdown}
                                searchResults={searchResults}
                            />
                        </div>
                        <div className="lg:w-[33%]">
                            {/* <FeaturedApps apps={mockData.featuredApps} /> */}
                            <ImageSliderCard />
                        </div>
                    </div>

                    {/* Packages Section */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Packages</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <ModernCard
                                icon="🔍"
                                title="Package Lookup"
                                iconBgColor="linear-gradient(135deg, #e3f2fd, #bbdefb)"
                            />
                            <ModernCard
                                icon="📋"
                                title="Package Status Change"
                                iconBgColor="linear-gradient(135deg, #e8f5e8, #c8e6c9)"
                            />
                            <ModernCard
                                icon="💰"
                                title="Additional Package Charges"
                                iconBgColor="linear-gradient(135deg, #fff3e0, #ffcc02)"
                            />
                            <ModernCard
                                icon="➕"
                                title="Create Package"
                                iconBgColor="linear-gradient(135deg, #e3f2fd, #bbdefb)"
                            />
                            <ModernCard
                                icon="📦"
                                title="Orders"
                                iconBgColor="linear-gradient(135deg, #f3e5f5, #e1bee7)"
                            />
                        </div>
                    </div>

                    {/* More Module Options Section */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">More Module Options</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <ModernCard
                                icon="📦"
                                title="Package Management"
                                iconBgColor="linear-gradient(135deg, #e3f2fd, #bbdefb)"
                            />
                            <ModernCard
                                icon="🔄"
                                title="Update Package"
                                iconBgColor="linear-gradient(135deg, #e8f5e8, #c8e6c9)"
                            />
                            <ModernCard
                                icon="📊"
                                title="Package Reporting"
                                iconBgColor="linear-gradient(135deg, #fff3e0, #ffcc02)"
                            />
                            <ModernCard
                                icon="🏷️"
                                title="Create Package Label"
                                iconBgColor="linear-gradient(135deg, #f3e5f5, #e1bee7)"
                            />
                            <ModernCard
                                icon="📈"
                                title="Update Package Status"
                                iconBgColor="linear-gradient(135deg, #e0f2f1, #b2dfdb)"
                            />
                            <ModernCard
                                icon="🗑️"
                                title="Delete Packages"
                                iconBgColor="linear-gradient(135deg, #ffebee, #ffcdd2)"
                            />
                        </div>
                    </div>

                    {/* Two Column Layout for Container and Drop Alerts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        {/* Container Modules */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Container Modules</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <ModernCard
                                    icon="📦"
                                    title="Create Container"
                                    iconBgColor="linear-gradient(135deg, #fff3e0, #ffcc02)"
                                />
                                <ModernCard
                                    icon="📋"
                                    title="Manage Containers"
                                    iconBgColor="linear-gradient(135deg, #fff3e0, #ffcc02)"
                                />
                            </div>
                        </div>

                        {/* Drop Alerts */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Drop Alerts</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <ModernCard
                                    icon="🔔"
                                    title="Create DropAlert"
                                    iconBgColor="linear-gradient(135deg, #ffebee, #ffcdd2)"
                                />
                                <ModernCard
                                    icon="📦"
                                    title="DropAlert Packages"
                                    iconBgColor="linear-gradient(135deg, #ffebee, #ffcdd2)"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Customer Modules */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Customer Modules</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <ModernCard
                                icon="📋"
                                title="Client Form"
                                iconBgColor="linear-gradient(135deg, #fff8e1, #ffecb3)"
                            />
                            <ModernCard
                                icon="✅"
                                title="Approve Document"
                                iconBgColor="linear-gradient(135deg, #e8f5e8, #c8e6c9)"
                            />
                            <ModernCard
                                icon="📤"
                                title="Upload User Document"
                                iconBgColor="linear-gradient(135deg, #e3f2fd, #bbdefb)"
                            />
                            <ModernCard
                                icon="📄"
                                title="Document List"
                                iconBgColor="linear-gradient(135deg, #f3e5f5, #e1bee7)"
                            />
                        </div>
                    </div>

                    {/* Settings */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Settings</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <ModernCard
                                icon="🏢"
                                title="Update Warehouse Address"
                                iconBgColor="linear-gradient(135deg, #f5f5f5, #e0e0e0)"
                            />
                            <ModernCard
                                icon="🔒"
                                title="Update Master Password"
                                iconBgColor="linear-gradient(135deg, #f5f5f5, #e0e0e0)"
                            />
                            <ModernCard
                                icon="💱"
                                title="Exchange Rate"
                                iconBgColor="linear-gradient(135deg, #f5f5f5, #e0e0e0)"
                            />
                            <ModernCard
                                icon="🔍"
                                title="User Data Lookup"
                                iconBgColor="linear-gradient(135deg, #f5f5f5, #e0e0e0)"
                            />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <ModernCard
                                icon="🏗️"
                                title="Create New Branch"
                                iconBgColor="linear-gradient(135deg, #f5f5f5, #e0e0e0)"
                            />
                            <ModernCard
                                icon="🏢"
                                title="Manage Branch"
                                iconBgColor="linear-gradient(135deg, #f5f5f5, #e0e0e0)"
                            />
                            <ModernCard
                                icon="📦"
                                title="Shipper Package Management"
                                iconBgColor="linear-gradient(135deg, #f5f5f5, #e0e0e0)"
                            />
                            <ModernCard
                                icon="👥"
                                title="Customer Management"
                                iconBgColor="linear-gradient(135deg, #f5f5f5, #e0e0e0)"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
