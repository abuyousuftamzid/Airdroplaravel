import { useState, useEffect, useRef } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { InputAdornment, Box, Typography } from '@mui/material';
import CustomTextField from '@/Components/CustomTextField';
import CustomSelectField from '@/Components/CustomSelectField';
import BlackButton from '@/Components/BlackButton';
import { ArrowDropDown } from '@mui/icons-material';
import { useTheme } from '@/Contexts/ThemeContext';

// Countries array - moved outside component to avoid recreating on every render
const countries = [
    // Priority countries first
    { id: 'US', code: '+1', country: 'US', name: 'United States' },
    { id: 'JM', code: '+1876', country: 'JM', name: 'Jamaica' },
    // Other countries
    { id: 'CA', code: '+1', country: 'CA', name: 'Canada' },
    { id: 'GB', code: '+44', country: 'GB', name: 'United Kingdom' },
    { id: 'AF', code: '+93', country: 'AF', name: 'Afghanistan' },
    { id: 'AL', code: '+355', country: 'AL', name: 'Albania' },
    { id: 'DZ', code: '+213', country: 'DZ', name: 'Algeria' },
    { id: 'AR', code: '+54', country: 'AR', name: 'Argentina' },
    { id: 'AU', code: '+61', country: 'AU', name: 'Australia' },
    { id: 'AT', code: '+43', country: 'AT', name: 'Austria' },
    { id: 'BD', code: '+880', country: 'BD', name: 'Bangladesh' },
    { id: 'BE', code: '+32', country: 'BE', name: 'Belgium' },
    { id: 'BR', code: '+55', country: 'BR', name: 'Brazil' },
    { id: 'CN', code: '+86', country: 'CN', name: 'China' },
    { id: 'DK', code: '+45', country: 'DK', name: 'Denmark' },
    { id: 'EG', code: '+20', country: 'EG', name: 'Egypt' },
    { id: 'FR', code: '+33', country: 'FR', name: 'France' },
    { id: 'DE', code: '+49', country: 'DE', name: 'Germany' },
    { id: 'GR', code: '+30', country: 'GR', name: 'Greece' },
    { id: 'IN', code: '+91', country: 'IN', name: 'India' },
    { id: 'ID', code: '+62', country: 'ID', name: 'Indonesia' },
    { id: 'IR', code: '+98', country: 'IR', name: 'Iran' },
    { id: 'IQ', code: '+964', country: 'IQ', name: 'Iraq' },
    { id: 'IE', code: '+353', country: 'IE', name: 'Ireland' },
    { id: 'IL', code: '+972', country: 'IL', name: 'Israel' },
    { id: 'IT', code: '+39', country: 'IT', name: 'Italy' },
    { id: 'JP', code: '+81', country: 'JP', name: 'Japan' },
    { id: 'KZ', code: '+7', country: 'KZ', name: 'Kazakhstan' },
    { id: 'KE', code: '+254', country: 'KE', name: 'Kenya' },
    { id: 'MY', code: '+60', country: 'MY', name: 'Malaysia' },
    { id: 'MX', code: '+52', country: 'MX', name: 'Mexico' },
    { id: 'NL', code: '+31', country: 'NL', name: 'Netherlands' },
    { id: 'NZ', code: '+64', country: 'NZ', name: 'New Zealand' },
    { id: 'NO', code: '+47', country: 'NO', name: 'Norway' },
    { id: 'PK', code: '+92', country: 'PK', name: 'Pakistan' },
    { id: 'PH', code: '+63', country: 'PH', name: 'Philippines' },
    { id: 'PL', code: '+48', country: 'PL', name: 'Poland' },
    { id: 'PT', code: '+351', country: 'PT', name: 'Portugal' },
    { id: 'RU', code: '+7', country: 'RU', name: 'Russia' },
    { id: 'SA', code: '+966', country: 'SA', name: 'Saudi Arabia' },
    { id: 'SG', code: '+65', country: 'SG', name: 'Singapore' },
    { id: 'ZA', code: '+27', country: 'ZA', name: 'South Africa' },
    { id: 'KR', code: '+82', country: 'KR', name: 'South Korea' },
    { id: 'ES', code: '+34', country: 'ES', name: 'Spain' },
    { id: 'LK', code: '+94', country: 'LK', name: 'Sri Lanka' },
    { id: 'SE', code: '+46', country: 'SE', name: 'Sweden' },
    { id: 'CH', code: '+41', country: 'CH', name: 'Switzerland' },
    { id: 'TH', code: '+66', country: 'TH', name: 'Thailand' },
    { id: 'TR', code: '+90', country: 'TR', name: 'Turkey' },
    { id: 'UA', code: '+380', country: 'UA', name: 'Ukraine' },
    { id: 'AE', code: '+971', country: 'AE', name: 'United Arab Emirates' },
    { id: 'VN', code: '+84', country: 'VN', name: 'Vietnam' },
];

