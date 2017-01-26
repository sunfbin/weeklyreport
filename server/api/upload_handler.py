from flask_login import login_required
from flask import g, make_response, jsonify, request

from server import app
from werkzeug.utils import secure_filename
import os
from shutil import copy2


@app.route('/upload/avatar', methods=['post'])
@login_required
def upload_avatar():
    if 'file' not in request.files:
        result = {
            'success': False,
            'msg': 'No file found in request'
        }
        return make_response(jsonify(result), 400)
    avatar = request.files['file']
    if avatar.filename == '':
        result = {
            'success': False,
            'msg': 'No selected file'
        }
        return make_response(jsonify(result), 400)
    if not allowed_file(avatar.filename):
        result = {
            'success': False,
            'msg': 'Only file %s are allowed to upload' % app.config['ALLOWED_EXTENSIONS']
        }
        return make_response(jsonify(result), 400)
    file_name = secure_filename(avatar.filename)
    avatar.save(os.path.join(app.config['UPLOAD_FOLDER'], file_name))
    copy_to_static(file_name)
    result = {
        'success': True,
        'msg': 'Upload Succeed'
    }
    return make_response(jsonify(result), 200)


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']


def copy_to_static(file_name):
    new_file_name = g.user.user_id + '.jpg'

    upload_folder = app.config['UPLOAD_FOLDER']
    src = os.path.join(upload_folder, file_name)
    dest = os.path.join(upload_folder, '..', 'static', 'images', new_file_name)
    copy2(src, dest)