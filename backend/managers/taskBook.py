from managers.db import DBTaskManager
class Task:
    '''This class provides the blueprint of a task'''
    def __init__(self, task_heading: str, task_due_date, user_id,task_priority="None", task_category="Other", task_done=False):
        self.id = None
        self.task_heading = task_heading.lower().capitalize()
        self.task_done = task_done
        self.task_due_date = task_due_date if task_due_date else "Not set"
        self.task_priority = task_priority if task_priority else "None"
        self.task_category = task_category if task_category else "Other"
        self.user_id = user_id

    def get_dict(self):
        '''This function returns the dict version of the instance for jsonify'''
        return {
            "task_heading": self.task_heading,
            "task_done": "Done" if self.task_done else "Pending",
            "task_due_date": self.task_due_date,
            "task_priority": self.task_priority,
            "task_category": self.task_category,
            "user_id": self.user_id
        }

class TaskBook:
    '''This class aims to handle the list of tasks'''
    def __init__(self):
        self.taskBookDb = DBTaskManager()


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

    def get_tasks(self,user_id):
        '''Returns the list of tasks'''
        return self.taskBookDb.get_all_tasks(user_id)

    def toggle_task(self, task_id: int):
        '''Toggles the status of a task by its ID'''
        task = self.taskBookDb.get_task_from_id(task_id)
        task["task_done"] = "Pending" if task["task_done"] == "Done" else "Done"
        self.taskBookDb.update_task(task_id , task)
        return False
    def update_task(self,task_id:int ,updated_task: Task):
        try:
            print("LOG debug")
            print(updated_task.get_dict())
            self.taskBookDb.update_task(task_id,updated_task.get_dict())
            return True
        except Exception as e:
            print("Error")
            return False
    
    def close_connection(self):
        self.taskBookDb.close_connection()