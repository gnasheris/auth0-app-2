import { useAuth } from "'react-oidc-context";

const LogoutButton = () => {
    const { logout } = useAuth();

    console.log("pressed!")

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