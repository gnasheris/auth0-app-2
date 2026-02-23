import { useAuth } from "'react-oidc-context";

const LogoutButton = () => {
    const { logout } = useAuth();

    return (
        <button
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            className="button logout"
        >
            Log Out
        </button>
    );
};

export default LogoutButton;