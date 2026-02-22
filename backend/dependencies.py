# dependencies.py
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User, Project, ProjectMember
from auth import get_current_user

def get_or_create_user(
    payload: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> User:
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Token missing subject")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        user = User(id=user_id, email=payload.get("email"))
        db.add(user)
        db.commit()
        db.refresh(user)

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