export default function EditEmployee({ employee, deliveryLocations }) {
    // Debug: Log employee data to see actual values
    // console.log('Employee data:', employee);

    // Theme context
    const { isDark } = useTheme();

    const { data, setData, patch, processing, errors, reset } = useForm({
        user_first_last_name: employee.user_first_last_name || '',
        user_second_last_name: employee.user_second_last_name || '',
        user_mobile: employee.user_mobile || '',
        country_code: employee.user_address_country || '+1',
        user_type: employee.user_type || '',
        user_package_delivery_location: employee.user_package_delivery_location || '',
        user_email: employee.user_email || '',
    });

    const [flagDropdownOpen, setFlagDropdownOpen] = useState(false);
    const [selectedCountryId, setSelectedCountryId] = useState(() => {
        // Find the country ID based on the country code
        const foundCountry = countries.find(c => c.code === (employee.user_address_country || '+1'));
        return foundCountry ? foundCountry.id : 'US';
    });

    // Ref for the country dropdown container
    const dropdownRef = useRef(null);

    // Handle outside clicks to close the dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setFlagDropdownOpen(false);
            }
        };

        if (flagDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [flagDropdownOpen]);

    const submit = (e) => {
        e.preventDefault();
        patch(route('admin.employees.update', employee.user_id));
    };

    const userTypes = [
        { value: 'Airdrop_Admin', label: 'Airdrop Admin' },
        { value: 'Airdrop_Supervisor', label: 'Airdrop Supervisor' },
        { value: 'Airdrop_Cashier', label: 'Airdrop Cashier' },
        { value: 'Airdrop_Shipper', label: 'Airdrop Shipper' },
        { value: 'Airdrop_Operations_Supervisor', label: 'Airdrop Operations Supervisor' },
        { value: 'Airdrop_Manager', label: 'Airdrop Manager' },
        { value: 'Airdrop_Master_Admin', label: 'Airdrop Master Admin' },
        { value: 'admin', label: 'Admin' },
    ];


    const selectedCountry = countries.find(country => country.id === selectedCountryId) || countries[0];

    const colors = {
        darkTertiary: '#374151',
        backgroundSecondary: '#f9fafb',
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Edit Employee: ${employee.user_first_last_name}`} />

            <div className="py-2">
                <div>
                    <div className="mb-6">
                        <h3 className="text-2xl leading-9 font-bold text-[#1c252e] dark:text-dark-text-primary">Edit Employee Information</h3>
                        <p className="text-sm leading-[22px] text-[#1c252e] dark:text-dark-text-primary">
                            Update the employee details below. Leave password fields empty to keep current passwords.
                        </p>
                    </div>
                    <div className="bg-white dark:bg-dark-quaternary overflow-hidden shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)] sm:rounded-lg">
                        <div className="p-6">

                            <form onSubmit={submit} className="space-y-6">
                                {/* Personal Information Section */}
                                <div className="border-b border-gray-200 dark:border-dark-quaternary pb-6">
                                    <h4 className="text-md font-medium text-gray-900 mb-4 dark:text-dark-text-primary">Personal Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* First Last Name */}
                                        <div>
                                            <CustomTextField
                                                id="user_first_last_name"
                                                label="First Name"
                                                type="text"
                                                value={data.user_first_last_name}
                                                onChange={(e) => setData('user_first_last_name', e.target.value)}
                                                required
                                                fullWidth
                                                variant="outlined"
                                                error={!!errors.user_first_last_name}
                                                helperText={errors.user_first_last_name}
                                            />
                                        </div>

                                        {/* Second Last Name */}
                                        <div>
                                            <CustomTextField
                                                id="user_second_last_name"
                                                label="Second Name"
                                                type="text"
                                                value={data.user_second_last_name}
                                                onChange={(e) => setData('user_second_last_name', e.target.value)}
                                                fullWidth
                                                variant="outlined"
                                                error={!!errors.user_second_last_name}
                                                helperText={errors.user_second_last_name}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information Section */}
                                <div className="border-b border-gray-200 dark:border-charcoal pb-6">
                                    <h4 className="text-md font-medium text-gray-900 mb-4 dark:text-dark-text-primary">Contact Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Box ref={dropdownRef} sx={{ position: 'relative', width: '100%' }}>
                                                <CustomTextField
                                                    id="user_mobile"
                                                    label="Phone Number"
                                                    type="tel"
                                                    placeholder="Enter phone number"
                                                    required
                                                    fullWidth
                                                    variant="outlined"
                                                    value={data.user_mobile}
                                                    onChange={(e) => setData('user_mobile', e.target.value)}
                                                    error={!!errors.user_mobile}
                                                    helperText={errors.user_mobile}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Box
                                                                    onClick={() => setFlagDropdownOpen(!flagDropdownOpen)}
                                                                    sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        cursor: 'pointer',
                                                                        padding: '4px 8px 4px 0',
                                                                        borderRight: '1px solid #e0e0e0',
                                                                        marginRight: '8px',
                                                                        '&:hover': {
                                                                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                                                            borderRadius: '4px',
                                                                            color: isDark ? '#ffffff' : 'inherit',
                                                                        }
                                                                    }}
                                                                >
                                                                    <img
                                                                        src={`https://flagcdn.com/w20/${(countries.find(c => c.id === selectedCountryId) || countries[0]).country.toLowerCase()}.png`}
                                                                        alt={`${(countries.find(c => c.id === selectedCountryId) || countries[0]).name} flag`}
                                                                        style={{ width: 20, height: 16, objectFit: 'cover' }}
                                                                    />
                                                                    <ArrowDropDown sx={{ ml: 0.5, fontSize: 16, color: isDark ? '#ffffff' : 'inherit' }} />
                                                                </Box>
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />

                                                {/* Country selection dropdown */}
                                                {flagDropdownOpen && (
                                                    <Box
                                                        sx={{
                                                            position: 'absolute',
                                                            top: '100%',
                                                            left: 0,
                                                            right: 0,
                                                            backgroundColor: isDark ? 'rgba(28, 37, 46, 0.9)' : 'white',
                                                            border: isDark ? 'none' : '1px solid #e0e0e0',
                                                            borderRadius: '10px',
                                                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                                            zIndex: 1300,
                                                            maxHeight: '200px',
                                                            overflowY: 'auto',
                                                            mt: 0.5,
                                                            color: isDark ? '#ffffff' : 'inherit',
                                                        }}
                                                        className="custom-select-dropdown"
                                                    >
                                                        {countries.map((country) => (
                                                            <Box
                                                                key={country.id}
                                                                onClick={() => {
                                                                    setData('country_code', country.code);
                                                                    setSelectedCountryId(country.id);
                                                                    setFlagDropdownOpen(false);
                                                                }}
                                                                sx={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: 1,
                                                                    padding: '8px 12px',
                                                                    cursor: 'pointer',
                                                                    backgroundColor: selectedCountryId === country.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                                                    '&:hover': {
                                                                        backgroundColor: isDark ? colors.darkTertiary : colors.backgroundSecondary,
                                                                        color: isDark ? '#ffffff' : 'inherit',
                                                                    }
                                                                }}
                                                            >
                                                                <img
                                                                    src={`https://flagcdn.com/w20/${country.country.toLowerCase()}.png`}
                                                                    alt={`${country.name} flag`}
                                                                    style={{ width: 20, height: 16, objectFit: 'cover' }}
                                                                />
                                                                <Box>
                                                                <Typography variant="body2" sx={{ fontWeight: 500, color: isDark ? '#ffffff' : 'inherit' }}>
                                                                        {country.name}
                                                                    </Typography>
                                                                    <Typography variant="caption" color="text.secondary" sx={{ color: isDark ? '#ffffff' : 'inherit' }}>
                                                                        {country.code}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        ))}
                                                    </Box>
                                                )}
                                            </Box>
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <CustomTextField
                                                id="user_email"
                                                label="Email Address"
                                                type="email"
                                                value={data.user_email}
                                                onChange={(e) => setData('user_email', e.target.value)}
                                                required
                                                fullWidth
                                                variant="outlined"
                                                error={!!errors.user_email}
                                                helperText={errors.user_email}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Work Information Section */}
                                <div className="border-b border-gray-200 dark:border-charcoal pb-6">
                                    <h4 className="text-md font-medium text-gray-900 mb-4 dark:text-dark-text-primary">Work Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* User Type */}
                                        <div>
                                            <CustomSelectField
                                                id="user_type"
                                                label="User Type *"
                                                value={data.user_type}
                                                onChange={(e) => setData('user_type', e.target.value)}
                                                required
                                                error={!!errors.user_type}
                                                helperText={errors.user_type}
                                                options={[
                                                    { value: '', label: 'Select user type' },
                                                    ...userTypes,
                                                    // Fallback option for existing value not in list
                                                    ...(data.user_type && !userTypes.find(type => type.value === data.user_type) ? [
                                                        { value: data.user_type, label: data.user_type.charAt(0).toUpperCase() + data.user_type.slice(1).replace(/_/g, ' ') }
                                                    ] : [])
                                                ]}
                                            />
                                        </div>

                                        {/* Delivery Location */}
                                        <div>
                                            <CustomSelectField
                                                id="user_package_delivery_location"
                                                label="User Branch"
                                                value={data.user_package_delivery_location}
                                                onChange={(e) => setData('user_package_delivery_location', e.target.value)}
                                                error={!!errors.user_package_delivery_location}
                                                helperText={errors.user_package_delivery_location}
                                                options={[
                                                    { value: '', label: 'Select user branch' },
                                                    ...(deliveryLocations?.map((location) => ({
                                                        value: location.location_id,
                                                        label: location.location_name
                                                    })) || []),
                                                    // Fallback option for existing value not in list
                                                    ...(data.user_package_delivery_location && !deliveryLocations?.find(location => location.location_id == data.user_package_delivery_location) ? [
                                                        { value: data.user_package_delivery_location, label: `Delivery Location ID: ${data.user_package_delivery_location}` }
                                                    ] : [])
                                                ]}
                                            />
                                        </div>
                                    </div>
                                </div>


                                {/* Form Actions */}
                                <div className="flex items-center justify-end space-x-4">
                                    <Link href={route('admin.employees.index')}>
                                        <BlackButton
                                            variant="outlined"
                                            type="button"
                                            loading={processing}
                                        >
                                            Cancel
                                        </BlackButton>
                                    </Link>
                                    <BlackButton
                                        variant="contained"
                                        type="submit"
                                        disabled={processing}
                                        loading={processing}
                                        loadingText="Updating..."
                                    >
                                        {processing ? 'Updating...' : 'Update Employee'}
                                    </BlackButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
