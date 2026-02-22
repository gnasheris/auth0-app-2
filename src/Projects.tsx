import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects, createProject } from "./api";

function Projects() {
    const { getAccessTokenSilently } = useAuth0();
    const [projects, setProjects] = useState([]);
    const [newName, setNewName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        async function load() {
            const token = await getAccessTokenSilently();
            const data = await getProjects(token);
            setProjects(data);
        }
        load();
    }, []);

    async function handleCreate() {
        if (!newName.trim()) return;
        const token = await getAccessTokenSilently();
        await createProject(token, newName);
        setNewName("");
        const data = await getProjects(token);
        setProjects(data);
    }

    return (
        <div>
            <h2>Your Projects</h2>
            <ul>
                {projects.map((p: any) => (
                    <li key={p.id} onClick={() => navigate(`/projects/${p.id}`)} style={{ cursor: 'pointer' }}>
                        {p.name} <span style={{ color: '#a0aec0', fontSize: '0.85rem' }}>{p.status}</span>
                    </li>
                ))}
            </ul>
            <input
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="New project name"
            />
            <button onClick={handleCreate}>Create</button>
        </div>
    );
}

export default Projects;