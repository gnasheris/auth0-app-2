# models.py
import uuid
from sqlalchemy import Column, String, ForeignKey, DateTime, Text, Integer, Enum, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True)  # Auth0 sub
    email = Column(String, unique=True, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    memberships = relationship("ProjectMember", back_populates="user")


class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    status = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    members = relationship("ProjectMember", back_populates="project", cascade="all, delete")
    datasets = relationship("Dataset", back_populates="project", cascade="all, delete")
    patients = relationship("Patient", back_populates="project", cascade="all, delete")


class ProjectMember(Base):
    __tablename__ = "project_members"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    role = Column(String, default="viewer")  # admin, collaborator, viewer

    user = relationship("User", back_populates="memberships")
    project = relationship("Project", back_populates="members")


class Dataset(Base):
    __tablename__ = "datasets"
    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    name = Column(String, nullable=False)
    abstract = Column(Text, nullable=True)
    site = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    project = relationship("Project", back_populates="datasets")
    metadata_ = relationship("DatasetMetadata", back_populates="dataset", cascade="all, delete")
    files = relationship("File", back_populates="dataset", cascade="all, delete")


class DatasetMetadata(Base):
    __tablename__ = "datasets_metadata"
    id = Column(Integer, primary_key=True, autoincrement=True)
    dataset_id = Column(Integer, ForeignKey("datasets.id"), nullable=False)
    key = Column(String)
    value = Column(String)

    dataset = relationship("Dataset", back_populates="metadata_")


class File(Base):
    __tablename__ = "files"
    id = Column(Integer, primary_key=True, autoincrement=True)
    dataset_id = Column(Integer, ForeignKey("datasets.id"), nullable=False)
    path = Column(String)
    file_type = Column(String)

    dataset = relationship("Dataset", back_populates="files")
    metadata_ = relationship("FileMetadata", back_populates="file", cascade="all, delete")


class FileMetadata(Base):
    __tablename__ = "files_metadata"
    metadata_id = Column(Integer, primary_key=True, autoincrement=True)
    file_id = Column(Integer, ForeignKey("files.id"), nullable=False)
    metadata_key = Column(String, nullable=False)
    metadata_value = Column(String, nullable=False)

    file = relationship("File", back_populates="metadata_")


class Patient(Base):
    __tablename__ = "patients"
    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    ext_patient_id = Column(String)
    ext_patient_url = Column(String)
    public_patient_id = Column(String)

    project = relationship("Project", back_populates="patients")
    metadata_ = relationship("PatientMetadata", back_populates="patient", cascade="all, delete")
    samples = relationship("Sample", back_populates="patient", cascade="all, delete")


class PatientMetadata(Base):
    __tablename__ = "patients_metadata"
    id = Column(Integer, primary_key=True, autoincrement=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    key = Column(String)
    value = Column(String)

    patient = relationship("Patient", back_populates="metadata_")


class Sample(Base):
    __tablename__ = "samples"
    id = Column(Integer, primary_key=True, autoincrement=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    ext_sample_id = Column(String)
    ext_sample_url = Column(String)

    patient = relationship("Patient", back_populates="samples")
    metadata_ = relationship("SampleMetadata", back_populates="sample", cascade="all, delete")


class SampleMetadata(Base):
    __tablename__ = "samples_metadata"
    id = Column(Integer, primary_key=True, autoincrement=True)
    sample_id = Column(Integer, ForeignKey("samples.id"), nullable=False)
    key = Column(String)
    value = Column(String)

    sample = relationship("Sample", back_populates="metadata_")

class ProjectInvite(Base):
    __tablename__ = "project_invites"
    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    email = Column(String, nullable=False)
    role = Column(String, default="viewer")
    created_at = Column(DateTime, server_default=func.now())

    project = relationship("Project")