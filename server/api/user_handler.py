from flask import make_response, jsonify, request
from flask_login import login_required, fresh_login_required, logout_user

from server import app
from server.model import db
from server.model.User import User


@app.route('/users')
@login_required
def get_all_users():
    users = User.query.filter(User.role<>"Manager", User.role!="admin")
    result = {
        "success": True,
        "users": [user.serialize() for user in users]
    }
    response = make_response(jsonify(result), 200)
    return response


@app.route('/users', methods=['post'])
@login_required
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
        response = make_response(jsonify(result), code)
        return response
    result = {
        'success': True,
        'task': user.serialize()
    }
    response = make_response(jsonify(result), 200)
    return response


@app.route('/users/<user_id>')
@login_required
def get_user(user_id):
    user = User.query.filter(User.id==user_id)
    user = user.first()
    response = make_response(jsonify(user.serialize()), 200)
    # response.set_cookie('username', user.name)
    response.headers['Content-type'] = 'application/json'
    return response


@app.route('/users/tasks')
@login_required
def get_present_users_tasks():
    if len(request.values) > 0:
        # status = request.values['status']
        weekId = request.values['weekId']
    users = User.query.filter(User.role<>'manager', User.role<>'admin').all()

    for user in users:
        user.tasks = user.tasks.filter_by(week_id=weekId).all()
    result = {
        'users': [user.serialize(True) for user in users]
    }
    response = make_response(jsonify(result), 200)
    return response

@app.route('/users/change_password', methods=['post'])
@fresh_login_required
def change_password():
    if len(request.values) > 0:
        password = request.values['pwd']
        new_password = request.values['new_pwd']
        user_id = request.values['user_id']
    user = User.query.get(user_id)
    if not user:
        result = {
            'success': False,
            'msg': 'User not found'
        }
        response = make_response(jsonify(result), 200)
        return response

    if not user.verify_password(password):
        result = {
            'success': False,
            'msg': 'Old password not match. Authentication failed'
        }
        response = make_response(jsonify(result), 200)
        return response

    user.password = new_password
    db.session.commit()
    logout_user()
    response = make_response(jsonify({'success': True}), 200)
    return response
