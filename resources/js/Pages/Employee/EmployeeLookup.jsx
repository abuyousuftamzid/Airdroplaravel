import { useState, useEffect } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Box,
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    Tabs,
    Tab,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Alert,
    FormHelperText,
    Chip,
    Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import SaveIcon from '@mui/icons-material/Save';
import PersonIcon from '@mui/icons-material/Person';
import InfoIcon from '@mui/icons-material/Info';
import CustomTextField from '@/Components/CustomTextField';
import BlackButton from '@/Components/BlackButton';
import CustomSelectField from '@/Components/CustomSelectField';
import { useTheme } from '@/Contexts/ThemeContext';

export default function EmployeeLookup({ auth, employee, packages, message, deliveryLocations }) {
    const [activeTab, setActiveTab] = useState('main-info');
    const [accountStatus, setAccountStatus] = useState(null);
    const { isDark } = useTheme();

    const colors = {
        darkTextPrimary: '#ffffff !important',
        darkTextSecondary: '#637381',
        darkTabActive: '#ffffff',
        darkTabInactive: '#b0b0b0',
    };

    const { data: updateFormStep1, setData: setUpdateFormStep1, post: postStep1, processing: processingStep1 } = useForm({
        user_account_number: '',
        user_email: '',
        user_first_last_name: '',
        user_second_last_name: '',
        user_identity_number: '',
        user_phone: '',
        user_mobile: '',
        user_phone_office: '',
        user_identity_type: '',
        user_address_line_1: '',
        user_address_line_2: '',
        user_address_city: '',
        user_address_state: '',
        user_delivery_instructions: '',
        user_package_delivery_location: '',
        user_fax: '',
        user_trn_number: '',
    });

    const { data: updateFormStep2, setData: setUpdateFormStep2, post: postStep2, processing: processingStep2 } = useForm({
        user_account_number: '',
        user_account_type: '',
        user_account_status: '',
        status_change_comment: '',
    });

    useEffect(() => {
        if (employee) {
            // Update search form to show the found employee's account number
            setSearchFormData('user_account_number', employee.user_account_number);

            setUpdateFormStep1({
                user_account_number: employee.user_account_number || '',
                user_email: employee.user_email || '',
                user_first_last_name: employee.user_first_last_name || '',
                user_second_last_name: employee.user_second_last_name || '',
                user_identity_number: employee.user_identity_number || '',
                user_phone: employee.user_phone || '',
                user_mobile: employee.user_mobile || '',
                user_phone_office: employee.user_phone_office || '',
                user_identity_type: employee.user_identity_type || '',
                user_address_line_1: employee.user_address_line_1 || '',
                user_address_line_2: employee.user_address_line_2 || '',
                user_address_city: employee.user_address_city || '',
                user_address_state: employee.user_address_state || '',
                user_delivery_instructions: employee.user_delivery_instructions || '',
                user_package_delivery_location: employee.user_package_delivery_location || '',
                user_fax: employee.user_fax || '',
                user_trn_number: employee.user_trn_number || '',
            });

            setUpdateFormStep2({
                user_account_number: employee.user_account_number || '',
                user_account_type: employee.user_account_type || '',
                user_account_status: employee.user_account_status || '',
                status_change_comment: employee.status_change_comment || '',
            });

            setAccountStatus(employee.account_status);
        }
    }, [employee]);

    const { data: searchFormData, setData: setSearchFormData, post: postSearch, processing: processingSearch } = useForm({
        user_account_number: ''
    });

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchFormData.user_account_number) return;

        postSearch(route('admin.employees.lookup.search'));
    };

    const handleUpdateStep1 = (e) => {
        e.preventDefault();
        postStep1(route('admin.employees.lookup.update-step-1'));
    };

    const handleUpdateStep2 = (e) => {
        e.preventDefault();
        postStep2(route('admin.employees.lookup.update-step-2'));
    };

    const toggleAccountStatus = async (action) => {
        try {
            const response = await fetch(route('admin.employees.lookup.toggle-status'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                body: JSON.stringify({
                    user_account_number: employee.user_account_number,
                    action: action
                })
            });

            const result = await response.json();
            if (result.success) {
                setAccountStatus(result.status);
            }
        } catch (error) {
            console.error('Error toggling account status:', error);
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Employee Data Lookup" />

            <div className="py-2">
                <h2 className="text-2xl leading-9 font-bold text-primary dark:text-dark-text-primary mb-2">Employee Center</h2>

                <div className="bg-white dark:bg-dark-quaternary overflow-hidden shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)] sm:rounded-lg">
                    {/* Search Section */}
                    <Paper elevation={0} sx={{ p: 3 }} className="dark:bg-dark-quaternary">
                        {message && (
                            <Alert
                                severity={message.includes('successfully') ? 'success' : 'error'}
                                sx={{ mb: 3 }}
                            >
                                {message}
                            </Alert>
                        )}
                        <Box component="form" onSubmit={handleSearch}>
                            <CustomTextField
                                label="Account Number"
                                fullWidth
                                required
                                value={searchFormData.user_account_number}
                                onChange={(e) => setSearchFormData('user_account_number', e.target.value)}
                            />
                            <BlackButton
                                type="submit"
                                disabled={processingSearch}
                                startIcon={<SearchIcon />}
                                sx={{ mt: 2 }}
                            >
                                {processingSearch ? 'Searching...' : 'View'}
                            </BlackButton>
                        </Box>
                    </Paper>

                    {/* Employee Information Section */}
                    {employee && (
                        <Paper elevation={0} sx={{ overflow: 'hidden' }} className="dark:bg-dark-quaternary">
                            <Box sx={{ p: 3 }}>
                                {/* Tabs */}
                                <Tabs
                                    value={activeTab}
                                    onChange={(event, newValue) => setActiveTab(newValue)}
                                    sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
                                >
                                    <Tab
                                        icon={<PersonIcon />}
                                        label="Main Info"
                                        value="main-info"
                                        iconPosition="start"
                                        sx={isDark ? {
                                            color: activeTab === 'main-info' ? colors.darkTabActive : colors.darkTabInactive,
                                            '&.Mui-selected': {
                                                color: colors.darkTabActive
                                            }
                                        } : {}}
                                    />
                                    <Tab
                                        icon={<InfoIcon />}
                                        label="Detail Info"
                                        value="detail-info"
                                        iconPosition="start"
                                        sx={isDark ? {
                                            color: activeTab === 'detail-info' ? colors.darkTabActive : colors.darkTabInactive,
                                            '&.Mui-selected': {
                                                color: colors.darkTabActive
                                            }
                                        } : {}}
                                    />
                                </Tabs>

                                {/* Tab Content */}
                                <Box>
                                    {activeTab === 'main-info' && (
                                        <Box component="form" onSubmit={handleUpdateStep1}>
                                            <Box sx={{ mb: 4 }}>
                                                <Typography variant="h6" component="h4" align="center" gutterBottom sx={{ mb: 4, fontWeight: 600, color: isDark ? colors.darkTextPrimary : 'inherit' }}>
                                                    AIR - {employee.user_account_number}
                                                </Typography>

                                                {/* Form Fields using Flexbox */}
                                                <Box sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: 3
                                                }}>
                                                    {/* Row 1 */}
                                                    <Box sx={{
                                                        display: 'flex',
                                                        gap: 2,
                                                        flexWrap: 'wrap',
                                                        '& > *': { flex: '1 1 300px', minWidth: '250px' }
                                                    }}>
                                                        <FormControl fullWidth required>
                                                            <CustomSelectField
                                                                label="Tax Type"
                                                                value={updateFormStep1.user_tax_type}
                                                                onChange={(e) => setUpdateFormStep1({ ...updateFormStep1, user_tax_type: e.target.value })}
                                                                options={[
                                                                    { label: 'Person', value: '1' },
                                                                ]}
                                                            />
                                                        </FormControl>

                                                        <FormControl fullWidth required>
                                                            <CustomSelectField
                                                                label="Employee ID Type"
                                                                value={updateFormStep1.user_identity_type}
                                                                onChange={(e) => setUpdateFormStep1({ ...updateFormStep1, user_identity_type: e.target.value })}
                                                                options={[
                                                                    { label: 'National ID', value: 'National ID' },
                                                                    { label: 'Drivers License', value: 'Drivers License' },
                                                                    { label: 'Passport', value: 'Passport' },
                                                                ]}
                                                            />
                                                        </FormControl>
                                                    </Box>

                                                    {/* Row 2 */}
                                                    <Box sx={{
                                                        display: 'flex',
                                                        gap: 2,
                                                        flexWrap: 'wrap',
                                                        '& > *': { flex: '1 1 300px', minWidth: '250px' }
                                                    }}>
                                                        <CustomTextField
                                                            label="Employee ID Number"
                                                            fullWidth
                                                            required
                                                            value={updateFormStep1.user_identity_number}
                                                            onChange={(e) => setUpdateFormStep1({ ...updateFormStep1, user_identity_number: e.target.value })}
                                                        />

                                                        <CustomTextField
                                                            label="Tax Registration Number"
                                                            fullWidth
                                                            required
                                                            value={updateFormStep1.user_trn_number}
                                                            onChange={(e) => setUpdateFormStep1({ ...updateFormStep1, user_trn_number: e.target.value })}
                                                        />
                                                    </Box>


                                                    {/* Row 3 - Names */}
                                                    <Box sx={{
                                                        display: 'flex',
                                                        gap: 2,
                                                        flexWrap: 'wrap',
                                                        '& > *': { flex: '1 1 300px', minWidth: '250px' }
                                                    }}>
                                                        <CustomTextField
                                                            label="First Name"
                                                            fullWidth
                                                            required
                                                            value={updateFormStep1.user_first_last_name}
                                                            onChange={(e) => setUpdateFormStep1({ ...updateFormStep1, user_first_last_name: e.target.value })}
                                                        />

                                                        <CustomTextField
                                                            label="Last Name"
                                                            fullWidth
                                                            required
                                                            value={updateFormStep1.user_second_last_name}
                                                            onChange={(e) => setUpdateFormStep1({ ...updateFormStep1, user_second_last_name: e.target.value })}
                                                        />
                                                    </Box>

                                                    <Box sx={{
                                                        display: 'flex',
                                                        gap: 2,
                                                        flexWrap: 'wrap',
                                                        '& > *': { flex: '1 1 300px', minWidth: '250px' }
                                                    }}>
                                                        <CustomTextField
                                                            label="Email"
                                                            type="email"
                                                            fullWidth
                                                            required
                                                            value={updateFormStep1.user_email}
                                                            onChange={(e) => setUpdateFormStep1({ ...updateFormStep1, user_email: e.target.value })}
                                                        />

                                                        <CustomTextField
                                                            label="Address 1"
                                                            fullWidth
                                                            required
                                                            value={updateFormStep1.user_address_line_1}
                                                            onChange={(e) => setUpdateFormStep1({ ...updateFormStep1, user_address_line_1: e.target.value })}
                                                        />
                                                    </Box>

                                                    <Box sx={{
                                                        display: 'flex',
                                                        gap: 2,
                                                        flexWrap: 'wrap',
                                                        '& > *': { flex: '1 1 300px', minWidth: '250px' }
                                                    }}>
                                                        <CustomTextField
                                                            label="Address 2"
                                                            fullWidth
                                                            value={updateFormStep1.user_address_line_2}
                                                            onChange={(e) => setUpdateFormStep1({ ...updateFormStep1, user_address_line_2: e.target.value })}
                                                        />

                                                        <CustomTextField
                                                            label="City"
                                                            fullWidth
                                                            value={updateFormStep1.user_address_city}
                                                            onChange={(e) => setUpdateFormStep1({ ...updateFormStep1, user_address_city: e.target.value })}
                                                        />
                                                    </Box>

                                                    <Box sx={{
                                                        display: 'flex',
                                                        gap: 2,
                                                        flexWrap: 'wrap',
                                                        '& > *': { flex: '1 1 300px', minWidth: '250px' }
                                                    }}>
                                                        <CustomTextField
                                                            label="Province/State/Parish"
                                                            fullWidth
                                                            value={updateFormStep1.user_address_state}
                                                            onChange={(e) => setUpdateFormStep1({ ...updateFormStep1, user_address_state: e.target.value })}
                                                        />

                                                        <CustomTextField
                                                            label="Delivery Instructions"
                                                            fullWidth
                                                            value={updateFormStep1.user_delivery_instructions}
                                                            onChange={(e) => setUpdateFormStep1({ ...updateFormStep1, user_delivery_instructions: e.target.value })}
                                                        />
                                                    </Box>

                                                    <Box sx={{
                                                        display: 'flex',
                                                        gap: 2,
                                                        flexWrap: 'wrap',
                                                        '& > *': { flex: '1 1 300px', minWidth: '250px' }
                                                    }}>
                                                        <FormControl fullWidth>
                                                            <CustomSelectField
                                                                label="Delivery Preferences"
                                                                value={updateFormStep1.user_package_delivery_location}
                                                                onChange={(e) => setUpdateFormStep1({ ...updateFormStep1, user_package_delivery_location: e.target.value })}
                                                                options={deliveryLocations.map((location) => (
                                                                    { label: location.location_name, value: location.location_id }
                                                                ))}
                                                            />
                                                        </FormControl>

                                                        <FormControl fullWidth required>
                                                            <CustomSelectField
                                                                label="Language"
                                                                value={updateFormStep1.user_language}
                                                                onChange={(e) => setUpdateFormStep1({ ...updateFormStep1, user_language: e.target.value })}
                                                                options={[
                                                                    { label: 'English', value: '1' },
                                                                ]}
                                                            />
                                                        </FormControl>
                                                    </Box>
                                                </Box>
                                            </Box>

                                            <Divider sx={{ my: 4 }} />

                                            {/* Telephones Section */}
                                            <Box sx={{ mb: 4 }}>
                                                <Typography variant="h6" component="h4" align="center" gutterBottom sx={{ mb: 4, fontWeight: 600, color: isDark ? colors.darkTextPrimary : 'inherit' }}>
                                                    Telephones
                                                </Typography>

                                                <Box sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: 3
                                                }}>
                                                    {/* Phone Row 1 */}
                                                    <Box sx={{
                                                        display: 'flex',
                                                        gap: 2,
                                                        flexWrap: 'wrap',
                                                        '& > *': { flex: '1 1 300px', minWidth: '250px' }
                                                    }}>
                                                        <CustomTextField
                                                            label="Office (Area)"
                                                            fullWidth
                                                            placeholder="*** - *******"
                                                            value={updateFormStep1.user_phone_office}
                                                            onChange={(e) => setUpdateFormStep1({ ...updateFormStep1, user_phone_office: e.target.value })}
                                                        />

                                                        <CustomTextField
                                                            label="Home (Area)"
                                                            fullWidth
                                                            required
                                                            placeholder="*** - *******"
                                                            value={updateFormStep1.user_phone}
                                                            onChange={(e) => setUpdateFormStep1({ ...updateFormStep1, user_phone: e.target.value })}
                                                        />
                                                    </Box>

                                                    {/* Phone Row 2 */}
                                                    <Box sx={{
                                                        display: 'flex',
                                                        gap: 2,
                                                        flexWrap: 'wrap',
                                                        '& > *': { flex: '1 1 300px', minWidth: '250px' }
                                                    }}>
                                                        <CustomTextField
                                                            label="Cellular (Area)"
                                                            fullWidth
                                                            placeholder="*** - *******"
                                                            value={updateFormStep1.user_mobile}
                                                            onChange={(e) => setUpdateFormStep1({ ...updateFormStep1, user_mobile: e.target.value })}
                                                        />

                                                        <CustomTextField
                                                            label="Fax (Area)"
                                                            fullWidth
                                                            placeholder="*** - *******"
                                                            value={updateFormStep1.user_fax}
                                                            onChange={(e) => setUpdateFormStep1({ ...updateFormStep1, user_fax: e.target.value })}
                                                        />
                                                    </Box>
                                                </Box>

                                                {/* Save Button Section - Properly separated */}
                                                <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                                    <FormHelperText sx={{ mb: 2, color: 'text.secondary', color: isDark ? colors.darkTextPrimary : 'inherit' }}>
                                                        To change information click on <strong>Save Button</strong> below
                                                    </FormHelperText>
                                                    <BlackButton
                                                        type="submit"
                                                        disabled={processingStep1}
                                                        startIcon={<SaveIcon />}
                                                        sx={{ mt: 2 }}
                                                    >
                                                        Save
                                                    </BlackButton>
                                                </Box>
                                            </Box>
                                        </Box>
                                    )}

                                    {activeTab === 'detail-info' && (
                                        <Box component="form" onSubmit={handleUpdateStep2}>
                                            <Box sx={{ mb: 4 }}>
                                                <Typography variant="h6" component="h4" align="center" gutterBottom sx={{ mb: 4, fontWeight: 600, color: isDark ? colors.darkTextPrimary : 'inherit' }}>
                                                    AIR - {employee.user_account_number}
                                                </Typography>

                                                {/* Form Fields using Flexbox */}
                                                <Box sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: 3
                                                }}>
                                                    {/* Row 1 - Account Type and Email Notification */}
                                                    <Box sx={{
                                                        display: 'flex',
                                                        gap: 2,
                                                        flexWrap: 'wrap',
                                                        '& > *': { flex: '1 1 300px', minWidth: '250px' }
                                                    }}>
                                                        <FormControl fullWidth>
                                                            <CustomSelectField
                                                                label="Account Type"
                                                                value={updateFormStep2.user_account_type}
                                                                onChange={(e) => setUpdateFormStep2({ ...updateFormStep2, user_account_type: e.target.value })}
                                                                options={[
                                                                    { label: 'Express-COD', value: 'Express-COD' },
                                                                    { label: 'Express-Charge', value: 'Express-Charge' },
                                                                    { label: 'Express-Diplomat', value: 'Express-Diplomat' },
                                                                    { label: 'Walk-in', value: 'Walk-in' },
                                                                    { label: 'Express-Credit', value: 'Express-Credit' },
                                                                    { label: 'Staff Account', value: 'Staff Account' },
                                                                    { label: 'Corporate', value: 'Corporate' },
                                                                    { label: 'Amway', value: 'Amway' },
                                                                    { label: 'Delivery COD', value: 'Delivery COD' },
                                                                ]}
                                                            />
                                                        </FormControl>

                                                        <FormControl fullWidth>
                                                            <CustomSelectField
                                                                label="Email Notification Status"
                                                                value={updateFormStep2.user_account_status}
                                                                onChange={(e) => setUpdateFormStep2({ ...updateFormStep2, user_account_status: e.target.value })}
                                                                options={[
                                                                    { label: 'Active', value: '1' },
                                                                    { label: 'Inactive', value: '0' },
                                                                ]}
                                                            />
                                                        </FormControl>
                                                    </Box>

                                                    {/* Row 2 - Additional Comment and Sign-Up Date */}
                                                    <Box sx={{
                                                        display: 'flex',
                                                        gap: 2,
                                                        flexWrap: 'wrap',
                                                        alignItems: 'flex-start',
                                                        '& > *': { flex: '1 1 300px', minWidth: '250px' }
                                                    }}>
                                                        <CustomTextField
                                                            label="Additional Comment"
                                                            multiline
                                                            rows={5}
                                                            fullWidth
                                                            value={updateFormStep2.status_change_comment}
                                                            onChange={(e) => setUpdateFormStep2({ ...updateFormStep2, status_change_comment: e.target.value })}
                                                        />

                                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                            <CustomTextField
                                                                label="Sign-Up Date"
                                                                fullWidth
                                                                value={employee.user_signup_date || ''}
                                                                InputProps={{
                                                                    readOnly: true,
                                                                }}
                                                            />

                                                            {/* User Account Status Section */}
                                                            <Box sx={{
                                                                p: 2,
                                                                border: '1px solid',
                                                                borderColor: 'divider',
                                                                borderRadius: 1,
                                                                color: isDark ? colors.darkTextPrimary : 'inherit'
                                                            }} className="dark:bg-dark-quaternary dark:border-charcoal">
                                                                <Typography variant="body2" gutterBottom sx={{ color: isDark ? colors.darkTextPrimary : 'inherit' }}>
                                                                    User Account Status:
                                                                    <Chip
                                                                        label={accountStatus === 'deactivate' ? 'Deactivated' : 'Active'}
                                                                        color={accountStatus === 'deactivate' ? 'error' : 'success'}
                                                                        size="small"
                                                                        sx={{ ml: 1, fontWeight: 'bold' }}
                                                                    />
                                                                </Typography>
                                                                <Box sx={{ mt: 2 }}>
                                                                    {accountStatus === 'deactivate' ? (
                                                                        <BlackButton
                                                                            onClick={() => toggleAccountStatus('activate')}
                                                                        >
                                                                            Activate
                                                                        </BlackButton>
                                                                    ) : (
                                                                        <BlackButton
                                                                            onClick={() => toggleAccountStatus('deactivate')}
                                                                        >
                                                                            Deactivate
                                                                        </BlackButton>
                                                                    )}
                                                                </Box>
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </Box>

                                                {/* Save Button Section - Properly separated */}
                                                <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                                    <FormHelperText sx={{ mb: 2, color: isDark ? colors.darkTextPrimary : 'inherit' }}>
                                                        To change information click on <strong>Save Button</strong> below
                                                    </FormHelperText>
                                                    <BlackButton
                                                        type="submit"
                                                        disabled={processingStep2}
                                                        startIcon={<SaveIcon />}
                                                        sx={{ mt: 2 }}
                                                    >
                                                        Save
                                                    </BlackButton>
                                                </Box>
                                            </Box>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        </Paper>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
