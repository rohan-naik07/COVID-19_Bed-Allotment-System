import React, {createContext, useState} from 'react';

export const ThemeContext = createContext();

export const ThemeContextProvider = (props) => {
    const [dark, setDark] = useState(true);

    const toggleTheme = () => {
        setDark(!dark);
    }

    return (
        <ThemeContext.Provider value={{ 
            dark :dark, 
            toggleTheme : toggleTheme}}>
            {props.children}
        </ThemeContext.Provider>
    )
}