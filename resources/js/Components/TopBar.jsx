import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Box,
    Badge,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    Button,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    InputBase,
    Paper,
    Fade,
    Backdrop
} from '@mui/material';
import {
    Menu as MenuIcon,
    Search as SearchIcon,
    Notifications as NotificationsIcon,
    Close as CloseIcon,
    Home as HomeIcon,
    Person as PersonIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
    Upgrade as UpgradeIcon,
    LightMode as LightModeIcon,
    DarkMode as DarkModeIcon
} from '@mui/icons-material';
import { useTheme } from '@/Contexts/ThemeContext';


export default function TopBar({ onMenuClick, sidebarCollapsed = false, isDesktop = false, onSearchClick }) {
    const user = usePage().props.auth.user;
    const { isDark, toggleTheme } = useTheme();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [showUserDrawer, setShowUserDrawer] = useState(false);
    const notifRef = useRef(null);
    const searchRef = useRef(null);
    const drawerRef = useRef(null);


    // Close notifications and drawer when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
            if (drawerRef.current && !drawerRef.current.contains(event.target)) {
                setShowUserDrawer(false);
            }
        };

        if (showNotifications || showUserDrawer) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [showNotifications, showUserDrawer]);

    // Handle Escape key for user drawer
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setShowUserDrawer(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <>
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    left: isDesktop ? (sidebarCollapsed ? '88px' : '300px') : '0px',
                    right: '0px',
                    width: isDesktop ? (sidebarCollapsed ? 'calc(100% - 103px)' : 'calc(100% - 315px)') : '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(11px)',
                    // zIndex: 50,
                    color: 'text.primary',
                    '& .MuiToolbar-root': {
                        minHeight: '71px'
                    }
                }}
                className="dark:!bg-[rgba(20,26,33,0.8)] dark:!text-white"
            >
                {/* Mobile search bar - shows when toggled */}
                {showMobileSearch && (
                    <Box sx={{ display: { xs: 'block', md: 'none' }, p: 2, borderBottom: '1px solid #e5e7eb' }} className="dark:border-gray-700">
                        <Paper sx={{ position: 'relative', display: 'flex', alignItems: 'center', px: 2, py: 1, backgroundColor: 'white' }} className="dark:!bg-gray-800">
                            <SearchIcon sx={{ color: 'grey.500', mr: 1 }} className="dark:!text-gray-400" />
                            <InputBase
                                placeholder="Search..."
                                autoFocus
                                sx={{ flex: 1, color: 'text.primary' }}
                                className="dark:!text-white dark:[&_input::placeholder]:!text-gray-400"
                            />
                            <IconButton
                                onClick={() => setShowMobileSearch(false)}
                                size="small"
                                sx={{ color: 'grey.500' }}
                                className="dark:!text-gray-400"
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Paper>
                    </Box>
                )}

                <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 } }}>
                    {/* Left side - Menu button and search */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
                        {/* Mobile menu button - always visible on mobile/tablet/laptop */}
                        <IconButton
                            onClick={onMenuClick}
                            sx={{
                                display: 'flex',
                                color: 'grey.600',
                                '&:hover': {
                                    backgroundColor: 'grey.100'
                                },
                                '@media (min-width: 1280px)': {
                                    display: 'none'
                                }
                            }}
                            className="dark:!text-gray-300 dark:hover:!bg-[rgba(255,255,255,0.1)]"
                        >
                            <MenuIcon />
                        </IconButton>
                    </Box>

                    {/* Right side - Theme switcher, Notifications and user menu */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {/* Theme Switcher */}
                        <IconButton
                            onClick={toggleTheme}
                            sx={{
                                color: 'grey.600',
                                '&:hover': {
                                    backgroundColor: 'grey.100',
                                    transform: 'scale(1.05)'
                                },
                                transition: 'all 200ms'
                            }}
                            className="dark:!text-gray-300 dark:hover:!bg-[rgba(255,255,255,0.1)]"
                            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {isDark ? <LightModeIcon /> : <DarkModeIcon />}
                        </IconButton>

                        {/* Search Button */}
                        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                            <Button
                                onClick={onSearchClick}
                                ref={searchRef}
                                sx={{
                                    backgroundColor: 'grey.100',
                                    color: 'grey.600',
                                    // gap: 1,
                                    px: 2,
                                    py: 1,
                                    borderRadius: 2,
                                    '&:hover': {
                                        backgroundColor: 'grey.200'
                                    },
                                    textTransform: 'none'
                                }}
                                className="dark:!bg-[rgba(255,255,255,0.1)] dark:!text-gray-300 dark:hover:!bg-[rgba(255,255,255,0.2)]"
                                startIcon={<SearchIcon fontSize="small" sx={{ marginRight: 0 }} />}
                                endIcon={
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                        backgroundColor: 'white',
                                        px: 1,
                                        py: 0.5,
                                        borderRadius: 1,
                                        border: '1px solid #e5e7eb',
                                        fontSize: '0.75rem',
                                        color: 'grey.500'
                                    }}
                                    className="dark:!bg-[rgba(0,0,0,0.2)] dark:!border-gray-600 dark:!text-gray-400">
                                        <span className="text-xs">⌘</span>
                                        <span className="text-xs">K</span>
                                    </Box>
                                }
                            >
                            </Button>
                        </Box>
                        {/* Notifications */}
                        <Box sx={{ position: 'relative' }} ref={notifRef}>
                            <IconButton
                                onClick={() => setShowNotifications(!showNotifications)}
                                sx={{
                                    color: isDark ? 'grey.300' : 'grey.600',
                                    '&:hover': {
                                        backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'grey.100',
                                        transform: 'scale(1.05)'
                                    },
                                    transition: 'all 200ms'
                                }}
                            >
                                <Badge badgeContent={3} color="error">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>

                            {/* Notifications dropdown */}
                            <Menu
                                anchorEl={notifRef.current}
                                open={showNotifications}
                                onClose={() => setShowNotifications(false)}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                PaperProps={{
                                    sx: {
                                        width: 320,
                                        maxWidth: 'calc(100vw - 2rem)',
                                        maxHeight: 400,
                                        mt: 1,
                                        backgroundColor: isDark ? '#1f2937' : 'white',
                                        border: isDark ? '1px solid #374151' : '1px solid #e5e7eb'
                                    }
                                }}
                            >
                                <Box sx={{ p: 2, borderBottom: isDark ? '1px solid #374151' : '1px solid #e5e7eb' }}>
                                    <Typography variant="subtitle1" fontWeight="medium" sx={{ color: isDark ? 'white' : 'text.primary' }}>
                                        Notifications
                                    </Typography>
                                </Box>
                                <Box sx={{ maxHeight: 256, overflowY: 'auto' }}>
                                    <MenuItem sx={{
                                        alignItems: 'flex-start',
                                        py: 1.5,
                                        '&:hover': {
                                            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'grey.50'
                                        }
                                    }}>
                                        <Box sx={{ display: 'flex', width: '100%' }}>
                                            <Box sx={{
                                                width: 8,
                                                height: 8,
                                                backgroundColor: 'primary.main',
                                                borderRadius: '50%',
                                                mt: 1,
                                                mr: 1.5,
                                                flexShrink: 0
                                            }} />
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="body2" sx={{ color: isDark ? 'white' : 'text.primary' }}>
                                                    New order received
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: isDark ? 'grey.400' : 'text.secondary' }}>
                                                    2 minutes ago
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </MenuItem>
                                    <MenuItem sx={{
                                        alignItems: 'flex-start',
                                        py: 1.5,
                                        '&:hover': {
                                            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'grey.50'
                                        }
                                    }}>
                                        <Box sx={{ display: 'flex', width: '100%' }}>
                                            <Box sx={{
                                                width: 8,
                                                height: 8,
                                                backgroundColor: 'success.main',
                                                borderRadius: '50%',
                                                mt: 1,
                                                mr: 1.5,
                                                flexShrink: 0
                                            }} />
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="body2" sx={{ color: isDark ? 'white' : 'text.primary' }}>
                                                    Payment completed
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: isDark ? 'grey.400' : 'text.secondary' }}>
                                                    5 minutes ago
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </MenuItem>
                                    <MenuItem sx={{
                                        alignItems: 'flex-start',
                                        py: 1.5,
                                        '&:hover': {
                                            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'grey.50'
                                        }
                                    }}>
                                        <Box sx={{ display: 'flex', width: '100%' }}>
                                            <Box sx={{
                                                width: 8,
                                                height: 8,
                                                backgroundColor: 'warning.main',
                                                borderRadius: '50%',
                                                mt: 1,
                                                mr: 1.5,
                                                flexShrink: 0
                                            }} />
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="body2" sx={{ color: isDark ? 'white' : 'text.primary' }}>
                                                    System maintenance scheduled
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: isDark ? 'grey.400' : 'text.secondary' }}>
                                                    1 hour ago
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </MenuItem>
                                </Box>
                                <Divider sx={{ borderColor: isDark ? '#374151' : '#e5e7eb' }} />
                                <Box sx={{ p: 2 }}>
                                    <Link href="/notifications">
                                        <Typography variant="body2" sx={{
                                            color: isDark ? '#60a5fa' : 'primary.main',
                                            '&:hover': {
                                                color: isDark ? '#93c5fd' : 'primary.dark'
                                            }
                                        }}>
                                            View all notifications
                                        </Typography>
                                    </Link>
                                </Box>
                            </Menu>
                        </Box>
                        {/* User menu */}
                        <IconButton
                            onClick={() => setShowUserDrawer(true)}
                            sx={{
                                p: 0.5,
                                '&:hover': {
                                    transform: 'scale(1.05)'
                                },
                                transition: 'transform 200ms'
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 40,
                                    height: 40,
                                    background: 'linear-gradient(90deg, #ff6b35, #4ade80)',
                                    p: '2px'
                                }}
                            >
                                <Avatar
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        backgroundColor: 'primary.main',
                                        fontSize: '0.875rem',
                                        fontWeight: 'medium'
                                    }}
                                >
                                    {user?.user_first_last_name?.charAt(0) || 'U'}
                                </Avatar>
                            </Avatar>
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {/* Right-side User Drawer */}
            <Drawer
                anchor="right"
                open={showUserDrawer}
                onClose={() => setShowUserDrawer(false)}
                ref={drawerRef}
                PaperProps={{
                    sx: {
                        width: 320,
                        boxShadow: isDark ? '0 -4px 40px 80px rgba(0,0,0,0.3)' : '0 -4px 40px 80px rgba(145,158,171,0.24)',
                        backgroundColor: isDark ? '#1f2937' : 'white',
                        border: isDark ? '1px solid #374151' : '1px solid #e5e7eb'
                    }
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5 }}>
                        <IconButton
                            onClick={() => setShowUserDrawer(false)}
                            sx={{
                                color: isDark ? 'grey.300' : 'grey.600',
                                '&:hover': {
                                    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'grey.100'
                                }
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* User Profile Section */}
                    <Box sx={{ p: 3, borderBottom: isDark ? '1px solid #374151' : '1px solid #e5e7eb' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                            {/* Avatar */}
                            <Avatar
                                sx={{
                                    width: 80,
                                    height: 80,
                                    background: 'linear-gradient(90deg, #ff6b35, #4ade80)',
                                    p: '3px'
                                }}
                            >
                                <Avatar
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        backgroundColor: 'primary.main',
                                        fontSize: '2rem',
                                        fontWeight: 'medium'
                                    }}
                                >
                                    {user?.user_first_last_name?.charAt(0) || 'U'}
                                </Avatar>
                            </Avatar>

                            {/* User Info */}
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" fontWeight="600" sx={{ color: isDark ? 'white' : 'text.primary' }}>
                                    {user?.user_first_last_name || 'User'}
                                </Typography>
                                <Typography variant="body2" sx={{ color: isDark ? 'grey.400' : 'text.secondary' }}>
                                    {user?.user_email || 'user@example.com'}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Navigation Menu */}
                    <Box sx={{ flex: 1, p: 3 }}>
                        <List>
                            <ListItem
                                button
                                component={Link}
                                href="/dashboard"
                                onClick={() => setShowUserDrawer(false)}
                                sx={{
                                    borderRadius: 2,
                                    mb: 0.5,
                                    '&:hover': {
                                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'grey.50'
                                    }
                                }}
                            >
                                <ListItemIcon>
                                    <HomeIcon sx={{ color: isDark ? 'grey.400' : 'grey.500' }} />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Home"
                                    primaryTypographyProps={{
                                        variant: 'body2',
                                        color: isDark ? 'white' : 'text.primary',
                                        fontWeight: 'normal'
                                    }}
                                />
                            </ListItem>

                            <ListItem
                                button
                                component={Link}
                                href={route('profile.edit')}
                                onClick={() => setShowUserDrawer(false)}
                                sx={{
                                    borderRadius: 2,
                                    mb: 0.5,
                                    '&:hover': {
                                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'grey.50'
                                    }
                                }}
                            >
                                <ListItemIcon>
                                    <PersonIcon sx={{ color: isDark ? 'grey.400' : 'grey.500' }} />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Profile"
                                    primaryTypographyProps={{
                                        variant: 'body2',
                                        color: isDark ? 'white' : 'text.primary',
                                        fontWeight: 'normal'
                                    }}
                                />
                            </ListItem>

                            <ListItem
                                button
                                component={Link}
                                href="/subscription"
                                onClick={() => setShowUserDrawer(false)}
                                sx={{
                                    borderRadius: 2,
                                    mb: 0.5,
                                    '&:hover': {
                                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'grey.50'
                                    }
                                }}
                            >
                                <ListItemIcon>
                                    <UpgradeIcon sx={{ color: isDark ? 'grey.400' : 'grey.500' }} />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Subscription"
                                    primaryTypographyProps={{
                                        variant: 'body2',
                                        color: isDark ? 'white' : 'text.primary',
                                        fontWeight: 'normal'
                                    }}
                                />
                            </ListItem>

                            <ListItem
                                button
                                component={Link}
                                href="/settings"
                                onClick={() => setShowUserDrawer(false)}
                                sx={{
                                    borderRadius: 2,
                                    mb: 0.5,
                                    '&:hover': {
                                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'grey.50'
                                    }
                                }}
                            >
                                <ListItemIcon>
                                    <SettingsIcon sx={{ color: isDark ? 'grey.400' : 'grey.500' }} />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Account settings"
                                    primaryTypographyProps={{
                                        variant: 'body2',
                                        color: isDark ? 'white' : 'text.primary',
                                        fontWeight: 'normal'
                                    }}
                                />
                            </ListItem>
                        </List>
                    </Box>

                    {/* Promotional Banner */}
                    <Box sx={{ p: 3, borderTop: isDark ? '1px solid #374151' : '1px solid #e5e7eb' }}>
                        <Paper
                            sx={{
                                background: 'linear-gradient(135deg, #9c27b0, #ff9800)',
                                color: 'white',
                                p: 2,
                                borderRadius: 2,
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            <Box sx={{ position: 'relative', zIndex: 1 }}>
                                <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 0.5 }}>
                                    35% OFF
                                </Typography>
                                <Typography variant="caption" sx={{ opacity: 0.9, mb: 2, display: 'block' }}>
                                    Power up Productivity!
                                </Typography>
                                <Button
                                    size="small"
                                    sx={{
                                        backgroundColor: 'white',
                                        color: 'purple.600',
                                        fontSize: '0.75rem',
                                        fontWeight: 'medium',
                                        px: 2,
                                        py: 0.5,
                                        borderRadius: 8,
                                        textTransform: 'none',
                                        '&:hover': {
                                            backgroundColor: 'grey.100'
                                        }
                                    }}
                                >
                                    Upgrade to Pro
                                </Button>
                            </Box>
                            <Box
                                sx={{
                                    position: 'absolute',
                                    right: 8,
                                    top: 8,
                                    opacity: 0.2
                                }}
                            >
                                <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                            </Box>
                        </Paper>
                    </Box>

                    {/* Logout Button */}
                    <Box sx={{ p: 3, borderTop: isDark ? '1px solid #374151' : '1px solid #e5e7eb' }}>
                        <Button
                            component={Link}
                            href={route('logout')}
                            method="post"
                            as="button"
                            fullWidth
                            variant="contained"
                            onClick={() => setShowUserDrawer(false)}
                            startIcon={<LogoutIcon />}
                            sx={{
                                backgroundColor: 'rgba(255,86,48,0.5)',
                                color: '#b71d18',
                                fontWeight: 'bold',
                                py: 1.5,
                                borderRadius: 2,
                                textTransform: 'none',
                                '&:hover': {
                                    backgroundColor: 'rgba(255,86,48,0.6)',
                                    color: '#9a1712'
                                }
                            }}
                        >
                            Logout
                        </Button>
                    </Box>
                </Box>
            </Drawer>
        </>
    );
}
