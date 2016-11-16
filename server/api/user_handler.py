from flask import make_response, jsonify

from server import app
from server.model.user import User


@app.route('/users')
def get_all_tasks():
    users = User.query.all()
    response = make_response(jsonify([user.serialize() for user in users]), 200)
    # response.set_cookie('username', 'the username')
    response.headers['Content-type'] = 'application/json'
    return response


@app.route('/users/:id')
def get_task(user_id):
    user = User.query.filter_by(id=user_id).first()
    response = make_response(jsonify(user), 200)
    response.headers['Content-type'] = 'application/json'
    return response
