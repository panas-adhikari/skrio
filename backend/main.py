from flask import Flask, jsonify, request
from flask_cors import CORS
import random
import string

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
            "id": self.id,
            "task_heading": self.task_heading,
            "task_done": "Done" if self.task_done else "Pending",
            "task_due_date": self.task_due_date,
            "task_priority": self.task_priority,
            "task_category": self.task_category
        }

class TaskBook:
    '''This class aims to handle the list of tasks'''
    def __init__(self):
        self.tasks = []
        self._next_id = 1 # Start ID at 1 for clarity

    def add_task(self, task: Task):
        '''Add new task to the list'''
        task.id = self._next_id
        self._next_id += 1
        self.tasks.append(task.get_dict())
        return {"message": "success", "task_id": task.id}

    def remove_task(self, task_id: int):
        '''Removes a task by its ID'''
        original_length = len(self.tasks)
        # Filter out the task with the matching ID
        self.tasks = [task for task in self.tasks if task.get("id") != task_id]
        return len(self.tasks) < original_length # Returns True if a task was removed

    def get_tasks(self):
        '''Returns the list of tasks'''
        return self.tasks

    def toggle_task(self, task_id: int):
        '''Toggles the status of a task by its ID'''
        for task in self.tasks:
            if task.get("id") == task_id:
                current_status = task.get("task_done")
                task["task_done"] = "Pending" if current_status == "Done" else "Done"
                return True
        return False

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
    taskbook.add_task(Task("Build a backend API", "2025-09-01", "High"))
    taskbook.add_task(Task("Plan the frontend", "2025-09-05", "Medium"))
    taskbook.add_task(Task("Learn Redux", "2025-08-30"))
    app.run(debug=True)