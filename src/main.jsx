import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from 'react-oidc-context';
import { BrowserRouter } from 'react-router-dom';

const oidcConfig = {
  authority: import.meta.env.VITE_AUTH0_DOMAIN
    ? `https://${import.meta.env.VITE_AUTH0_DOMAIN}/`
    : "",
  client_id: import.meta.env.VITE_AUTH0_CLIENT_ID,
  redirect_uri: window.location.origin,
  scope: "openid profile email",
  extraQueryParams: {
    audience: "https:Auth0-App-2"  // Auth0 specific — remove for Keycloak
  }
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider {...oidcConfig}>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)