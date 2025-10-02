'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Job {
  id: string;
  title: string;
  company: string;
  company_logo?: string;
  location: string;
  employment_type: 'full-time' | 'part-time' | 'contract' | 'internship';
  salary_min: number;
  salary_max: number;
  currency: string;
  description: string;
  responsibilities: string[];
  required_skills: string[];
  preferred_skills: string[];
  benefits: string[];
  posted_date: string;
  deadline?: string;
  remote_option: boolean;
  experience_level: string;
  match_score?: number;
}

export default function JobDetailsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'candidate') {
      router.push('/login');
      return;
    }

    fetchJobDetails();
  }, [jobId, user, router]);

  const fetchJobDetails = async () => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data
      const mockJob: Job = {
        id: jobId,
        title: 'Senior Full Stack Developer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        employment_type: 'full-time',
        salary_min: 120000,
        salary_max: 180000,
        currency: 'USD',
        description: 'We are looking for an experienced Full Stack Developer to join our growing team. You will be responsible for developing and maintaining both frontend and backend components of our web applications.',
        responsibilities: [
          'Design, develop, and maintain scalable web applications',
          'Collaborate with cross-functional teams to define and implement new features',
          'Write clean, maintainable, and efficient code',
          'Participate in code reviews and contribute to team knowledge sharing',
          'Troubleshoot and debug applications',
          'Stay up-to-date with emerging technologies and industry trends'
        ],
        required_skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'PostgreSQL', 'REST APIs'],
        preferred_skills: ['Next.js', 'GraphQL', 'Docker', 'AWS', 'CI/CD', 'Redis'],
        benefits: [
          'Competitive salary and equity package',
          'Health, dental, and vision insurance',
          '401(k) with company match',
          'Flexible work arrangements',
          'Professional development budget',
          'Unlimited PTO',
          'Modern office with free snacks and drinks'
        ],
        posted_date: '2025-09-15',
        deadline: '2025-10-15',
        remote_option: true,
        experience_level: '5+ years',
        match_score: 87
      };

      setJob(mockJob);
    } catch (err) {
      setError('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setApplying(true);

    if (!coverLetter.trim()) {
      setError('Please write a cover letter');
      setApplying(false);
      return;
    }

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSuccess('Application submitted successfully!');
      setShowApplyModal(false);
      setTimeout(() => {
        router.push('/candidate/applications');
      }, 2000);
    } catch (err) {
      setError('Failed to submit application. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#EB9197] mx-auto"></div>
          <p className="text-zinc-400 mt-4">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Job not found</h2>
          <Link href="/candidate/jobs" className="btn-primary">
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Success Message */}
        {success && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg mb-6 animate-fadeIn">
            {success}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/candidate/jobs"
            className="text-zinc-400 hover:text-white transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Jobs
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <div className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  {job.company_logo ? (
                    <img
                      src={job.company_logo}
                      alt={job.company}
                      className="w-16 h-16 rounded-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gradient-primary flex items-center justify-center text-2xl font-bold text-white">
                      {job.company[0]}
                    </div>
                  )}
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{job.title}</h1>
                    <p className="text-xl text-zinc-300">{job.company}</p>
                  </div>
                </div>
                {job.match_score && (
                  <div className="text-center">
                    <div className="relative w-20 h-20">
                      <svg className="transform -rotate-90 w-20 h-20">
                        <circle
                          cx="40"
                          cy="40"
                          r="32"
                          stroke="#282828"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="40"
                          cy="40"
                          r="32"
                          stroke="url(#gradient)"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${(job.match_score / 100) * 201} 201`}
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#FFA082" />
                            <stop offset="100%" stopColor="#BA5DEF" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold gradient-text">{job.match_score}%</span>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">Match Score</p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-zinc-300">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1 text-[#EB9197]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {job.location}
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1 text-[#EB9197]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {job.employment_type.replace('-', ' ').toUpperCase()}
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1 text-[#EB9197]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {job.currency} {job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()}
                </div>
                {job.remote_option && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-[#EB9197]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Remote Available
                  </div>
                )}
              </div>
            </div>

            {/* Job Description */}
            <div className="card">
              <h2 className="text-2xl font-bold text-white mb-4">About the Role</h2>
              <p className="text-zinc-300 leading-relaxed">{job.description}</p>
            </div>

            {/* Responsibilities */}
            <div className="card">
              <h2 className="text-2xl font-bold text-white mb-4">Responsibilities</h2>
              <ul className="space-y-2">
                {job.responsibilities.map((resp, index) => (
                  <li key={index} className="flex items-start text-zinc-300">
                    <svg className="w-5 h-5 mr-2 mt-1 text-[#EB9197] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {resp}
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills */}
            <div className="card">
              <h2 className="text-2xl font-bold text-white mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {job.required_skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gradient-primary text-white rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <h3 className="text-xl font-bold text-white mb-3">Preferred Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.preferred_skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="card">
              <h2 className="text-2xl font-bold text-white mb-4">Benefits</h2>
              <ul className="space-y-2">
                {job.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start text-zinc-300">
                    <svg className="w-5 h-5 mr-2 mt-1 text-[#EB9197] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card sticky top-8 space-y-6">
              {/* Apply Button */}
              <button
                onClick={() => setShowApplyModal(true)}
                className="btn-primary w-full"
              >
                Apply Now
              </button>

              {/* Job Info */}
              <div className="pt-6 border-t border-zinc-700">
                <h3 className="text-lg font-bold text-white mb-4">Job Information</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-zinc-500 mb-1">Experience Level</p>
                    <p className="text-white font-medium">{job.experience_level}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 mb-1">Posted Date</p>
                    <p className="text-white font-medium">
                      {new Date(job.posted_date).toLocaleDateString()}
                    </p>
                  </div>
                  {job.deadline && (
                    <div>
                      <p className="text-zinc-500 mb-1">Application Deadline</p>
                      <p className="text-white font-medium">
                        {new Date(job.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Company Info */}
              <div className="pt-6 border-t border-zinc-700">
                <h3 className="text-lg font-bold text-white mb-4">About {job.company}</h3>
                <p className="text-zinc-300 text-sm mb-4">
                  Learn more about our company culture, values, and what makes us a great place to work.
                </p>
                <button className="btn-secondary w-full text-sm">
                  View Company Profile
                </button>
              </div>

              {/* Actions */}
              <div className="pt-6 border-t border-zinc-700 space-y-3">
                <button className="w-full px-4 py-2 border border-zinc-700 text-zinc-300 rounded-lg hover:bg-zinc-800 transition-all flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Save Job
                </button>
                <button className="w-full px-4 py-2 border border-zinc-700 text-zinc-300 rounded-lg hover:bg-zinc-800 transition-all flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share Job
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Apply for {job.title}</h2>
              <button
                onClick={() => setShowApplyModal(false)}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleApply} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Resume
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                  className="input-field"
                />
                <p className="text-xs text-zinc-500 mt-1">
                  Accepted formats: PDF, DOC, DOCX (Max 5MB)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Cover Letter <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="input-field min-h-[200px] resize-y"
                  placeholder="Tell us why you're a great fit for this role..."
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-6 py-3 border border-zinc-700 text-zinc-300 rounded-lg hover:bg-zinc-800 transition-all"
                  disabled={applying}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={applying}
                >
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
