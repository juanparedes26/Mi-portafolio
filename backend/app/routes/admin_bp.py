from flask import Blueprint, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from app import db, bcrypt
from app.models import User ,Project
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
        
    # RUTA CREAR PROYECTO
@admin_bp.route('/projects', methods=['POST'])
@jwt_required()
def create_project():
    try:
        current_user_id = get_jwt_identity()
        if not current_user_id:
            return jsonify({'error': 'Token inválido o no proporcionado'}), 401

        data = request.get_json()
        if not data:
            return jsonify({'error': 'Request body must be JSON.'}), 400
        title = data.get('title')
        description = data.get('description')
        techs = data.get('techs')
        repo_url = data.get('repo_url')
        live_url = data.get('live_url')
        image_url = data.get('image_url')
        images = data.get('images')

        MAX_TECHS = 10
        MAX_IMAGES = 10

        if not isinstance(techs, list) or len(techs) > MAX_TECHS:
            return jsonify({'error': f'Máximo {MAX_TECHS} tecnologías permitidas.'}), 400

        if images and (not isinstance(images, list) or len(images) > MAX_IMAGES):
            return jsonify({'error': f'Máximo {MAX_IMAGES} imágenes permitidas.'}), 400

        if len(title) > 100:
            return jsonify({'error': 'El título no puede superar 100 caracteres.'}), 400

        if len(description) > 2000:
            return jsonify({'error': 'La descripción no puede superar 2000 caracteres.'}), 400



        if not title or not description or not techs :
            return jsonify({'error': 'Title, description, techs, and repo_url are required.'}), 400

        new_project = Project(
            title=title,
            description=description,
            techs=",".join(techs) if isinstance(techs, list) else techs,
            repo_url=repo_url,
            live_url=live_url,
            image_url=image_url,
            images=",".join(images) if isinstance(images, list) else images
        )

        db.session.add(new_project)
        db.session.commit()

        return jsonify({'message': 'Project created successfully.', 'project': new_project.serialize()}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error in project creation: ' + str(e)}), 500

# RUTA OBTENER TODOS LOS PROYECTOS
@admin_bp.route('/projects', methods=['GET'])
def get_projects():
    try:
        projects = Project.query.all()
        projects_list = [project.serialize() for project in projects]
        return jsonify(projects_list), 200
    except Exception as e:
        return jsonify({'error': 'Error fetching projects: ' + str(e)}), 500
# RUTA OBTENER PROYECTO POR ID
@admin_bp.route('/projects/<int:project_id>', methods=['GET'])
def get_project(project_id):
    try:
        project = Project.query.get(project_id)
        if not project:
            return jsonify({'error': 'Project not found.'}), 404
        return jsonify(project.serialize()), 200
    except Exception as e:
        return jsonify({'error': 'Error fetching project: ' + str(e)}), 500
    
# RUTA ACTUALIZAR PROYECTO POR ID
@admin_bp.route('/projects/<int:project_id>', methods=['PUT'])
@jwt_required()
def update_project(project_id):
    try:
        current_user_id = get_jwt_identity()
        if not current_user_id:
            return jsonify({'error': 'Token inválido o no proporcionado'}), 401

        project = Project.query.get(project_id)
        if not project:
            return jsonify({'error': 'Project not found.'}), 404

        data = request.get_json()
        if not data:
            return jsonify({'error': 'Request body must be JSON.'}), 400

        title = data.get('title', project.title)
        description = data.get('description', project.description)
        techs = data.get('techs', project.techs.split(",") if project.techs else [])
        repo_url = data.get('repo_url', project.repo_url)
        live_url = data.get('live_url', project.live_url)
        image_url = data.get('image_url', project.image_url)
        images = data.get('images', project.images.split(",") if project.images else [])

        MAX_TECHS = 10
        MAX_IMAGES = 10

        if not isinstance(techs, list) or len(techs) > MAX_TECHS:
            return jsonify({'error': f'Máximo {MAX_TECHS} tecnologías permitidas.'}), 400

        if images and (not isinstance(images, list) or len(images) > MAX_IMAGES):
            return jsonify({'error': f'Máximo {MAX_IMAGES} imágenes permitidas.'}), 400

        if len(title) > 100:
            return jsonify({'error': 'El título no puede superar 100 caracteres.'}), 400

        if len(description) > 2000:
            return jsonify({'error': 'La descripción no puede superar 2000 caracteres.'}), 400

        project.title = title
        project.description = description
        project.techs = ",".join(techs) if isinstance(techs, list) else techs
        project.repo_url = repo_url
        project.live_url = live_url
        project.image_url = image_url
        project.images = ",".join(images) if isinstance(images, list) else images

        db.session.commit()

        return jsonify({'message': 'Project updated successfully.', 'project': project.serialize()}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error updating project: ' + str(e)}), 500

# RUTA ELIMINAR PROYECTO POR ID
@admin_bp.route('/projects/<int:project_id>', methods=['DELETE'])
@jwt_required()
def delete_project(project_id):
    try:
        current_user_id = get_jwt_identity()
        if not current_user_id:
            return jsonify({'error': 'Token inválido o no proporcionado'}), 401

        project = Project.query.get(project_id)
        if not project:
            return jsonify({'error': 'Project not found.'}), 404

        db.session.delete(project)
        db.session.commit()

        return jsonify({'message': 'Project deleted successfully.'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error deleting project: ' + str(e)}), 500
    

