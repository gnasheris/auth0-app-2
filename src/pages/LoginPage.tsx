import LoginButton from '../LoginButton';

function LoginPage() {
    return (
        <div className="app-container">
            <div className="main-card-wrapper">
                <h1 className="main-title">Welcome to Sample0</h1>
                <div className="action-card">
                    <p className="action-text">Get started by signing in to your account</p>
                    <LoginButton />
                </div>
            </div>
        </div>
    );
}

export default LoginPage;