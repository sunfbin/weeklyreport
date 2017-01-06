from flask_login import login_required
from flask import make_response, jsonify, request, send_from_directory

from server.model import db
from server import app
from server.model.Task import Task


@app.route('/tasks', methods=['get'])
@login_required
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
    response = make_response(jsonify(result), 200)
    response.headers['Content-type'] = 'application/json'
    return response


@app.route('/tasks/<task_id>', methods=['delete'])
def delete_task(task_id):
    task = Task.query.get(task_id)
    db.session.delete(task)
    db.session.commit()
    result = {'success': True}
    response = make_response(jsonify(result), 200)
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
    response = make_response(jsonify(result), 200)
    response.headers['Content-type'] = 'application/json'
    return response


@app.route('/tasks/export')
def export_tasks():
    # zero  : clear the specific directory
    # first : query the tasks list
    # second: generate excel file
    # third: save it in some specific directory
    # forth: send it to http response
    return send_from_directory(directory='database', filename='users.json')
