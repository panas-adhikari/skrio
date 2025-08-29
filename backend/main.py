from flask import Flask, jsonify, request
from flask_cors import CORS
from managers.db import DBManager

class Task:
    '''This class provides the blueprint of a task'''
    def __init__(self, task_heading: str, task_due_date, task_priority="None", task_category="Other", task_done=False):
        self.id = None
        self.task_heading = task_heading.lower().capitalize()
        self.task_done = task_done
        self.task_due_date = task_due_date if task_due_date else "Not set"
        self.task_priority = task_priority if task_priority else "None"
        self.task_category = task_category if task_category else "Other"

    def get_dict(self):
        '''This function returns the dict version of the instance for jsonify'''
        return {
            "task_heading": self.task_heading,
            "task_done": "Done" if self.task_done else "Pending",
            "task_due_date": self.task_due_date,
            "task_priority": self.task_priority,
            "task_category": self.task_category
        }

class TaskBook:
    '''This class aims to handle the list of tasks'''
    def __init__(self):
        self.taskBookDb = DBManager()
        

    def add_task(self, task: Task):
        '''Add new task to the list'''
        task_dict = task.get_dict()
        try:
            new_task_id = self.taskBookDb.add_task(task_dict)
        except Exception as e:
            print("Error adding task:", e)
        return {"message": "success", "task_id": new_task_id}

    def remove_task(self, task_id: int):
        '''Removes a task by its ID'''
        if self.taskBookDb.remove_task(task_id) :
            return True
        else:
            return False

    def get_tasks(self):
        '''Returns the list of tasks'''
        return self.taskBookDb.get_all_tasks()

    def toggle_task(self, task_id: int):
        '''Toggles the status of a task by its ID'''
        task = self.taskBookDb.get_task_from_id(task_id)
        task["task_done"] = "Pending" if task["task_done"] == "Done" else "Done"
        self.taskBookDb.update_task(task_id , task)
        return False
    
    def close_connection(self):
        self.taskBookDb.close_connection()
# --- Flask App ---

app = Flask(__name__)
CORS(app)
taskbook = TaskBook()

@app.route('/add_task', methods=['POST'])
def add_task_route():
    data = request.json
    if not data:
        return jsonify({"error": "No data received"}), 400

    task_heading = data.get("task_heading")
    task_due_date = data.get("task_due_date")
    task_priority = data.get("task_priority")
    task_category = data.get("task_category")
    
    new_task = Task(task_heading, task_due_date, task_priority, task_category, False)
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
    tasks = taskbook.get_tasks()
    return jsonify(tasks), 200

if __name__ == "__main__":
    try:
        app.run()
    except KeyboardInterrupt:
        taskbook.close_connection()