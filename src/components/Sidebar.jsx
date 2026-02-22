import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
    {
        label: 'Projects',
        path: '/projects',
        icon: (
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
        )
    },
    {
        label: 'Datasets',
        path: '/datasets',
        icon: (
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round" />
            </svg>
        )
    },
    {
        label: 'Patients',
        path: '/patients',
        icon: (
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4a4 4 0 11-8 0 4 4 0 018 0zm6 4a3 3 0 10-6 0" strokeLinecap="round" />
            </svg>
        )
    },
    {
        label: 'Documentation',
        path: '/docs',
        icon: (
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeLinecap="round" />
            </svg>
        )
    },
];

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-12 bg-white border-r border-gray-200 flex flex-col items-center py-4 gap-6 z-40">
            {navItems.map((item, i) => (
                <button
                    key={i}
                    onClick={() => navigate(item.path)}
                    title={item.label}
                    className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${location.pathname === item.path ? 'text-blue-600' : 'text-gray-400 hover:text-gray-700'
                        }`}
                >
                    {item.icon}
                </button>
            ))}
        </div>
    );
}

export default Sidebar;