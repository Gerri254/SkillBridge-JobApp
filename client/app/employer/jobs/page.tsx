'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Users,
  MapPin,
  DollarSign,
  Calendar,
  MoreVertical,
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  salary: {
    min: number;
    max: number;
  };
  status: 'active' | 'closed' | 'draft';
  applicationsCount: number;
  viewsCount: number;
  postedDate: string;
  deadline: string;
  skills: string[];
}

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'closed' | 'draft'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/jobs/my');
      const jobsData = response.data.data || [];

      // Map backend data to frontend structure
      const mappedJobs = jobsData.map((job: Record<string, unknown>) => ({
        id: job.id as string,
        title: job.title as string,
        description: (job.description as string) || '',
        location: (job.location as string) || 'Remote',
        type: (job.employment_type as 'full-time' | 'part-time' | 'contract' | 'internship') || 'full-time',
        salary: {
          min: (job.salary_min as number) || 0,
          max: (job.salary_max as number) || 0,
        },
        status: (job.status as 'active' | 'closed' | 'draft') || 'active',
        applicationsCount: (job.applications_count as number) || 0,
        viewsCount: (job.views_count as number) || 0,
        postedDate: job.created_at as string,
        deadline: (job.application_deadline as string) || '',
        skills: (job.required_skills as string[]) || [],
      }));

      setJobs(mappedJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job posting?')) return;

    try {
      await api.delete(`/jobs/${jobId}`);
      setJobs(jobs.filter(job => job.id !== jobId));
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job posting');
    }
  };


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'closed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'draft':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full-time':
        return 'bg-blue-500/20 text-blue-400';
      case 'part-time':
        return 'bg-purple-500/20 text-purple-400';
      case 'contract':
        return 'bg-pink-500/20 text-pink-400';
      case 'internship':
        return 'bg-orange-500/20 text-orange-400';
      default:
        return 'bg-zinc-500/20 text-zinc-400';
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (jobId: string, newStatus: Job['status']) => {
    try {
      await api.patch(`/jobs/${jobId}`, { status: newStatus });
      setJobs(
        jobs.map((job) =>
          job.id === jobId ? { ...job, status: newStatus } : job
        )
      );
      setShowActionMenu(null);
    } catch (error) {
      console.error('Error updating job status:', error);
      alert('Failed to update job status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Manage Jobs</h1>
          <p className="text-zinc-400">
            View and manage all your job postings
          </p>
        </div>
        <Link
          href="/employer/jobs/create"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-all duration-200"
        >
          <Plus size={20} />
          Create New Job
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-[#282828] rounded-lg p-6 border border-zinc-800">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search jobs by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'closed' | 'draft')}
              className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
              <option value="draft">Draft</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white hover:border-purple-500 transition-all duration-200"
            >
              <Filter size={20} />
              Filters
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">
              {jobs.filter((j) => j.status === 'active').length}
            </p>
            <p className="text-zinc-400 text-sm">Active Jobs</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">
              {jobs.reduce((sum, job) => sum + job.applicationsCount, 0)}
            </p>
            <p className="text-zinc-400 text-sm">Total Applications</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">
              {jobs.reduce((sum, job) => sum + job.viewsCount, 0)}
            </p>
            <p className="text-zinc-400 text-sm">Total Views</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">
              {jobs.filter((j) => j.status === 'draft').length}
            </p>
            <p className="text-zinc-400 text-sm">Drafts</p>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="bg-[#282828] rounded-lg p-12 border border-zinc-800 text-center">
            <p className="text-zinc-400 text-lg">No jobs found</p>
            <p className="text-zinc-500 text-sm mt-2">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-[#282828] rounded-lg p-6 border border-zinc-800 hover:border-purple-500/50 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">
                          {job.title}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            job.status
                          )}`}
                        >
                          {job.status.charAt(0).toUpperCase() +
                            job.status.slice(1)}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
                            job.type
                          )}`}
                        >
                          {job.type
                            .split('-')
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(' ')}
                        </span>
                      </div>
                      <p className="text-zinc-400 line-clamp-2">
                        {job.description}
                      </p>
                    </div>

                    {/* Actions Menu */}
                    <div className="relative">
                      <button
                        onClick={() =>
                          setShowActionMenu(
                            showActionMenu === job.id ? null : job.id
                          )
                        }
                        className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all duration-200"
                      >
                        <MoreVertical size={20} />
                      </button>

                      {showActionMenu === job.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setShowActionMenu(null)}
                          />
                          <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg overflow-hidden z-20">
                            <Link
                              href={`/jobs/${job.id}/edit`}
                              className="flex items-center gap-3 px-4 py-3 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                            >
                              <Edit size={16} />
                              Edit Job
                            </Link>
                            <button
                              onClick={() =>
                                handleStatusChange(
                                  job.id,
                                  job.status === 'active' ? 'closed' : 'active'
                                )
                              }
                              className="w-full flex items-center gap-3 px-4 py-3 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                            >
                              <Eye size={16} />
                              {job.status === 'active'
                                ? 'Close Job'
                                : 'Activate Job'}
                            </button>
                            <button
                              onClick={() => handleDeleteJob(job.id)}
                              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                              <Trash2 size={16} />
                              Delete Job
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Job Details */}
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center gap-2 text-zinc-400 text-sm">
                      <MapPin size={16} />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-2 text-zinc-400 text-sm">
                      <DollarSign size={16} />
                      ${job.salary.min.toLocaleString()} - $
                      {job.salary.max.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2 text-zinc-400 text-sm">
                      <Calendar size={16} />
                      Deadline: {new Date(job.deadline).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-zinc-800 text-zinc-300 text-sm rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-purple-400" />
                      <span className="text-white font-semibold">
                        {job.applicationsCount}
                      </span>
                      <span className="text-zinc-400 text-sm">
                        Applications
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye size={16} className="text-blue-400" />
                      <span className="text-white font-semibold">
                        {job.viewsCount}
                      </span>
                      <span className="text-zinc-400 text-sm">Views</span>
                    </div>
                    <div className="text-zinc-500 text-sm">
                      Posted {new Date(job.postedDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
