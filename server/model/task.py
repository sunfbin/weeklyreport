from server.model import db

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(1024))
    status = db.Column(db.String(10))
    project = db.Column(db.String(128))
    progress = db.Column(db.Integer)
    description = db.Column(db.String(1024))
    risk = db.Column(db.String(1024))
    eta = db.Column(db.String(32))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    week_id = db.Column(db.Integer, db.ForeignKey('week.id'))


    def __init__(self, options):
        if 'id' in options:
            self.id = options['id']
        if 'name' in options:
            self.name = options['name']
        if 'status' in options:
            self.status = options['status']
        if 'project' in options:
            self.project = options['project']
        if 'progress' in options:
            self.progress = options['progress']
        if 'risk' in options:
            self.risk = options['risk']
        if 'eta' in options:
            self.eta = options['eta']
        if 'userId' in options:
            self.user_id = options['userId']
        if 'weekId' in options:
            self.week_id = options['weekId']
        if 'description' in options:
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
            "eta": self.eta,
            "userId": self.user_id,
            "weekId": self.week_id
        }

    def __repr__(self):
        import json
        return json.dumps(self.serialize())
