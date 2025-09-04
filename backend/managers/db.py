from pymongo import MongoClient
from datetime import datetime , timezone #for logging the timestamp of the creating and insertion of the task
def printdb(args):
    print(f"Database Log : {args}")

class DBTaskManager:
    '''
    This class create a connection to the mongodb server and provides several function to interact with the database.
    '''
    def __init__(self ,db_name="taskBookLibrary",collection_name="task_book",free_id_pool = "free_id_pool" ,url="mongodb://localhost:27017"):
        self.client = MongoClient(url)
        self.db = self.client[db_name]
        self.tasks_collection = self.db[collection_name]
        self.id_pool = self.db[free_id_pool]

    def reset_database(self):
        '''Resets the entire database (for development/testing purposes)'''
        self.tasks_collection.delete_many({})
        self.id_pool.delete_many({})
        # printdb("Database reset")

    def __get_id(self):
        result = self.id_pool.find_one({})
        if result and result["available_ids"]:
            returnable_id = min(result["available_ids"])
            self.id_pool.update_one({},{"$pull":{"available_ids":returnable_id}})
            # printdb(f"new id is : {returnable_id}")
            return returnable_id
        else :
            if result:
                new_last_id = result["last_id"] + 1
                self.id_pool.update_one({}, {"$set": {"last_id": new_last_id}})
            else:
                new_last_id = 1
                self.id_pool.insert_one({"available_ids": [], "last_id": new_last_id})
            # printdb(f"new id is : {new_last_id}")
            return new_last_id

    def add_task(self,task:dict):
        '''Funciton to add a task in the databse .@params: it takes task as parameter . Note: task must be in standard format. should not contain a task id'''
        try:
            task["created_at"] = datetime.now(timezone.utc)
            task["id"] = self.__get_id()
            self.tasks_collection.insert_one(task)
            # printdb("ADDED A TASK")
            return task["id"]
        except Exception as e:
            print("Error adding task:",e)
            return False
  
    def remove_task(self,task_id:int):
        '''Function to remove task forom the database utilizing the task ID ,'''
        try:
            result = self.tasks_collection.delete_one({"id":task_id})
            # printdb("Removed a task")
            if result.deleted_count >0:
                self.id_pool.update_one({}, {"$addToSet": {"available_ids": task_id}}, upsert=True)
                return True
        except Exception as e:
            print("Error removing task:",e)
            return False

    def update_task(self,task_id:int,task:dict):
        """Funciton to update any task (for future integration)"""
        try:
            result = self.tasks_collection.update_one({"id":task_id},{"$set":task})
            printdb(f"affected : {result.modified_count}")
            if result.modified_count == 0:
                printdb("No task was updated")
        except Exception as e:
            print("Error updating task:",e)

    def get_all_tasks(self,task_user_id):
        """Function to get all the tasks logged in the database."""
        try:
            result = []
            for collection in self.tasks_collection.find({"user_id":task_user_id},{"_id":0 , "user_id":0}):
                result.append(collection)
            return result
        except Exception as e:
            print("Error fetching tasks:",e)
            return False

    def get_task_from_id(self, task_id: int):
        """Function to get a specific task from the database by its id"""
        try:
            # printdb(f"Fetching task with id: {task_id}")
            result = self.tasks_collection.find_one({"id": task_id}, {"_id": 0,"user_id":0})
            return result
        except Exception as e:
            print("Error fetching task:", e)
            return False

    def close_connection(self):
        '''Close the connecion if required'''
        self.client.close()

class DBUserManager:
    def __init__(self , db_name="taskBookLibrary" , collection_name="users" , url="mongodb://localhost:27017"):
        self.client = MongoClient(url)
        self.db = self.client[db_name]
        self.users_collection = self.db[collection_name]

    def reset_database(self):
        '''Resets the entire database (for development/testing purposes)'''
        self.users_collection.delete_many({})

    def add_user(self, user: dict):
        '''Function to add a user to the database'''
        try:
            new_user = self.users_collection.insert_one(user)
            return new_user
        except Exception as e:
            print("Error adding user:", e)
            return None
    
    def get_user_by_username(self,username:str):
        '''Function to get a user from the database by their username'''
        try:
            user = self.users_collection.find_one({"username": username}, {"_id": 0})
            return user
        except Exception as e:
            print("Error fetching user:", e)
            return False
    def get_user_by_email(self,email:str):
        '''Function to get a user from the database by their email'''
        try:
            user = self.users_collection.find_one({"email": email}, {"_id": 0})
            return user
        except Exception as e:
            print("Error fetching user:", e)
            return False
    def remove_user(self, user_id: int):
        '''Function to remove a user from the database by their ID'''
        try:
            result = self.users_collection.delete_one({"id": user_id})
            return result.deleted_count > 0
        except Exception as e:
            print("Error removing user:", e)
            return False

    def get_all_users(self):
        """Function to get all the users from the database."""
        try:
            result = []
            for user in self.users_collection.find({}, {"_id": 0}):
                result.append(user)
            # printdb("returned all the users")
            return result
        except Exception as e:
            print("Error fetching users:", e)
            return False
    
    def authenticate_user(self, username: str) -> dict:
        """
        Authenticate a user (only fetch user from DB).
        Returns:
        - success: int (1=success, 2=user not found, 4=error)
        - message: str
        - user: dict (only when success=1)
        """
        try:
            user = self.users_collection.find_one({"username": username})
            if not user:
                return {"success": 2, "message": "User not Found"}

            # Only return user + stored hash
            return {
                "success": 1,
                "message": "User found",
                "user": {
                    "id": str(user["_id"]),
                    "username": user["username"],
                    "password": user["password"]
                }
            }

        except Exception as e:
            print("Error during authentication:", e)
            return {"success": 4, "message": "Error during authentication"}
            
    def close_connection(self):
        '''Close the connection if required'''
        self.client.close()

if __name__ == "__main__":
    db_manager = DBTaskManager()
    user_manager = DBUserManager()
    db_manager.reset_database()
    user_manager.reset_database()