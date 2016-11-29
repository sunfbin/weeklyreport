from werkzeug.security import generate_password_hash, check_password_hash
from server.model import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), unique=True, index=True)
    email = db.Column(db.Integer, unique=True, index=True)
    password_hash = db.Column(db.String(128))
    role = db.Column(db.String(64))   #, db.ForeignKey("role.roles_id")

    def __init__(self, name, email, password, role):
        self.name = name
        self.email = email
        self.role = role
        self.password = password

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
            "name": self.name,
            "role": self.role
        }

