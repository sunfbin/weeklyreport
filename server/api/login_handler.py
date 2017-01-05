from server import app
import json, flask_login
from flask import render_template, request, make_response
from server.model.User import User

login_manager = flask_login.LoginManager()
login_manager.init_app(app)


@app.route('/', methods=['get','post'])
@app.route('/index', methods=['get','post'])
# @flask_login.login_required
def home():
    return render_template('base.html')


@app.route('/login', methods=['post'])
def login():
    name = request.values['username']
    password = request.values['password']
    user = User.query.filter_by(user_id = name).first()
    if not user:
        is_auth = False
    else:
        is_auth = user.verify_password(password)
    response = make_response(json.dumps(is_auth), 200)
    if is_auth:
        response.set_cookie('username', 'name')
    response.headers['Content-type'] = 'application/json'
    return response


@app.route('/is_authenticated', methods=['post'])
def is_authenticated():
    # result = "false"
    result = "true"
    response = make_response(result , 200)
    # response.set_cookie('username', 'the username')
    response.headers['Content-type'] = 'application/json'
    return response

