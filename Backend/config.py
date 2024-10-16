class Config:
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:root@localhost:3306/user_db'
    # SQLALCHEMY_DATABASE_URI = 'mysql://root:root@localhost:3306/user_db'  # Update username/password
    SQLALCHEMY_TRACK_MODIFICATIONS = False
