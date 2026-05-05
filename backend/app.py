from flask import Flask  # type: ignore
from flask_cors import CORS  # type: ignore
from flask_jwt_extended import JWTManager  # type: ignore
from flask_admin import Admin  # type: ignore
from flask_admin.contrib.sqla import ModelView  # type: ignore
from flask_migrate import Migrate  # type: ignore
from extensions import mail  # type: ignore

from config import Config
from api.models import db, User, Refugio, Reporte

# Blueprints
from api.routes import api


# =========================
# 🏗️ APP
# =========================
app = Flask(__name__)
app.config.from_object(Config)

mail.init_app(app)


# =========================
# 🌐 CORS
# =========================
CORS(
    app,
    resources={r"/api/*": {"origins": "*"}},
    supports_credentials=True
)


# =========================
# 🔌 EXTENSIONES
# =========================
db.init_app(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)


# =========================
# 🔐 JWT (opcional pero útil)
# =========================
@jwt.user_identity_loader
def user_identity_lookup(user_id):
    return user_id


# =========================
# 🧑‍💼 ADMIN PANEL
# =========================
admin = Admin(app, name='Panel Admin')

admin.add_view(ModelView(User, db.session))
admin.add_view(ModelView(Refugio, db.session))
admin.add_view(ModelView(Reporte, db.session))


# =========================
# 🔗 ROUTES
# =========================
app.register_blueprint(api, url_prefix='/api')


# =========================
# 🧪 HEALTH CHECK
# =========================
@app.route('/ping')
def ping():
    return {'status': 'ok'}, 200


# =========================
# 🧱 INIT DB (solo dev)
# =========================
with app.app_context():
    db.create_all()


# =========================
# ▶️ RUN
# =========================
if __name__ == '__main__':
    app.run(debug=True)