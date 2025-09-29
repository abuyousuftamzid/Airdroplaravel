import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import TopBar from '@/Components/TopBar';
import SearchPopup from '@/Components/SearchPopup';
import { Container, Box, Toolbar } from '@mui/material';

export default function AuthenticatedLayout({ header, children, searchQuery }) {
    const { url } = usePage();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const [showSearchPopup, setShowSearchPopup] = useState(false);

    // Handle window resize to detect desktop mode
    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1280);
        };

        // Set initial value
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Keyboard shortcut to open search
    useEffect(() => {
        const handleKeyDown = (event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
                event.preventDefault();
                setShowSearchPopup(true);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'white' }} className="dark:bg-dark-primary">
            {/* Sidebar */}
            <Box style={{ flexShrink: 0 }}>
                <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    searchQuery={searchQuery || ''}
                    isCollapsed={sidebarCollapsed}
                    onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
                />
            </Box>


            {/* Main content area */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'auto',
                    pt: '71px',
                    minWidth: '0px',
                    height: '100%',
                    transition: 'all 200ms linear',
                    zIndex: 10,
                }}
            >
                {/* Page header */}
                {header && (
                    <div className="bg-white dark:bg-dark-primary shadow-sm border-b border-gray-200 dark:border-gray-700">
                        <div className="px-6 py-4">
                            {header}
                        </div>
                    </div>
                )}
                {/* Top bar - fixed at top */}
                <Box sx={{ zIndex: 50 }}>
                    <TopBar
                        onMenuClick={() => setSidebarOpen(true)}
                        sidebarCollapsed={sidebarCollapsed}
                        isDesktop={isDesktop}
                        onSearchClick={() => setShowSearchPopup(true)}
                    />
                </Box>

                {/* Main content */}
                <Box component="main" sx={{ flex: 1, zIndex: 40, backgroundColor: 'white' }} className="dark:bg-dark-primary">
                    <Container maxWidth={url === '/admin/dashboard' ? 'xl' : 'lg'} sx={{
                        px: { xs: '40px', sm: '40px', md: '40px', lg: '40px', xl: '40px' },
                    }}>
                        {children}
                    </Container>
                </Box>
            </Box>

            {/* Global Search Popup Component */}
            <SearchPopup
                isOpen={showSearchPopup}
                onClose={() => setShowSearchPopup(false)}
            />
        </Box>
    );
}
