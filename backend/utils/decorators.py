from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt


def role_required(*allowed_roles):
    """
    Decorator to check if user has required role
    Usage: @role_required('admin', 'employer')
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            user_role = claims.get('role')

            if user_role not in allowed_roles:
                return jsonify({
                    'success': False,
                    'error': 'Access denied. Insufficient permissions.'
                }), 403

            return fn(*args, **kwargs)
        return wrapper
    return decorator
