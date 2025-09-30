import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useTheme } from '@/Contexts/ThemeContext';
import {
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
    IconButton,
    InputAdornment
} from '@mui/material';
import {
    Search,
    Clear as ClearIcon
} from '@mui/icons-material';
import CustomTextField from '@/Components/CustomTextField';
import BlackButton from '@/Components/BlackButton';

const UpdatePackageStatus = () => {
    const { isDark } = useTheme();
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Dummy data matching the image format
    const dummyData = [
        {
            id: 1,
            customerAccount: '#AIR7070',
            courierNumber: '420330159200..',
            inhouseTracking: 'ARD00000130127',
            packageStatus: 'Shipment Received',
            dateTime: '16-09-2025 12:31:21 PM',
            weight: '0.5LBS'
        },
        {
            id: 2,
            customerAccount: '#AIR1954',
            courierNumber: '884375614883',
            inhouseTracking: 'ARD00000130126',
            packageStatus: 'Shipment Received',
            dateTime: '16-09-2025 12:23:47 PM',
            weight: '6.5LBS'
        },
        {
            id: 3,
            customerAccount: '#AIR5059',
            courierNumber: '420330159505..',
            inhouseTracking: 'ARD00000130125',
            packageStatus: 'Shipment Received',
            dateTime: '16-09-2025 12:21:50 PM',
            weight: '7.5LBS'
        },
        {
            id: 4,
            customerAccount: '#AIR1234',
            courierNumber: '420330159300..',
            inhouseTracking: 'ARD00000130124',
            packageStatus: 'Shipment Received',
            dateTime: '16-09-2025 12:15:30 PM',
            weight: '2.3LBS'
        },
        {
            id: 5,
            customerAccount: '#AIR5678',
            courierNumber: '884375614900',
            inhouseTracking: 'ARD00000130123',
            packageStatus: 'Shipment Received',
            dateTime: '16-09-2025 12:10:15 PM',
            weight: '4.7LBS'
        },
        {
            id: 6,
            customerAccount: '#AIR9012',
            courierNumber: '420330159400..',
            inhouseTracking: 'ARD00000130122',
            packageStatus: 'Shipment Received',
            dateTime: '16-09-2025 12:05:42 PM',
            weight: '1.8LBS'
        },
        {
            id: 7,
            customerAccount: '#AIR3456',
            courierNumber: '884375614800',
            inhouseTracking: 'ARD00000130121',
            packageStatus: 'Shipment Received',
            dateTime: '16-09-2025 12:00:18 PM',
            weight: '3.2LBS'
        },
        {
            id: 8,
            customerAccount: '#AIR7890',
            courierNumber: '420330159600..',
            inhouseTracking: 'ARD00000130120',
            packageStatus: 'Shipment Received',
            dateTime: '16-09-2025 11:55:33 PM',
            weight: '5.9LBS'
        },
        {
            id: 9,
            customerAccount: '#AIR2468',
            courierNumber: '884375614700',
            inhouseTracking: 'ARD00000130119',
            packageStatus: 'Shipment Received',
            dateTime: '16-09-2025 11:50:07 PM',
            weight: '2.1LBS'
        },
        {
            id: 10,
            customerAccount: '#AIR1357',
            courierNumber: '420330159700..',
            inhouseTracking: 'ARD00000130118',
            packageStatus: 'Shipment Received',
            dateTime: '16-09-2025 11:45:25 PM',
            weight: '8.3LBS'
        }
    ];

    const totalEntries = 10384;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);

    const handleUpdateAccount = (id) => {
        console.log('Update account for ID:', id);
        // Add your update logic here
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Update Package Status" />

            <div className="py-2">
                <div className="">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                        <h2 className="text-2xl leading-9 font-bold text-quaternary dark:text-dark-text-primary mb-6">
                            PACKAGE ASSIGN TO THE CORRECT ACCOUNT
                        </h2>
                    </div>

                    {/* Table Controls */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CustomTextField
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search color="action" className="text-quaternary dark:text-dark-text-primary" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: searchTerm && (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setSearchTerm('')}
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
                                            <TableCell className="table-header-cell dark:table-header-cell" sx={{ minWidth: 150 }}>
                                                Customer Account
                                            </TableCell>
                                            <TableCell className="table-header-cell dark:table-header-cell" sx={{ minWidth: 150 }}>
                                                Courier Number
                                            </TableCell>
                                            <TableCell className="table-header-cell dark:table-header-cell" sx={{ minWidth: 150 }}>
                                                Inhouse Tracking
                                            </TableCell>
                                            <TableCell className="table-header-cell dark:table-header-cell" sx={{ minWidth: 150 }}>
                                                Package Status
                                            </TableCell>
                                            <TableCell className="table-header-cell dark:table-header-cell" sx={{ minWidth: 150 }}>
                                                Date/Time
                                            </TableCell>
                                            <TableCell className="table-header-cell dark:table-header-cell" sx={{ minWidth: 100 }}>
                                                Weight
                                            </TableCell>
                                            <TableCell className="table-header-cell dark:table-header-cell" sx={{ minWidth: 150 }}>
                                                Update Account
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {dummyData.map((item, index) => (
                                            <TableRow
                                                key={item.id}
                                                hover
                                                className="table-row-hover dark:table-row-hover"
                                            >
                                                <TableCell className="table-body-cell dark:table-body-cell">
                                                    <div className="truncate">{item.customerAccount}</div>
                                                </TableCell>
                                                <TableCell className="table-body-cell dark:table-body-cell">
                                                    <div className="truncate">{item.courierNumber}</div>
                                                </TableCell>
                                                <TableCell className="table-body-cell dark:table-body-cell">
                                                    <div className="truncate">{item.inhouseTracking}</div>
                                                </TableCell>
                                                <TableCell className="table-body-cell dark:table-body-cell">
                                                    <div className="truncate">{item.packageStatus}</div>
                                                </TableCell>
                                                <TableCell className="table-body-cell dark:table-body-cell">
                                                    <div className="truncate">{item.dateTime}</div>
                                                </TableCell>
                                                <TableCell className="table-body-cell dark:table-body-cell">
                                                    <div className="truncate">{item.weight}</div>
                                                </TableCell>
                                                <TableCell className="table-body-cell dark:table-body-cell">
                                                    <Button
                                                        onClick={() => handleUpdateAccount(item.id)}
                                                        variant="contained"
                                                        sx={{
                                                            bgcolor: '#f97316',
                                                            '&:hover': { bgcolor: '#ea580c' },
                                                            px: 2,
                                                            py: 1,
                                                            fontSize: '0.875rem',
                                                            fontWeight: 500
                                                        }}
                                                    >
                                                        Update Account
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
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
                        onPageChange={(event, newPage) => handlePageChange(newPage + 1)}
                        onRowsPerPageChange={(event) => setEntriesPerPage(parseInt(event.target.value, 10))}
                        labelDisplayedRows={({ from, to, count }) =>
                            `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
                        }
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default UpdatePackageStatus;
