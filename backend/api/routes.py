from flask import Blueprint, request, jsonify  # type: ignore
from flask_jwt_extended import create_access_token, jwt_required, get_jwt  # type: ignore
from werkzeug.security import generate_password_hash, check_password_hash  # type: ignore
from api.models import db, User, Refugio, Reporte
from datetime import datetime
import hashlib

api = Blueprint("api", __name__)


# =========================
# 🧪 TEST
# =========================
@api.route("/hello", methods=["GET"])
def hello():
    return jsonify({"message": "Hello World!"})


# =========================
# 👤 USERS
# =========================
@api.route("/users", methods=["GET"])
def get_users():
    users = User.query.all()
    return jsonify([user.serialize() for user in users])


@api.route("/users", methods=["POST"])
def create_user():
    data = request.get_json()

    username = data.get("username")
    password = data.get("password")
    email = data.get("email")

    if not username or not password or not email:
        return jsonify({"error": "Missing required fields"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 400

    user = User(
    username=username,
    password=generate_password_hash(password),
    email=email,
    rol=data.get("rol", "OPERADOR"),
    refugio_id=data.get("refugio_id"),
    active=True
)

    db.session.add(user)
    db.session.commit()

    return jsonify(user.serialize()), 201


@api.route("/users/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()

    if "username" in data:
        user.username = data["username"]

    if "password" in data:
        user.password = generate_password_hash(data["password"])

    if "email" in data:
        user.email = data["email"]

    if "active" in data:
        user.active = data["active"]

    if "rol" in data:
        user.rol = data["rol"]

    db.session.commit()
    return jsonify(user.serialize())


@api.route("/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "User deleted"})
    

# =========================
# 🔐 LOGIN
# =========================
@api.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    user = User.query.filter_by(
        email=data.get("email")
    ).first()

    if not user or not check_password_hash(
        user.password,
        data.get("password")
    ):
        return jsonify({
            "error": "Invalid credentials"
        }), 401

    token = create_access_token(
        identity=str(user.id),
        additional_claims={
            "rol": user.rol
        }
    )

    return jsonify({
        "token": token,
        "user": user.serialize()
    }), 200


# =========================
# 🏠 REFUGIOS (PÚBLICO)
# =========================
@api.route("/refugios", methods=["GET"])
def get_refugios():
    refugios = Refugio.query.all()
    return jsonify([r.serialize() for r in refugios])


@api.route("/refugios", methods=["POST"])

def create_refugio():
    data = request.get_json()

    if not data.get("nombre") or not data.get("lat") or not data.get("lng"):
        return jsonify({"error": "Missing required fields"}), 400

    refugio = Refugio(
        nombre=data["nombre"],
        direccion=data.get("direccion"),
        lat=data["lat"],
        lng=data["lng"],
        telefono=data.get("telefono"),
        capacidad_total=data.get("capacidad_total"),
        cupos_disponibles=data.get("cupos_disponibles"),
        actualizado_en=datetime.now()
    )

    db.session.add(refugio)
    db.session.commit()

    return jsonify(refugio.serialize()), 201


@api.route("/refugios/<int:id>", methods=["PUT"])
@jwt_required()
def update_refugio(id):
    refugio = Refugio.query.get(id)
    if not refugio:
        return jsonify({"error": "Not found"}), 404

    data = request.get_json()

    for field in ["nombre", "direccion", "lat", "lng", "telefono", "capacidad_total", "cupos_disponibles"]:
        if field in data:
            setattr(refugio, field, data[field])

    refugio.actualizado_en = datetime.now()

    db.session.commit()

    return jsonify(refugio.serialize())


@api.route("/refugios/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_refugio(id):
    refugio = Refugio.query.get(id)
    if not refugio:
        return jsonify({"error": "Not found"}), 404

    db.session.delete(refugio)
    db.session.commit()

    return jsonify({"msg": "Deleted"})


# =========================
# 🚨 REPORTES
# =========================

def generar_fingerprint(req):
    raw = (req.remote_addr or "") + (req.headers.get("User-Agent") or "")
    return hashlib.sha256(raw.encode()).hexdigest()


@api.route("/reportes", methods=["POST"])
def create_reporte():
    data = request.get_json()

    if not data.get("lat") or not data.get("lng"):
        return jsonify({"error": "Ubicación requerida"}), 400

    fingerprint = generar_fingerprint(request)

    reporte = Reporte(
        lat=data["lat"],
        lng=data["lng"],
        descripcion=data.get("descripcion"),
        estado_persona=data.get("estado_persona"),
        esta_solo=data.get("esta_solo"),
        frio=data.get("frio", False),
        lluvia=data.get("lluvia", False),
        salud=data.get("salud", False),
        fingerprint=fingerprint
    )

    db.session.add(reporte)
    db.session.commit()

    return jsonify({"msg": "Reporte creado"}), 201


@api.route("/reportes", methods=["GET"])
@jwt_required()
def get_reportes():
    claims = get_jwt()

    if claims.get("rol") not in ["ADMIN", "OPERADOR"]:
        return jsonify({"error": "No autorizado"}), 403

    reportes = Reporte.query.order_by(Reporte.creado_en.desc()).all()

    return jsonify([r.serialize() for r in reportes])


@api.route("/reportes/<int:id>", methods=["PUT"])
@jwt_required()
def update_reporte(id):
    claims = get_jwt()

    if claims.get("rol") not in ["ADMIN", "OPERADOR"]:
        return jsonify({"error": "No autorizado"}), 403

    reporte = Reporte.query.get(id)
    if not reporte:
        return jsonify({"error": "Not found"}), 404

    data = request.get_json()

    if "estado" in data:
        reporte.estado = data["estado"]

    db.session.commit()

    return jsonify(reporte.serialize())