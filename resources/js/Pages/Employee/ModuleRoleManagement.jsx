import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Box,
    Typography,
    Pagination,
    Stack,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Paper,
    TablePagination
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import CustomTextField from '@/Components/CustomTextField';
import BlackButton from '@/Components/BlackButton';
import CustomCheckbox from '@/Components/CustomCheckbox';
import { useTheme } from '@/Contexts/ThemeContext';

export default function ModuleRoleManagement({ auth, modules, auctionEmails, roleTypes, masterPasswordRequired = false }) {
    const [masterPasswordVerified, setMasterPasswordVerified] = useState(!masterPasswordRequired); // Show table if no password required
    const { isDark } = useTheme();

    const colors = {
        darkTextPrimary: '#ffffff !important',
        darkTextSecondary: '#637381',
    };

    const [auctionEmailList, setAuctionEmailList] = useState(() => {
        if (auctionEmails && auctionEmails.trim() !== '') {
            // Process the emails similar to how loadAuctionEmails does it
            let emailsData = auctionEmails;
            try {
                const parsedEmails = JSON.parse(emailsData);
                if (parsedEmails.emails) {
                    emailsData = parsedEmails.emails;
                }
            } catch (e) {
                // If JSON parse fails, use as is
            }

            const emailList = emailsData.split(',').map(email => email.trim()).filter(Boolean);
            const processedEmails = emailList.join(', ');
            return processedEmails;
        }
        return '';
    });
    const [emailMessage, setEmailMessage] = useState('');
    const [emailValidationErrors, setEmailValidationErrors] = useState('');
    const [localModules, setLocalModules] = useState(modules || []); // Local state for modules
    const [updatingCheckbox, setUpdatingCheckbox] = useState(null); // Track which checkbox is updating

    // Pagination and filtering state
    const [currentPage, setCurrentPage] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredModules, setFilteredModules] = useState(modules || []);

    // Sorting state
    const [orderBy, setOrderBy] = useState('module_name');
    const [order, setOrder] = useState('asc');

    const { data, setData, post, processing, errors } = useForm({
        user_master_password: '',
    });

    // Sorting function
    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };


    // Sort and filter modules
    const getSortedAndFilteredModules = () => {
        let filtered = localModules;

        if (searchTerm.trim()) {
            filtered = localModules.filter(module =>
                module.module_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort the filtered modules
        const sorted = [...filtered].sort((a, b) => {
            if (orderBy === 'module_name') {
                const aValue = a.module_name.toLowerCase();
                const bValue = b.module_name.toLowerCase();
                if (order === 'asc') {
                    return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
                } else {
                    return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
                }
            }
            return 0;
        });

        return sorted;
    };

    // Filter modules based on search term and sorting
    useEffect(() => {
        const sortedAndFiltered = getSortedAndFilteredModules();
        setFilteredModules(sortedAndFiltered);
        setCurrentPage(0); // Reset to first page when filtering (MUI uses 0-based indexing)
    }, [localModules, searchTerm, orderBy, order]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredModules.length / perPage);
    const startIndex = currentPage * perPage;
    const endIndex = startIndex + perPage;
    const currentModules = filteredModules.slice(startIndex, endIndex);

    // Pagination handlers
    const goToPage = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const handlePerPageChange = (event) => {
        const newPerPage = parseInt(event.target.value, 10);
        setPerPage(newPerPage);
        setCurrentPage(0); // Reset to first page
    };

    // Search handler
    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    // Handle master password verification
    const handleMasterPasswordSubmit = (e) => {
        e.preventDefault();
        post(route('admin.employees.verify-master-password'), {
            onSuccess: () => {
                setMasterPasswordVerified(true);
            }
        });
    };

    // Handle module role toggle with local state update (no page refresh)
    const handleRoleToggle = async (moduleId, userRole, currentValue) => {
        const newValue = currentValue === '1' ? '0' : '1';
        const checkboxKey = `${moduleId}-${userRole}`;

        // console.log('Checkbox changed:', { moduleId, userRole, currentValue, newValue });

        // Set updating state for this specific checkbox
        setUpdatingCheckbox(checkboxKey);

        try {
            // Get CSRF token
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            console.log('CSRF Token found:', !!csrfToken);

            if (!csrfToken) {
                alert('CSRF token not found. Please refresh the page.');
                setUpdatingCheckbox(null);
                return;
            }

            // Make the request using basic fetch
            console.log('Making request to: /admin/employees/update-module-role');

            const formData = new FormData();
            formData.append('module_id', moduleId);
            formData.append('user_role', userRole);
            formData.append('button_value', newValue);
            formData.append('_token', csrfToken);

            const response = await fetch('/admin/employees/update-module-role', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                }
            });

            console.log('Response status:', response.status);

            if (response.ok) {
                console.log('Success! Updating local state...');

                // Update local state instead of reloading page
                setLocalModules(prevModules =>
                    prevModules.map(module => {
                        if (module.module_id === parseInt(moduleId)) {
                            return {
                                ...module,
                                [userRole]: newValue
                            };
                        }
                        return module;
                    })
                );

                console.log('Local state updated successfully');
            } else {
                console.error('Request failed with status:', response.status);
                const responseText = await response.text();
                console.error('Response text:', responseText);
                alert('Error updating role. Please check the console for details.');
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('Network error: ' + error.message);
        } finally {
            // Always clear the updating state
            setUpdatingCheckbox(null);
        }
    };


    // Load auction emails on component mount only if not provided via props
    useEffect(() => {
        if (!auctionEmails || auctionEmails.trim() === '') {
            loadAuctionEmails();
        }
    }, []);

    const loadAuctionEmails = async () => {
        try {
            const response = await fetch(route('admin.employees.get-auction-emails'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
            });

            const result = await response.json();
            if (result.success && result.emails) {
                let emailsData = result.emails;
                try {
                    const parsedEmails = JSON.parse(emailsData);
                    if (parsedEmails.emails) {
                        emailsData = parsedEmails.emails;
                    }
                } catch (e) {
                    // If JSON parse fails, use as is
                }

                const emailList = emailsData.split(',').map(email => email.trim()).filter(Boolean);
                const processedEmails = emailList.join(', ');
                setAuctionEmailList(processedEmails);
            }
        } catch (error) {
            console.error('Error loading emails:', error);
            showMessage('Error loading emails', 'error');
        }
    };


    // Validate email
    const validateEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    // Save auction emails
    const saveAuctionEmails = async () => {
        setEmailValidationErrors('');

        if (!auctionEmailList.trim()) {
            // If input is empty, clear the emails
            await saveEmails([]);
            return;
        }

        const invalidEmails = [];
        const validEmails = auctionEmailList.split(',').map(email => {
            email = email.trim();
            if (email && !validateEmail(email)) {
                invalidEmails.push(email);
            }
            return email;
        }).filter(email => email && validateEmail(email));

        if (invalidEmails.length > 0) {
            setEmailValidationErrors('Invalid email(s): ' + invalidEmails.join(', '));
            return;
        }

        if (validEmails.length === 0) {
            showMessage('Please enter valid email addresses', 'error');
            return;
        }

        await saveEmails(validEmails);
    };

    const saveEmails = async (emails) => {
        try {
            const response = await fetch(route('admin.employees.save-auction-emails'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                body: JSON.stringify({ emails }),
            });

            const result = await response.json();
            if (result.success) {
                setAuctionEmailList(emails.join(', '));
                showMessage('Emails saved successfully', 'success');
            } else {
                showMessage('Error saving emails. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error saving emails:', error);
            showMessage('Error saving emails', 'error');
        }
    };

    const showMessage = (message, type) => {
        setEmailMessage({ text: message, type });
        setTimeout(() => {
            setEmailMessage('');
        }, 5000);
    };

    // If master password not verified, show login form
    if (!masterPasswordVerified) {
        return (
            <AuthenticatedLayout
                user={auth.user}
                // header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Role Management</h2>}
            >
                <Head title="Role Management" />

                <div className="py-12">
                    <div className="max-w-md mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h2 className="text-xl font-semibold mb-6">Login With Master Password</h2>

                                {errors.user_master_password && (
                                    <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                        {errors.user_master_password}
                                    </div>
                                )}

                                <form onSubmit={handleMasterPasswordSubmit}>
                                    <div className="mb-4">
                                        <label htmlFor="user_master_password" className="block text-sm font-medium text-gray-700 mb-2">
                                            Master Password
                                        </label>
                                        <input
                                            type="password"
                                            id="user_master_password"
                                            value={data.user_master_password}
                                            onChange={(e) => setData('user_master_password', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md disabled:opacity-50"
                                    >
                                        {processing ? 'Logging in...' : 'Login'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            // header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Role Management</h2>}
        >
            <Head title="Role Management" />

            <div className="py-2">
                <div>
                    <h2 className="text-2xl leading-9 font-bold text-primary dark:text-dark-text-primary mb-2">Role Management of Employees</h2>
                    <div className="text-sm leading-[22px] text-primary dark:text-dark-text-primary mb-4">
                        When the box is "Disabled", this means the feature is disabled for the user and when the box is "Enabled",
                        this means the feature is enabled for the user.
                    </div>
                    {/* Main Role Management Table */}
                    <div className="bg-white dark:bg-dark-quaternary overflow-hidden shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)] sm:rounded-lg mb-6">
                        <div className="">
                            <div className="p-6">
                                {/* Search and Filter Controls */}
                                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, }}>
                                    {/* Search Input */}
                                    <CustomTextField
                                        fullWidth
                                        // label="Search Modules"
                                        placeholder="Search by module name..."
                                        value={searchTerm}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        InputProps={{
                                            startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1, color: isDark ? colors.darkTextPrimary : '#919191' }} />
                                        }}
                                    />
                                </Box>

                                {/* Results Info */}
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 1 }}>
                                    {searchTerm && (
                                        <BlackButton
                                            onClick={() => handleSearch('')}
                                        >
                                            <ClearIcon sx={{ mr: 1, fontSize: '16px' }} />
                                            Clear search
                                        </BlackButton>
                                    )}
                                </Box>
                            </div>

                            <TableContainer component={Paper} className="table-container">
                                <Table stickyHeader sx={{ minWidth: 1000, zIndex: 1 }}>
                                    <TableHead>
                                        <TableRow>
                                            {/* Module Name Column with Sorting */}
                                            <TableCell
                                                className="table-header-cell"
                                                sx={{
                                                    left: 0,
                                                    minWidth: 200,
                                                }}
                                            >
                                                <TableSortLabel
                                                    active={orderBy === 'module_name'}
                                                    direction={orderBy === 'module_name' ? order : 'asc'}
                                                    onClick={() => handleRequestSort('module_name')}
                                                    className="table-sort-label"
                                                    sx={{
                                                        '& .MuiTableSortLabel-icon': {
                                                          color: isDark ? colors.darkTextPrimary : '#919191',
                                                        },
                                                    }}
                                                >
                                                    Module Name
                                                </TableSortLabel>
                                            </TableCell>

                                            {/* Role Columns */}
                                            <TableCell className="table-header-cell" sx={{ minWidth: 150 }}>Shipper</TableCell>
                                            <TableCell className="table-header-cell" sx={{ minWidth: 150 }}>Customer Service</TableCell>
                                            <TableCell className="table-header-cell" sx={{ minWidth: 150 }}>Supervisor</TableCell>
                                            <TableCell className="table-header-cell" sx={{ minWidth: 150 }}>Manager</TableCell>
                                            <TableCell className="table-header-cell" sx={{ minWidth: 180 }}>Operations Supervisor</TableCell>
                                            <TableCell className="table-header-cell" sx={{ minWidth: 150 }}>Admin</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {currentModules.map((module, index) => {
                                            return (
                                                <TableRow
                                                    hover
                                                    key={module.module_id}
                                                    className="table-row-hover"
                                                >
                                                    {/* Module Name */}
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                        className="table-body-cell "
                                                        sx={{
                                                            left: 0,
                                                        }}
                                                    >
                                                        {module.module_name}
                                                    </TableCell>

                                                    {/* Role Checkboxes */}
                                                    <TableCell className="table-body-cell">
                                                        <CustomCheckbox
                                                            checked={module.Airdrop_Shipper === '1'}
                                                            onChange={(e) => {
                                                                e.stopPropagation();
                                                                handleRoleToggle(module.module_id, 'Airdrop_Shipper', module.Airdrop_Shipper);
                                                            }}
                                                            disabled={updatingCheckbox === `${module.module_id}-Airdrop_Shipper`}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="table-body-cell">
                                                        <CustomCheckbox
                                                            checked={module.Airdrop_Cashier === '1'}
                                                            onChange={(e) => {
                                                                e.stopPropagation();
                                                                handleRoleToggle(module.module_id, 'Airdrop_Cashier', module.Airdrop_Cashier);
                                                            }}
                                                            disabled={updatingCheckbox === `${module.module_id}-Airdrop_Cashier`}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="table-body-cell">
                                                        <CustomCheckbox
                                                            checked={module.Airdrop_Supervisor === '1'}
                                                            onChange={(e) => {
                                                                e.stopPropagation();
                                                                handleRoleToggle(module.module_id, 'Airdrop_Supervisor', module.Airdrop_Supervisor);
                                                            }}
                                                            disabled={updatingCheckbox === `${module.module_id}-Airdrop_Supervisor`}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="table-body-cell">
                                                        <CustomCheckbox
                                                            checked={module.Airdrop_Manager === '1'}
                                                            onChange={(e) => {
                                                                e.stopPropagation();
                                                                handleRoleToggle(module.module_id, 'Airdrop_Manager', module.Airdrop_Manager);
                                                            }}
                                                            disabled={updatingCheckbox === `${module.module_id}-Airdrop_Manager`}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="table-body-cell">
                                                        <CustomCheckbox
                                                            checked={module.Airdrop_Operations_Supervisor === '1'}
                                                            onChange={(e) => {
                                                                e.stopPropagation();
                                                                handleRoleToggle(module.module_id, 'Airdrop_Operations_Supervisor', module.Airdrop_Operations_Supervisor);
                                                            }}
                                                            disabled={updatingCheckbox === `${module.module_id}-Airdrop_Operations_Supervisor`}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="table-body-cell">
                                                        <CustomCheckbox
                                                            checked={module.Airdrop_Admin === '1'}
                                                            onChange={(e) => {
                                                                e.stopPropagation();
                                                                handleRoleToggle(module.module_id, 'Airdrop_Admin', module.Airdrop_Admin);
                                                            }}
                                                            disabled={updatingCheckbox === `${module.module_id}-Airdrop_Admin`}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                className="table-pagination"
                                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                                component="div"
                                count={filteredModules.length}
                                rowsPerPage={perPage}
                                page={currentPage}
                                onPageChange={goToPage}
                                onRowsPerPageChange={handlePerPageChange}
                            />

                                {/* No Results Message */}
                                {currentModules.length === 0 && (
                                    <div className="text-center py-8">
                                        <div className="text-gray-500 dark:text-dark-text-primary mb-4">
                                            {searchTerm ? 'No modules found matching your search.' : 'No modules available.'}
                                        </div>
                                        {searchTerm && (
                                            <BlackButton
                                                onClick={() => handleSearch('')}
                                            >
                                                <ClearIcon sx={{ mr: 1, fontSize: '16px' }} />
                                                Clear search to see all modules
                                            </BlackButton>
                                        )}
                                    </div>
                                )}

                            {/* Pagination Controls */}
                            {/* {totalPages > 1 && (
                                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                                    <div className="flex flex-1 justify-between sm:hidden">

                                        <button
                                            onClick={() => goToPage(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => goToPage(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next
                                        </button>
                                    </div>
                                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-gray-700">
                                                Showing {filteredModules.length === 0 ? 0 : startIndex + 1} to {Math.min(endIndex, filteredModules.length)} of {filteredModules.length} modules
                                                {searchTerm && (
                                                    <span className="ml-2 text-blue-600">
                                                        (filtered from {localModules.length} total)
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">

                                                <button
                                                    onClick={() => goToPage(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <span className="sr-only">Previous</span>
                                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                        <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                                                    </svg>
                                                </button>


                                                {getPageNumbers().map((pageNum) => (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => goToPage(pageNum)}
                                                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 ${
                                                            pageNum === currentPage
                                                                ? 'z-10 bg-blue-600 text-white ring-blue-600 hover:bg-blue-700'
                                                                : 'text-gray-900 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                ))}


                                                <button
                                                    onClick={() => goToPage(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <span className="sr-only">Next</span>
                                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            )} */}
                        </div>
                    </div>

                    {/* Auction Email Notifications */}
                    <div className="mb-4">
                        <h2 className="text-2xl leading-9 font-bold text-primary dark:text-dark-text-primary">Auction Email Notifications</h2>
                    </div>
                    <div className="bg-white dark:bg-dark-quaternary overflow-hidden shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)] sm:rounded-lg">
                        <div className="p-6">
                            <p className="text-sm leading-[22px] text-primary dark:text-dark-text-primary mb-4">Separate multiple emails with commas.</p>
                            <div className="">
                                {emailMessage && (
                                    <div className={`mb-4 p-4 rounded ${
                                        emailMessage.type === 'success'
                                            ? 'bg-green-100 text-green-700 border border-green-200'
                                            : 'bg-red-100 text-red-700 border border-red-200'
                                    }`}>
                                        {emailMessage.text}
                                    </div>
                                )}

                                <div className="mb-4">
                                    <div className="flex flex-col gap-2">
                                        <textarea
                                            value={auctionEmailList}
                                            onChange={(e) => setAuctionEmailList(e.target.value)}
                                            placeholder="e.g. email1@example.com, email2@example.com"
                                            className="w-full border border-gray-300 dark:border-charcoal bg-white dark:bg-dark-quaternary text-primary dark:text-dark-text-primary rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                                            rows={2}
                                            style={{ minHeight: '100px' }}
                                        />
                                        <div className="flex justify-end">
                                            <BlackButton
                                                onClick={saveAuctionEmails}
                                            >
                                                Save Changes
                                            </BlackButton>
                                        </div>
                                    </div>

                                    {emailValidationErrors && (
                                        <div className="mt-2 text-red-600 text-sm">{emailValidationErrors}</div>
                                    )}

                                    <span className="block mt-2 text-sm leading-[22px] text-primary dark:text-dark-text-primary">
                                        These email addresses will automatically receive notifications about auction updates.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
