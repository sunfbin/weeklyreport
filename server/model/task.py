from server.model import db

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), unique=True, index=True)
    status = db.Column(db.String(128))
    project = db.Column(db.String(128), index=True)
    progress = db.Column(db.Integer)
    description = db.Column(db.String(128))
    risk = db.Column(db.String(128))
    date = db.Column(db.String(32))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))


    def __init__(self, options):
        self.name = options['name']
        self.status = options['status']
        self.project = options['project']
        self.progress = options['progress']
        self.risk = options['risk']
        self.user_id = options['userId']
        self.date = options['date']
        self.description = options['description']

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "project": self.project,
            "progress": self.progress,
            "description": self.description,
            "status": self.status,
            "risk": self.risk,
            "userId": self.user_id,
            "date": self.date
        }

    def __repr__(self):
        import json
        return json.dumps(self.serialize())
