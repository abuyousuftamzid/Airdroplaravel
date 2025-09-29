import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTheme } from '@/Contexts/ThemeContext';
import LoadingScreen from '@/Components/LoadingScreen';
import {
    Box,
    Typography,
    Tabs,
    Tab,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
    Chip,
    IconButton,
    Pagination,
    Grid,
    Card,
    CardContent,
    InputAdornment,
    Menu,
    MenuItem,
    ListItemText,
    ListItemIcon
} from '@mui/material';
import {
    FilterList,
    Download,
    Search,
    ArrowUpward,
    ArrowDownward,
    MoreVert,
    Edit,
    LocalShipping,
    SwapHoriz,
    Receipt,
    AttachMoney,
    Note
} from '@mui/icons-material';
import CustomTextField from '@/Components/CustomTextField';
import CustomSelectField from '@/Components/CustomSelectField';
import CustomDatePicker from '@/Components/CustomDatePicker';
import BlackButton from '@/Components/BlackButton';
import ClearIcon from '@mui/icons-material/Clear';

// Route helper function
const route = (name, params = {}) => {
    const routes = {
        'admin.packages.getData': '/admin/packages/get-data',
        'admin.packages.exportCsv': '/admin/packages/export-csv',
        'admin.packages.create': '/admin/packages/create',
        'admin.packages.show': (trackingCode) => `/admin/packages/${trackingCode}`,
        'admin.packages.edit': (id) => `/admin/packages/${id}/edit`
    };

    if (typeof routes[name] === 'function') {
        return routes[name](params);
    }
    return routes[name] || '#';
};


