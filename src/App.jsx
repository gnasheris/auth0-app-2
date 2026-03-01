import { useAuth } from 'react-oidc-context';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';
import ProjectDetailPage from './pages/ProjectDetailPage.jsx';
import DatasetsPage from './pages/DatasetsPage.jsx';
import PatientsPage from './pages/PatientsPage.jsx';
import DocsPage from './pages/DocsPage.jsx';

function App() {
  const auth = useAuth();

  console.log("APP AUTH:", auth.isAuthenticated, auth.isLoading);
  if (auth.isLoading) return <div className="flex items-center justify-center h-screen bg-gray-100 text-gray-500">Loading...</div>;

  if (auth.error) return <div className="flex items-center justify-center h-screen bg-gray-100 text-red-500">Error: {auth.error.message}</div>;

  return (
    <Routes>
      <Route path="/" element={auth.isAuthenticated ? <Navigate to="/projects" /> : <LoginPage />} />
      <Route path="/projects" element={auth.isAuthenticated ? <ProjectsPage /> : <Navigate to="/" />} />
      <Route path="/projects/:id" element={auth.isAuthenticated ? <ProjectDetailPage /> : <Navigate to="/" />} />
      <Route path="/datasets" element={auth.isAuthenticated ? <DatasetsPage /> : <Navigate to="/" />} />
      <Route path="/patients" element={auth.isAuthenticated ? <PatientsPage /> : <Navigate to="/" />} />
      <Route path="/docs" element={auth.isAuthenticated ? <DocsPage /> : <Navigate to="/" />} />
    </Routes>
  );
}

export default App;