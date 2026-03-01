import { useAuth0 } from "react-oidc-context";

const LoginButton = () => {
    const { loginWithRedirect } = useAuth();

    loginWithRedirect({
        authorizationParams: {
            prompt: "login"
        }
    })

    return (
        <button
            onClick={() => loginWithRedirect()}
            className="button login"
        >
            Log In
        </button>
    );
};

export default LoginButton;