export default function PackageIndex({ auth, packageStatuses, initialData, totalCount, filters }) {
    const { isDark } = useTheme();
    const [activeTab, setActiveTab] = useState('air');
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [packages, setPackages] = useState(initialData || []);
    const [loading, setLoading] = useState(false);
    const [totalEntries, setTotalEntries] = useState(totalCount || 0);
    const [sortColumn, setSortColumn] = useState(7); // Default to creation date
    const [sortDirection, setSortDirection] = useState('desc');

    // Date picker states
    const [fromCreationDate, setFromCreationDate] = useState(null);
    const [toCreationDate, setToCreationDate] = useState(null);
    const [packageStatusDate, setPackageStatusDate] = useState(null);
    const [fromUpdateDate, setFromUpdateDate] = useState(null);
    const [toUpdateDate, setToUpdateDate] = useState(null);

    // Filter dropdown states
    const [packageStatus, setPackageStatus] = useState(filters?.package_status || 'all');
    const [pickupLocation, setPickupLocation] = useState(filters?.pickup_location || 'all');

    // Dropdown states
    const [colorCodeAnchor, setColorCodeAnchor] = useState(null);
    const [actionAnchor, setActionAnchor] = useState(null);
    const [actionRowIndex, setActionRowIndex] = useState(null);
    const [openActionDropdown, setOpenActionDropdown] = useState(null);
    const actionDropdownRef = useRef(null);
    const searchTimeoutRef = useRef(null);

    // Color code data for package statuses
    const colorCodeData = [
        { status: 'Drop Alerted', color: '#dc2626' },
        { status: 'Shipment Received', color: '#f97316' },
        { status: 'Port of Departure -MIA', color: '#06b6d4' },
        { status: 'Arrived at Port -JAM', color: '#8b5cf6' },
        { status: 'Processing at Customs', color: '#7c3aed' },
        { status: 'Detained at Customs', color: '#ec4899' },
        { status: 'Released From Customs', color: '#be185d' },
        { status: 'Processing at our Warehouse', color: '#84cc16' },
        { status: 'In-Transit to counter', color: '#22c55e' },
        { status: 'Ready for Pickup', color: '#3b82f6' },
        { status: '>=Delivered', color: '#10b981' }
    ];

    // Dropdown handlers
    const handleColorCodeClick = (event) => {
        setColorCodeAnchor(event.currentTarget);
    };

    const handleColorCodeClose = () => {
        setColorCodeAnchor(null);
    };

    const handleActionClick = (event, rowIndex) => {
        setActionAnchor(event.currentTarget);
        setActionRowIndex(rowIndex);
    };

    const handleActionClose = () => {
        setActionAnchor(null);
        setActionRowIndex(null);
    };

    // Function to handle column sorting
    const handleSort = (columnIndex) => {
        let newDirection = 'desc';
        if (sortColumn === columnIndex) {
            newDirection = sortDirection === 'desc' ? 'asc' : 'desc';
        }

        setSortColumn(columnIndex);
        setSortDirection(newDirection);
        setCurrentPage(1); // Reset to first page when sorting

        fetchPackages({
            start: 0,
            order: [{ column: columnIndex, dir: newDirection }],
            package_status: packageStatus === 'all' ? '' : packageStatus,
            pickup_location: pickupLocation === 'all' ? '' : pickupLocation,
            from_creation_date: fromCreationDate ? fromCreationDate.toISOString().split('T')[0] : '',
            to_creation_date: toCreationDate ? toCreationDate.toISOString().split('T')[0] : '',
            from_update_date: fromUpdateDate ? fromUpdateDate.toISOString().split('T')[0] : '',
            to_update_date: toUpdateDate ? toUpdateDate.toISOString().split('T')[0] : '',
            package_status_date: packageStatusDate ? packageStatusDate.toISOString().split('T')[0] : '',
            package_type: activeTab === 'air' ? 'ST' : activeTab === 'sea' ? 'SD' : 'ES',
            searchValue: searchTerm
        });
    };

    // Function to fetch packages data
    const fetchPackages = async (params = {}) => {
        setLoading(true);
        try {
            const requestBody = {
                start: params.start || 0,
                length: params.length || entriesPerPage,
                search: { value: params.search !== undefined ? params.search : (params.searchValue !== undefined ? params.searchValue : searchTerm) },
                order: params.order || [{ column: sortColumn, dir: sortDirection }],
                package_status: params.package_status || '',
                pickup_location: params.pickup_location || '',
                from_creation_date: params.from_creation_date || '',
                to_creation_date: params.to_creation_date || '',
                from_update_date: params.from_update_date || '',
                to_update_date: params.to_update_date || '',
                package_status_date: params.package_status_date || '',
                package_type: params.package_type || (activeTab === 'air' ? 'ST' : activeTab === 'sea' ? 'SD' : 'ES')
            };

            console.log('Fetching packages with request body:', requestBody);

            const response = await fetch(route('admin.packages.getData'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();
            console.log('Fetched data:', data); // Debug log
            setPackages(data.data || []);
            setTotalEntries(data.recordsTotal || 0);
        } catch (error) {
            console.error('Error fetching packages:', error);
        } finally {
            setLoading(false);
        }
    };

    // Debounced search function
    const debouncedSearch = useCallback((searchValue) => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            const filterParams = {
                package_status: packageStatus === 'all' ? '' : packageStatus,
                pickup_location: pickupLocation === 'all' ? '' : pickupLocation,
                from_creation_date: fromCreationDate ? fromCreationDate.toISOString().split('T')[0] : '',
                to_creation_date: toCreationDate ? toCreationDate.toISOString().split('T')[0] : '',
                from_update_date: fromUpdateDate ? fromUpdateDate.toISOString().split('T')[0] : '',
                to_update_date: toUpdateDate ? toUpdateDate.toISOString().split('T')[0] : '',
                package_status_date: packageStatusDate ? packageStatusDate.toISOString().split('T')[0] : '',
                package_type: activeTab === 'air' ? 'ST' : activeTab === 'sea' ? 'SD' : 'ES',
                searchValue: searchValue,
                order: [{ column: sortColumn, dir: sortDirection }]
            };

            console.log('Debounced search with params:', filterParams);
            fetchPackages(filterParams);
        }, 500); // 500ms delay
    }, [packageStatus, pickupLocation, fromCreationDate, toCreationDate, fromUpdateDate, toUpdateDate, packageStatusDate, activeTab, sortColumn, sortDirection]);

    // Function to apply filters
    const applyFilters = (currentTab = null) => {
        // Clear any pending search timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Use passed tab or current activeTab
        const tabToUse = currentTab || activeTab;
        const packageType = tabToUse === 'air' ? 'ST' : tabToUse === 'sea' ? 'SD' : 'ES';

        const filterParams = {
            start: 0,
            length: entriesPerPage,
            searchValue: searchTerm,
            order: [{ column: sortColumn, dir: sortDirection }],
            package_status: packageStatus === 'all' ? '' : packageStatus,
            pickup_location: pickupLocation === 'all' ? '' : pickupLocation,
            from_creation_date: fromCreationDate ? fromCreationDate.toISOString().split('T')[0] : '',
            to_creation_date: toCreationDate ? toCreationDate.toISOString().split('T')[0] : '',
            from_update_date: fromUpdateDate ? fromUpdateDate.toISOString().split('T')[0] : '',
            to_update_date: toUpdateDate ? toUpdateDate.toISOString().split('T')[0] : '',
            package_status_date: packageStatusDate ? packageStatusDate.toISOString().split('T')[0] : '',
            package_type: packageType
        };

        // console.log('Apply filters with params:', filterParams);
        // console.log('Package Status Value:', packageStatus);
        // console.log('Pickup Location Value:', pickupLocation);
        // console.log('Tab used for filter:', tabToUse, 'Package type:', packageType);
        fetchPackages(filterParams);
    };

    // Function to reset filters
    const resetFilters = () => {
        // Reset all state variables
        setFromCreationDate(null);
        setToCreationDate(null);
        setPackageStatusDate(null);
        setFromUpdateDate(null);
        setToUpdateDate(null);
        setSearchTerm('');
        setPackageStatus('all');
        setPickupLocation('all');
        setCurrentPage(1);

        // Clear any pending search timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Fetch all packages without any filters
        fetchPackages({
            start: 0,
            length: entriesPerPage,
            searchValue: '',
            order: [{ column: sortColumn, dir: sortDirection }],
            package_status: '',
            pickup_location: '',
            from_creation_date: '',
            to_creation_date: '',
            from_update_date: '',
            to_update_date: '',
            package_status_date: '',
            package_type: activeTab === 'air' ? 'ST' : activeTab === 'sea' ? 'SD' : 'ES'
        });
    };

    // Load initial data on component mount
    useEffect(() => {
        if (initialData && initialData.length > 0) {
            setPackages(initialData);
            setTotalEntries(totalCount || initialData.length);
        } else {
            // If no initial data, fetch from API
            fetchPackages();
        }
    }, [initialData, totalCount]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (actionDropdownRef.current && !actionDropdownRef.current.contains(event.target)) {
                setOpenActionDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Cleanup search timeout on unmount
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    // Handle page change
    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage + 1);
        fetchPackages({
            start: newPage * entriesPerPage,
            order: [{ column: sortColumn, dir: sortDirection }],
            package_status: packageStatus === 'all' ? '' : packageStatus,
            pickup_location: pickupLocation === 'all' ? '' : pickupLocation,
            from_creation_date: fromCreationDate ? fromCreationDate.toISOString().split('T')[0] : '',
            to_creation_date: toCreationDate ? toCreationDate.toISOString().split('T')[0] : '',
            from_update_date: fromUpdateDate ? fromUpdateDate.toISOString().split('T')[0] : '',
            to_update_date: toUpdateDate ? toUpdateDate.toISOString().split('T')[0] : '',
            package_status_date: packageStatusDate ? packageStatusDate.toISOString().split('T')[0] : '',
            package_type: activeTab === 'air' ? 'ST' : activeTab === 'sea' ? 'SD' : 'ES',
            searchValue: searchTerm
        });
    };

    // Handle rows per page change
    const handleRowsPerPageChange = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setEntriesPerPage(newRowsPerPage);
        setCurrentPage(1);
        fetchPackages({
            start: 0,
            length: newRowsPerPage,
            order: [{ column: sortColumn, dir: sortDirection }],
            package_status: packageStatus === 'all' ? '' : packageStatus,
            pickup_location: pickupLocation === 'all' ? '' : pickupLocation,
            from_creation_date: fromCreationDate ? fromCreationDate.toISOString().split('T')[0] : '',
            to_creation_date: toCreationDate ? toCreationDate.toISOString().split('T')[0] : '',
            from_update_date: fromUpdateDate ? fromUpdateDate.toISOString().split('T')[0] : '',
            to_update_date: toUpdateDate ? toUpdateDate.toISOString().split('T')[0] : '',
            package_status_date: packageStatusDate ? packageStatusDate.toISOString().split('T')[0] : '',
            package_type: activeTab === 'air' ? 'ST' : activeTab === 'sea' ? 'SD' : 'ES',
            searchValue: searchTerm
        });
    };

    // Helper function to render sortable column header
    const renderSortableHeader = (label, columnIndex) => {
        const isActive = sortColumn === columnIndex;
        const isAsc = isActive && sortDirection === 'asc';
        const isDesc = isActive && sortDirection === 'desc';

        return (
            <TableCell
                className="table-header-cell dark:table-header-cell"
                sx={{
                    minWidth: 150,
                    cursor: 'pointer',
                    userSelect: 'none',
                    '&:hover': { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)' }
                }}
                onClick={() => handleSort(columnIndex)}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{label}</span>
                    <div style={{ display: 'flex', flexDirection: 'column', fontSize: '12px' }}>
                        <ArrowUpward
                            sx={{
                                fontSize: '16px',
                                color: isAsc ? '#1976d2' : isDark ? '#919eab' : '#637381',
                                opacity: isActive ? 1 : 0.3
                            }}
                        />
                        <ArrowDownward
                            sx={{
                                fontSize: '16px',
                                color: isDesc ? '#1976d2' : isDark ? '#919eab' : '#637381',
                                opacity: isActive ? 1 : 0.3,
                                marginTop: '-4px'
                            }}
                        />
                    </div>
                </div>
            </TableCell>
        );
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Packages" />

            <div className="py-2">
                <div className="">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                        <h2 className="text-2xl leading-9 font-bold text-quaternary dark:text-dark-text-primary mb-6">
                            Package Management
                        </h2>
                        <div>
                            <Link href={route('admin.packages.create')}>
                                <BlackButton>
                                    Create New Package
                                </BlackButton>
                            </Link>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <Box className='flex justify-start md:justify-center mb-4'>
                        <Tabs
                            value={activeTab}
                            onChange={(e, newValue) => {
                                setActiveTab(newValue);
                                setCurrentPage(1);
                                // Apply filters when tab changes to refresh data with new package type
                                // Pass the new tab value directly to avoid React closure issues
                                setTimeout(() => applyFilters(newValue), 100);
                            }}
                            sx={{
                                '& .MuiTab-root': {
                                    fontSize: '14px',
                                    lineHeight: '22px',
                                    fontWeight: 500,
                                    color: isDark ? '#919eab' : '#637381',
                                    '&.Mui-selected': {
                                        color: isDark ? '#fff' : '#1c252e',
                                        borderBottom: isDark ? '#fff !important' : '#1c252e !important',
                                        fontWeight: 600,
                                    },
                                    '& .MuiTabs-indicator': {
                                        backgroundColor: isDark ? '#fff !important' : '#1c252e !important',
                                    }
                                }
                            }}
                        >
                            <Tab label="AIR Packages" value="air" />
                            <Tab label="SeaDrop Packages" value="sea" />
                            <Tab label="Express Packages" value="express" />
                        </Tabs>
                    </Box>


                    {/* Filter Section */}
                    <Card className='mb-3 bg-white dark:bg-dark-quaternary overflow-hidden shadow-card sm:rounded-lg'>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" className='text-quaternary dark:text-dark-text-primary !font-semibold !mb-6'>
                                Filter Packages By:
                            </Typography>

                            <div className='flex flex-col gap-6 mb-6'>
                                <div className='w-full flex flex-col md:flex-row gap-6 md:gap-2'>
                                    <div className='w-full'>
                                        <CustomSelectField
                                            name="package_status"
                                            label="Package Status"
                                            value={packageStatus}
                                            onChange={(e) => setPackageStatus(e.target.value)}
                                            options={[
                                                { value: 'all', label: 'All Packages' },
                                                ...(packageStatuses || []).map(status => ({
                                                    value: `status_${status.package_status_id}`,
                                                    label: status.package_status_name
                                                }))
                                            ]}
                                        />
                                    </div>

                                    <div className='w-full'>
                                        <CustomSelectField
                                            name="pickup_location"
                                            label="Pickup Location"
                                            value={pickupLocation}
                                            onChange={(e) => setPickupLocation(e.target.value)}
                                            options={[
                                                { value: 'all', label: 'All' },
                                                { value: 'Montego', label: 'Filter by Montego Bay' },
                                                { value: 'Kingston', label: 'Filter by Kingston' },
                                                { value: 'Savanna-La-Mar', label: 'Filter by Savanna-La-Mar' }
                                            ]}
                                        />
                                    </div>

                                    <div className='w-full'>
                                        <CustomDatePicker
                                            label="From Creation Date"
                                            variant="outlined"
                                            size="small"
                                            value={fromCreationDate}
                                            onChange={(newValue) => setFromCreationDate(newValue)}
                                        />
                                    </div>
                                </div>

                                <div className='w-full flex flex-col md:flex-row gap-6 md:gap-2'>
                                    <div className='w-full'>
                                        <CustomDatePicker
                                            label="To Creation Date"
                                            variant="outlined"
                                            size="small"
                                            value={toCreationDate}
                                            onChange={(newValue) => setToCreationDate(newValue)}
                                        />
                                    </div>

                                    <div className='w-full'>
                                        <CustomDatePicker
                                            label="Package Status Date"
                                            variant="outlined"
                                            size="small"
                                            value={packageStatusDate}
                                            onChange={(newValue) => setPackageStatusDate(newValue)}
                                        />
                                    </div>

                                    <div className='w-full'>
                                        <CustomDatePicker
                                            label="From Update Date"
                                            variant="outlined"
                                            size="small"
                                            value={fromUpdateDate}
                                            onChange={(newValue) => setFromUpdateDate(newValue)}
                                        />
                                    </div>
                                </div>

                                <div className='w-full md:w-1/3'>
                                    <CustomDatePicker
                                        label="To Update Date"
                                        variant="outlined"
                                        size="small"
                                        value={toUpdateDate}
                                        onChange={(newValue) => setToUpdateDate(newValue)}
                                    />
                                </div>
                            </div>

                            {/* Filter Buttons */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Button
                                        variant="contained"
                                        onClick={applyFilters}
                                        disabled={loading}
                                        sx={{
                                            bgcolor: '#059669',
                                            '&:hover': { bgcolor: '#047857' },
                                            px: 3
                                        }}
                                    >
                                        {loading ? 'Loading...' : 'Apply Filter'}
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={resetFilters}
                                        disabled={loading}
                                        sx={{
                                            bgcolor: '#dc2626',
                                            '&:hover': { bgcolor: '#b91c1c' },
                                            px: 3
                                        }}
                                    >
                                        Reset Filter
                                    </Button>
                                    <Button
                                        variant="contained"
                                        startIcon={<Download />}
                                        onClick={async () => {
                                            // Handle export functionality using React state values
                                            const exportParams = {
                                                package_status: packageStatus === 'all' ? '' : packageStatus,
                                                pickup_location: pickupLocation === 'all' ? '' : pickupLocation,
                                                from_creation_date: fromCreationDate ? fromCreationDate.toISOString().split('T')[0] : '',
                                                to_creation_date: toCreationDate ? toCreationDate.toISOString().split('T')[0] : '',
                                                from_update_date: fromUpdateDate ? fromUpdateDate.toISOString().split('T')[0] : '',
                                                to_update_date: toUpdateDate ? toUpdateDate.toISOString().split('T')[0] : '',
                                                package_status_date: packageStatusDate ? packageStatusDate.toISOString().split('T')[0] : '',
                                                package_type: activeTab === 'air' ? 'ST' : activeTab === 'sea' ? 'SD' : 'ES',
                                                search: searchTerm
                                            };

                                            // console.log('Export params:', exportParams);

                                            // Create a form and submit it to maintain session state
                                            const form = document.createElement('form');
                                            form.method = 'POST';
                                            form.action = route('admin.packages.exportCsv');
                                            form.target = '_blank'; // Open in new tab

                                            // Add all parameters as hidden inputs
                                            Object.keys(exportParams).forEach(key => {
                                                const input = document.createElement('input');
                                                input.type = 'hidden';
                                                input.name = key;
                                                input.value = exportParams[key];
                                                form.appendChild(input);
                                            });

                                            // Add CSRF token for POST requests
                                            const csrfInput = document.createElement('input');
                                            csrfInput.type = 'hidden';
                                            csrfInput.name = '_token';
                                            csrfInput.value = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
                                            form.appendChild(csrfInput);

                                            document.body.appendChild(form);
                                            form.submit();
                                            document.body.removeChild(form);

                                            // console.log('Export form submitted');
                                        }}
                                        sx={{
                                            bgcolor: '#2563eb',
                                            '&:hover': { bgcolor: '#1d4ed8' },
                                            px: 3
                                        }}
                                    >
                                        Export
                                    </Button>
                                </Box>

                                <BlackButton
                                    variant="contained"
                                    startIcon={<FilterList />}
                                    onClick={handleColorCodeClick}
                                    sx={{ px: 2 }}
                                >
                                    Color Code
                                </BlackButton>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Table Controls */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CustomTextField
                                value={searchTerm}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setSearchTerm(value);
                                    debouncedSearch(value);
                                }}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        // Clear any pending debounced search and search immediately
                                        if (searchTimeoutRef.current) {
                                            clearTimeout(searchTimeoutRef.current);
                                        }
                                        applyFilters();
                                    }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search color="action" className="text-quaternary dark:text-dark-text-primary" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: searchTerm && (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => {
                                                    setSearchTerm('');
                                                    // Clear any pending search timeout
                                                    if (searchTimeoutRef.current) {
                                                        clearTimeout(searchTimeoutRef.current);
                                                    }
                                                    // Trigger a search with empty search term to show all filtered results
                                                    debouncedSearch('');
                                                }}
                                                edge="end"
                                                size="small"
                                            >
                                                <ClearIcon className="text-quaternary dark:text-dark-text-primary" />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                customSx={{ width: 400 }}
                                placeholder="Search packages..."
                            />
                        </Box>
                    </Box>

                    {/* Data Table */}
                    <div className="w-full flex justify-center shadow-card sm:rounded-lg">
                        <div className="w-full">
                            <TableContainer component={Paper} className="table-container">
                                <Table stickyHeader sx={{ minWidth: 1000 }}>
                                    <TableHead>
                                        <TableRow>
                                            {renderSortableHeader("Customer Account", 0)}
                                            {renderSortableHeader("Customer Name", 1)}
                                            {renderSortableHeader("Courier Number", 2)}
                                            {renderSortableHeader("Inhouse Tracking", 3)}
                                            {renderSortableHeader("Package Description", 4)}
                                            {renderSortableHeader("Package Status", 5)}
                                            {renderSortableHeader("Pickup Location", 6)}
                                            {renderSortableHeader("Creation Date", 7)}
                                            {renderSortableHeader("Last Update Date", 8)}
                                            {renderSortableHeader("Actual Weight", 9)}
                                            <TableCell className="table-header-cell dark:table-header-cell" sx={{ minWidth: 120 }}>
                                                Actions
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={11} className="text-center py-8">
                                                    <LoadingScreen show={true} message="Loading packages..." />
                                                </TableCell>
                                            </TableRow>
                                        ) : packages.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={11} className="text-center py-8">
                                                    <div className="text-quaternary dark:text-dark-text-primary w-full">No packages found.</div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            packages.map((row, index) => (
                                            <TableRow
                                                key={index}
                                                hover
                                                className="table-row-hover dark:table-row-hover"
                                            >
                                                <TableCell className="table-body-cell dark:table-body-cell">
                                                    <Link href="#">
                                                    <div
                                                        className="[&_a]:text-blue-600 [&_a]:no-underline [&_a]:hover:underline"
                                                        dangerouslySetInnerHTML={{
                                                            __html: row.package_user_account_number
                                                        }}
                                                    />
                                                    </Link>
                                                </TableCell>
                                                <TableCell className="table-body-cell dark:table-body-cell">
                                                    <div className="truncate">{row.package_consignee}</div>
                                                </TableCell>
                                                <TableCell className="table-body-cell dark:table-body-cell">
                                                    <div className="truncate">{row.package_couirer_number}</div>
                                                </TableCell>
                                                <TableCell className="table-body-cell dark:table-body-cell">
                                                    <Link href={route('admin.packages.show', row.package_tracking_code)} target="_blank">
                                                        <div
                                                            className="[&_a]:text-blue-600 [&_a]:no-underline [&_a]:hover:underline"
                                                            dangerouslySetInnerHTML={{
                                                                __html: row.package_tracking_code
                                                            }}
                                                        />
                                                    </Link>
                                                </TableCell>
                                                <TableCell className="table-body-cell dark:table-body-cell">
                                                    <div className="truncate">{row.package_description}</div>
                                                </TableCell>
                                                <TableCell className="table-body-cell dark:table-body-cell">
                                                    <div dangerouslySetInnerHTML={{ __html: row.package_status }} />
                                                </TableCell>
                                                <TableCell className="table-body-cell dark:table-body-cell">
                                                    <div>{row.pickup_location}</div>
                                                </TableCell>
                                                <TableCell className="table-body-cell dark:table-body-cell">
                                                    <div>{row.package_creation_date_time}</div>
                                                </TableCell>
                                                <TableCell className="table-body-cell dark:table-body-cell">
                                                    <div>{row.package_updated_date}</div>
                                                </TableCell>
                                                <TableCell className="table-body-cell dark:table-body-cell">
                                                    <div>{row.package_weight}</div>
                                                </TableCell>
                                                <TableCell className="table-body-cell dark:table-body-cell">
                                                    <div className="relative" ref={openActionDropdown === index ? actionDropdownRef : null}>
                                                        {/* 3-dotted menu button */}
                                                        <button
                                                            onClick={() => setOpenActionDropdown(
                                                                openActionDropdown === index ? null : index
                                                            )}
                                                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                                                            aria-label="Actions menu"
                                                        >
                                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                            </svg>
                                                        </button>

                                                        {/* Dropdown Menu */}
                                                        {openActionDropdown === index && (
                                                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-quaternary border border-gray-200 dark:border-dark-quaternary rounded-md shadow-lg z-10 right-sidebar">
                                                                <div className="py-1">
                                                                    {/* Update Package Action */}
                                                                    <Link href={route('admin.packages.edit', row.package_id)}>
                                                                        <button
                                                                            onClick={() => setOpenActionDropdown(null)}
                                                                            className="flex w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-dark-text-primary hover:bg-gray-100 dark:hover:bg-dark-secondary items-center"
                                                                        >
                                                                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                            </svg>
                                                                            Update Package
                                                                        </button>
                                                                    </Link>

                                                                    {/* Create Label Action */}
                                                                    <button
                                                                        onClick={() => {
                                                                            // Handle create label
                                                                            setOpenActionDropdown(null);
                                                                        }}
                                                                        className="flex w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-dark-text-primary hover:bg-gray-100 dark:hover:bg-dark-secondary items-center"
                                                                    >
                                                                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                                        </svg>
                                                                        Create Label
                                                                    </button>

                                                                    {/* Change Status Action */}
                                                                    <button
                                                                        onClick={() => {
                                                                            // Handle change status
                                                                            setOpenActionDropdown(null);
                                                                        }}
                                                                        className="flex w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-dark-text-primary hover:bg-gray-100 dark:hover:bg-dark-secondary items-center"
                                                                    >
                                                                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                                                        </svg>
                                                                        Change Status
                                                                    </button>

                                                                    {/* View Invoice Action */}
                                                                    <Link href={route('admin.packages.show', row.package_tracking_code)} target="_blank">
                                                                        <button
                                                                            onClick={() => setOpenActionDropdown(null)}
                                                                            className="flex w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-dark-text-primary hover:bg-gray-100 dark:hover:bg-dark-secondary items-center"
                                                                        >
                                                                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                            </svg>
                                                                            View Invoice
                                                                        </button>
                                                                    </Link>

                                                                    {/* Add Charges Action */}
                                                                    <button
                                                                        onClick={() => {
                                                                            // Handle add charges
                                                                            setOpenActionDropdown(null);
                                                                        }}
                                                                        className="flex w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-dark-text-primary hover:bg-gray-100 dark:hover:bg-dark-secondary items-center"
                                                                    >
                                                                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                                                        </svg>
                                                                        Add Charges
                                                                    </button>

                                                                    {/* Package Notes Action */}
                                                                    <div className="border-t border-gray-100">
                                                                        <button
                                                                            onClick={() => {
                                                                                // Handle package notes
                                                                                setOpenActionDropdown(null);
                                                                            }}
                                                                            className="flex w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-dark-text-primary hover:bg-gray-100 dark:hover:bg-dark-secondary items-center"
                                                                        >
                                                                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                            </svg>
                                                                            Package Notes
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>

                    <TablePagination
                        className="table-pagination dark:table-pagination"
                        rowsPerPageOptions={[5, 10, 25, 50, 100]}
                        component="div"
                        count={totalEntries}
                        rowsPerPage={entriesPerPage}
                        page={currentPage - 1}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        labelDisplayedRows={({ from, to, count }) =>
                            `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
                        }
                    />

                    {/* Color Code Dropdown Menu */}
                    <Menu
                        anchorEl={colorCodeAnchor}
                        open={Boolean(colorCodeAnchor)}
                        onClose={handleColorCodeClose}
                        PaperProps={{
                            sx: {
                                mt: 1,
                                minWidth: 200,
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            }
                        }}
                    >
                        {colorCodeData.map((item, index) => (
                            <MenuItem key={index} onClick={handleColorCodeClose}>
                                <ListItemText
                                    primary={item.status}
                                    sx={{
                                        color: item.color,
                                        fontWeight: 500
                                    }}
                                />
                            </MenuItem>
                        ))}
                    </Menu>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
