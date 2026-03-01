from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User, Project, ProjectMember, ProjectInvite
from auth import get_current_user

def get_or_create_user(
    payload: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> User:
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Token missing subject")

    email = payload.get("email")
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        existing_by_email = db.query(User).filter(User.email == email).first()
        if existing_by_email:
            return existing_by_email
        user = User(id=user_id, email=email)
        db.add(user)
        db.flush()

        if email:
            pending = db.query(ProjectInvite).filter(ProjectInvite.email == email).all()
            for invite in pending:
                membership = ProjectMember(user_id=user.id, project_id=invite.project_id, role=invite.role)
                db.add(membership)
                db.delete(invite)

    elif not user.email and email:
    # check if another user already has this email
        existing = db.query(User).filter(User.email == email).first()
        if not existing:
            user.email = email
            pending = db.query(ProjectInvite).filter(ProjectInvite.email == email).all()
            for invite in pending:
                already_member = db.query(ProjectMember).filter(
                ProjectMember.project_id == invite.project_id,
                ProjectMember.user_id == user.id
            ).first()
            if not already_member:
                membership = ProjectMember(user_id=user.id, project_id=invite.project_id, role=invite.role)
                db.add(membership)
            db.delete(invite)
        db.commit()

        db.commit()
        db.refresh(user)

    elif not user.email and email:
        user.email = email
        pending = db.query(ProjectInvite).filter(ProjectInvite.email == email).all()
        for invite in pending:
            already_member = db.query(ProjectMember).filter(
                ProjectMember.project_id == invite.project_id,
                ProjectMember.user_id == user.id
            ).first()
            if not already_member:
                membership = ProjectMember(user_id=user.id, project_id=invite.project_id, role=invite.role)
                db.add(membership)
            db.delete(invite)
        db.commit()

    return user

def get_project_for_user(
    project_id: int,
    user: User = Depends(get_or_create_user),
    db: Session = Depends(get_db)
) -> Project:
    membership = db.query(ProjectMember).filter(
        ProjectMember.project_id == project_id,
        ProjectMember.user_id == user.id
    ).first()
    if not membership:
        raise HTTPException(status_code=403, detail="Not a member of this project")
    
    return membership.project