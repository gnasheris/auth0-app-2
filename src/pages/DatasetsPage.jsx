import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.jsx';

function DatasetsPage() {
    const { getAccessTokenSilently } = useAuth0();
    const [datasets, setDatasets] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function load() {
            const token = await getAccessTokenSilently();
            const res = await fetch('http://127.0.0.1:8000/api/datasets', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDatasets(await res.json());
        }
        load();
    }, []);

    return (
        <Layout>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-blue-600 font-semibold text-lg">All Datasets</h2>
                </div>
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Dataset ID</th>
                            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Name</th>
                            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Site</th>
                            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Created At</th>
                            <th className="text-center px-6 py-3 text-sm font-semibold text-gray-700">View Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datasets.length === 0 ? (
                            <tr><td colSpan={5} className="text-center py-12 text-gray-400 text-sm">No datasets yet</td></tr>
                        ) : (
                            datasets.map((d, i) => (
                                <tr key={d.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-600">P{d.project_id}-{String(i + 1).padStart(3, '0')}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{d.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{d.site || '—'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{d.created_at ? new Date(d.created_at).toISOString().split('T')[0] : '—'}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => navigate(`/projects/${d.project_id}?tab=datasets`)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium"
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
                    <span>{datasets.length} dataset{datasets.length !== 1 ? 's' : ''}</span>
                </div>
            </div>
        </Layout>
    );
}

export default DatasetsPage;