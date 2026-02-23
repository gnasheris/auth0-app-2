import { useAuth } from 'react-oidc-context';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.jsx';

function PatientsPage() {
    const auth = useAuth();
    const [patients, setPatients] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function load() {
            const token = auth.user?.access_token;
            const res = await fetch('http://127.0.0.1:8000/api/patients', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPatients(await res.json());
        }
        load();
    }, []);

    return (
        <Layout>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-blue-600 font-semibold text-lg">Patients</h2>
                </div>
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Patient ID</th>
                            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Project ID</th>
                            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">External Patient ID</th>
                            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">External Patient URL</th>
                            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Public Patient ID</th>
                            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Sample Count</th>
                            <th className="text-center px-6 py-3 text-sm font-semibold text-gray-700">View Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.length === 0 ? (
                            <tr><td colSpan={7} className="text-center py-12 text-gray-400 text-sm">No patients yet</td></tr>
                        ) : (
                            patients.map(p => (
                                <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-600">{p.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{p.project_id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{p.ext_patient_id || '—'}</td>
                                    <td className="px-6 py-4 text-sm text-blue-500">
                                        {p.ext_patient_url ? (
                                            <a href={p.ext_patient_url} target="_blank" rel="noreferrer" className="hover:underline truncate block max-w-xs">{p.ext_patient_url}</a>
                                        ) : '—'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{p.public_patient_id || '—'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{p.sample_count}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => navigate(`/projects/${p.project_id}?tab=patients`)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium uppercase"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <div className="flex items-center justify-end px-6 py-3 border-t border-gray-200 text-sm text-gray-500">
                    <span>{patients.length} patient{patients.length !== 1 ? 's' : ''}</span>
                </div>
            </div>
        </Layout>
    );
}

export default PatientsPage;