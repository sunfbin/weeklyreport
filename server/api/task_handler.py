import json

from flask import make_response, jsonify, request

from server.model import db
from server import app
from server.model.Task import Task


@app.route('/tasks', methods=['get'])
def get_tasks():
    filters = request.values
    if filters is None:
        tasks = Task.query.all()
    else:
        user_id = filters['userId']
        week_id = filters['weekId']
        tasks = Task.query.filter_by(user_id=user_id, week_id=week_id)
    result = {
        "success": True,
        "total": tasks.count(),
        "tasks": [task.serialize() for task in tasks]
    }
    response = make_response(jsonify(result), 200)
    # response.set_cookie('username', 'the username')
    response.headers['Content-type'] = 'application/json'
    return response


@app.route('/tasks/<task_id>')
def read_task(task_id):
    task = Task.query.get_or_404(task_id);

    if task is None:
        response = make_response(jsonify({}), 404)
        response.headers['Content-type'] = 'application/json'
    else:
        result = {
            "task": task.serialize()
        }
        response = make_response(jsonify(result), 200)
        response.headers['Content-type'] = 'application/json'
    return response


@app.route('/tasks', methods=['post'])
def create_task():
    task = Task(request.values)
    db.session.add(task)
    db.session.commit()

    result = {
        'success': True,
        'task': task.serialize()
    }
    response = make_response(json.dumps(result), 200)
    response.headers['Content-type'] = 'application/json'
    return response


@app.route('/tasks/<task_id>', methods=['delete'])
def delete_task(task_id):
    task = Task.query.get(task_id)
    db.session.delete(task)
    db.session.commit()
    result = {'success': True}
    response = make_response(json.dumps(result), 200)
    response.headers['Content-type'] = 'application/json'
    return response


@app.route('/tasks/<task_id>', methods=['put'])
def update_task(task_id):
    task = Task.query.get(task_id)
    new_task = Task(request.values)
    task.name = new_task.name
    task.status = new_task.status
    task.project = new_task.project
    task.progress = new_task.progress
    task.description = new_task.description
    task.risk = new_task.risk
    task.eta = new_task.eta
    db.session.commit()

    result = {'success': True}
    response = make_response(json.dumps(result), 200)
    response.headers['Content-type'] = 'application/json'
    return response

@app.route('/tasks/present')
def get_present_tasks():
    if len(request.values) > 0:
        status = request.values['status']
        weekId = request.values['weekId']

    # result = Task.query.filter_by(week_id=weekId).join('owner').filter_by(status=status).all()
    result = Task.query.filter_by(week_id=weekId).all()
    a = []
    for task in result:
        a.append(task.owner.serialize())
    user = list(a)
    result = {
        'users': [user.serialize() for user in result]
    }
    response = make_response(jsonify(result), 200)
    # response.set_cookie('username', user.name)
    response.headers['Content-type'] = 'application/json'
    return response
