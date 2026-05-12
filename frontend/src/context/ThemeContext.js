import React, { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  return (
    <ThemeContext.Provider value={{ isDark: true, toggleTheme: () => {} }}>
      <div className="dark">
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
