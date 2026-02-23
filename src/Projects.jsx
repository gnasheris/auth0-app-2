import { useAuth } from "react-oidc-context";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects, createProject } from "./api.js";
import { useDarkMode } from './components/Layout.jsx';

function Projects() {
    const auth = useAuth();
    const [projects, setProjects] = useState([]);
    const [newName, setNewName] = useState("");
    const [creating, setCreating] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();
    const darkMode = useDarkMode();

    useEffect(() => {
        async function load() {
            const token = auth.user?.access_token;
            const data = await getProjects(token);
            setProjects(data);
        }
        load();
    }, []);

    async function handleCreate() {
        if (!newName.trim()) return;
        setCreating(true);
        const token = auth.user?.access_token;
        await createProject(token, newName);
        setNewName("");
        setShowForm(false);
        const data = await getProjects(token);
        setProjects(data);
        setCreating(false);
    }

    async function handleDeleteProject(projectId) {
        if (!confirm('Are you sure you want to delete this project?')) return;
        const token = auth.user?.access_token;
        await fetch(`http://127.0.0.1:8000/api/projects/${projectId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await getProjects(token);
        setProjects(data);
    }

    async function handleDeleteDataset(datasetId) {
        if (!confirm('Delete this dataset?')) return;
        const token = await getToken();
        await fetch(`http://127.0.0.1:8000/api/projects/${id}/datasets/${datasetId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        loadDatasets();
    }

    async function handleDeletePatient(patientId) {
        if (!confirm('Delete this patient and all their samples?')) return;
        const token = await getToken();
        await fetch(`http://127.0.0.1:8000/api/projects/${id}/patients/${patientId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        loadPatients();
    }

    async function handleDeleteSample(patientId, sampleId) {
        if (!confirm('Delete this sample?')) return;
        const token = await getToken();
        await fetch(`http://127.0.0.1:8000/api/projects/${id}/patients/${patientId}/samples/${sampleId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        loadSamples(patientId);
    }

    async function handleDeleteProject(projectId) {
        if (!confirm('Are you sure you want to delete this project?')) return;
        const token = auth.user?.access_token;
        const res = await fetch(`http://127.0.0.1:8000/api/projects/${projectId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.status === 403) {
            alert('You must be the project admin to delete it.');
            return;
        }
        const data = await getProjects(token);
        setProjects(data);
    }

    return (
        <div>
            <div className={`rounded-lg shadow-sm border overflow-hidden ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className={`flex items-center justify-between px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h2 className="text-blue-600 font-semibold text-lg">Projects</h2>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm font-medium transition-colors"
                    >
                        + New Project
                    </button>
                </div>

                {showForm && (
                    <div className={`px-6 py-4 border-b flex gap-3 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                        <input
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                            placeholder="Project name"
                            className={`flex-1 border rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 text-gray-900'}`}
                            onKeyDown={e => e.key === 'Enter' && handleCreate()}
                            autoFocus
                        />
                        <button onClick={handleCreate} disabled={creating} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm font-medium disabled:opacity-50">
                            {creating ? 'Creating...' : 'Create'}
                        </button>
                        <button onClick={() => setShowForm(false)} className={`px-3 py-1.5 rounded text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}>
                            Cancel
                        </button>
                    </div>
                )}

                <table className="w-full">
                    <thead>
                        <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <th className={`text-left px-6 py-3 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Project ID</th>
                            <th className={`text-left px-6 py-3 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Name</th>
                            <th className={`text-left px-6 py-3 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</th>
                            <th className={`text-center px-6 py-3 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>View Summary</th>
                            <th className={`text-center px-6 py-3 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>View Datasets</th>
                            <th className={`text-center px-6 py-3 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>View Patients</th>
                            <th className={`text-center px-6 py-3 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.length === 0 ? (
                            <tr>
                                <td colSpan={7} className={`text-center py-12 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                    No projects yet — create your first project above
                                </td>
                            </tr>
                        ) : (
                            projects.map((p) => (
                                <tr key={p.id} className={`border-b ${darkMode ? 'border-gray-800 hover:bg-gray-800' : 'border-gray-100 hover:bg-gray-50'}`}>
                                    <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{p.id}</td>
                                    <td className={`px-6 py-4 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{p.name}</td>
                                    <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{p.status || 'Pending'}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button onClick={() => navigate(`/projects/${p.id}`)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors">
                                            View Summary
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button onClick={() => navigate(`/projects/${p.id}?tab=datasets`)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors">
                                            View Datasets
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button onClick={() => navigate(`/projects/${p.id}?tab=patients`)} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors">
                                            View Patients
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDeleteProject(p.id); }}
                                            className="text-red-500 hover:text-red-700 text-xs font-medium"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                <div className={`flex items-center justify-end px-6 py-3 border-t text-sm ${darkMode ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'}`}>
                    <span>{projects.length} project{projects.length !== 1 ? 's' : ''}</span>
                </div>
            </div>
        </div>
    );
}

export default Projects;