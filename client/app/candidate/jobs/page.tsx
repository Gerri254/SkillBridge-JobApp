'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  TrendingUp,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import api from '@/lib/api';

interface Job {
  id: string;
  title: string;
  company: string;
  company_logo?: string;
  location: string;
  employment_type: 'full-time' | 'part-time' | 'contract' | 'internship';
  experience_level: 'entry' | 'mid' | 'senior' | 'lead';
  salary_range: string;
  description: string;
  requirements: string[];
  posted_date: string;
  match_percentage: number;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState<string>('');
  const [experienceLevelFilter, setExperienceLevelFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/jobs');
      const jobsData = response.data.data || [];

      // Map backend data to frontend structure
      const mappedJobs = jobsData.map((job: Record<string, unknown>) => ({
        id: job.id as string,
        title: job.title as string,
        company: (job.company_name as string) || 'Unknown Company',
        company_logo: job.company_logo as string | undefined,
        location: (job.location as string) || 'Remote',
        employment_type: (job.employment_type as 'full-time' | 'part-time' | 'contract' | 'internship') || 'full-time',
        experience_level: (job.experience_level as 'entry' | 'mid' | 'senior' | 'lead') || 'mid',
        salary_range: (job.salary_range as string) || 'Competitive',
        description: (job.description as string) || '',
        requirements: (job.required_skills as string[]) || [],
        posted_date: formatPostedDate((job.created_at as string) || ''),
        match_percentage: (job.match_percentage as number) || 0,
      }));

      setJobs(mappedJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPostedDate = (date: string) => {
    if (!date) return 'Recently';
    const postedDate = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - postedDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation =
      !locationFilter ||
      job.location.toLowerCase().includes(locationFilter.toLowerCase());

    const matchesEmploymentType =
      !employmentTypeFilter ||
      job.employment_type === employmentTypeFilter;

    const matchesExperienceLevel =
      !experienceLevelFilter ||
      job.experience_level === experienceLevelFilter;

    return matchesSearch && matchesLocation && matchesEmploymentType && matchesExperienceLevel;
  });

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const clearFilters = () => {
    setSearchQuery('');
    setLocationFilter('');
    setEmploymentTypeFilter('');
    setExperienceLevelFilter('');
  };

  const getMatchBadge = (percentage: number) => {
    let color = 'from-green-600 to-emerald-600';
    if (percentage < 70) color = 'from-orange-600 to-yellow-600';
    if (percentage < 50) color = 'from-red-600 to-orange-600';

    return (
      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r ${color} text-white text-xs font-bold`}>
        <TrendingUp size={12} />
        {percentage}% Match
      </div>
    );
  };

  const getEmploymentTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      'full-time': 'bg-blue-500/10 border-blue-500/20 text-blue-400',
      'part-time': 'bg-purple-500/10 border-purple-500/20 text-purple-400',
      'contract': 'bg-orange-500/10 border-orange-500/20 text-orange-400',
      'internship': 'bg-green-500/10 border-green-500/20 text-green-400',
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-md border ${colors[type]} text-xs font-medium`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
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
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Browse Jobs</h1>
        <p className="text-zinc-400">Find your perfect job match from {jobs.length} opportunities</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
            <input
              type="text"
              placeholder="Search jobs, companies, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
            />
          </div>

          {/* Location Filter */}
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
            <input
              type="text"
              placeholder="Location..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
            />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-6 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white hover:bg-zinc-700 transition-all duration-200 flex items-center gap-2"
          >
            <Filter size={20} />
            Filters
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-zinc-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Employment Type */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Employment Type</label>
                <select
                  value={employmentTypeFilter}
                  onChange={(e) => setEmploymentTypeFilter(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                >
                  <option value="">All Types</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Experience Level</label>
                <select
                  value={experienceLevelFilter}
                  onChange={(e) => setExperienceLevelFilter(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                >
                  <option value="">All Levels</option>
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                  <option value="lead">Lead/Principal</option>
                </select>
              </div>
            </div>

            <button
              onClick={clearFilters}
              className="mt-4 text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center gap-1 transition-colors"
            >
              <X size={16} />
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-zinc-400">
          Showing {paginatedJobs.length} of {filteredJobs.length} jobs
        </p>
      </div>

      {/* Job Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {paginatedJobs.map((job) => (
          <div
            key={job.id}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-200"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {job.company.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">{job.title}</h3>
                  <p className="text-zinc-400 text-sm">{job.company}</p>
                </div>
              </div>
              {getMatchBadge(job.match_percentage)}
            </div>

            {/* Details */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-zinc-400 text-sm">
                <MapPin size={16} />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400 text-sm">
                <Briefcase size={16} />
                <span>{getEmploymentTypeBadge(job.employment_type)}</span>
                <span className="text-zinc-600">•</span>
                <span className="capitalize">{job.experience_level} Level</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400 text-sm">
                <DollarSign size={16} />
                <span>{job.salary_range}</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400 text-sm">
                <Clock size={16} />
                <span>Posted {job.posted_date}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{job.description}</p>

            {/* Requirements */}
            <div className="flex flex-wrap gap-2 mb-4">
              {job.requirements.slice(0, 3).map((req, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-full text-zinc-300 text-xs"
                >
                  {req}
                </span>
              ))}
              {job.requirements.length > 3 && (
                <span className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-full text-zinc-400 text-xs">
                  +{job.requirements.length - 3} more
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all duration-200">
                Apply Now
              </button>
              <button className="px-4 py-2 bg-zinc-800 border border-zinc-700 text-white rounded-lg hover:bg-zinc-700 transition-all duration-200">
                Save
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronLeft size={20} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentPage === page
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'bg-zinc-800 border border-zinc-700 text-white hover:bg-zinc-700'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
