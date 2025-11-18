# app/__init__.py
from flask import Flask
from .routes.main import main_bp
from .routes.taskone import taskone_bp
from .routes.tasktwo import tasktwo_bp
from .routes.taskthree import taskthree_bp
from .routes.tasktwopost import tasktwopost_bp
from datetime import timedelta

def create_app(config_class="config.DevelopmentConfig"):
    app = Flask(__name__)
    app.config.from_object(config_class)

    app.secret_key = "mctfintrotasksupersecretkeyhehe"  # must be set for sessions
    app.permanent_session_lifetime = timedelta(days=1)  # session lasts 1 day

    # Initialize extensions
    # db.init_app(app)

    # Register blueprints
    app.register_blueprint(main_bp)
    app.register_blueprint(taskone_bp, url_prefix="/taskone")
    app.register_blueprint(tasktwo_bp, url_prefix="/tasktwo")
    app.register_blueprint(tasktwopost_bp, url_prefix="/tasktwopost")
    app.register_blueprint(taskthree_bp, url_prefix="/taskthree")

    return app

