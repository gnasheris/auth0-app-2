import { useAuth0 } from '@auth0/auth0-react';
import Profile from '../Profile';
import LogoutButton from '../LogoutButton';
import Projects from '../Projects';

function ProjectsPage() {
    return (
        <div className="app-container">
            <div className="main-card-wrapper">
                <div className="logged-in-section">
                    <Profile />
                    <Projects />
                    <LogoutButton />
                </div>
            </div>
        </div>
    );
}

export default ProjectsPage;