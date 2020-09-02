"""
The flask application package.
"""

import os;

from flask import Flask,session
app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(24)

import Flask1.views
