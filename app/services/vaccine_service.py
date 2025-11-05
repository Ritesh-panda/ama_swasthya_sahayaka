# File: app/services/vaccine_service.py

from sqlalchemy.orm import Session
from datetime import date
from app.models.vaccine import Vaccine

def calculate_vaccine_schedule(db: Session, date_of_birth: date):
    """
    Calculates the vaccine schedule for a child based on their date of birth.
    """
    today = date.today()
    age_in_days = (today - date_of_birth).days
    age_in_weeks = age_in_days // 7

    if age_in_weeks < 0:
        return "The date of birth cannot be in the future. Please provide a valid date."

    # Find vaccines that are currently due for the child's age
    due_now = db.query(Vaccine).filter(
        Vaccine.due_at_weeks_min <= age_in_weeks,
        Vaccine.due_at_weeks_max >= age_in_weeks
    ).order_by(Vaccine.due_at_weeks_min).all()

    # Find all upcoming vaccines within the first year
    upcoming = db.query(Vaccine).filter(
        Vaccine.due_at_weeks_min > age_in_weeks,
        Vaccine.due_at_weeks_min <= 52 # Limit to first year for simplicity
    ).order_by(Vaccine.due_at_weeks_min).all()

    # --- Format the reply message ---
    reply = f"For a child born on {date_of_birth.strftime('%d-%b-%Y')} (Age: {age_in_weeks} weeks):\n\n"

    if due_now:
        reply += "--- 💉 Vaccines Due Now ---\n"
        for v in due_now:
            reply += f"*{v.name}*\n_{v.details}_\n\n"
    else:
        reply += "--- No Vaccines Due This Week ---\n\n"

    if upcoming:
        reply += "--- 🗓️ Upcoming Vaccines ---\n"
        for v in upcoming:
            reply += f"*{v.name}* (Due around week {v.due_at_weeks_min})\n"

    if not due_now and not upcoming:
         reply += "All initial vaccinations as per the schedule seem to be complete. Please consult a doctor for booster shots and further guidance."

    return reply