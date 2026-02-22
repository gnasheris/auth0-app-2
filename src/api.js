const API_URL = "http://127.0.0.1:8000";

export async function getProjects(token) {
    const res = await fetch(`${API_URL}/api/projects`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
}

export async function createProject(token, name) {
    const res = await fetch(`${API_URL}/api/projects?name=${encodeURIComponent(name)}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
}