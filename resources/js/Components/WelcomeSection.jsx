import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    CardContent,
    Typography,
    Button
} from '@mui/material';

const WelcomeSection = ({ user, onSearch, searchQuery, setSearchQuery, showSearchDropdown, setShowSearchDropdown, searchResults }) => {
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
        <Box
            sx={{
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
                height: 'auto',
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `url(https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/public/assets/background/background-5.webp)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.6,
                    zIndex: 0
                },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'black',
                    opacity: 0.8,
                    zIndex: 1
                }
            }}
        >
            {/* Wave Animation Background */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '42%',
                    minHeight: 120,
                    zIndex: 1,
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '100%',
                        background: `
                      radial-gradient(ellipse 100% 100% at 50% 120%, rgba(168, 85, 247, 0.4) 0%, transparent 50%),
                      radial-gradient(ellipse 80% 80% at 30% 110%, rgba(14, 165, 233, 0.3) 0%, transparent 50%),
                      radial-gradient(ellipse 120% 120% at 70% 115%, rgba(236, 72, 153, 0.3) 0%, transparent 50%),
                      radial-gradient(ellipse 90% 90% at 20% 100%, rgba(34, 197, 94, 0.2) 0%, transparent 50%)
                    `,
                        animation: 'waveFloat 6s ease-in-out infinite alternate',
                        '@keyframes waveFloat': {
                            '0%': {
                                transform: 'translateY(0px) scale(1)',
                            },
                            '100%': {
                                transform: 'translateY(-10px) scale(1.05)',
                            }
                        }
                    }
                }}
            />

            {/* Main Content Container - Responsive Flex */}
            <Box
                sx={{
                    position: 'relative',
                    zIndex: 2,
                    p: { xs: 3, md: 5 },
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    justifyContent: { xs: 'center', md: 'space-between' },
                    gap: { xs: 3, md: 2 },
                }}
            >
                {/* Text Content */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        alignItems: { xs: 'center', md: 'start' },
                        textAlign: { xs: 'center', md: 'left' },
                        flex: 1,
                        maxWidth: { xs: '100%', md: 'none' }
                    }}
                >
                    <Typography
                        variant="h3"
                        component="h4"
                        sx={{
                            fontWeight: 'bold',
                            fontSize: { xs: '20px', sm: '22px', md: '24px' },
                            lineHeight: { xs: '30px', md: '36px' },
                            color: '#fff',
                        }}
                    >
                        Welcome back 👋<br />
                        {user?.user_first_last_name || user?.displayName || 'Jaydon Frankie'}
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            lineHeight: '22px',
                            fontSize: { xs: '13px', md: '14px' },
                            color: '#fff',
                            fontWeight: '400',
                            maxWidth: { xs: '280px', md: '330px' },
                            opacity: 0.9
                        }}
                    >
                        If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything.
                    </Typography>

                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#00A76F',
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            lineHeight: '24px',
                            textTransform: 'none',
                            borderRadius: '8px',
                            padding: '6px 12px',
                            mt: 1,
                            '&:hover': {
                                backgroundColor: '#00e077',
                            }
                        }}
                    >
                        Go now
                    </Button>
                </Box>


                {/* Search functionality (hidden but preserved for future use) */}
                <div className="relative" ref={searchRef} style={{ display: 'none' }}>
                    {/* Search Results Dropdown */}
                    {showSearchDropdown && searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999] max-h-80 overflow-y-auto">
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
                        </div>
                    )}

                    {/* No Results Message */}
                    {showSearchDropdown && searchQuery.trim() && searchResults.length === 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999]">
                            <div className="p-4 text-center text-gray-500 text-sm">
                                No results found for "{searchQuery}"
                            </div>
                        </div>
                    )}
                </div>


                {/* Cartoon Character Image - Made Bigger */}
                <Box
                    sx={{
                        flexShrink: 0,
                        width: { xs: 280, sm: 320, lg: 350 },
                        height: { xs: 180, sm: 200, lg: 220 },
                        backgroundImage: 'url(/assets/images/dashboard_cartoon.png)',
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                    }}
                />
            </Box>
        </Box>
    );
};

export default WelcomeSection;
