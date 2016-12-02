import json

from flask import make_response, jsonify, request

from server.model import db
from server import app
from server.model.task import Task


@app.route('/tasks', methods=['get'])
def get_tasks():
    filters = request.values
    if filters is None:
        tasks = Task.query.all()
    else:
        user_id = filters['userId']
        week_id = filters['weekId']
        tasks = Task.query.filter_by(user_id=user_id, week_id=week_id)
    response = make_response(jsonify([task.serialize() for task in tasks]), 200)
    response.set_cookie('username', 'the username')
    response.headers['Content-type'] = 'application/json'
    return response


@app.route('/tasks/<task_id>')
def read_task(task_id):
    task = Task.query.get(task_id);
    if task is None:
        response = make_response({}, 404)
        response.headers['Content-type'] = 'application/json'
    else:
        response = make_response({'task': task.serialize()}, 200)
        response.headers['Content-type'] = 'application/json'
    return response


@app.route('/tasks', methods=['post'])
def create_task():
    task = Task(request.values)
    try:
        db.session.add(task)
        db.session.commit()
    except Exception as e:
        code = 500
        message = e.statement
        if 'UNIQUE constraint failed' in e.message:
            code = 409
            message = 'Task name {0} already exist.'.format(task.name)
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
        'task': task.serialize()
    }
    response = make_response(json.dumps(result), 200)
    # response.set_cookie('username', 'the username')
    response.headers['Content-type'] = 'application/json'
    return response


@app.route('/tasks/<task_id>', methods=['delete'])
def delete_task(task_id):
    task = Task.query.get(task_id)
    db.session.delete(task)
    db.session.commit()
    result = {'success': True}
    response = make_response(json.dumps(result), 200)
    response.set_cookie('username', 'the username')
    response.headers['Content-type'] = 'application/json'
    return response


@app.route('/tasks/<task_id>', methods=['put'])
def update_task():
    pass


