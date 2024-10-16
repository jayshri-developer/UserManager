from flask import Flask
from flask_cors import CORS
from config import Config
from models import db
from routes import user_bp

app = Flask(__name__)
app.config.from_object(Config)

# Enable CORS for all routes
CORS(app)

# Initialize the database
db.init_app(app)

# Register routes (API)
app.register_blueprint(user_bp)

if __name__ == '__main__':
    app.run(debug=True)
