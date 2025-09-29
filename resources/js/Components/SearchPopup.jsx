import { useState, useEffect, useRef } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { navigation } from '@/data/navigation';
import { useTheme } from '@/Contexts/ThemeContext';

export default function SearchPopup({ isOpen, onClose }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const searchInputRef = useRef(null);
    const { isDark } = useTheme();

    // Filter navigation items based on search query
    const filteredItems = navigation.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Keyboard shortcuts and navigation
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (!isOpen) return;

            if (event.key === 'Escape') {
                onClose();
                setSearchQuery('');
                setSelectedIndex(-1);
            }

            // Arrow key navigation when search popup is open
            if (event.key === 'ArrowDown') {
                event.preventDefault();
                setSelectedIndex(prev =>
                    prev < filteredItems.length - 1 ? prev + 1 : prev
                );
            }
            if (event.key === 'ArrowUp') {
                event.preventDefault();
                setSelectedIndex(prev => prev > -1 ? prev - 1 : prev);
            }
            if (event.key === 'Enter' && selectedIndex >= 0) {
                event.preventDefault();
                const selectedItem = filteredItems[selectedIndex];
                if (selectedItem) {
                    window.location.href = selectedItem.href;
                    onClose();
                    setSearchQuery('');
                    setSelectedIndex(-1);
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, filteredItems, selectedIndex, onClose]);

    // Reset selected index when search query changes
    useEffect(() => {
        setSelectedIndex(-1);
    }, [searchQuery]);

    // Focus input when popup opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    // Clear search when popup closes
    useEffect(() => {
        if (!isOpen) {
            setSearchQuery('');
            setSelectedIndex(-1);
        }
    }, [isOpen]);

    const handleItemClick = (href) => {
        window.location.href = href;
        onClose();
        setSearchQuery('');
        setSelectedIndex(-1);
    };

    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        // Only close if clicking on the backdrop, not the popup content
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-[60] bg-black bg-opacity-50 flex items-start justify-center pt-16"
            onClick={handleBackdropClick}
        >
            <div className="bg-white dark:bg-dark-quaternary rounded-xl shadow-2xl w-[600px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-8rem)] overflow-hidden">
                {/* Search Input */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <TextField
                        ref={searchInputRef}
                        fullWidth
                        variant="outlined"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                backgroundColor: 'transparent',
                                padding: '12px 16px',
                                '& fieldset': {
                                    border: 'none',
                                },
                                '&:hover fieldset': {
                                    border: 'none',
                                },
                                '&.Mui-focused fieldset': {
                                    border: 'none',
                                },
                            },
                            '& .MuiInputBase-input': {
                                fontSize: '18px',
                                lineHeight: '28px',
                                fontWeight: '600',
                                padding: '0',
                                color: isDark ? 'white !important' : '#1C252E',
                                // color: 'white !important',
                                '&::placeholder': {
                                    color: '#9CA3AF',
                                    opacity: 1,
                                },
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: '#9CA3AF', fontSize: '30px' }} />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <span className="hidden sm:inline-block px-2 py-1 text-xs leading-[18px] font-bold text-[#637381] bg-[rgba(145,158,171,0.16)] dark:text-[#919EAB] dark:bg-[rgba(145,158,171,0.16)] rounded-md">Esc</span>
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>

                {/* Search Results */}
                <div className="max-h-80 overflow-y-auto scrollbar">
                    {searchQuery.trim() === '' ? (
                        /* No search query - show all items */
                        <div className="px-6 py-4">
                            <div className="space-y-1">
                                {navigation.map((item, index) => (
                                    <div key={item.name} className="w-full border-b border-gray-200 dark:border-[#333d47] border-dashed mb-1">
                                        <button
                                            onClick={() => handleItemClick(item.href)}
                                            className="w-full flex items-center px-3 py-2.5 text-left text-sm leading-[22px]
                                                        font-semibold text-[#1c252e] dark:text-white rounded-lg hover:border hover:border-dashed
                                                        hover:border-[#00a76f] hover:bg-[rgba(0,167,111,0.08)]"
                                            onMouseEnter={() => setSelectedIndex(index)}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-sm">{item.name}</div>
                                                <div className="text-xs text-gray-500 dark:text-[#919eab] truncate">{item.href}</div>
                                            </div>
                                            <div className="text-xs">
                                                <div className="text-xs leading-[18px] text-[#1c252e] bg-[rgba(145,158,171,0.16)] dark:text-gray-200 dark:bg-gray-700 font-bold rounded-md px-1 py-1">Overview</div>
                                            </div>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* Search results */
                        <div className="px-6 py-4">
                            {filteredItems.length > 0 ? (
                                <div className="space-y-1">
                                    {filteredItems.map((item, index) => (
                                        <button
                                            key={item.name}
                                            onClick={() => handleItemClick(item.href)}
                                            className="w-full flex items-center px-3 py-2.5 text-left text-sm leading-[22px]
                                                        font-semibold text-[#1c252e] dark:text-white rounded-lg hover:border hover:border-dashed
                                                        hover:border-[#00a76f] hover:bg-[rgba(0,167,111,0.08)]"
                                            onMouseEnter={() => setSelectedIndex(index)}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-sm">{item.name}</div>
                                                <div className="text-xs text-gray-500 dark:text-[#919eab] truncate">{item.href}</div>
                                            </div>
                                            <div className="text-xs">
                                                <div className="text-xs leading-[18px] text-[#1c252e] bg-[rgba(145,158,171,0.16)] dark:text-gray-200 dark:bg-gray-700 font-bold rounded-md px-1 py-1">Overview</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">No results found</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Try searching for something else</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
