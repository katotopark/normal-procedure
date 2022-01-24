from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def db_drop_and_create_all():
    db.drop_all()
    db.create_all()


class Player(db.Model):
    __tablename__ = "player"

    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(50), unique=True)
    name = db.Column(db.String(32), unique=True, nullable=False)
    password = db.Column(db.String(250))
    cases = db.relationship("Case", backref="player", lazy=True)

    def __init__(self, public_id, name, password) -> None:
        self.public_id = public_id
        self.name = name
        self.password = password

    def create(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def format(self):
        return {"id": self.id, "name": self.name, "public_id": self.public_id}

    def __repr__(self) -> str:
        return f"<Player [{self.id}]: {self.name}>"


class Case(db.Model):
    __tablename__ = "case"

    id = db.Column(db.Integer, primary_key=True)
    department = db.Column(db.String(), nullable=False)
    case_number = db.Column(db.String(), unique=True, nullable=False)
    player_id = db.Column(db.Integer, db.ForeignKey("player.id"), nullable=False)
    paperworks = db.relationship("Paperwork", backref="case", lazy=True)

    def __init__(self, department, case_number, player_id, paperworks) -> None:
        self.department = department
        self.case_number = case_number
        self.player_id = player_id
        self.paperworks = paperworks

    def create(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def format(self):
        return {
            "id": self.id,
            "case_number": self.case_number,
            "department": self.department,
            "player_id": self.player_id,
            "paperworks": [paperwork.format() for paperwork in self.paperworks],
        }

    def __repr__(self) -> str:
        return f"<Case [{self.id}]>"


class Paperwork(db.Model):
    __tablename__: "Paperwork"

    id = db.Column(db.Integer, primary_key=True)
    x = db.Column(db.Integer, nullable=False)
    y = db.Column(db.Integer, nullable=False)
    z = db.Column(db.Integer, nullable=False)
    document_type = db.Column(db.String, nullable=False)
    case_id = db.Column(db.Integer, db.ForeignKey("case.id"), nullable=False)

    def __init__(self, x, y, z, document_type, case_id) -> None:
        self.x = x
        self.y = y
        self.z = z
        self.document_type = document_type
        self.case_id = case_id

    def create(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def format(self):
        return {
            "case_id": self.case_id,
            "coordinates": {"x": self.x, "y": self.y, "z": self.z},
            "document_type": self.document_type,
        }

    def __repr__(self) -> str:
        return f"<Paperwork [{self.id}]: {self.x}, {self.y}, {self.z}>"
