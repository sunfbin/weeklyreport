from flask import Flask, g
import flask_login
import config

app = Flask(__name__)
app.config.from_object(config)

from server.model.User import User
from server.model.Week import Week
from server.model.Task import Task


def init_users():
    import json
    with open("./server/database/users.json") as users:
        all_users = json.load(users)
        for user_value in all_users:
            new_user = User(user_value)
            db.session.add(new_user)
        db.session.commit();

from server.model import db
db.init_app(app)
with app.app_context():
    db.create_all()
    db.session.commit()
    users = User.query.all()
    if len(users) == 0:
        init_users()



login_manager = flask_login.LoginManager()
login_manager.init_app(app)

@app.before_request
def before_request():
    g.user = flask_login.current_user

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

import server.api.login_handler
import server.api.task_handler
import server.api.user_handler
import server.api.week_handler
