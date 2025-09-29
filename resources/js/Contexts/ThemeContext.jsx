import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        // Check if dark class is already applied to document (from inline script)
        const hasDarkClass = document.documentElement.classList.contains('dark');

        // Check localStorage first, then system preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme === 'dark';
        }

        // If no saved preference, use the current state of the document
        if (hasDarkClass) {
            return true;
        }

        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        // Apply theme to document (only if it's not already applied)
        const hasDarkClass = document.documentElement.classList.contains('dark');

        if (isDark && !hasDarkClass) {
            document.documentElement.classList.add('dark');
        } else if (!isDark && hasDarkClass) {
            document.documentElement.classList.remove('dark');
        }

        // Save to localStorage
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    const toggleTheme = () => {
        setIsDark(!isDark);
    };

    const value = {
        isDark,
        toggleTheme,
        theme: isDark ? 'dark' : 'light'
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
