import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import React from 'react';

function ProjectDetailPage() {
    const { id } = useParams();
    const auth = useAuth();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [datasets, setDatasets] = useState([]);
    const [patients, setPatients] = useState([]);
    const [activeTab, setActiveTab] = useState('datasets');
    const [newDatasetName, setNewDatasetName] = useState("");
    const [newPatientId, setNewPatientId] = useState("");
    const [expandedPatient, setExpandedPatient] = useState(null);
    const [samplesMap, setSamplesMap] = useState({});
    const [newSampleId, setNewSampleId] = useState("");
    const [members, setMembers] = useState({ members: [], pending_invites: [] });
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteMessage, setInviteMessage] = useState("");

    async function loadProject() {
        const token = auth.user?.access_token;
        const res = await fetch(`http://127.0.0.1:8000/api/projects/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setProject(await res.json());
    }

    async function loadDatasets() {
        const token = auth.user?.access_token;
        const res = await fetch(`http://127.0.0.1:8000/api/projects/${id}/datasets`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setDatasets(await res.json());
    }

    async function loadPatients() {
        const token = auth.user?.access_token;
        const res = await fetch(`http://127.0.0.1:8000/api/projects/${id}/patients`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setPatients(await res.json());
    }

    async function loadSamples(patientId) {
        const token = auth.user?.access_token;
        const res = await fetch(`http://127.0.0.1:8000/api/projects/${id}/patients/${patientId}/samples`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setSamplesMap(prev => ({ ...prev, [patientId]: data }));
    }

    async function loadMembers() {
        const token = auth.user?.access_token;
        const res = await fetch(`http://127.0.0.1:8000/api/projects/${id}/members`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setMembers(await res.json());
    }

    useEffect(() => {
        loadProject();
        loadDatasets();
        loadPatients();
        loadMembers();
    }, [id]);

    async function handleCreateDataset() {
        if (!newDatasetName.trim()) return;
        const token = auth.user?.access_token;
        await fetch(`http://127.0.0.1:8000/api/projects/${id}/datasets?name=${encodeURIComponent(newDatasetName)}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` }
        });
        setNewDatasetName("");
        loadDatasets();
    }

    async function handleCreatePatient() {
        if (!newPatientId.trim()) return;
        const token = auth.user?.access_token;
        await fetch(`http://127.0.0.1:8000/api/projects/${id}/patients?ext_patient_id=${encodeURIComponent(newPatientId)}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` }
        });
        setNewPatientId("");
        loadPatients();
    }

    async function handleCreateSample(patientId) {
        if (!newSampleId.trim()) return;
        const token = auth.user?.access_token;
        await fetch(`http://127.0.0.1:8000/api/projects/${id}/patients/${patientId}/samples?ext_sample_id=${encodeURIComponent(newSampleId)}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` }
        });
        setNewSampleId("");
        loadSamples(patientId);
    }

    async function handleInvite() {
        if (!inviteEmail.trim()) return;
        const token = auth.user?.access_token;
        const res = await fetch(`http://127.0.0.1:8000/api/projects/${id}/invite?email=${encodeURIComponent(inviteEmail)}&role=viewer`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setInviteMessage(data.message || data.detail);
        setInviteEmail("");
        loadMembers();
    }

    function togglePatient(patientId) {
        if (expandedPatient === patientId) {
            setExpandedPatient(null);
        } else {
            setExpandedPatient(patientId);
            loadSamples(patientId);
        }
    }

    if (!project) return <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>;

    const tabClass = (tab) =>
        `px-4 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer ${activeTab === tab
            ? 'border-blue-600 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'
        }`;

    return (
        <Layout>
            <div className="max-w-6xl">
                <button
                    onClick={() => navigate('/projects')}
                    className="text-blue-600 hover:text-blue-700 text-sm mb-6 mt-6 flex items-center gap-1"
                >
                    ← Back to Projects
                </button>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-blue-600 font-semibold text-lg">{project.name}</h2>
                        <p className="text-gray-500 text-sm mt-1">Status: {project.status || 'Pending'}</p>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 px-6">
                        <button className={tabClass('datasets')} onClick={() => setActiveTab('datasets')}>Datasets</button>
                        <button className={tabClass('patients')} onClick={() => setActiveTab('patients')}>Patients</button>
                        <button className={tabClass('members')} onClick={() => setActiveTab('members')}>Members</button>
                    </div>

                    <div className="p-6">
                        {/* Datasets Tab */}
                        {activeTab === 'datasets' && (
                            <div>
                                <table className="w-full mb-6">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 text-sm font-semibold text-gray-700">Name</th>
                                            <th className="text-left py-3 text-sm font-semibold text-gray-700">Site</th>
                                            <th className="text-left py-3 text-sm font-semibold text-gray-700">Created</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {datasets.length === 0 ? (
                                            <tr><td colSpan={3} className="py-8 text-center text-gray-400 text-sm">No datasets yet</td></tr>
                                        ) : (
                                            datasets.map(d => (
                                                <tr key={d.id} className="border-b border-gray-100">
                                                    <td className="py-3 text-sm font-medium text-gray-900">{d.name}</td>
                                                    <td className="py-3 text-sm text-gray-500">{d.site || '—'}</td>
                                                    <td className="py-3 text-sm text-gray-500">{d.created_at ? new Date(d.created_at).toLocaleDateString() : '—'}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                                <div className="flex gap-3">
                                    <input
                                        value={newDatasetName}
                                        onChange={e => setNewDatasetName(e.target.value)}
                                        placeholder="New dataset name"
                                        className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-blue-500"
                                    />
                                    <button onClick={handleCreateDataset} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm font-medium">Add Dataset</button>
                                </div>
                            </div>
                        )}

                        {/* Patients Tab */}
                        {activeTab === 'patients' && (
                            <div>
                                <table className="w-full mb-6">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 text-sm font-semibold text-gray-700">Patient ID</th>
                                            <th className="text-left py-3 text-sm font-semibold text-gray-700">Public ID</th>
                                            <th className="text-left py-3 text-sm font-semibold text-gray-700">Samples</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {patients.length === 0 ? (
                                            <tr><td colSpan={3} className="py-8 text-center text-gray-400 text-sm">No patients yet</td></tr>
                                        ) : (
                                            patients.map(p => (
                                                <React.Fragment key={p.id}>
                                                    <tr key={p.id} className="border-b border-gray-100 cursor-pointer hover:bg-gray-50" onClick={() => togglePatient(p.id)}>
                                                        <td className="py-3 text-sm font-medium text-gray-900">{p.ext_patient_id}</td>
                                                        <td className="py-3 text-sm text-gray-500">{p.public_patient_id || '—'}</td>
                                                        <td className="py-3 text-sm text-gray-500">{expandedPatient === p.id ? '▲ Hide' : '▼ Show'} samples</td>
                                                    </tr>
                                                    {expandedPatient === p.id && (
                                                        <tr key={`samples-${p.id}`}>
                                                            <td colSpan={3} className="bg-gray-50 px-6 py-4">
                                                                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Samples</p>
                                                                {(samplesMap[p.id] || []).length === 0 ? (
                                                                    <p className="text-sm text-gray-400">No samples yet</p>
                                                                ) : (
                                                                    <div className="flex flex-wrap gap-2 mb-3">
                                                                        {(samplesMap[p.id] || []).map(s => (
                                                                            <span key={s.id} className="bg-white border border-gray-200 rounded px-2 py-1 text-xs text-gray-700">{s.ext_sample_id}</span>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                                <div className="flex gap-2">
                                                                    <input
                                                                        value={newSampleId}
                                                                        onChange={e => setNewSampleId(e.target.value)}
                                                                        placeholder="Sample ID"
                                                                        className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-blue-500"
                                                                    />
                                                                    <button onClick={() => handleCreateSample(p.id)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">Add</button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                                <div className="flex gap-3">
                                    <input
                                        value={newPatientId}
                                        onChange={e => setNewPatientId(e.target.value)}
                                        placeholder="Patient ID (e.g. EXT-P001)"
                                        className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-blue-500"
                                    />
                                    <button onClick={handleCreatePatient} className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded text-sm font-medium">Add Patient</button>
                                </div>
                            </div>
                        )}

                        {/* Members Tab */}
                        {activeTab === 'members' && (
                            <div>
                                <table className="w-full mb-6">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 text-sm font-semibold text-gray-700">Email</th>
                                            <th className="text-left py-3 text-sm font-semibold text-gray-700">Role</th>
                                            <th className="text-left py-3 text-sm font-semibold text-gray-700">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {members.members.map(m => (
                                            <tr key={m.user_id} className="border-b border-gray-100">
                                                <td className="py-3 text-sm text-gray-900">{m.email || m.user_id}</td>
                                                <td className="py-3 text-sm text-gray-500 capitalize">{m.role}</td>
                                                <td className="py-3"><span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">Active</span></td>
                                            </tr>
                                        ))}
                                        {members.pending_invites.map(i => (
                                            <tr key={i.email} className="border-b border-gray-100">
                                                <td className="py-3 text-sm text-gray-500">{i.email}</td>
                                                <td className="py-3 text-sm text-gray-500 capitalize">{i.role}</td>
                                                <td className="py-3"><span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full">Pending</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="flex gap-3">
                                    <input
                                        value={inviteEmail}
                                        onChange={e => setInviteEmail(e.target.value)}
                                        placeholder="email@example.com"
                                        className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-blue-500"
                                    />
                                    <button onClick={handleInvite} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm font-medium">Invite</button>
                                </div>
                                {inviteMessage && <p className="text-blue-600 text-sm mt-2">{inviteMessage}</p>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default ProjectDetailPage;