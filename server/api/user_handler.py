from flask_login import login_required, fresh_login_required, logout_user
from flask import make_response, jsonify, request, send_from_directory, render_template

from server import app
from server.model import db
from server.model.User import User
from xhtml2pdf import pisa
from StringIO import StringIO
import os


@app.route('/users')
@login_required
def get_all_users():
    users = User.query.filter(User.role <> "Manager", User.role != "admin").order_by('user_oder')
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
    user = User.query.filter(User.id == user_id)
    user = user.first()
    response = make_response(jsonify(user.serialize()), 200)
    response.headers['Content-type'] = 'application/json'
    return response


@app.route('/users/tasks')
@login_required
def get_present_users_tasks():
    if len(request.values) > 0:
        weekId = request.values['weekId']
    else:
        return make_response('Bad request', 400)
    result = get_users_tasks(weekId)
    response = make_response(jsonify(result), 200)
    print response
    return response


def get_users_tasks(weekId):
    users = User.query.filter(User.role <> 'manager', User.role <> 'admin').order_by('user_oder').all()
    for user in users:
        user.tasks = user.tasks.filter_by(week_id=weekId).all()
    result = {
        'users': [user.serialize(True) for user in users]
    }
    return result


def create_pdf(pdf_data, weekDate):
    name = "weekly_report_" + weekDate + ".pdf"
    root_path = os.path.dirname(__file__)
    data_path = os.path.join(root_path, "../download")
    pdf = open(os.path.join(data_path, name), "w")
    pisa.CreatePDF(StringIO(pdf_data), pdf)
    return name


@app.route('/tasks/export')
@fresh_login_required
def export_tasks():
    if len(request.values) > 0:
        weekId = request.values['weekId']
        weekDate = request.values['weekDate']
    else:
        return make_response('Bad request', 400)
    data = get_users_tasks(weekId)
    name = create_pdf(render_template('export.html', data=data, weekDate=weekDate), weekDate)
    return send_from_directory(directory='download', filename=name, as_attachment=True)


@app.route('/users/change_password', methods=['post'])
@fresh_login_required
def change_password():
    if len(request.values) > 0:
        password = request.values['pwd']
        new_password = request.values['new_pwd']
        user_id = request.values['user_id']
    else:
        response = make_response('Bad Request: No enough parameters.', 400)
        return response
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


@app.route('/users/change_present_order', methods=['post'])
@login_required
def change_present_order():
    if len(request.values) <= 0:
        return make_response('Bad request', 400)

    keys = request.values.keys()
    for key in keys:
        value = request.values[key]
        user = User.query.get(int(key))
        user.user_oder = value

    db.session.commit()
    return make_response(jsonify({'success': True}), 200)

