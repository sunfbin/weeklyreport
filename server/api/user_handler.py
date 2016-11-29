from flask import make_response, jsonify

from server import app
from server.model.user import User


@app.route('/users')
def get_all_users():
    users = fetch_users(None)
    response = make_response(jsonify([user.serialize() for user in users]), 200)
    response.headers['Content-type'] = 'application/json'
    return response


@app.route('/users/:id')
def get_user(user_id):
    user = fetch_users({'id': user_id})
    user =user.first()
    response = make_response(jsonify(user), 200)
    # response.set_cookie('username', user.name)
    response.headers['Content-type'] = 'application/json'
    return response


@app.route('/users/presented')
def get_present_users(week_id):

    if week_id is None:
        users = fetch_users(None)
    else:
        users = []
        # get tasks that belong to week_id
        # then aggregate by users
        # return users list

    response = make_response(jsonify(users), 200)
    response.headers['Content-type'] = 'application/json'
    return response


def fetch_users(filters):
    filter_dict = build_filters(filters);
    if filter_dict is None:
        users = User.query.all(filters)
    else:
        users = User.query.filter_by(filter_dict)
    return users


def build_filters(filters):
    return filters