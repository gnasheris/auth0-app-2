import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';
import { useState } from 'react';

function Layout({ children }) {
    const [darkMode, setDarkMode] = useState(false);

    return (
        <div className={`h-screen overflow-hidden ${darkMode ? 'bg-gray-950' : 'bg-gray-100'}`}>
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
            <Sidebar darkMode={darkMode} />
            <main className={`ml-12 pt-14 p-8 h-full overflow-y-auto ${darkMode ? 'bg-gray-950' : 'bg-gray-100'}`}>
                {children}
            </main>
        </div>
    );
}

export default Layout;