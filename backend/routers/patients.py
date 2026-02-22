# routers/patients.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User, Patient, Sample, ProjectMember
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

@router.get("/projects/{project_id}/patients")
def list_patients(project_id: int, user: User = Depends(get_or_create_user), db: Session = Depends(get_db)):
    check_membership(user.id, project_id, db)
    return db.query(Patient).filter(Patient.project_id == project_id).all()

@router.post("/projects/{project_id}/patients")
def create_patient(project_id: int, ext_patient_id: str, public_patient_id: str = "", ext_patient_url: str = "", user: User = Depends(get_or_create_user), db: Session = Depends(get_db)):
    check_membership(user.id, project_id, db)
    patient = Patient(project_id=project_id, ext_patient_id=ext_patient_id, public_patient_id=public_patient_id, ext_patient_url=ext_patient_url)
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient

@router.get("/projects/{project_id}/patients/{patient_id}/samples")
def list_samples(project_id: int, patient_id: int, user: User = Depends(get_or_create_user), db: Session = Depends(get_db)):
    check_membership(user.id, project_id, db)
    return db.query(Sample).filter(Sample.patient_id == patient_id).all()

@router.post("/projects/{project_id}/patients/{patient_id}/samples")
def create_sample(project_id: int, patient_id: int, ext_sample_id: str, ext_sample_url: str = "", user: User = Depends(get_or_create_user), db: Session = Depends(get_db)):
    check_membership(user.id, project_id, db)
    sample = Sample(patient_id=patient_id, ext_sample_id=ext_sample_id, ext_sample_url=ext_sample_url)
    db.add(sample)
    db.commit()
    db.refresh(sample)
    return sample