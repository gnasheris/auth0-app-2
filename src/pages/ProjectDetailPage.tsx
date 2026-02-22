import { useParams, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';

function ProjectDetailPage() {
    const { id } = useParams();
    const { getAccessTokenSilently } = useAuth0();
    const navigate = useNavigate();
    const [project, setProject] = useState<any>(null);
    const [datasets, setDatasets] = useState<any[]>([]);
    const [patients, setPatients] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'datasets' | 'patients'>('datasets');
    const [newDatasetName, setNewDatasetName] = useState("");
    const [newPatientId, setNewPatientId] = useState("");

    async function getToken() {
        return await getAccessTokenSilently();
    }

    async function loadProject() {
        const token = await getToken();
        const res = await fetch(`http://127.0.0.1:8000/api/projects/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setProject(await res.json());
    }

    async function loadDatasets() {
        const token = await getToken();
        const res = await fetch(`http://127.0.0.1:8000/api/projects/${id}/datasets`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setDatasets(await res.json());
    }

    async function loadPatients() {
        const token = await getToken();
        const res = await fetch(`http://127.0.0.1:8000/api/projects/${id}/patients`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setPatients(await res.json());
    }

    useEffect(() => {
        loadProject();
        loadDatasets();
        loadPatients();
    }, [id]);

    async function handleCreateDataset() {
        if (!newDatasetName.trim()) return;
        const token = await getToken();
        await fetch(`http://127.0.0.1:8000/api/projects/${id}/datasets?name=${encodeURIComponent(newDatasetName)}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` }
        });
        setNewDatasetName("");
        loadDatasets();
    }

    async function handleCreatePatient() {
        if (!newPatientId.trim()) return;
        const token = await getToken();
        await fetch(`http://127.0.0.1:8000/api/projects/${id}/patients?ext_patient_id=${encodeURIComponent(newPatientId)}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` }
        });
        setNewPatientId("");
        loadPatients();
    }

    if (!project) return <div className="loading-text">Loading...</div>;

    return (
        <div className="app-container">
            <div className="main-card-wrapper">
                <button onClick={() => navigate('/projects')} style={{ marginBottom: '1rem' }}>← Back</button>
                <h1>{project.name}</h1>
                <p style={{ color: '#a0aec0' }}>Status: {project.status}</p>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid #2d3748' }}>
                    <button
                        onClick={() => setActiveTab('datasets')}
                        style={{ padding: '0.5rem 1rem', background: 'none', border: 'none', color: activeTab === 'datasets' ? '#63b3ed' : '#a0aec0', borderBottom: activeTab === 'datasets' ? '2px solid #63b3ed' : 'none', cursor: 'pointer' }}
                    >
                        Datasets
                    </button>
                    <button
                        onClick={() => setActiveTab('patients')}
                        style={{ padding: '0.5rem 1rem', background: 'none', border: 'none', color: activeTab === 'patients' ? '#63b3ed' : '#a0aec0', borderBottom: activeTab === 'patients' ? '2px solid #63b3ed' : 'none', cursor: 'pointer' }}
                    >
                        Patients
                    </button>
                </div>

                {/* Datasets Tab */}
                {activeTab === 'datasets' && (
                    <div>
                        {datasets.length === 0 ? (
                            <p style={{ color: '#a0aec0' }}>No datasets yet</p>
                        ) : (
                            <ul>
                                {datasets.map((d: any) => (
                                    <li key={d.id}>
                                        <strong>{d.name}</strong>
                                        {d.site && <span style={{ color: '#a0aec0', marginLeft: '0.5rem' }}>{d.site}</span>}
                                    </li>
                                ))}
                            </ul>
                        )}
                        <input value={newDatasetName} onChange={e => setNewDatasetName(e.target.value)} placeholder="New dataset name" />
                        <button onClick={handleCreateDataset}>Add Dataset</button>
                    </div>
                )}

                {/* Patients Tab */}
                {activeTab === 'patients' && (
                    <div>
                        {patients.length === 0 ? (
                            <p style={{ color: '#a0aec0' }}>No patients yet</p>
                        ) : (
                            <ul>
                                {patients.map((p: any) => (
                                    <li key={p.id}>
                                        <strong>{p.ext_patient_id}</strong>
                                        {p.public_patient_id && <span style={{ color: '#a0aec0', marginLeft: '0.5rem' }}>({p.public_patient_id})</span>}
                                    </li>
                                ))}
                            </ul>
                        )}
                        <input value={newPatientId} onChange={e => setNewPatientId(e.target.value)} placeholder="Patient ID (e.g. EXT-P001)" />
                        <button onClick={handleCreatePatient}>Add Patient</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProjectDetailPage;