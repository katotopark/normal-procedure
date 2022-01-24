from fcntl import F_SETFL
from black import token
from flask import Blueprint, jsonify, request, abort
from .auth import token_required
from models import db, Case, Paperwork
from random import randint
from typing import Dict, List
from error import ErrorWithCode

bp = Blueprint("case", __name__, url_prefix="/case")

"""
TODO constants should go to their own file
"""

document_types: List[str] = ["legal", "academic", "medical"]
departments: List[str] = ["Substantial Whims", "Mediocre Breakthroughs"]

"""
TODO utility functions should go into their own file
"""


def get_random_element(list_of_elements: List[any]):
    index: int = randint(0, len(list_of_elements) - 1)
    return list_of_elements[index]


def generate_random_location(grid_size: int = 10) -> Dict[str, int]:
    return {
        "x": randint(1, grid_size),
        "y": randint(1, grid_size),
        "z": randint(1, grid_size),
    }


def generate_initial_cluster(case_id: int, count: int = 20) -> List[Dict]:
    cluster: List[Dict] = []
    for i in range(count):
        location = generate_random_location()

        paperwork = dict(
            x=location.get("x"),
            y=location.get("y"),
            z=location.get("z"),
            document_type=get_random_element(document_types),
            case_id=case_id,
        )
        cluster.append(paperwork)
    return cluster


@bp.route("", methods=["POST"])
@token_required
def create_case(f):
    data: Dict[str, int] = request.get_json()
    player_id = data.get("player_id")

    case = Case(
        department=get_random_element(departments),
        case_number=randint(0, 10000),
        player_id=player_id,
        paperworks=[],
    )

    try:
        case.create()

        cluster = generate_initial_cluster(case.id)
        db.session.bulk_insert_mappings(Paperwork, cluster, return_defaults=True)
        db.session.commit()

        case.paperworks = Paperwork.query.filter(Paperwork.case_id == case.id).all()
        case.update()

        return jsonify({"case": case.format(), "success": True})
    except ErrorWithCode as e:
        db.session.rollback()
        abort(e.code)
    finally:
        db.session.close()


@bp.route("/<int:case_id>", methods=["GET"])
@token_required
def get_case_by_id(f, case_id):
    if not case_id:
        raise ErrorWithCode(400)

    try:
        case = Case.query.filter_by(id=case_id).first_or_404()
        return jsonify({"case": case.format(), "success": True})
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
