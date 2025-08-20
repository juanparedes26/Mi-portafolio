from flask import Blueprint, jsonify

public_bp = Blueprint('public', __name__)

@public_bp.route('/')
def home():
    return jsonify({'msg':'Home Page'})

@public_bp.route('/demo')
def demo():
    return jsonify({'msg':'jeje)'}), 200

@public_bp.route('/about')
def about():
    return jsonify({'msg':'About Page'})