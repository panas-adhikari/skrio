from flask import Flask, jsonify, request
from flask_cors import CORS
from managers.taskBook import Task, TaskBook
from managers.loginManager import HandleLogin , HandleRegister 
from managers.sessionManager import get_requester_user



app = Flask(__name__)
CORS(app)
taskbook = TaskBook()

@app.route('/add_task', methods=['POST'])
def add_task_route():
    data = request.json
    jwt_token = request.headers.get('Authorization')
    print(f"JWT {jwt_token}")
    if not jwt_token:
        print("JWT token not found")
        return jsonify({"error": "Unauthorized"}), 401
    else:
        user_id = get_requester_user(jwt_token)
        if not user_id:
            print("User ID not found")
            return jsonify({"error": "Unauthorized"}), 401
    if not data:
        return jsonify({"error": "No data received"}), 400

    task_heading = data.get("task_heading")
    task_due_date = data.get("task_due_date")
    task_priority = data.get("task_priority")
    task_category = data.get("task_category")

    new_task = Task(task_heading, task_due_date, user_id, task_priority, task_category, False)
    newData = taskbook.add_task(new_task)
    return jsonify(newData), 201

@app.route('/tasks/delete/<int:task_id>', methods=['DELETE'])
def delete_task_route(task_id: int):
    if taskbook.remove_task(task_id):
        return jsonify({"message": f"Task {task_id} deleted successfully"}), 200
    else:
        return jsonify({"error": f"Task {task_id} not found"}), 404

@app.route('/tasks/status/<int:task_id>', methods=['PUT'])
def toggle_task_route(task_id: int):
    if taskbook.toggle_task(task_id):
        return jsonify({"message": f"Status of task {task_id} toggled successfully"}), 200
    else:
        return jsonify({"error": f"Task {task_id} not found"}), 404

@app.route('/get_tasks', methods=['GET'])
def get_tasks_route():
    jwt_token = request.headers.get('Authorization')
    print(f"JWT {jwt_token}")

    if not jwt_token:
        print("JWT token not found")
        return jsonify({"error": "Unauthorized"}), 401
    
    user_id = get_requester_user(jwt_token)
    if not user_id:
        print("User ID not found")
        return jsonify({"error": "Unauthorized"}), 401

    tasks = taskbook.get_tasks(user_id)
    return jsonify(tasks), 200


@app.route('/tasks/update/<int:task_id>', methods=['PUT'])
def update_task_route(task_id: int):
    data = request.json
    jwt_token = request.headers.get('Authorization')
    user_id = get_requester_user(jwt_token)
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    if not data:
        return jsonify({"error": "No data received"}), 400

    task_heading = data.get("task_heading")
    task_due_date = data.get("task_due_date")
    task_priority = data.get("task_priority")
    task_category = data.get("task_category")
    task_done = True if data.get("task_done") == "Done" else False
    updated_task = Task(task_heading ,task_due_date,user_id, task_priority, task_category, task_done)
    if taskbook.update_task(int(task_id),updated_task):
        return jsonify({"message": "Task updated successfully"}), 200
    else:
        return jsonify({"message": "Task Not Updated"}), 404

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    if not data:
        return jsonify({"status": "error", "message": "No data received"}), 400
    
    username = data.get("username")
    password = data.get("password")

    result = HandleLogin(username, password)
    if result["status"] == "success":
        return jsonify(result), 200
    else:
        return jsonify(result), 401
    
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    if not data:
        return jsonify({"status": "error", "message": "No data received"}), 400

    username = data.get("username")
    password = data.get("password")
    email = data.get("email")

    # Calling the handling function gor validation and token generation
    result = HandleRegister(username, password, email)

    # Mapping status to HTTP code
    if result["status"] == "success":
        status_code = 201 
    elif result.get("conflict"):
        status_code = 409  
    elif result.get("server_error"):
        status_code = 500  
    else:
        status_code = 400

    return jsonify(result), status_code

if __name__ == "__main__":
    try:
        app.run()
    except KeyboardInterrupt as e:
        print("Shutting down server...")
        taskbook.close_connection()
    except:
        print("Error occurred")
    finally:
        taskbook.close_connection()