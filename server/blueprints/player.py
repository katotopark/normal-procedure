from flask import Blueprint, abort, jsonify
from random import randint
from models import db, Case, Player
from .auth import token_required
from error import ErrorWithCode


bp = Blueprint("player", __name__, url_prefix="/player")


def generate_random_location():
    return {"x:": randint(1, 100), "y": randint(1, 100), "z": randint(1, 200)}


@bp.route("/<int:player_id>", methods=["GET"])
def get_player(f, player_id):
    try:
        player = Player.query.filter_by(id=player_id).first_or_404()
        return jsonify({"player": player, "success": True})
    except ErrorWithCode as e:
        db.session.rollback()
        abort(e.code)
    finally:
        db.session.close()


@bp.route("/<int:player_id>/cases", methods=["GET"])
@token_required
def get_cases_of_player(f, player_id):
    if not player_id:
        raise ErrorWithCode(400)

    try:
        cases = Case.query.filter(Case.player_id == player_id).all()
        return jsonify(
            {
                "cases": [case.format() for case in cases],
                "total_count": len(cases),
                "success": True,
            }
        )
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
