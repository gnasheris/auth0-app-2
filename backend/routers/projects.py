# routers/projects.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User, Project, ProjectMember, ProjectInvite
from dependencies import get_or_create_user

router = APIRouter()

@router.get("/projects")
def list_projects(user: User = Depends(get_or_create_user), db: Session = Depends(get_db)):
    memberships = db.query(ProjectMember).filter(ProjectMember.user_id == user.id).all()
    return [m.project for m in memberships]

@router.post("/projects")
def create_project(name: str, status: str = "Pending", user: User = Depends(get_or_create_user), db: Session = Depends(get_db)):
    project = Project(name=name, status=status)
    db.add(project)
    db.flush()  # get the project ID before committing

    # automatically make creator an admin
    membership = ProjectMember(user_id=user.id, project_id=project.id, role="admin")
    db.add(membership)
    db.commit()
    db.refresh(project)
    return project

@router.get("/projects/{project_id}")
def get_project(project_id: int, user: User = Depends(get_or_create_user), db: Session = Depends(get_db)):
    membership = db.query(ProjectMember).filter(
        ProjectMember.project_id == project_id,
        ProjectMember.user_id == user.id
    ).first()
    if not membership:
        raise HTTPException(status_code=403, detail="Not a member of this project")
    return membership.project

@router.delete("/projects/{project_id}")
def delete_project(project_id: int, user: User = Depends(get_or_create_user), db: Session = Depends(get_db)):
    membership = db.query(ProjectMember).filter(
        ProjectMember.project_id == project_id,
        ProjectMember.user_id == user.id,
        ProjectMember.role == "admin"
    ).first()
    if not membership:
        raise HTTPException(staxtus_code=403, detail="Must be admin to delete project")
    
    # delete invites first to avoid foreign key violation
    db.query(ProjectInvite).filter(ProjectInvite.project_id == project_id).delete()
    
    project = db.query(Project).filter(Project.id == project_id).first()
    db.delete(project)
    db.commit()
    return {"message": "Project deleted"}