from flask import Blueprint, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from app import db, bcrypt
from app.models import User
from datetime import timedelta


admin_bp = Blueprint('admin', __name__)

# RUTA TEST de http://127.0.0.1:5000/admin_bp que muestra "Hola mundo":
@admin_bp.route('/', methods=['GET'])
def show_hello_world():
     return "Hola mundo",200


# RUTA CREAR USUARIO
@admin_bp.route('/users', methods=['POST'])
def create_user():
    try:
        username = request.json.get('username')
        password = request.json.get('password')

        if not username or not password:
            return jsonify({'error': 'Username and password are required.'}), 400

        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            return jsonify({'error': 'Username already exists.'}), 409

        password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

        new_user = User(username=username, password=password_hash)


        db.session.add(new_user)
        db.session.commit()

        good_to_share_user = {
            'id': new_user.id,
            'username': new_user.username
        }

        return jsonify({'message': 'User created successfully.','user_created':good_to_share_user}), 201

    except Exception as e:
        return jsonify({'error': 'Error in user creation: ' + str(e)}), 500


#RUTA LOG-IN ( CON TOKEN DE RESPUESTA )
@admin_bp.route('/login', methods=['POST'])
def get_token():
    try:

        username = request.json.get('username')
        password = request.json.get('password')

        if not username or not password:
            return jsonify({'error': 'Username and password are required.'}), 400

        login_user = User.query.filter_by(username=username).one()

        password_from_db = login_user.password
        true_o_false = bcrypt.check_password_hash(password_from_db, password)
        
        if true_o_false:
            expires = timedelta(minutes=60)

            user_id = login_user.id
            access_token = create_access_token(identity=str(user_id), expires_delta=expires)
            return jsonify({ 'access_token':access_token}), 200

        else:
            return {"Error":"Contraseña  incorrecta"}
    
    except Exception as e:
        return {"Error":"El username proporcionado no corresponde a ninguno registrado: " + str(e)}, 500
    
    
@admin_bp.route('/users')
@jwt_required()
def show_users():
    current_user_id = get_jwt_identity()
    if current_user_id:
        users = User.query.all()
        user_list = []
        for user in users:
            user_dict = {
                'id': user.id,
                'username': user.username
            }
            user_list.append(user_dict)
        return jsonify(user_list), 200
    else:
        return {"Error": "Token inválido o no proporcionado"}, 401