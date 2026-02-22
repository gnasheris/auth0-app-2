// import { useAuth0 } from '@auth0/auth0-react';
// import LoginButton from './LoginButton';
// import LogoutButton from './LogoutButton';
// import Profile from './Profile';
// import Projects from './Projects';

// function App() {
//   const { isLoading, error, isAuthenticated } = useAuth0();
//   if (isLoading) {
//     return (
//       <div className="app-container">
//         <div className="loading-state">
//           <div className="loading-text">Loading...</div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="app-container">
//         <div className="error-state">
//           <div className="error-title">Oops!</div>
//           <div className="error-message">Something went wrong</div>
//           <div className="error-sub-message">{error.message}</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="app-container">
//       <div className="main-card-wrapper">
//         <img
//           src="https://cdn.auth0.com/quantum-assets/dist/latest/logos/auth0/auth0-lockup-en-ondark.png"
//           alt="Auth0 Logo"
//           className="auth0-logo"
//           onError={(e) => {
//             e.currentTarget.style.display = 'none';
//           }}
//         />
//         <h1 className="main-title">Welcome to Sample0</h1>

//         {isAuthenticated ? (
//           <div className="logged-in-section">
//             <div className="logged-in-message">✅ Successfully authenticated!</div>
//             <h2 className="profile-section-title">Your Profile</h2>
//             <div className="profile-card">
//               <Profile />
//             </div>
//             <LogoutButton />
//             <Projects />
//           </div>
//         ) : (
//           <div className="action-card">
//             <p className="action-text">Get started by signing in to your account</p>
//             <LoginButton />
//           </div>
//         )}
//       </div>
//     </div>

//   );
// }

// export default App;

import { useAuth0 } from '@auth0/auth0-react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';

function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <div className="loading-text">Loading...</div>;

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/projects" /> : <LoginPage />} />
      <Route path="/projects" element={isAuthenticated ? <ProjectsPage /> : <Navigate to="/" />} />
      <Route path="/projects/:id" element={isAuthenticated ? <ProjectDetailPage /> : <Navigate to="/" />} />
    </Routes>
  );
}

export default App;