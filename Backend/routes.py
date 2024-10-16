# from flask import Blueprint, request, jsonify
# from models import db, User
# import re  # Import regex for email/phone validation

# user_bp = Blueprint('user', __name__)

# # Create a new user with validation
# @user_bp.route('/users', methods=['POST'])
# def create_user():
#     data = request.get_json()  # Fetch the JSON data sent by the frontend
#     print(f"Data received from frontend: {data}")  # Log the received data

#     if not data:
#         return jsonify({'error': 'No data provided'}), 400

#     # Initialize an empty dictionary to collect error messages
#     errors = {}

#     # Check for required fields and validate each one
#     if 'first_name' not in data or not data['first_name'].isalpha():
#         errors['first_name'] = 'First name must contain only letters.'

#     if 'last_name' not in data or not data['last_name'].isalpha():
#         errors['last_name'] = 'Last name must contain only letters.'

#     phone_pattern = re.compile(r'^\d{10}$')
#     if 'phone' not in data or not phone_pattern.match(data['phone']):
#         errors['phone'] = 'Phone number must be 10 digits.'

#     email_pattern = re.compile(r'^[\w\.-]+@[\w\.-]+\.\w+$')
#     if 'email' not in data or not email_pattern.match(data['email']):
#         errors['email'] = 'Invalid email format.'

#     if 'address' not in data or len(data['address']) < 5:
#         errors['address'] = 'Address must be at least 5 characters long.'

#     # If there are any errors, return them
#     if errors:
#         return jsonify({'validation_errors': errors}), 400

#     # If all validations pass, create the new user
#     new_user = User(
#         first_name=data['first_name'],
#         last_name=data['last_name'],
#         phone=data['phone'],
#         email=data['email'],
#         address=data['address']
#     )

#     try:
#         db.session.add(new_user)
#         db.session.commit()
#         return jsonify({'message': 'User created successfully'}), 201
#     except Exception as e:
#         db.session.rollback()
#         print(f"Error saving to database: {e}")  # Log any errors that occur
#         return jsonify({'error': 'Failed to add user'}), 500

from flask import Blueprint, request, jsonify
from models import db, User
import re

user_bp = Blueprint('user', __name__)

# Create a new user with validation
@user_bp.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()

    if not data:
        return jsonify({'error': 'No data provided'}), 400

    # Check for required fields and validate
    required_fields = ['first_name', 'last_name', 'phone', 'email', 'address']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'Missing field: {field}'}), 400

    # Validate first name and last name
    if not data['first_name'].isalpha() or not data['last_name'].isalpha():
        return jsonify({'error': 'First name and last name must contain only letters'}), 400

    # Validate phone
    phone_pattern = re.compile(r'^\d{10}$')
    if not phone_pattern.match(data['phone']):
        return jsonify({'error': 'Phone number must be 10 digits'}), 400

    # Validate email
    email_pattern = re.compile(r'^[\w\.-]+@[\w\.-]+\.\w+$')
    if not email_pattern.match(data['email']):
        return jsonify({'error': 'Invalid email format'}), 400

    # Validate address
    if len(data['address']) < 5:
        return jsonify({'error': 'Address must be at least 5 characters long'}), 400

    # Create the user
    new_user = User(
        first_name=data['first_name'],
        last_name=data['last_name'],
        phone=data['phone'],
        email=data['email'],
        address=data['address']
    )

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User created successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to add user'}), 500

# GET route to retrieve users
@user_bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    user_list = [{
        'id': user.id,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'phone': user.phone,
        'email': user.email,
        'address': user.address
    } for user in users]
    return jsonify(user_list), 200

# Update user
@user_bp.route('/users/<int:id>', methods=['PUT'])
def update_user(id):
    user = User.query.get_or_404(id)
    data = request.get_json()

    user.first_name = data.get('first_name', user.first_name)
    user.last_name = data.get('last_name', user.last_name)
    user.phone = data.get('phone', user.phone)
    user.email = data.get('email', user.email)
    user.address = data.get('address', user.address)

    db.session.commit()
    return jsonify({'message': 'User updated successfully'}), 200

# Delete user
@user_bp.route('/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.get_or_404(id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted successfully'}), 200

