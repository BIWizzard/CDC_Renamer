// src/contexts/ThemeContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Try to get theme from localStorage, default to 'light'
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const savedTheme = localStorage.getItem('theme') as Theme;
      return savedTheme === 'dark' ? 'dark' : 'light';
    } catch (error) {
      return 'light';
    }
  });

  // Effect to update body class and localStorage when theme changes
  useEffect(() => {
    // Update body class for global CSS styling
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme}`);
    
    // Save theme to localStorage
    try {
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.error('Error saving theme to localStorage:', error);
    }
  }, [theme]);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using theme
export const useTheme = () => React.useContext(ThemeContext);