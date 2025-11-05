
# File: seed_vaccines.py

from app.db.session import SessionLocal
from app.models.vaccine import Vaccine

db = SessionLocal()

# Data based on the National Immunization Schedule (NIS) for infants in India
vaccine_schedule = [
    {"name": "BCG", "due_at_weeks_min": 0, "due_at_weeks_max": 4, "details": "Protects against Tuberculosis. Given at birth or as early as possible till one year of age."},
    {"name": "Hepatitis B - Birth dose", "due_at_weeks_min": 0, "due_at_weeks_max": 1, "details": "Protects against Hepatitis B. Given at birth or as early as possible within 24 hours."},
    {"name": "OPV - 0 dose", "due_at_weeks_min": 0, "due_at_weeks_max": 2, "details": "Oral Polio Vaccine. Given at birth or as early as possible within the first 15 days."},
    {"name": "OPV - 1st dose", "due_at_weeks_min": 6, "due_at_weeks_max": 8, "details": "1st dose of Oral Polio Vaccine."},
    {"name": "Pentavalent - 1st dose", "due_at_weeks_min": 6, "due_at_weeks_max": 8, "details": "Protects against Diphtheria, Pertussis, Tetanus, Hepatitis B and Hib."},
    {"name": "Rotavirus Vaccine - 1st dose", "due_at_weeks_min": 6, "due_at_weeks_max": 8, "details": "Protects against Rotaviral diarrhea."},
    {"name": "PCV - 1st dose", "due_at_weeks_min": 6, "due_at_weeks_max": 8, "details": "Pneumococcal Conjugate Vaccine. Protects against pneumococcal diseases."},
    {"name": "OPV - 2nd dose", "due_at_weeks_min": 10, "due_at_weeks_max": 12, "details": "2nd dose of Oral Polio Vaccine."},
    {"name": "Pentavalent - 2nd dose", "due_at_weeks_min": 10, "due_at_weeks_max": 12, "details": "2nd dose of Pentavalent vaccine."},
    {"name": "Rotavirus Vaccine - 2nd dose", "due_at_weeks_min": 10, "due_at_weeks_max": 12, "details": "2nd dose of Rotavirus vaccine."},
    {"name": "OPV - 3rd dose", "due_at_weeks_min": 14, "due_at_weeks_max": 16, "details": "3rd dose of Oral Polio Vaccine."},
    {"name": "Pentavalent - 3rd dose", "due_at_weeks_min": 14, "due_at_weeks_max": 16, "details": "3rd dose of Pentavalent vaccine."},
    {"name": "Rotavirus Vaccine - 3rd dose", "due_at_weeks_min": 14, "due_at_weeks_max": 16, "details": "3rd dose of Rotavirus vaccine."},
    {"name": "PCV - Booster", "due_at_weeks_min": 36, "due_at_weeks_max": 52, "details": "Booster dose for Pneumococcal Conjugate Vaccine."},
    {"name": "Measles & Rubella (MR) - 1st dose", "due_at_weeks_min": 36, "due_at_weeks_max": 52, "details": "Protects against Measles and Rubella."},
]

def seed_vaccines():
    print("--- Seeding vaccine data... ---")
    # Clear old data first
    db.query(Vaccine).delete()
    db.commit()

    # Add new data
    for v_data in vaccine_schedule:
        vaccine = Vaccine(**v_data)
        db.add(vaccine)

    db.commit()
    print("--- Vaccine data seeded successfully! ---")

if __name__ == "__main__":
    seed_vaccines()
    db.close()