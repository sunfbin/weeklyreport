from flask import make_response, jsonify, request
import json
from server import app
from server.model import db
from server.model.user import User


@app.route('/users')
def get_all_users():
    users = User.query.filter(User.role<>"Manager")
    result = {
        "success": True,
        "users": [user.serialize() for user in users]
    }
    response = make_response(jsonify(result), 200)
    response.headers['Content-type'] = 'application/json'
    return response


@app.route('/users', methods=['post'])
def create_user():
    user = User(request.values)
    try:
        db.session.add(user)
        db.session.commit()
    except Exception as e:
        code = 500
        message = e.message
        if 'UNIQUE constraint failed' in e.message:
            code = 409
            message = 'User name {0} already exist.'.format(user.name)
        result = {
            'success': False,
            'status': code,
            'message': message
        }
        response = make_response(json.dumps(result), code)
        response.headers['Content-type'] = 'application/json'
        return response
    result = {
        'success': True,
        'task': user.serialize()
    }
    response = make_response(json.dumps(result), 200)
    response.headers['Content-type'] = 'application/json'
    return response


@app.route('/users/<user_id>')
def get_user(user_id):
    user = User.query.filter(User.id==user_id)
    user = user.first()
    response = make_response(jsonify(user.serialize()), 200)
    # response.set_cookie('username', user.name)
    response.headers['Content-type'] = 'application/json'
    return response






def build_filters(filters):
    return filters