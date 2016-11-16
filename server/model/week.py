from server.model import db

class Week(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    day_date = db.Column(db.Date, unique=True)
    status = db.Column(db.Boolean)  # false means skipped (no meeting this week)

    def __init__(self, current_date):
        self.day_date = current_date

    def skip_this_week(self):
        self.status = False

    def unskip_this_week(self):
        self.status = True
