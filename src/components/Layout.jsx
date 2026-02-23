import { useState, createContext, useContext, useEffect } from 'react';
import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';

export const DarkModeContext = createContext(false);

export function useDarkMode() {
    return useContext(DarkModeContext);
}

function Layout({ children }) {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        document.body.style.backgroundColor = darkMode ? '#111827' : '#f3f4f6';
    }, [darkMode]);

    return (
        <DarkModeContext.Provider value={darkMode}>
            <div className={`h-screen overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
                <Sidebar />
                <main className={`ml-12 pt-14 p-8 h-full overflow-y-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                    {children}
                </main>
            </div>
        </DarkModeContext.Provider>
    );
}

export default Layout;