# Auth0 App Research Data Registry

I developed a full-stack data-registry clone in order to understand authentication flow for Auth0 and OIDC compliancy. By using the OIDC library, the app promotes extensibility to other open source software such as Keycloak. The app mimics [WEHI's Data Registry](https://data-registry.wehi-rcp.cloud.edu.au/patients). 

The aim of my internship was to successfully get to Step 5 of this diagram, with each step being cruical to my understanding of authentication and authorization with OIDC.

<img width="3716" height="3246" alt="WEHI - Page 1 Frame 1 (1)" src="https://github.com/user-attachments/assets/c01224d5-05b5-43e7-9d8a-0c6435171def" />


### What is OIDC?
OpenID Connect (OIDC) is an open-standard authentication protocol built on top of the OAuth2 framework. It enables Single Sign-On (SSO) by ensuring secure, JSON-based Identity Tokens (JWTs), allowing users to securely log in across multiple apps without creating new passwords. 

### What is Auth0?
In this context, Auth0 was used as an Identity Provider to implement OIDC. It was always planned that the app would later prove extensibility with Keycloak. 

### What is Keycloak?
In this project, Keycloak plays the role of the self-hosted identity provider, an institutional alternative to Auth0. Running Keycloak on the actual Data Registry using OIDC, was the final goal of the project. 

To see my implementation of Auth0 and Keycloak using OIDC on WEHI RCP's Data Registry, checkout:

- [REDMANE Docker](https://github.com/gnasheris/REDMANE_Docker) - containerised deployment environment
- [REDMANE FastAPI](https://github.com/gnasheris/REDMANE_fastapi) - backend with token validation and protected APIs
- [REDMANE React](https://github.com/gnasheris/REDMANE_react.js) - frontend authentication flow

---

## Features

- Project, dataset, patient, and sample management
- Role-based access control and project invitations (Auth0)
- OIDC-compliant authentication — works with Auth0, Keycloak, Google, or any standard identity provider
- Dark mode
- Docker-ready for local development

---

## Quick Start (with shared demo Auth0)

The fastest way to get running. Uses a shared Auth0 tenant — no setup required.

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) (v3.11+)

### 1. Clone the repo
```bash
git clone https://github.com/gnasheris/auth0-app-2.git
cd auth0-app-2
```

### 2. Start the database
```bash
docker run --name redmane-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=mydb -p 5432:5432 -d postgres
```

If you see a "container name already in use" error, the container already exists — just start it:
```bash
docker start redmane-db
```

To verify it's running:
```bash
docker ps | grep redmane-db
```

### 3. Set up the backend

Create `backend/.env`:
```bash
DATABASE_URL=postgresql://postgres:password@localhost:5432/mydb
AUTH0_DOMAIN=dev-6mdq3tdvjb04tojd.us.auth0.com
AUTH0_AUDIENCE=https:Auth0-App-2
```

Then run:
```bash
cd backend
pip install -r requirements.txt
pip install python-dotenv
python -c "from database import engine; from models import Base; Base.metadata.create_all(engine)"
uvicorn main:app --reload
```
### Backend commands (macOS with Anaconda)

If you have Anaconda installed, use the full Python path to avoid conflicts:
```bash
/Users/YOUR_USERNAME/anaconda3/bin/pip install -r requirements.txt
/Users/YOUR_USERNAME/anaconda3/bin/pip install python-dotenv
/Users/YOUR_USERNAME/anaconda3/bin/python -c "from database import engine; from models import Base; Base.metadata.create_all(engine)"
/Users/YOUR_USERNAME/anaconda3/bin/python -m uvicorn main:app --reload
```
Debugging Statements
```bash
pkill -f uvicorn
lsof -ti :8000 | xargs kill -9
```

Or if you're using a virtual environment:
```bash
source .venv/bin/activate
pip install -r requirements.txt
python -c "from database import engine; from models import Base; Base.metadata.create_all(engine)"
uvicorn main:app --reload
```

### 4. Set up the frontend

Create `.env` in the root:
```bash
VITE_AUTH0_DOMAIN=dev-6mdq3tdvjb04tojd.us.auth0.com
VITE_AUTH0_CLIENT_ID=z35wTXmPfwhzVMlspC2dSVgIuGTIKrez
```

Then run:
```bash
npm install
npm run dev
```
If Vite crashes:
```bash
rm -rf node_modules
rm -rf node_modules/.vite
rm package-lock.json
npm install
npm run dev
```

### 5. Open the app

Go to http://localhost:5173 and sign in.

> **Note:** The credentials above are shared demo credentials for evaluation purposes. Auth0 setup is entirely optional — see below to bring your own identity provider.

---

## Production Setup (Bring Your Own Auth Provider)

REDMANE is built on standard OIDC. Swapping providers requires only environment variable changes — no code changes.

### Option A — Your own Auth0

1. Create a free account at [auth0.com](https://auth0.com)
2. Create a Single Page Application
3. Set Allowed Callback URLs, Logout URLs, and Web Origins to your app URL
4. Create an API with an identifier
5. Update your `.env` files with your domain, client ID, and audience

### Option B — Keycloak (recommended for institutions)

Keycloak is self-hosted and open-source.

#### Switch Branches
```bash
git checkout keycloak
```

#### Run Keycloak
```bash
docker run -p 8080:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:latest start-dev
```

#### Configure Keycloak

1. Go to http://localhost:8080, log in as `admin`
2. Create a new Realm (e.g. `research-registry`)
3. Create a Client with Standard flow enabled, redirect URI `http://localhost:5173/*`, web origin `http://localhost:5173`
4. Create a user under Users → Add user → set password under Credentials

#### Update configuration

Backend `.env`:
```bash
AUTH0_DOMAIN=localhost:8080/realms/research-registry
AUTH0_AUDIENCE=account
```

Frontend `main.jsx`:
```javascript
const oidcConfig = {
  authority: "http://localhost:8080/realms/research-registry",
  client_id: "research-app",
  redirect_uri: window.location.origin,
  scope: "openid profile email",
};
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS, react-oidc-context |
| Backend | FastAPI, SQLAlchemy, Python-Jose |
| Database | PostgreSQL |
| Auth | OIDC (Auth0 / Keycloak) |
| Containerisation | Docker |
