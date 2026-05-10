from flask_sqlalchemy import SQLAlchemy  # type: ignore
from config import Config
from datetime import datetime

db = SQLAlchemy(
    engine_options=Config.SQLALCHEMY_ENGINE_OPTIONS
)

# =========================
# 👤 USUARIOS (ADMIN / OPERADOR)
# =========================
class User(db.Model):
    __tablename__ = "users"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    username = db.Column(
        db.String(64),
        index=True,
        unique=True,
        nullable=False
    )

    password = db.Column(
        db.String(255),
        nullable=False
    )

    email = db.Column(
        db.String(120),
        unique=True,
        nullable=False
    )

    active = db.Column(
        db.Boolean(),
        default=True
    )

    rol = db.Column(
        db.String(20),
        default="OPERADOR"
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.now
    )

    refugio_id = db.Column(
        db.Integer,
        db.ForeignKey("refugios.id")
    )

    # RELACIÓN CON REFUGIO
    refugio = db.relationship(
        "Refugio",
        back_populates="usuarios"
    )

    def __repr__(self):
        return f"<User {self.username}>"

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "active": self.active,
            "rol": self.rol,
            "refugio_id": self.refugio_id,
            "created_at": self.created_at.isoformat()
            if self.created_at
            else None
        }


# =========================
# 🏠 REFUGIOS (PÚBLICO)
# =========================
class Refugio(db.Model):
    __tablename__ = "refugios"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    nombre = db.Column(
        db.String(100),
        nullable=False
    )

    direccion = db.Column(
        db.String(200)
    )

    lat = db.Column(
        db.Float,
        nullable=False
    )

    lng = db.Column(
        db.Float,
        nullable=False
    )

    telefono = db.Column(
        db.String(50)
    )

    capacidad_total = db.Column(
        db.Integer
    )

    cupos_disponibles = db.Column(
        db.Integer
    )

    actualizado_en = db.Column(
        db.DateTime,
        default=datetime.now
    )

    # RELACIÓN CON USERS
    usuarios = db.relationship(
        "User",
        back_populates="refugio",
        lazy=True
    )

    def __repr__(self):
        return f"<Refugio {self.nombre}>"

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "direccion": self.direccion,
            "lat": self.lat,
            "lng": self.lng,
            "telefono": self.telefono,
            "capacidad_total": self.capacidad_total,
            "cupos_disponibles": self.cupos_disponibles,
            "actualizado_en": self.actualizado_en.isoformat()
            if self.actualizado_en
            else None,

            # SERIALIZACIÓN SEGURA
            "usuarios": [
                {
                    "id": u.id,
                    "username": u.username,
                    "rol": u.rol
                }
                for u in self.usuarios
            ]
        }


# =========================
# 🚨 REPORTES (PRIVADO)
# =========================
class Reporte(db.Model):
    __tablename__ = "reportes"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    lat = db.Column(
        db.Float,
        nullable=False
    )

    lng = db.Column(
        db.Float,
        nullable=False
    )

    descripcion = db.Column(
        db.String(150)
    )

    estado_persona = db.Column(
        db.String(50)
    )  # durmiendo, despierto, etc

    esta_solo = db.Column(
        db.Boolean
    )

    frio = db.Column(
        db.Boolean,
        default=False
    )

    lluvia = db.Column(
        db.Boolean,
        default=False
    )

    salud = db.Column(
        db.Boolean,
        default=False
    )

    estado = db.Column(
        db.String(20),
        default="pendiente"
    )  # pendiente / atendido

    creado_en = db.Column(
        db.DateTime,
        default=datetime.now
    )

    fingerprint = db.Column(
        db.String(128)
    )  # anti-spam

    def __repr__(self):
        return f"<Reporte {self.id}>"

    def serialize(self):
        return {
            "id": self.id,
            "lat": self.lat,
            "lng": self.lng,
            "descripcion": self.descripcion,
            "estado_persona": self.estado_persona,
            "esta_solo": self.esta_solo,
            "frio": self.frio,
            "lluvia": self.lluvia,
            "salud": self.salud,
            "estado": self.estado,
            "creado_en": self.creado_en.isoformat()
            if self.creado_en
            else None
        }