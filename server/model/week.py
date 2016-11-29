from server.model import db

class Week(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(32), unique=True)
    status = db.Column(db.String(64)) # skipped, holiday

    def __init__(self, date, status="normal"):
        self.date = date
        self.status = status


    def serialize(self):
        return {
            "id": self.id,
            "date": self.date,
            "status": self.status
        }
