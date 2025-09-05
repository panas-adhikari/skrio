import bcrypt #type: ignore
from managers.db import DBUserManager
from managers.sessionManager import generate_jwt

def generateHash(password:str)->str:
    '''This function generates hash of the password using bcrypt'''
    salt = bcrypt.gensalt()
    hash = bcrypt.hashpw(password.encode('utf-8'),salt)
    return hash.decode('utf-8')

def HandleLogin(username: str, password: str) -> dict:
    user_manager = DBUserManager()
    auth_result = user_manager.authenticate_user(username)
    if auth_result["success"] == 1:
        stored_hash = auth_result["user"]["password"]
        if bcrypt.checkpw(password.encode("utf-8"), stored_hash.encode("utf-8")):
            token = generate_jwt(auth_result["user"]["id"])
            del user_manager
            user_data = {
                "username": auth_result["user"]["username"]
            }
            return {"status": "success", "token": token, "user": user_data}
        else:
            del user_manager
            return {"status": "error", "message": "Password does not match"}

    del user_manager
    return {"status": "error", "message": auth_result["message"]}
def HandleRegister(username: str, password: str, email: str) -> dict:
    """
    Handles all registration logic:
    - field validation
    - check existing username/email
    - hash password
    - insert into DB
    """
    if not all([username, password, email]):
        return {"status": "error", "message": "All fields are required"}

    user_manager = DBUserManager()

    if user_manager.get_user_by_username(username):
        print("usernme error")
        return {"status": "error", "message": "Username already exists", "conflict": True}

    if user_manager.get_user_by_email(email):
        print("email error")
        return {"status": "error", "message": "Email already registered", "conflict": True}

    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    new_user = {
        "username": username,
        "password": hashed_password,
        "email": email
    }
    result = user_manager.add_user(new_user)
    if result:
        user_id = str(result.inserted_id)
        token = generate_jwt(user_id)
        return {"status": "success", "message": "User registered successfully", "token": token}
    else:
        return {"status": "error", "message": "Failed to register user", "server_error": True}
    
def check_user_validity(user_id: str) -> bool:
    '''Function to check if a user exists in the database by their user_id'''
    user_manager = DBUserManager()
    exists = user_manager.user_exists(user_id)
    print("Checking user's Validiy :",exists)
    del user_manager
    return exists