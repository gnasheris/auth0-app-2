import { useAuth } from 'react-oidc-context';

function LoginPage() {
    const auth = useAuth();

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 w-full max-w-sm text-center">
                <h1 className="text-2xl font-bold text-[#0d1b2a] mb-2">Research Data Registry</h1>
                <p className="text-gray-500 text-sm mb-8">Sign in to access your research projects</p>
                <button
                    onClick={() => auth.signinRedirect()}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded font-medium transition-colors"
                >
                    Sign In
                </button>
            </div>
        </div>
    );
}

export default LoginPage;