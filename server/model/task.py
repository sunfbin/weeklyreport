from server.model import db

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), unique=True, index=True)
    project = db.Column(db.String(128), index=True)
    progress = db.Column(db.Integer)
    description = db.Column(db.String(128))   #,
    status = db.Column(db.String(128))
    risk = db.Column(db.String(128))
    report = db.Column(db.Integer, db.ForeignKey('report.id'))


    def __init__(self, name, progress):
        self.name = name
        self.progress = progress

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "project": self.project,
            "progress": self.progress,
            "description": self.description,
            "status": self.status,
            "risk": self.risk
        }

    def __repr__(self):
        import json
        result = {
            "id": self.id,
            "name": self.name,
            "project": self.project,
            "progress": self.progress,
            "description": self.description,
            "status": self.status,
            "risk": self.risk
        }
        return json.dumps(result)
