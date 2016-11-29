from flask import make_response, jsonify, request
import datetime
from server import app
from server.model import db
from server.model.week import Week


@app.route('/weeks', methods=['get'])
def get_all_weeks():
    weeks = Week.query.all()
    response = make_response(jsonify([week.serialize() for week in weeks]), 200)
    # response.set_cookie('username', 'the username')
    response.headers['Content-type'] = 'application/json'
    return response


@app.route('/weeks', methods=['post'])
def save_week():
    week_date = request.values['date']
    week = Week(week_date)
    db.session.add(week)
    db.session.commit()

    response = make_response(jsonify({'week': week.serialize()}), 200)
    # response.set_cookie('username', 'the username')
    response.headers['Content-type'] = 'application/json'
    return response


@app.route('/weeks/<week_id>', methods=['put'])
def update_week(week_id):
    # status could be skipped [skip], holiday[] or normal [active]
    week = Week.query.filter_by(id=week_id).first()
    status = request.values['status']
    week.status = status
    db.session.commit()
    response = make_response(jsonify(week), 200)
    response.headers['Content-type'] = 'application/json'
    return response


@app.route('/weeks/next-monday', methods=['get'])
def next_monday():
    next_monday = get_next_monday()
    week = Week.query.filter_by(date=next_monday).first()
    if week is None:
        week = Week(next_monday)
        db.session.add(week)
        db.session.commit()
    response = make_response(jsonify(week.serialize()), 200)
    response.headers['Content-type'] = 'application/json'
    return response


def get_next_monday():
    today = datetime.date.today()
    if today.weekday()==0:
        next_monday = today
    else:
        next_monday = today + datetime.timedelta(7 - today.weekday())
    return datetime.date.strftime(next_monday, '%Y-%m-%d')
