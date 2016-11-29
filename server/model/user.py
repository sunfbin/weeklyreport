from werkzeug.security import generate_password_hash, check_password_hash
from server.model import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), unique=True, index=True)
    status = db.Column(db.String(128))
    email = db.Column(db.Integer, unique=True, index=True)
    password_hash = db.Column(db.String(128))
    role = db.Column(db.String(64))
    user_oder = db.Column(db.Integer)

    def __init__(self, options):
        if 'id' in options:
            self.id = options['id']
        if 'name' in options:
            self.name = options['name']
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
            "name": self.name,
            "status": self.status,
            "role": self.role,
            "user_order": self.user_order,
            "email": self.email,
        }

