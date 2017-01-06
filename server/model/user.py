from werkzeug.security import generate_password_hash, check_password_hash
from server.model import db
from flask_login import UserMixin

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(32), unique=True, index=True)
    name = db.Column(db.String(128), unique=True, index=True)
    status = db.Column(db.String(128))
    gender = db.Column(db.String(10))
    email = db.Column(db.String(128), unique=True, index=True)
    password_hash = db.Column(db.String(128))
    role = db.Column(db.String(64))
    user_oder = db.Column(db.Integer)
    tasks = db.relationship('Task', backref="owner", lazy='dynamic')

    def __init__(self, options):
        if 'id' in options:
            self.id = options['id']
        if 'userId' in options:
            self.user_id = options['userId']
        if 'name' in options:
            self.name = options['name']
        if 'gender' in options:
            self.gender = options['gender']
        if 'email' in options:
            self.email = options['email']
        if 'role' in options:
            self.role = options['role']
        if 'status' in options:
            self.status = options['status']
        if 'password' in options:
            self.password = options['password']
        if 'user_oder' in options:
            self.user_oder = options['user_oder']

    @property
    def password(self):
        raise AttributeError('Password is not allowed to read')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return 'Model class User %r ' % self.name

    def serialize(self):
        return {
            "id": self.id,
            "userId": self.user_id,
            "name": self.name,
            "status": self.status,
            "role": self.role,
            "gender": self.gender,
            "user_order": self.user_oder,
            "email": self.email,
            "tasks": [task.serialize() for task in self.tasks]
        }

