from server.model import db

class Report(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    week_id = db.Column(db.Integer, db.ForeignKey("week.id"))
    tasks = db.relationship('Task', backref='report_owner', lazy='dynamic')

    def __init__(self, user, week):
        self.user_id = user.id
        self.week_id = week.id
