import os
from flask import Flask
from flask_migrate import Migrate
from flask_cors import CORS
from config import DevConfig
from models import db


def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)

    if test_config is None:
        app.config.from_object(DevConfig())
    else:
        app.config.from_mapping(test_config)

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    CORS(app)

    db.init_app(app)
    db.app = app
    Migrate(app, db)

    from blueprints import auth, case, player

    app.register_blueprint(auth.bp)
    app.register_blueprint(case.bp)
    app.register_blueprint(player.bp)

    return app


if __name__ == "__main__":
    app = create_app()
    app.run()
