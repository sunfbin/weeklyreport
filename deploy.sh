#!/bin/bash

# base condition is that python should be available on your server
# install necessary libs, like pip, virtualenv
# pip install virtualenv
# create venv directory in the parent folder of 'server'
# cd ../
# virtualenv venv
# create database
#

which pip>/dev/null
if [ $? -ne 0 ]; then
    which easy_install>/dev/null
    if [ $? -ne 0 ]; then
        echo "please install python and easy_install first"
        exit 1
    else
        #install pip
        sudo easy_install pip
    fi 
fi

pip install virtualenv
virtualenv venv
cd venv

source ./bin/activate
pip install flask
pip install flask_login
pip install Flask-SQLAlchemy
pip install mysql-python
if [ $? -ne 0 ]; then
    # assume it is Ubuntu system
    apt-get install libmysqlclient-dev
    pip install mysql-python
fi

echo "Preparation Done. Now starting the app..."

cd ..

python weekly_report.py
