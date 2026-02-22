# routers/datasets.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User, Dataset, ProjectMember
from dependencies import get_or_create_user

router = APIRouter()

def check_membership(user_id: str, project_id: int, db: Session):
    membership = db.query(ProjectMember).filter(
        ProjectMember.project_id == project_id,
        ProjectMember.user_id == user_id
    ).first()
    if not membership:
        raise HTTPException(status_code=403, detail="Not a member of this project")
    return membership

@router.get("/projects/{project_id}/datasets")
def list_datasets(project_id: int, user: User = Depends(get_or_create_user), db: Session = Depends(get_db)):
    check_membership(user.id, project_id, db)
    return db.query(Dataset).filter(Dataset.project_id == project_id).all()

@router.post("/projects/{project_id}/datasets")
def create_dataset(project_id: int, name: str, site: str = "", abstract: str = "", user: User = Depends(get_or_create_user), db: Session = Depends(get_db)):
    check_membership(user.id, project_id, db)
    dataset = Dataset(project_id=project_id, name=name, site=site, abstract=abstract)
    db.add(dataset)
    db.commit()
    db.refresh(dataset)
    return dataset

@router.delete("/projects/{project_id}/datasets/{dataset_id}")
def delete_dataset(project_id: int, dataset_id: int, user: User = Depends(get_or_create_user), db: Session = Depends(get_db)):
    check_membership(user.id, project_id, db)
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id, Dataset.project_id == project_id).first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    db.delete(dataset)
    db.commit()
    return {"message": "Dataset deleted"}

@router.get("/datasets")
def list_all_datasets(user: User = Depends(get_or_create_user), db: Session = Depends(get_db)):
    memberships = db.query(ProjectMember).filter(ProjectMember.user_id == user.id).all()
    project_ids = [m.project_id for m in memberships]
    datasets = db.query(Dataset).filter(Dataset.project_id.in_(project_ids)).all()
    return datasets