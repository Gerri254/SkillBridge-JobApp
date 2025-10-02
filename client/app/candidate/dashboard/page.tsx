'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Calendar,
  Eye,
  Heart,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import api from '@/lib/api';

interface StatCard {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  color: string;
}

interface Application {
  id: string;
  job_title: string;
  company: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'interviewed' | 'offered' | 'rejected';
  applied_date: string;
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary_range: string;
  match_percentage: number;
  posted_date: string;
}

export default function CandidateDashboard() {
  const [stats, setStats] = useState<StatCard[]>([
    {
      title: 'Applications Submitted',
      value: '0',
      change: 'Loading...',
      icon: Briefcase,
      color: 'from-purple-600 to-blue-600',
    },
    {
      title: 'Interviews Scheduled',
      value: '0',
      change: 'Loading...',
      icon: Calendar,
      color: 'from-pink-600 to-purple-600',
    },
    {
      title: 'Profile Views',
      value: '0',
      change: 'Loading...',
      icon: Eye,
      color: 'from-blue-600 to-cyan-600',
    },
    {
      title: 'Matches Found',
      value: '0',
      change: 'Loading...',
      icon: Heart,
      color: 'from-orange-600 to-pink-600',
    },
  ]);

  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch applications
      const applicationsRes = await api.get('/matching/applications');
      const applications = applicationsRes.data.data || [];

      // Fetch recommended jobs
      const jobsRes = await api.get('/jobs?limit=3');
      const jobs = jobsRes.data.data || [];

      // Calculate stats from applications
      const totalApplications = applications.length;
      const interviewedCount = applications.filter((app: Application) =>
        app.status === 'interviewed' || app.status === 'offered'
      ).length;

      // Update stats
      setStats([
        {
          title: 'Applications Submitted',
          value: totalApplications.toString(),
          change: `${applications.slice(0, 3).length} recent`,
          icon: Briefcase,
          color: 'from-purple-600 to-blue-600',
        },
        {
          title: 'Interviews Scheduled',
          value: interviewedCount.toString(),
          change: `${interviewedCount} in progress`,
          icon: Calendar,
          color: 'from-pink-600 to-purple-600',
        },
        {
          title: 'Profile Views',
          value: '0',
          change: 'Coming soon',
          icon: Eye,
          color: 'from-blue-600 to-cyan-600',
        },
        {
          title: 'Matches Found',
          value: jobs.length.toString(),
          change: `${jobs.length} available`,
          icon: Heart,
          color: 'from-orange-600 to-pink-600',
        },
      ]);

      // Set recent applications (limit to 4)
      setRecentApplications(applications.slice(0, 4));

      // Set recommended jobs
      setRecommendedJobs(jobs.slice(0, 3));

      // Calculate profile completion
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      let completion = 30; // Base for having an account
      if (user.email) completion += 20;
      if (user.full_name) completion += 20;
      if (user.phone) completion += 15;
      if (applications.length > 0) completion += 15;

      setProfileCompletion(Math.min(completion, 100));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
      pending: { bg: 'bg-yellow-500/10 border-yellow-500/20', text: 'text-yellow-400', icon: Clock },
      reviewed: { bg: 'bg-blue-500/10 border-blue-500/20', text: 'text-blue-400', icon: Eye },
      shortlisted: { bg: 'bg-purple-500/10 border-purple-500/20', text: 'text-purple-400', icon: CheckCircle },
      interviewed: { bg: 'bg-cyan-500/10 border-cyan-500/20', text: 'text-cyan-400', icon: Calendar },
      offered: { bg: 'bg-green-500/10 border-green-500/20', text: 'text-green-400', icon: CheckCircle },
      rejected: { bg: 'bg-red-500/10 border-red-500/20', text: 'text-red-400', icon: XCircle },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border ${config.bg} ${config.text} text-xs font-medium`}>
        <Icon size={12} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-zinc-400">Welcome back! Here is your job search overview.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-zinc-400 text-sm mb-2">{stat.title}</p>
              <p className="text-xs text-green-400 font-medium">{stat.change}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <div className="lg:col-span-2">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Recent Applications</h2>
              <Link
                href="/candidate/applications"
                className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center gap-1 transition-colors"
              >
                View All
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="space-y-4">
              {recentApplications.map((app) => (
                <div
                  key={app.id}
                  className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 hover:border-zinc-600 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold mb-1">{app.job_title}</h3>
                      <p className="text-zinc-400 text-sm">{app.company}</p>
                    </div>
                    {getStatusBadge(app.status)}
                  </div>
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span>Applied: {new Date(app.applied_date).toLocaleDateString()}</span>
                    <button className="text-purple-400 hover:text-purple-300 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Profile Completion Widget */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <AlertCircle className="text-white" size={20} />
              </div>
              <h2 className="text-white font-bold">Profile Completion</h2>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between text-white text-sm mb-2">
                <span>Complete your profile</span>
                <span className="font-bold">{profileCompletion}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-white h-full rounded-full transition-all duration-500"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-white text-sm">
                <CheckCircle size={16} className="text-green-300" />
                <span>Basic information added</span>
              </div>
              <div className="flex items-center gap-2 text-white text-sm">
                <CheckCircle size={16} className="text-green-300" />
                <span>Resume uploaded</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <Clock size={16} />
                <span>Add skills and experience</span>
              </div>
            </div>

            <button className="w-full bg-white text-purple-600 font-semibold py-2 rounded-lg hover:bg-white/90 transition-all duration-200">
              Complete Profile
            </button>
          </div>
        </div>
      </div>

      {/* Recommended Jobs */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Recommended Jobs</h2>
          <Link
            href="/candidate/jobs"
            className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center gap-1 transition-colors"
          >
            Browse All Jobs
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedJobs.map((job) => (
            <div
              key={job.id}
              className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-5 hover:border-zinc-600 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-200"
            >
              <div className="mb-4">
                {getMatchBadge(job.match_percentage)}
              </div>
              <h3 className="text-white font-semibold mb-2 text-lg">{job.title}</h3>
              <p className="text-zinc-400 text-sm mb-4">{job.company}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-zinc-400 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{job.salary_range}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-500 text-xs">{job.posted_date}</span>
                <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-all duration-200">
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
