import { useAuth0 } from '@auth0/auth0-react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';
import ProjectDetailPage from './pages/ProjectDetailPage.jsx';
import DatasetsPage from './pages/DatasetsPage.jsx';
import PatientsPage from './pages/PatientsPage.jsx';
import DocsPage from './pages/DocsPage.jsx';

function App() {
  const { isAuthenticated, isLoading } = useAuth0();
  if (isLoading) return <div className="flex items-center justify-center h-screen bg-gray-100 text-gray-500">Loading...</div>;

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/projects" /> : <LoginPage />} />
      <Route path="/projects" element={isAuthenticated ? <ProjectsPage /> : <Navigate to="/" />} />
      <Route path="/projects/:id" element={isAuthenticated ? <ProjectDetailPage /> : <Navigate to="/" />} />
      <Route path="/datasets" element={isAuthenticated ? <DatasetsPage /> : <Navigate to="/" />} />
      <Route path="/patients" element={isAuthenticated ? <PatientsPage /> : <Navigate to="/" />} />
      <Route path="/pages/DatasetsPage" element={isAuthenticated ? <DatasetsPage /> : <Navigate to="/" />} />
      <Route path="/pages/ProjectDetailPage" element={isAuthenticated ? <ProjectDetailPage /> : <Navigate to="/" />} />
      <Route path="/pages/ProjectPage" element={isAuthenticated ? <ProjectsPage /> : <Navigate to="/" />} />
      <Route path="/docs" element={isAuthenticated ? <DocsPage /> : <Navigate to="/" />} />
    </Routes>
  );
}

export default App;