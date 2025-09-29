import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CustomTextField from '@/Components/CustomTextField';
import CustomSelectField from '@/Components/CustomSelectField';
import BlackButton from '@/Components/BlackButton';
import {
    Button,
    Box,
    Grid,
    Paper,
    InputAdornment,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    TablePagination,
} from '@mui/material';
import {
    Search as SearchIcon,
    Clear as ClearIcon
} from '@mui/icons-material';
import { useTheme } from '@/Contexts/ThemeContext';

export default function EmployeeIndex({ employees }) {
    const { isDark } = useTheme();
    const [statusFilter, setStatusFilter] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredEmployees, setFilteredEmployees] = useState(employees.data || []);
    const [showExportModal, setShowExportModal] = useState(false);
    const [openPasswordDropdown, setOpenPasswordDropdown] = useState(null);
    const [openActionDropdown, setOpenActionDropdown] = useState(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const dropdownRef = useRef(null);
    const actionDropdownRef = useRef(null);
    const [selectedColumns, setSelectedColumns] = useState({
        user_address: true,
        user_fullname: true,
        user_account_no: true,
        user_email: true,
        user_signup_date: true,
        user_mobile: true,
        user_role: true,
    });

    const handleDelete = (userId) => {
        if (confirm('Are you sure you want to delete this employee?')) {
            router.delete(route('admin.employees.destroy', userId), {
                preserveScroll: true,
            });
        }
    };

    const handleStatusToggle = (userId, currentStatus, employeeName) => {
        const newStatus = currentStatus === 'activate' ? 'deactivate' : 'activate';
        const action = newStatus === 'activate' ? 'activate' : 'deactivate';

        setSelectedEmployee({
            id: userId,
            name: employeeName,
            currentStatus,
            newStatus,
            action
        });
        setShowStatusModal(true);
    };

    const confirmStatusToggle = () => {
        if (selectedEmployee) {
            router.patch(route('admin.employees.toggle-status', selectedEmployee.id), {
                status: selectedEmployee.newStatus
            }, {
                preserveScroll: true,
            });
        }
        setShowStatusModal(false);
        setSelectedEmployee(null);
    };

    const handlePasswordReset = (userId, type) => {
        if (type === 'login') {
            router.get(route('admin.employees.reset-login-password', userId));
        } else {
            router.get(route('admin.employees.reset-master-password', userId));
        }
        setOpenPasswordDropdown(null);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenPasswordDropdown(null);
            }
            if (actionDropdownRef.current && !actionDropdownRef.current.contains(event.target)) {
                setOpenActionDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Client-side filtering function
    const applyFilters = () => {
        let filtered = employees.data || [];

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(employee =>
                (employee.user_first_last_name && employee.user_first_last_name.toLowerCase().includes(query)) ||
                (employee.user_second_last_name && employee.user_second_last_name.toLowerCase().includes(query)) ||
                (employee.user_email && employee.user_email.toLowerCase().includes(query)) ||
                (employee.user_account_number && employee.user_account_number.toLowerCase().includes(query))
            );
        }

        // Apply status filter
        if (statusFilter) {
            filtered = filtered.filter(employee => {
                if (statusFilter === 'active') {
                    return employee.user_account_status === 'activate' && !employee.is_deleted;
                } else if (statusFilter === 'activate') {
                    return employee.user_account_status === 'activate';
                } else if (statusFilter === 'deactivate') {
                    return employee.user_account_status === 'deactivate';
                }
                return true;
            });
        }

        // Apply role filter
        if (roleFilter) {
            filtered = filtered.filter(employee => employee.user_type === roleFilter);
        }

        setFilteredEmployees(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    };

    // Debounced filter application
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            applyFilters();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [statusFilter, roleFilter, searchQuery, employees.data]);

    // Pagination logic
    const totalPages = Math.ceil(filteredEmployees.length / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;
    const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

    const handlePaginationClick = (page) => {
        setCurrentPage(page);
    };

    const handleColumnToggle = (column) => {
        setSelectedColumns(prev => ({
            ...prev,
            [column]: !prev[column]
        }));
    };

    const handleSelectAll = () => {
        const allSelected = Object.values(selectedColumns).every(Boolean);
        const newState = {};
        Object.keys(selectedColumns).forEach(key => {
            newState[key] = !allSelected;
        });
        setSelectedColumns(newState);
    };

    const handleExport = () => {
        const selectedCols = Object.keys(selectedColumns).filter(key => selectedColumns[key]);
        if (selectedCols.length === 0) {
            alert('Please select at least one column to export.');
            return;
        }

        // Create a form to submit the export request with current filters
        const form = document.createElement('form');
        form.method = 'GET';
        form.action = route('admin.employees.index');
        form.target = '_blank';

        // Add export parameter
        const exportInput = document.createElement('input');
        exportInput.type = 'hidden';
        exportInput.name = 'export';
        exportInput.value = 'csv';
        form.appendChild(exportInput);

        // Add columns parameter
        const columnsInput = document.createElement('input');
        columnsInput.type = 'hidden';
        columnsInput.name = 'columns';
        columnsInput.value = selectedCols.join(',');
        form.appendChild(columnsInput);

        // Add current filter values
        if (statusFilter) {
            const statusInput = document.createElement('input');
            statusInput.type = 'hidden';
            statusInput.name = 'status';
            statusInput.value = statusFilter;
            form.appendChild(statusInput);
        }

        if (roleFilter) {
            const roleInput = document.createElement('input');
            roleInput.type = 'hidden';
            roleInput.name = 'role';
            roleInput.value = roleFilter;
            form.appendChild(roleInput);
        }

        if (searchQuery) {
            const searchInput = document.createElement('input');
            searchInput.type = 'hidden';
            searchInput.name = 'search';
            searchInput.value = searchQuery;
            form.appendChild(searchInput);
        }

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);

        setShowExportModal(false);
    };
    return (
        <>
            <AuthenticatedLayout>
                <Head title="Employee Management" />

                <div className="py-2">
                <div className="">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl leading-9 font-bold text-quaternary dark:text-dark-text-primary">
                            Employee Management
                        </h2>
                        <div>
                            <div className="flex gap-2 sm:gap-3">
                                <BlackButton
                                    onClick={() => setShowExportModal(true)}
                                >
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span className="hidden sm:inline">Export CSV</span>
                                    <span className="sm:hidden">Export</span>
                                </BlackButton>
                                <Link
                                    href={route('admin.employees.create')}
                                >
                                    <BlackButton onClick={() => router.get(route('admin.employees.create'))}>
                                    <svg className="w-4 h-4 sm:w-4 sm:h-4" fill="#fff" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span className="hidden sm:inline ml-2">Add Employee</span>
                                    <span className="sm:hidden">Add Employee</span>
                                    </BlackButton>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-dark-quaternary overflow-hidden shadow-card sm:rounded-lg">
                        <div className="w-full">
                            {/* Filter Controls */}
                            <div className="p-6">
                                {/* Search Bar */}
                                <Box sx={{ mb: 3 }}>
                                    <CustomTextField
                                        fullWidth
                                        placeholder="Search by name, email, account number..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon color="action" className="text-quaternary dark:text-dark-text-primary" />
                                                </InputAdornment>
                                            ),
                                            endAdornment: searchQuery && (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setSearchQuery('')}
                                                        edge="end"
                                                        size="small"
                                                    >
                                                        <ClearIcon className="text-quaternary dark:text-dark-text-primary" />
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        variant="outlined"
                                    />
                                </Box>

                                <Box sx={{
                                    display: 'flex',
                                    gap: 2,
                                    flexWrap: 'wrap',
                                    alignItems: 'center'
                                }}>
                                    {/* Status Filter */}
                                    <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                                        <CustomSelectField
                                            label="Status"
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            borderColor="gray"
                                            options={[
                                                { value: '', label: 'All Status' },
                                                { value: 'active', label: 'Active' },
                                                { value: 'activate', label: 'Activate' },
                                                { value: 'deactivate', label: 'Deactivate' }
                                            ]}
                                        />
                                    </Box>

                                    {/* Role Filter */}
                                    <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                                        <CustomSelectField
                                            label="User Role"
                                            value={roleFilter}
                                            onChange={(e) => setRoleFilter(e.target.value)}
                                            borderColor="gray"
                                            options={[
                                                { value: '', label: 'All Roles' },
                                                { value: 'Airdrop_Shipper', label: 'Airdrop Shipper' },
                                                { value: 'Airdrop_Cashier', label: 'Airdrop Cashier' },
                                                { value: 'Airdrop_Manager', label: 'Airdrop Manager' },
                                                { value: 'Airdrop_Supervisor', label: 'Airdrop Supervisor' },
                                                { value: 'Airdrop_Admin', label: 'Airdrop Admin' },
                                                { value: 'Airdrop_Master_Admin', label: 'Airdrop Master Admin' },
                                                { value: 'Airdrop_Operations_Supervisor', label: 'Airdrop Operations Supervisor' }
                                            ]}
                                        />
                                    </Box>

                                    {/* Entries Per Page */}
                                    {/* <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Entries per page</InputLabel>
                                            <Select
                                                value={entriesPerPage}
                                                onChange={(e) => setEntriesPerPage(parseInt(e.target.value))}
                                                label="Entries per page"
                                            >
                                                <MenuItem value={5}>5</MenuItem>
                                                <MenuItem value={10}>10</MenuItem>
                                                <MenuItem value={25}>25</MenuItem>
                                                <MenuItem value={50}>50</MenuItem>
                                                <MenuItem value={100}>100</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Box> */}

                                    {/* Clear Filters Button */}
                                    <Box sx={{ flex: '0 0 auto', minWidth: '120px' }}>
                                        <BlackButton
                                            onClick={() => {
                                                setStatusFilter('');
                                                setRoleFilter('');
                                                setSearchQuery('');
                                                setCurrentPage(1);
                                            }}
                                        >
                                            Clear All
                                        </BlackButton>
                                    </Box>
                                </Box>
                            </div>

                            {(!filteredEmployees || filteredEmployees.length === 0) ? (
                                <div className="text-center py-12">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No employees</h3>
                                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new employee.</p>
                                    <div className="mt-6">
                                        <Link
                                            href={route('admin.employees.create')}
                                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Add New Employee
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full flex justify-center shadow-card sm:rounded-lg">
                                    <div className="w-full">
                                        <TableContainer component={Paper} className="table-container">
                                            <Table stickyHeader sx={{ minWidth: 1000 }}>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell className="table-header-cell dark:table-header-cell" sx={{ minWidth: 200 }}>
                                                            Name
                                                        </TableCell>
                                                        <TableCell className="table-header-cell dark:table-header-cell" sx={{ minWidth: 200 }}>
                                                            Email
                                                        </TableCell>
                                                        <TableCell className="table-header-cell dark:table-header-cell" sx={{ minWidth: 150 }}>
                                                            Account No.
                                                        </TableCell>
                                                        <TableCell className="table-header-cell dark:table-header-cell" sx={{ minWidth: 150 }}>
                                                            User Role
                                                        </TableCell>
                                                        <TableCell className="table-header-cell dark:table-header-cell" sx={{ minWidth: 150 }}>
                                                            User Branch
                                                        </TableCell>
                                                        <TableCell className="table-header-cell dark:table-header-cell" sx={{ minWidth: 120 }}>
                                                            Status
                                                        </TableCell>
                                                        <TableCell className="table-header-cell dark:table-header-cell" sx={{ minWidth: 180 }}>
                                                            Datetime
                                                        </TableCell>
                                                        <TableCell className="table-header-cell dark:table-header-cell" sx={{ minWidth: 120 }}>
                                                            Actions
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {paginatedEmployees.map((employee, index) => (
                                                        <TableRow
                                                            hover
                                                            key={employee.user_id || index}
                                                            className="table-row-hover dark:table-row-hover"
                                                        >
                                                            {/* Name Column */}
                                                            <TableCell className="table-body-cell dark:table-body-cell">
                                                                <div className="flex items-center">
                                                                    <div className="flex-shrink-0 h-8 w-8">
                                                                        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                                                                            <span>
                                                                                {(employee.user_first_last_name || 'U').charAt(0).toUpperCase()}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="ml-2">
                                                                        <div className="truncate">
                                                                            {employee.user_first_last_name}
                                                                            {employee.user_second_last_name && ` ${employee.user_second_last_name}`}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </TableCell>

                                                            {/* Email Column */}
                                                            <TableCell className="table-body-cell">
                                                                <div className="truncate">{(employee.user_email && employee.user_email.toLowerCase()) || 'n/a'}</div>
                                                            </TableCell>

                                                            {/* Account No. Column */}
                                                            <TableCell className="table-body-cell">
                                                                <div>
                                                                    {employee.user_account_number || '-'}
                                                                </div>
                                                            </TableCell>

                                                            {/* User Role Column */}
                                                            <TableCell className="table-body-cell">
                                                                <span className="capitalize">
                                                                    {(employee.user_type && employee.user_type.replace(/_/g, ' ')) || '-'}
                                                                </span>
                                                            </TableCell>

                                                            {/* User Branch Column */}
                                                            <TableCell className="table-body-cell">
                                                                <div>{employee.user_branch || '-'}</div>
                                                            </TableCell>

                                                            {/* Status Column */}
                                                            <TableCell className="table-body-cell">
                                                                <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                                                                    employee.is_deleted
                                                                        ? 'bg-red-100 text-red-800'
                                                                        : employee.user_account_status === 'activate'
                                                                            ? 'bg-green-100 text-green-800'
                                                                            : 'bg-yellow-100 text-yellow-800'
                                                                }`}>
                                                                    {(employee.is_deleted ? 'Deleted' : (employee.user_account_status || 'Deactivate')).charAt(0).toUpperCase() + (employee.is_deleted ? 'Deleted' : (employee.user_account_status || 'Deactivate')).slice(1).toLowerCase()}
                                                                </span>
                                                            </TableCell>

                                                            {/* Datetime Column */}
                                                            <TableCell className="table-body-cell">
                                                                <div>
                                                                    {employee.user_signup_date ? (() => {
                                                                        const date = new Date(employee.user_signup_date);
                                                                        return isNaN(date.getTime())
                                                                            ? '-'
                                                                            : date.toLocaleDateString('en-US', {
                                                                                year: 'numeric',
                                                                                month: 'short',
                                                                                day: 'numeric',
                                                                                hour: '2-digit',
                                                                                minute: '2-digit'
                                                                            });
                                                                    })() : '-'}
                                                                </div>
                                                            </TableCell>

                                                            {/* Actions Column */}
                                                            <TableCell className="table-body-cell">
                                                                <div className="relative" ref={openActionDropdown === employee.user_id ? actionDropdownRef : null}>
                                                                    {/* 3-dotted menu button */}
                                                                    <button
                                                                        onClick={() => setOpenActionDropdown(
                                                                            openActionDropdown === employee.user_id ? null : employee.user_id
                                                                        )}
                                                                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                                                                        aria-label="Actions menu"
                                                                    >
                                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                                        </svg>
                                                                    </button>

                                                                    {/* Dropdown Menu */}
                                                                    {openActionDropdown === employee.user_id && (
                                                                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-quaternary border border-gray-200 dark:border-dark-quaternary rounded-md shadow-lg z-10 right-sidebar">
                                                                            <div className="py-1">
                                                                                {/* Update Action */}
                                                                                <Link
                                                                                    href={route('admin.employees.edit', employee.user_id)}
                                                                                    className="flex px-4 py-2 text-sm text-gray-700 dark:text-dark-text-primary hover:bg-gray-100 dark:hover:bg-dark-secondary items-center"
                                                                                    onClick={() => setOpenActionDropdown(null)}
                                                                                >
                                                                                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                                    </svg>
                                                                                    Update
                                                                                </Link>

                                                                                {/* Activate/Deactivate Action */}
                                                                                <button
                                                                                    onClick={() => {
                                                                                        const fullName = `${employee.user_first_last_name || ''} ${employee.user_second_last_name || ''}`.trim();
                                                                                        handleStatusToggle(employee.user_id, employee.user_account_status, fullName);
                                                                                        setOpenActionDropdown(null);
                                                                                    }}
                                                                                    className={`flex w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-dark-quaternary items-center ${
                                                                                        employee.user_account_status === 'activate'
                                                                                            ? 'text-red-700'
                                                                                            : 'text-green-700'
                                                                                    }`}
                                                                                >
                                                                                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                                                                                    </svg>
                                                                                    {employee.user_account_status === 'activate' ? 'Deactivate' : 'Activate'}
                                                                                </button>

                                                                                {/* Password Reset Actions */}
                                                                                <div className="border-t border-gray-100">
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            handlePasswordReset(employee.user_id, 'login');
                                                                                            setOpenActionDropdown(null);
                                                                                        }}
                                                                                        className="flex w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-dark-text-primary hover:bg-gray-100 dark:hover:bg-dark-secondary items-center"
                                                                                    >
                                                                                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                                                                        </svg>
                                                                                        Reset Login Password
                                                                                    </button>
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            handlePasswordReset(employee.user_id, 'master');
                                                                                            setOpenActionDropdown(null);
                                                                                        }}
                                                                                        className="flex w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-dark-text-primary hover:bg-gray-100 dark:hover:bg-dark-secondary items-center"
                                                                                    >
                                                                                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                                                        </svg>
                                                                                        Set Master Password
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>

                                        <TablePagination
                                            className="table-pagination dark:table-pagination"
                                            rowsPerPageOptions={[5, 10, 25, 50, 100]}
                                            component="div"
                                            count={filteredEmployees.length}
                                            rowsPerPage={entriesPerPage}
                                            page={currentPage - 1}
                                            onPageChange={(event, newPage) => handlePaginationClick(newPage + 1)}
                                            onRowsPerPageChange={(event) => setEntriesPerPage(parseInt(event.target.value, 10))}
                                        />

                                        {/* No Results Message */}
                                        {paginatedEmployees.length === 0 && (
                                            <div className="text-center py-8">
                                                <div className="text-gray-500">
                                                    {searchQuery ? 'No employees found matching your search.' : 'No employees available.'}
                                                </div>
                                                {searchQuery && (
                                                    <Button
                                                        onClick={() => setSearchQuery('')}
                                                        startIcon={<ClearIcon />}
                                                        variant="text"
                                                        size="small"
                                                        color="primary"
                                                        sx={{ mt: 1 }}
                                                    >
                                                        Clear search to see all employees
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            </AuthenticatedLayout>

            {/* Export Modal */}
            {showExportModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-[9999]">
                    <div className="relative top-20 mx-auto p-5 w-96 shadow-lg rounded-md bg-white dark:bg-dark-quaternary">
                        <div className="mt-3">
                            {/* Modal Header */}
                            <div className="flex items-center justify-center mb-4">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text-primary">
                                    Select Column's Show Excel file
                                </h3>
                            </div>

                            {/* Column Selection */}
                            <div className="mt-4 space-y-3">
                                {/* Select All */}
                                <div className="flex items-center">
                                    <input
                                        id="select-all"
                                        type="checkbox"
                                        checked={Object.values(selectedColumns).every(Boolean)}
                                        onChange={handleSelectAll}
                                        className="h-4 w-4 text-blue-600 !ring-offset-0 focus:ring-blue-500 dark:focus:ring-dark-quaternary border-gray-300 dark:border-dark-quaternary rounded"
                                    />
                                    <label htmlFor="select-all" className="ml-2 text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                                        Select All
                                    </label>
                                </div>

                                {/* Individual Columns */}
                                <div className="grid grid-cols-2 gap-3 mt-4">
                                    <div className="flex items-center">
                                        <input
                                            id="user-address"
                                            type="checkbox"
                                            checked={selectedColumns.user_address}
                                            onChange={() => handleColumnToggle('user_address')}
                                            className="h-4 w-4 text-blue-600 !ring-offset-0 focus:ring-blue-500 dark:focus:ring-dark-quaternary border-gray-300 dark:border-dark-quaternary rounded"
                                        />
                                        <label htmlFor="user-address" className="ml-2 text-sm text-gray-700 dark:text-dark-text-primary">
                                            User Address
                                        </label>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            id="user-fullname"
                                            type="checkbox"
                                            checked={selectedColumns.user_fullname}
                                            onChange={() => handleColumnToggle('user_fullname')}
                                            className="h-4 w-4 text-blue-600 !ring-offset-0 focus:ring-blue-500 dark:focus:ring-dark-quaternary border-gray-300 dark:border-dark-quaternary rounded"
                                        />
                                        <label htmlFor="user-fullname" className="ml-2 text-sm text-gray-700 dark:text-dark-text-primary">
                                            User Fullname
                                        </label>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            id="user-account-no"
                                            type="checkbox"
                                            checked={selectedColumns.user_account_no}
                                            onChange={() => handleColumnToggle('user_account_no')}
                                            className="h-4 w-4 text-blue-600 !ring-offset-0 focus:ring-blue-500 dark:focus:ring-dark-quaternary border-gray-300 dark:border-dark-quaternary rounded"
                                        />
                                        <label htmlFor="user-account-no" className="ml-2 text-sm text-gray-700 dark:text-dark-text-primary">
                                            User Account No.
                                        </label>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            id="user-email"
                                            type="checkbox"
                                            checked={selectedColumns.user_email}
                                            onChange={() => handleColumnToggle('user_email')}
                                            className="h-4 w-4 text-blue-600 !ring-offset-0 focus:ring-blue-500 dark:focus:ring-dark-quaternary border-gray-300 dark:border-dark-quaternary rounded"
                                        />
                                        <label htmlFor="user-email" className="ml-2 text-sm text-gray-700 dark:text-dark-text-primary">
                                            User Email
                                        </label>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            id="user-signup-date"
                                            type="checkbox"
                                            checked={selectedColumns.user_signup_date}
                                            onChange={() => handleColumnToggle('user_signup_date')}
                                            className="h-4 w-4 text-blue-600 !ring-offset-0 focus:ring-blue-500 dark:focus:ring-dark-quaternary border-gray-300 dark:border-dark-quaternary  rounded"
                                        />
                                        <label htmlFor="user-signup-date" className="ml-2 text-sm text-gray-700 dark:text-dark-text-primary">
                                            User Signup Date
                                        </label>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            id="user-mobile"
                                            type="checkbox"
                                            checked={selectedColumns.user_mobile}
                                            onChange={() => handleColumnToggle('user_mobile')}
                                            className="h-4 w-4 text-blue-600 !ring-offset-0 focus:ring-blue-500 dark:focus:ring-dark-quaternary border-gray-300 dark:border-dark-quaternary rounded"
                                        />
                                        <label htmlFor="user-mobile" className="ml-2 text-sm text-gray-700 dark:text-dark-text-primary">
                                            User Mobile
                                        </label>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            id="user-role"
                                            type="checkbox"
                                            checked={selectedColumns.user_role}
                                            onChange={() => handleColumnToggle('user_role')}
                                            className="h-4 w-4 text-blue-600 !ring-offset-0 focus:ring-blue-500 dark:focus:ring-dark-quaternary border-gray-300 dark:border-dark-quaternary rounded"
                                        />
                                        <label htmlFor="user-role" className="ml-2 text-sm text-gray-700 dark:text-dark-text-primary">
                                            User Role
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Actions */}
                            <div className="items-center px-4 py-3 mt-6">
                                <div className="flex justify-end gap-3">
                                    <BlackButton
                                        onClick={() => setShowExportModal(false)}
                                    >
                                        Cancel
                                    </BlackButton>
                                    <BlackButton
                                        onClick={handleExport}
                                    >
                                        Export CSV
                                    </BlackButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Status Toggle Confirmation Modal */}
            {showStatusModal && selectedEmployee && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-[9999]">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-dark-quaternary dark:border-dark-quaternary">
                        <div className="mt-3 text-center">
                            {/* Modal Icon */}
                            <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${
                                selectedEmployee.action === 'activate'
                                    ? 'bg-green-100'
                                    : 'bg-red-100'
                            }`}>
                                <svg className={`h-6 w-6 ${
                                    selectedEmployee.action === 'activate'
                                        ? 'text-green-600'
                                        : 'text-red-600'
                                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {selectedEmployee.action === 'activate' ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    )}
                                </svg>
                            </div>

                            {/* Modal Title */}
                            <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary mt-4">
                                {selectedEmployee.action === 'activate' ? 'Activate Employee' : 'Deactivate Employee'}
                            </h3>

                            {/* Modal Message */}
                            <div className="mt-2 px-7 py-3">
                                <p className="text-sm text-gray-500 dark:text-dark-text-primary">
                                    Are you sure you want to <span className={`font-semibold ${
                                        selectedEmployee.action === 'activate'
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                    }`}>{selectedEmployee.action}</span> the employee{' '}
                                    <span className="font-semibold text-gray-900 dark:text-dark-text-primary">"{selectedEmployee.name}"</span>?
                                </p>
                                {selectedEmployee.action === 'deactivate' && (
                                    <p className="text-xs text-red-500 mt-2">
                                        This will prevent the employee from accessing the system.
                                    </p>
                                )}
                            </div>

                            {/* Modal Actions */}
                            <div className="items-center px-4 py-3">
                                <div className="flex justify-end gap-3">
                                    <BlackButton
                                        onClick={() => {
                                            setShowStatusModal(false);
                                            setSelectedEmployee(null);
                                        }}
                                    >
                                        Cancel
                                    </BlackButton>
                                    <BlackButton
                                        onClick={confirmStatusToggle}
                                        className={`${
                                            selectedEmployee.action === 'activate'
                                                ? 'bg-green-600 hover:bg-green-700 focus:ring-green-300'
                                                : 'bg-red-600 hover:bg-red-700 focus:ring-red-300'
                                        }`}
                                    >
                                        {selectedEmployee.action === 'activate' ? 'Activate' : 'Deactivate'}
                                    </BlackButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
