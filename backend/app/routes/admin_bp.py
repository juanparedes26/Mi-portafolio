from flask import Blueprint, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from app import db, bcrypt
from app.models import User ,Project
from datetime import timedelta
import os
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '..', 'static', 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'JPG'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


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
        title_en = data.get('title_en')
        description_en = data.get('description_en')
        techs = data.get('techs')
        repo_url = data.get('repo_url')
        live_url = data.get('live_url')
        image_url = data.get('image_url')
        images = data.get('images')
        main_image_index = data.get('main_image_index', 0)

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
        
        if title_en and len(title_en) > 100:
            return jsonify({'error': 'El título en inglés no puede superar 100 caracteres.'}), 400

        if description_en and len(description_en) > 2000:
            return jsonify({'error': 'La descripción en inglés no puede superar 2000 caracteres.'}), 400




        if not title or not description or not techs:
            return jsonify({'error': 'Title, description, and techs are required.'}), 400

        new_project = Project(
            title=title,
            description=description,
            title_en=title_en,
            description_en=description_en,
            techs=",".join(techs) if isinstance(techs, list) else techs,
            repo_url=repo_url or "",  
            live_url=live_url,
            image_url=image_url,
            images=",".join(images) if isinstance(images, list) else images,
            main_image_index=main_image_index
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
        print("Buscando proyecto con ID:", project_id)
        project = Project.query.get(project_id)
        print("Resultado:", project)
        if not project:
            return jsonify({'ok': False, 'data': None, 'error': 'Project not found.'}), 404
        return jsonify({'ok': True, 'data': project.serialize()}), 200
    except Exception as e:
        return jsonify({'ok': False, 'data': None, 'error': 'Error fetching project: ' + str(e)}), 500
    
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
        title_en = data.get('title_en', project.title_en)
        description_en = data.get('description_en', project.description_en)
        techs = data.get('techs', project.techs.split(",") if project.techs else [])
        repo_url = data.get('repo_url', project.repo_url)
        live_url = data.get('live_url', project.live_url)
        image_url = data.get('image_url', project.image_url)
        images = data.get('images', project.images.split(",") if project.images else [])
        main_image_index = data.get('main_image_index', project.main_image_index or 0)

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
        if title_en and len(title_en) > 100:
            return jsonify({'error': 'El título en inglés no puede superar 100 caracteres.'}), 400
        if description_en and len(description_en) > 2000:
            return jsonify({'error': 'La descripción en inglés no puede superar 2000 caracteres.'}), 400

        project.title = title
        project.description = description
        project.title_en = title_en
        project.description_en = description_en
        project.techs = ",".join(techs) if isinstance(techs, list) else techs
        project.repo_url = repo_url or ""  
        project.live_url = live_url
        project.image_url = image_url
        project.images = ",".join(images) if isinstance(images, list) else images
        project.main_image_index = main_image_index

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
# RUTA SUBIR IMAGEN
@admin_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_file():
    try:
        current_user_id = get_jwt_identity()
        if not current_user_id:
            return jsonify({'error': 'Token inválido o no proporcionado'}), 401

        if 'file' not in request.files:
            return jsonify({'error': 'No file part in the request.'}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file.'}), 400

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(file_path)
            file_url = f'http://localhost:5100/static/uploads/{filename}'
            return jsonify({'message': 'File uploaded successfully.', 'file_url': file_url}), 201
        else:
            return jsonify({'error': 'File type not allowed.'}), 400

    except Exception as e:
        return jsonify({'error': 'Error uploading file: ' + str(e)}), 500


# RUTA SUBIR MÚLTIPLES IMÁGENES
@admin_bp.route('/upload-multiple', methods=['POST'])
@jwt_required()
def upload_multiple_files():
    try:
        current_user_id = get_jwt_identity()
        if not current_user_id:
            return jsonify({'error': 'Token inválido o no proporcionado'}), 401

        if 'files' not in request.files:
            return jsonify({'error': 'No files in the request.'}), 400

        files = request.files.getlist('files')
        if not files or len(files) == 0:
            return jsonify({'error': 'No files selected.'}), 400

        MAX_FILES = 10
        if len(files) > MAX_FILES:
            return jsonify({'error': f'Máximo {MAX_FILES} archivos permitidos.'}), 400

        uploaded_files = []
        for file in files:
            if file and file.filename != '' and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                # Agregar timestamp para evitar conflictos de nombres
                import time
                timestamp = str(int(time.time()))
                name, ext = os.path.splitext(filename)
                unique_filename = f"{name}_{timestamp}{ext}"
                
                file_path = os.path.join(UPLOAD_FOLDER, unique_filename)
                file.save(file_path)
                file_url = f'http://localhost:5100/static/uploads/{unique_filename}'
                uploaded_files.append(file_url)
            else:
                return jsonify({'error': f'File type not allowed: {file.filename}'}), 400

        return jsonify({
            'message': f'{len(uploaded_files)} files uploaded successfully.',
            'files': uploaded_files
        }), 201

    except Exception as e:
        return jsonify({'error': 'Error uploading files: ' + str(e)}), 500