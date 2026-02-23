import { useAuth } from 'react-oidc-context';
import { useLocation } from 'react-router-dom';

const pageTitles = {
    '/projects': 'All Projects',
    '/datasets': 'All Datasets',
    '/patients': 'Patients',
    '/docs': 'Documentation',
};

function Navbar({ darkMode, setDarkMode }) {
    const auth = useAuth();
    const location = useLocation();

    const title = pageTitles[location.pathname] || 'Project Detail';

    return (
        <div className="fixed top-0 left-0 right-0 h-14 bg-[#0d1b2a] flex items-center justify-between px-4 z-50">
            <div className="flex items-center gap-4">
                <button className="text-white p-1">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" />
                    </svg>
                </button>
                <span className="text-white font-semibold text-lg">{title}</span>
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="text-white p-1.5 rounded hover:bg-white/10 transition-colors"
                    title="Toggle dark mode"
                >
                    {darkMode ? (
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeLinecap="round" />
                        </svg>
                    ) : (
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" strokeLinecap="round" />
                        </svg>
                    )}
                </button>
                <button
                    onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                    className="text-white text-sm font-medium hover:text-gray-300 transition-colors"
                >
                    Log Out
                </button>
            </div>
        </div>
    );
}

export default Navbar;