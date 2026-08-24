import sys
from pathlib import Path

# Add parent directory to path so script can be run standalone
sys.path.append(str(Path(__file__).resolve().parents[2]))

from app.core.database import SessionLocal, engine, Base
from app.models.project import MP, Project
from app.models.entity import Contractor, Agency
from app.models.network import EntityRelationship
from app.models.historical_case import HistoricalCase


def seed_db():
    print("Initializing Database Schema...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        print("Seeding MPs...")
        mps = [
            MP(id="MP001", name="Rajesh Sharma", constituency="Varanasi", state="Uttar Pradesh", party="Party A"),
            MP(id="MP002", name="Anita Roy", constituency="Kolkata South", state="West Bengal", party="Party B"),
            MP(id="MP003", name="Suresh Patel", constituency="Ahmedabad East", state="Gujarat", party="Party C"),
        ]
        db.add_all(mps)

        print("Seeding Contractors...")
        contractors = [
            Contractor(
                id="CNT101",
                name="Apex Infra Corp",
                pan="AAACA1234A",
                gstin="09AAACA1234A1Z1",
                registered_address="Plot 42, Civil Lines, Varanasi",
                registration_date="2019-03-15",
                status="Active"
            ),
            Contractor(
                id="CNT102",
                name="Zenith Infrastructure",
                pan="AAACA1234A",  # SUSPICIOUS: Identical PAN (Shared identity signal)
                gstin="09AAACA1234A1Z2",
                registered_address="Plot 42, Civil Lines, Varanasi",  # SUSPICIOUS: Identical address
                registration_date="2021-06-10",
                status="Active"
            ),
            Contractor(
                id="CNT103",
                name="Green Earth Eco Solutions",
                pan="BBBBC5678B",
                gstin="19BBBBC5678B1Z5",
                registered_address="12 Park Street, Kolkata",
                registration_date="2017-01-20",
                status="Active"
            ),
            Contractor(
                id="CNT104",
                name="Rural Development Works Pvt Ltd",
                pan="CCCC9999C",
                gstin="24CCCC9999C1Z9",
                registered_address="SG Highway, Ahmedabad",
                registration_date="2018-09-01",
                status="Active"
            ),
        ]
        db.add_all(contractors)

        print("Seeding Agencies...")
        agencies = [
            Agency(id="AGY201", name="Public Works Department (PWD)", department="Infrastructure", district="Varanasi", state="Uttar Pradesh"),
            Agency(id="AGY202", name="Kolkata Municipal Corporation", department="Urban Development", district="Kolkata", state="West Bengal"),
            Agency(id="AGY203", name="District Rural Development Agency (DRDA)", department="Rural Development", district="Ahmedabad", state="Gujarat"),
        ]
        db.add_all(agencies)

        print("Seeding Projects...")
        projects = [
            # P1021: Primary Suspicious Project
            Project(
                id="P1021",
                title="Construction of Community Hall & Digital Learning Centre",
                category="Education",
                cost_sanctioned=45.0,  # ₹45 Lakhs (Significantly higher than peer mean of ₹28 Lakhs)
                cost_spent=44.8,
                mp_id="MP001",
                district="Varanasi",
                state="Uttar Pradesh",
                sanction_date="2023-01-15",
                completion_date="2023-08-30",
                status="Completed",
                contractor_id="CNT101",
                agency_id="AGY201",
                description="Integrated digital learning space and multipurpose community hall."
            ),
            # P1022: Related Suspicious Project awarded to linked entity CNT102
            Project(
                id="P1022",
                title="Installation of Solar Street Lights in Ward 12-18",
                category="Sanitation & Energy",
                cost_sanctioned=38.0,
                cost_spent=37.9,
                mp_id="MP001",
                district="Varanasi",
                state="Uttar Pradesh",
                sanction_date="2023-02-10",
                completion_date="2023-09-15",
                status="Completed",
                contractor_id="CNT102",
                agency_id="AGY201",
                description="Solar street lighting setup."
            ),
            # P1023: Legitimate Peer Project 1
            Project(
                id="P1023",
                title="Rural Drinking Water Pipeline Extension",
                category="Water Supply",
                cost_sanctioned=28.5,
                cost_spent=27.0,
                mp_id="MP001",
                district="Varanasi",
                state="Uttar Pradesh",
                sanction_date="2023-03-01",
                completion_date="2023-07-20",
                status="Completed",
                contractor_id="CNT104",
                agency_id="AGY201",
                description="Pipeline work for drinking water access."
            ),
            # P1024: Legitimate Case with Counter-Evidence
            Project(
                id="P1024",
                title="Primary Health Centre Upgradation & Advanced ICU Equipment",
                category="Healthcare",
                cost_sanctioned=52.0,  # High cost, but counter-evidence (specialized medical import) explains deviation
                cost_spent=51.5,
                mp_id="MP002",
                district="Kolkata",
                state="West Bengal",
                sanction_date="2023-04-12",
                completion_date="2023-11-05",
                status="Completed",
                contractor_id="CNT103",
                agency_id="AGY202",
                description="ICU equipment setup and structural renovation."
            ),
            # P1025: Legitimate Peer Project 2
            Project(
                id="P1025",
                title="Skill Training Centre Infrastructure",
                category="Education",
                cost_sanctioned=30.0,
                cost_spent=29.1,
                mp_id="MP003",
                district="Ahmedabad",
                state="Gujarat",
                sanction_date="2023-05-20",
                completion_date="2023-12-10",
                status="Completed",
                contractor_id="CNT104",
                agency_id="AGY203",
                description="Skill development lab building."
            ),
        ]
        db.add_all(projects)

        print("Seeding Entity Relationships (Graph Network)...")
        relationships = [
            EntityRelationship(
                source_id="CNT101",
                source_type="CONTRACTOR",
                target_id="CNT102",
                target_type="CONTRACTOR",
                relationship_type="SHARED_PAN",
                confidence_score=0.98,
                metadata_json='{"reason": "Identical PAN identifier AAACA1234A detected"}'
            ),
            EntityRelationship(
                source_id="CNT101",
                source_type="CONTRACTOR",
                target_id="CNT102",
                target_type="CONTRACTOR",
                relationship_type="SHARED_ADDRESS",
                confidence_score=0.95,
                metadata_json='{"reason": "Identical registered address Plot 42, Civil Lines, Varanasi"}'
            ),
            EntityRelationship(
                source_id="CNT101",
                source_type="CONTRACTOR",
                target_id="P1021",
                target_type="PROJECT",
                relationship_type="CONTRACTOR_FOR",
                confidence_score=1.0,
                metadata_json='{}'
            ),
            EntityRelationship(
                source_id="CNT102",
                source_type="CONTRACTOR",
                target_id="P1022",
                target_type="PROJECT",
                relationship_type="CONTRACTOR_FOR",
                confidence_score=1.0,
                metadata_json='{}'
            ),
            EntityRelationship(
                source_id="AGY201",
                source_type="AGENCY",
                target_id="P1021",
                target_type="PROJECT",
                relationship_type="IMPLEMENTED_BY",
                confidence_score=1.0,
                metadata_json='{}'
            ),
            EntityRelationship(
                source_id="AGY201",
                source_type="AGENCY",
                target_id="P1022",
                target_type="PROJECT",
                relationship_type="IMPLEMENTED_BY",
                confidence_score=1.0,
                metadata_json='{}'
            ),
        ]
        db.add_all(relationships)

        print("Seeding Historical Case Replay...")
        historical_case = HistoricalCase(
            id="CASE001",
            title="Varanasi Multi-Procurement Shared Identity Case",
            description="Retrospective study of rapid allocation to entities sharing address and PAN credentials.",
            official_investigation_date="2024-02-15",
            cutoff_date="2023-03-01",
            target_project_id="P1021",
            summary_findings="Multiple contracts awarded to twin entities using common tax identifiers."
        )
        db.add(historical_case)

        db.commit()
        print("Database Seeding Completed Successfully!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    seed_db()
