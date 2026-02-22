# routers/invites.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User, ProjectMember, ProjectInvite
from dependencies import get_or_create_user

router = APIRouter()

def check_admin(user_id: str, project_id: int, db: Session):
    membership = db.query(ProjectMember).filter(
        ProjectMember.project_id == project_id,
        ProjectMember.user_id == user_id,
        ProjectMember.role == "admin"
    ).first()
    if not membership:
        raise HTTPException(status_code=403, detail="Must be project admin to invite users")
    return membership

@router.post("/projects/{project_id}/invite")
def invite_user(project_id: int, email: str, role: str = "viewer", user: User = Depends(get_or_create_user), db: Session = Depends(get_db)):
    check_admin(user.id, project_id, db)

    # check if user already exists
    existing_user = db.query(User).filter(User.email == email).first()

    if existing_user:
        # check if already a member
        already_member = db.query(ProjectMember).filter(
            ProjectMember.project_id == project_id,
            ProjectMember.user_id == existing_user.id
        ).first()
        if already_member:
            raise HTTPException(status_code=400, detail="User is already a member")

        # add them directly
        membership = ProjectMember(user_id=existing_user.id, project_id=project_id, role=role)
        db.add(membership)
        db.commit()
        return {"message": f"{email} added to project"}
    else:
        # create pending invite
        existing_invite = db.query(ProjectInvite).filter(
            ProjectInvite.project_id == project_id,
            ProjectInvite.email == email
        ).first()
        if existing_invite:
            raise HTTPException(status_code=400, detail="Invite already sent to this email")

        invite = ProjectInvite(project_id=project_id, email=email, role=role)
        db.add(invite)
        db.commit()
        return {"message": f"Invite pending for {email} — they'll be added when they sign up"}

@router.get("/projects/{project_id}/members")
def list_members(project_id: int, user: User = Depends(get_or_create_user), db: Session = Depends(get_db)):
    membership = db.query(ProjectMember).filter(
        ProjectMember.project_id == project_id,
        ProjectMember.user_id == user.id
    ).first()
    if not membership:
        raise HTTPException(status_code=403, detail="Not a member of this project")
    
    members = db.query(ProjectMember).filter(ProjectMember.project_id == project_id).all()
    pending = db.query(ProjectInvite).filter(ProjectInvite.project_id == project_id).all()
    
    return {
        "members": [{"user_id": m.user_id, "email": m.user.email, "role": m.role} for m in members],
        "pending_invites": [{"email": i.email, "role": i.role} for i in pending]
    }