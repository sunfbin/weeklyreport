from server import app
from flask import render_template, request, make_response, g, jsonify
from server.model.User import User
from flask_login import login_required, logout_user, login_user


@app.route('/', methods=['get'])
@app.route('/index', methods=['get'])
def home():
    return render_template('base.html')


@app.route('/login', methods=['post'])
def login():
    name = request.values['username']
    password = request.values['password']
    remember_me = False
    if 'remember_me' in request.values:
        remember_me = request.values['remember_me']
    user = User.query.filter_by(user_id = name).first()
    if not user:
        is_auth = False
    else:
        is_auth = user.verify_password(password)
        login_user(user, remember = remember_me)
    result = {
        'is_auth': is_auth,
        'user': user.serialize()
    }
    response = make_response(jsonify(result), 200)
    return response


@app.route('/is_authenticated', methods=['post'])
def is_authenticated():
    is_auth = g.user is not None and g.user.is_authenticated
    result = {
        'is_auth': is_auth
    }
    if is_auth:
        result['user'] = g.user.serialize()
    response = make_response(jsonify( result ) , 200)
    return response


@app.route('/logout', methods=['post'])
@login_required
def logout():
    logout_user()
    return jsonify( True )
