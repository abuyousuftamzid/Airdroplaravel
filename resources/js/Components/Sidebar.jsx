import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Ripple from './RippleButton';
import {
    Drawer,
    Box,
    Typography,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    Collapse,
    IconButton,
    Avatar,
    Divider,
    Button
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Inventory as PackageIcon,
    People as PeopleIcon,
    Notifications as AlertIcon,
    Business as ContainerIcon,
    AccountBox as AccountIcon,
    Settings as SettingsIcon,
    Description as LogIcon,
    AttachMoney as FinancialIcon,
    ExpandLess,
    ExpandMore,
    ChevronLeft as CollapseIcon,
    ChevronRight as ExpandIcon
} from '@mui/icons-material';

const navigation = [
    {
        name: 'Dashboard',
        href: '/admin/dashboard',
        icon: <DashboardIcon />,
        current: true,
    },
    {
        name: 'Packages',
        icon: <PackageIcon />,
        children: [
            { name: 'Package Management', href: '/admin/packages' },
            { name: 'Create Package', href: '/admin/packages/create' },
            { name: 'Package Reporting', href: '/packages/reporting' },
            { name: 'Create Package Label', href: '/packages/label/create' },
            { name: 'Update Package Status', href: '/admin/packages/status/update' },
            { name: 'Delete Packages', href: '/packages/delete' },
        ]
    },
    {
        name: 'Containers',
        icon: <ContainerIcon />,
        children: [
            { name: 'Create Container', href: '/containers/create' },
            { name: 'Manage Containers', href: '/containers/manage' },
        ]
    },
    {
        name: 'Drop Alerts',
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2L3 14h14l-7-12z" />
                <path d="M10 11a1 1 0 011 1v1a1 1 0 01-2 0v-1a1 1 0 011-1z" />
                <path d="M10 7a1 1 0 011 1v2a1 1 0 01-2 0V8a1 1 0 011-1z" />
            </svg>
        ),
        children: [
            { name: 'Create Drop Alert', href: '/drop-alerts/create' },
            { name: 'Manage Drop Alert Packages', href: '/drop-alerts/packages/manage' },
        ]
    },
    {
        name: 'Customers',
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
        ),
        children: [
            { name: 'Client Form', href: '/customers/client-form' },
            { name: 'Approve Document', href: '/customers/approve-document' },
            { name: 'Upload User Document', href: '/customers/upload-document' },
            { name: 'Document List', href: '/customers/documents' },
        ]
    },
    {
        name: 'More Account Options',
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
        ),
        children: [
            { name: 'Account Activity Report', href: '/accounts/activity-report' },
            { name: 'Accounts with Similar Name', href: '/accounts/similar-name' },
        ]
    },
    {
        name: 'Employees',
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM5 8a2 2 0 114 0v1a2 2 0 11-4 0V8zM13 8a2 2 0 114 0v1a2 2 0 11-4 0V8z" />
                <path d="M6 14a2 2 0 012-2h4a2 2 0 012 2v3H6v-3z" />
            </svg>
        ),
        children: [
            { name: 'Add New Employee', href: '/admin/employees/create' },
            { name: 'Employee Management', href: '/admin/employees' },
            { name: 'Role Management', href: '/admin/employees/roles' },
            { name: 'Employee Data Lookup', href: '/admin/employees/lookup' },
        ]
    },
    {
        name: 'Financial Reports',
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
        ),
        children: [
            { name: 'Financial Reports', href: '/financial-reports' },
            { name: 'Refer Friend Management', href: '/refer-friend' },
            { name: 'Reports / Tickets', href: '/reports-tickets' },
            { name: 'Payment Gateways', href: '/payment-gateways' },
        ]
    },
    {
        name: 'Settings',
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
        ),
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
    {
        name: 'View Log',
        href: '/admin/logs',
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
            </svg>
        )
    },
];

