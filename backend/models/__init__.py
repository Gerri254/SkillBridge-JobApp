from pymongo import MongoClient
from config import Config

# MongoDB client
client = MongoClient(Config.MONGODB_URI)
db = client.get_database()

from .user import User
from .job import Job
from .application import Application

__all__ = ['db', 'client', 'User', 'Job', 'Application']
