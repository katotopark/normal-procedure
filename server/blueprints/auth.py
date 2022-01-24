from os import environ
from flask import Blueprint, jsonify, request, abort
import uuid
from werkzeug.security import check_password_hash, generate_password_hash
from typing import Dict
from models import db, Player
from error import ErrorWithCode
import jwt
from datetime import datetime, timedelta
from functools import wraps

bp = Blueprint("auth", __name__, url_prefix="/auth")


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "x-access-token" in request.headers:
            token = request.headers["x-access-token"]

        if not token:
            return jsonify({"message": "Token is missing!!"}), 401

        try:
            data = jwt.decode(
                token,
                environ.get("SECRET_KEY"),
                algorithms=["HS256"],
            )
            current_user = Player.query.filter_by(public_id=data["public_id"]).first()
        except:
            return jsonify({"message": "Token is invalid!!"}), 401
        return f(current_user, *args, **kwargs)

    return decorated


@bp.route("/login", methods=["POST"])
def login():
    data: Dict[str, str] = request.get_json()
    name, password = data.get("name"), data.get("password")

    if not data or not name or not password:
        raise ErrorWithCode(401)

    player = Player.query.filter_by(name=name).first()

    if not player:
        raise ErrorWithCode(401)

    if check_password_hash(player.password, password):
        token = jwt.encode(
            {
                "public_id": player.public_id,
                "exp": datetime.utcnow() + timedelta(minutes=120),
            },
            environ.get("SECRET_KEY"),
            algorithm="HS256",
        )
        return jsonify({"token": token, "success": True})

    raise ErrorWithCode(403)


@bp.route("/register", methods=["POST"])
def register():
    data: Dict[str, str] = request.get_json()
    name, password = data.get("name"), data.get("password")

    if not name or not password:
        raise ErrorWithCode(400)

    player = Player.query.filter_by(name=name).first()

    if not player:
        player = Player(
            public_id=str(uuid.uuid4()),
            name=name,
            password=generate_password_hash(password),
        )

    try:
        player.create()
        return jsonify({"player": player.format(), "success": True})
    except ErrorWithCode as e:
        db.session.rollback()
        abort(e.code)
    finally:
        db.session.close()


@bp.errorhandler(400)
def bad_request(error):
    return (
        jsonify(
            {
                "error": error.code,
                "message": "bad request",
                "success": False,
            }
        ),
        400,
    )


@bp.errorhandler(401)
def bad_request(error):
    return (
        jsonify(
            {
                "error": error.code,
                "message": "unauthorized",
                "success": False,
            }
        ),
        401,
    )


@bp.errorhandler(403)
def bad_request(error):
    return (
        jsonify(
            {
                "error": error.code,
                "message": "could not verify",
                "success": False,
            }
        ),
        403,
    )


@bp.errorhandler(500)
def internal_server_error(error):
    return (
        jsonify(
            {
                "error": error.code,
                "message": "internal server error",
                "success": False,
            }
        ),
        500,
    )
