from celery import Celery
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize Celery
celery = Celery(
    'skillbridge',
    broker=os.getenv('REDIS_URL', 'redis://localhost:6379/0'),
    backend=os.getenv('REDIS_URL', 'redis://localhost:6379/0')
)

# Celery configuration
celery.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes
    task_soft_time_limit=25 * 60,  # 25 minutes
)

# Import tasks
from tasks import resume_tasks, job_tasks, notification_tasks

if __name__ == '__main__':
    celery.start()