export default function Sidebar({ isOpen, onClose, searchQuery = '', isCollapsed = false, onToggleCollapse }) {
    const { url, props } = usePage();
    const user = props.auth.user;
    const [openDropdowns, setOpenDropdowns] = useState({});

    const isUrlActive = (href) => {
        if (!href) return false;
        return url === href || url.startsWith(href + '/') || url.startsWith(href + '?');
    };

    const toggleDropdown = (itemName) => {
        setOpenDropdowns(prev => {
            const isCurrentlyOpen = prev[itemName];

            // Create new state object
            const newState = { ...prev };

            // Toggle the clicked dropdown
            newState[itemName] = !isCurrentlyOpen;

            // Close other dropdowns (accordion behavior)
            navigation.forEach(item => {
                if (item.children && item.name !== itemName) {
                    newState[item.name] = false;
                }
            });

            return newState;
        });
    };

    const isChildActive = (children) => {
        if (!children) return false;
        return children.some(child => {
            const isActive = url === child.href || url.startsWith(child.href + '/') || url.startsWith(child.href + '?');
            return isActive;
        });
    };

    // Filter navigation based on search query
    const filteredNavigation = navigation.filter(item => {
        if (!searchQuery || !searchQuery.trim()) return true;

        const searchLower = searchQuery.toLowerCase();

        // Check if main item name matches
        if (item.name.toLowerCase().includes(searchLower)) return true;

        // Check if any child item name matches
        if (item.children) {
            return item.children.some(child =>
                child.name.toLowerCase().includes(searchLower)
            );
        }

        return false;
    });

    // Ensure dropdown with active child is opened on mount/url change
    useEffect(() => {
        // Find which parent has an active child
        const activeParent = navigation.find(item => {
            if (!item.children) return false;
            return item.children.some(child => {
                return url === child.href || url.startsWith(child.href + '/') || url.startsWith(child.href + '?');
            });
        });

        // Set dropdown states
        setOpenDropdowns(prev => {
            const newState = {};
            navigation.forEach(item => {
                if (item.children) {
                    // Open the dropdown if it has an active child
                    newState[item.name] = activeParent && item.name === activeParent.name;
                }
            });
            return newState;
        });
    }, [url]);

    // For search mode, allow multiple dropdowns to be open
    const effectiveOpenDropdowns = { ...openDropdowns };

    // During search, also open dropdowns that have matching children
    if (searchQuery && searchQuery.trim()) {
        navigation.forEach(item => {
            if (!item.children) return;
            const hasMatchingChild = item.children.some(child =>
                child.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            if (hasMatchingChild) {
                effectiveOpenDropdowns[item.name] = true;
            }
        });
    }

    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-gray-600 bg-opacity-75 xl:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed top-0 bottom-0 left-0 z-40 w-64 ${isCollapsed ? 'xl:w-[88px]' : 'xl:w-[300px]'} bg-white dark:bg-dark-primary border-r border-gray-200 dark:border-gray-700 transform transition-all duration-200 ease-linear h-full xl:relative xl:translate-x-0 xl:block xl:top-0 xl:bottom-auto xl:h-screen
                ${isOpen ? 'translate-x-0' : '-translate-x-full xl:translate-x-0'}
            `}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className={`${isCollapsed ? 'flex justify-center py-5' : 'pl-7 pt-5 pb-2'} relative flex-shrink-0`}>
                        {/* Collapse toggle (desktop only) */}
                        <button
                            type="button"
                            onClick={onToggleCollapse}
                            className={`hidden xl:flex absolute top-1/2 -translate-y-1/2 items-center justify-center w-7 h-7 rounded-full bg-white dark:bg-dark-primary border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 z-[9999]`}
                            style={{
                                left: isCollapsed ? '88px' : '300px',
                                transform: 'translate(-50%, -50%)',
                                transition: 'left 200ms linear'
                            }}
                            title={isCollapsed ? 'Expand' : 'Collapse'}
                        >
                            <svg className={`w-4 h-4`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isCollapsed ? "M9 18l6-6-6-6" : "M15 18l-6-6 6-6"} />
                            </svg>
                        </button>
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">A</span>
                            </div>
                            {!isCollapsed && (
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Airdrop</span>
                            )}
                        </Link>
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 overflow-y-auto mt-4 scrollbar">
                        <nav className={`${isCollapsed ? 'px-2 py-2' : 'px-4'} flex-1`}>
                            <table className="w-full table-fixed">
                                <tbody>
                                    {filteredNavigation.map((item) => {
                                        if (item.children) {
                                            // Dropdown menu item
                                            const hasActiveChild = isChildActive(item.children);
                                            const isManuallyToggled = effectiveOpenDropdowns[item.name];

                                            // Show dropdown if:
                                            // 1. It has an active child (automatic opening)
                                            // 2. It's manually toggled open
                                            // 3. But if manually toggled closed, respect that even with active child
                                            const isDropdownOpen = hasActiveChild ?
                                                (isManuallyToggled !== false) : // If has active child, show unless explicitly closed
                                                isManuallyToggled; // If no active child, only show if manually opened

                                            return (
                                                <tr key={item.name}>
                                                    <td className="w-full max-w-0 pb-1">
                                                        <div className="space-y-1">
                                                            <Ripple
                                                                onClick={() => toggleDropdown(item.name)}
                                                                className={`
                                                                    w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200
                                                                    ${hasActiveChild
                                                                        ? 'text-[#00a76f] bg-[rgba(0,167,111,0.08)] dark:bg-[rgba(0,167,111,0.15)] dark:text-[#5be49b] dark:hover:bg-[#11312E]'
                                                                        : isDropdownOpen
                                                                        ? 'text-gray-600 dark:text-white bg-gray-100 dark:bg-[#1D242B]'
                                                                        : searchQuery && searchQuery.trim() && item.name.toLowerCase().includes(searchQuery.toLowerCase())
                                                                        ? 'bg-yellow-50 dark:bg-yellow-600/20 text-yellow-800 dark:text-yellow-300'
                                                                        : 'text-gray-600 dark:text-[#919eab] hover:bg-gray-100 dark:hover:bg-[#1D242B]'
                                                                    }
                                                                `}
                                                                bgColor="bg-gray-400/60"
                                                            >
                                                                {isCollapsed ? (
                                                                    <span className="flex items-center justify-center" title={item.name}>{item.icon}</span>
                                                                ) : (
                                                                    <>
                                                                        <div className="flex items-center min-w-0">
                                                                            <span className="flex-shrink-0 mr-3">{item.icon}</span>
                                                                            <span className="truncate leading-[22px]">{item.name}</span>
                                                                        </div>
                                                                        <svg
                                                                            className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ${
                                                                                isDropdownOpen ? 'rotate-0' : '-rotate-90'
                                                                            }`}
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                            stroke="currentColor"
                                                                        >
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                                        </svg>
                                                                    </>
                                                                )}
                                                            </Ripple>

                                                            {/* Dropdown items */}
                                                            {!isCollapsed && (
                                                                <div className={`
                                                                    overflow-hidden transition-all duration-200 ease-in-out mt-1 relative
                                                                    ${isDropdownOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                                                                `}>
                                                                    <table className="w-full table-fixed">
                                                                        <tbody>
                                                                            {item.children
                                                                                .filter(child => {
                                                                                    if (!searchQuery || !searchQuery.trim()) return true;
                                                                                    return child.name.toLowerCase().includes(searchQuery.toLowerCase());
                                                                                })
                                                                                .map((child, index, array) => {
                                                                                    // Child items use exact match to avoid prefix collisions (e.g., '/employees' vs '/employees/roles')
                                                                                    const isChildActive = url === child.href;
                                                                                    const isSearchMatch = searchQuery && searchQuery.trim() && child.name.toLowerCase().includes(searchQuery.toLowerCase());
                                                                                    const isLastItem = index === array.length - 1;
                                                                                    return (
                                                                                        <tr key={child.name}>
                                                                                            <td className="max-w-0 relative">
                                                                                                <div className={`absolute left-5 w-px bg-gray-200 dark:bg-gray-600 ${isLastItem ? 'top-0 h-[43%]' : 'top-0 bottom-0'}`}></div>
                                                                                                <div className="absolute left-5 top-[24%] w-3 h-3 border-l border-b border-gray-200 dark:border-gray-600 rounded-bl-md"></div>

                                                                                                <Link
                                                                                                    href={child.href}
                                                                                                    className="w-full pl-8 block"
                                                                                                >
                                                                                                    <Ripple
                                                                                                        className={`
                                                                                                            flex items-center px-3 py-2 text-sm rounded-lg transition-colors duration-200
                                                                                                            ${isChildActive
                                                                                                                ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-[#1D242B] font-medium'
                                                                                                                : isSearchMatch
                                                                                                                ? 'bg-yellow-50 dark:bg-yellow-600/20 text-yellow-800 dark:text-yellow-300 font-medium'
                                                                                                                : 'text-gray-600 dark:text-[#919eab] hover:bg-gray-100 dark:hover:bg-[#1D242B]'
                                                                                                            }
                                                                                                        `}
                                                                                                        bgColor="bg-gray-400/60"
                                                                                                    >
                                                                                                        <span className="truncate">{child.name}</span>
                                                                                                    </Ripple>
                                                                                                </Link>
                                                                                            </td>
                                                                                        </tr>
                                                                                    );
                                                                                })}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        } else {
                                            // Regular menu item
                                            const isActive = isUrlActive(item.href);
                                            return (
                                                <tr key={item.name}>
                                                    <td className="w-full max-w-0 pb-1">
                                                        <Link
                                                            href={item.href}
                                                            className="w-full"
                                                        >
                                                            <Ripple
                                                                className={`
                                                                    flex items-center ${isCollapsed ? 'justify-center' : ''} px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200
                                                                    ${isActive
                                                                        ? 'text-[#00a76f] dark:text-[#5be49b] dark:hover:bg-[#11312E]'
                                                                        + ' '
                                                                        + 'bg-[rgba(0,167,111,0.08)] dark:bg-[rgba(0,167,111,0.15)]'
                                                                        : searchQuery && searchQuery.trim() && item.name.toLowerCase().includes(searchQuery.toLowerCase())
                                                                        ? 'bg-yellow-50 dark:bg-yellow-600/20 text-yellow-800 dark:text-yellow-300'
                                                                        : 'text-gray-600 dark:text-[#919eab] hover:bg-gray-100 dark:hover:bg-[#1D242B]'
                                                                    }
                                                                `}
                                                                bgColor="bg-[#00a76f]"
                                                            >
                                                                {isCollapsed ? (
                                                                    <span className="text-[16px] leading-[24px]" title={item.name}>{item.icon}</span>
                                                                ) : (
                                                                    <>
                                                                        <span className="text-[16px] leading-[24px] flex-shrink-0 mr-3">{item.icon}</span>
                                                                        <span className="truncate leading-[22px] font-semibold">{item.name}</span>
                                                                    </>
                                                                )}
                                                            </Ripple>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    })}
                                </tbody>
                            </table>
                        </nav>
                    </div>

                    {/* User info at bottom */}
                    {/* {!isCollapsed && (
                        <div className="px-2 py-5 flex-shrink-0 bg-white text-center">
                            <div className="flex flex-col items-center">
                                <div className="relative mb-6">
                                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                                        <span className="text-lg font-medium text-white">
                                            {user?.user_first_last_name?.charAt(0) || 'U'}
                                        </span>
                                    </div>
                                    <span className="absolute -top-1.5 left-10 px-1.5 py-0.5 bg-green-500 text-white text-xs font-medium rounded-lg">
                                        Free
                                    </span>
                                </div>

                                <div className="mb-8 w-full">
                                    <p className="text-sm font-semibold text-gray-900 mb-1 truncate">
                                        {user?.user_first_last_name || 'Jaydon Frankie'}
                                    </p>
                                    <p className="text-sm text-gray-500 truncate">
                                        {user?.user_email || 'demo@minimals.cc'}
                                    </p>
                                </div>

                                <button className="w-full bg-gray-900 text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors duration-200">
                                    Upgrade to Pro
                                </button>
                            </div>
                        </div>
                    )} */}
                </div>
            </div>
        </>
    );
}
