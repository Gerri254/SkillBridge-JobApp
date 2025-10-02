from celery_app import celery
from services.job_matcher import JobMatcher
from services.vector_service import VectorService
from models import Job
import logging

logger = logging.getLogger(__name__)

vector_service = VectorService()
job_matcher = JobMatcher(vector_service)


@celery.task(name='tasks.generate_job_matches')
def generate_job_matches(job_id: str, limit: int = 50):
    """
    Generate candidate matches for a newly posted job
    """
    try:
        logger.info(f"Generating matches for job: {job_id}")

        # Get job
        job = Job.query.get(job_id)
        if not job:
            return {'success': False, 'error': 'Job not found'}

        # Generate job embedding
        job_data = {
            'title': job.title,
            'description': job.description,
            'required_skills': job.required_skills or [],
            'preferred_skills': job.preferred_skills or [],
            'experience_years': job.experience_years,
            'location': job.location
        }
        job_embedding = job_matcher.generate_job_embedding(job_data)

        # Find matching candidates
        matches = job_matcher.match_candidates_for_job(
            job_data=job_data,
            job_embedding=job_embedding,
            limit=limit
        )

        logger.info(f"Found {len(matches)} matches for job: {job_id}")

        return {
            'success': True,
            'job_id': job_id,
            'matches_count': len(matches)
        }

    except Exception as e:
        logger.error(f"Error generating job matches: {e}")
        return {'success': False, 'error': str(e)}


@celery.task(name='tasks.update_job_vector')
def update_job_vector(job_id: str):
    """
    Update job vector in Qdrant
    """
    try:
        logger.info(f"Updating job vector: {job_id}")

        # Get job
        job = Job.query.get(job_id)
        if not job:
            return {'success': False, 'error': 'Job not found'}

        # Regenerate embedding
        job_data = {
            'title': job.title,
            'description': job.description,
            'required_skills': job.required_skills or [],
            'preferred_skills': job.preferred_skills or [],
            'experience_years': job.experience_years,
            'location': job.location
        }
        new_embedding = job_matcher.generate_job_embedding(job_data)

        # Update metadata
        from models import User
        employer = User.query.get(job.employer_id)

        metadata = {
            'job_id': job_id,
            'required_skills': job.required_skills or [],
            'preferred_skills': job.preferred_skills or [],
            'experience_years': job.experience_years,
            'location': job.location,
            'employment_type': job.employment_type or '',
            'salary_min': job.salary_min or 0,
            'salary_max': job.salary_max or 0,
            'category': job.category or '',
            'company': employer.company_name if employer else ''
        }

        # Store updated vector
        vector_service.store_job_vector(
            job_id=job_id,
            embedding=new_embedding,
            metadata=metadata
        )

        logger.info(f"Job vector updated: {job_id}")

        return {'success': True, 'job_id': job_id}

    except Exception as e:
        logger.error(f"Error updating job vector: {e}")
        return {'success': False, 'error': str(e)}
