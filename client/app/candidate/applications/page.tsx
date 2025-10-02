'use client';

import React, { useState, useEffect } from 'react';
import {
  Clock,
  Eye,
  CheckCircle,
  Calendar,
  Award,
  XCircle,
  FileText,
  MapPin,
  Briefcase,
  DollarSign,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react';
import api from '@/lib/api';

interface Application {
  id: string;
  job_id: string;
  job_title: string;
  company: string;
  location: string;
  salary_range: string;
  employment_type: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'interviewed' | 'offered' | 'rejected';
  applied_date: string;
  updated_date: string;
  cover_letter: string;
  timeline: TimelineEvent[];
}

interface TimelineEvent {
  status: string;
  date: string;
  description: string;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/matching/applications');
      const applicationsData = response.data.data || [];

      // Map backend data to frontend structure
      const mappedApplications = applicationsData.map((app: Record<string, unknown>) => ({
        id: app.id,
        job_id: app.job_id,
        job_title: app.job_title || 'Unknown Position',
        company: app.company || 'Unknown Company',
        location: app.location || 'Remote',
        salary_range: app.salary_range || 'Not specified',
        employment_type: app.employment_type || 'Full-time',
        status: app.status || 'pending',
        applied_date: app.created_at || new Date().toISOString(),
        updated_date: app.updated_at || app.created_at || new Date().toISOString(),
        cover_letter: app.cover_letter || 'No cover letter provided',
        timeline: generateTimeline(app),
      }));

      setApplications(mappedApplications);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateTimeline = (app: Record<string, unknown>) => {
    const timeline: TimelineEvent[] = [];

    timeline.push({
      status: 'Applied',
      date: (app.created_at as string) || '',
      description: 'Application submitted successfully',
    });

    if (app.status === 'reviewed' || app.status === 'shortlisted' || app.status === 'interviewed' || app.status === 'offered') {
      timeline.push({
        status: 'Reviewed',
        date: (app.updated_at as string) || (app.created_at as string) || '',
        description: 'Your application is under review by the hiring team',
      });
    }

    if (app.status === 'shortlisted' || app.status === 'interviewed' || app.status === 'offered') {
      timeline.push({
        status: 'Shortlisted',
        date: (app.updated_at as string) || (app.created_at as string) || '',
        description: 'You have been shortlisted for interview',
      });
    }

    if (app.status === 'interviewed' || app.status === 'offered') {
      timeline.push({
        status: 'Interviewed',
        date: (app.updated_at as string) || (app.created_at as string) || '',
        description: 'Interview completed',
      });
    }

    if (app.status === 'offered') {
      timeline.push({
        status: 'Offered',
        date: (app.updated_at as string) || (app.created_at as string) || '',
        description: 'Job offer extended',
      });
    }

    if (app.status === 'rejected') {
      timeline.push({
        status: 'Rejected',
        date: (app.updated_at as string) || (app.created_at as string) || '',
        description: 'Application not selected at this time',
      });
    }

    return timeline;
  };

  const [statusFilter, setStatusFilter] = useState<string>('');
  const [expandedApp, setExpandedApp] = useState<string | null>(null);

  const filteredApplications = statusFilter
    ? applications.filter((app) => app.status === statusFilter)
    : applications;

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
      pending: { bg: 'bg-yellow-500/10 border-yellow-500/20', text: 'text-yellow-400', icon: Clock },
      reviewed: { bg: 'bg-blue-500/10 border-blue-500/20', text: 'text-blue-400', icon: Eye },
      shortlisted: { bg: 'bg-purple-500/10 border-purple-500/20', text: 'text-purple-400', icon: CheckCircle },
      interviewed: { bg: 'bg-cyan-500/10 border-cyan-500/20', text: 'text-cyan-400', icon: Calendar },
      offered: { bg: 'bg-green-500/10 border-green-500/20', text: 'text-green-400', icon: Award },
      rejected: { bg: 'bg-red-500/10 border-red-500/20', text: 'text-red-400', icon: XCircle },
    };
    return configs[status] || configs.pending;
  };

  const getStatusBadge = (status: string) => {
    const config = getStatusConfig(status);
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border ${config.bg} ${config.text} text-xs font-medium`}>
        <Icon size={12} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const statusCounts = {
    all: applications.length,
    pending: applications.filter((a) => a.status === 'pending').length,
    reviewed: applications.filter((a) => a.status === 'reviewed').length,
    shortlisted: applications.filter((a) => a.status === 'shortlisted').length,
    interviewed: applications.filter((a) => a.status === 'interviewed').length,
    offered: applications.filter((a) => a.status === 'offered').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
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
        <h1 className="text-3xl font-bold text-white mb-2">My Applications</h1>
        <p className="text-zinc-400">Track and manage all your job applications</p>
      </div>

      {/* Status Filter Tabs */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter('')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              statusFilter === ''
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                : 'bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700'
            }`}
          >
            All ({statusCounts.all})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              statusFilter === 'pending'
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                : 'bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700'
            }`}
          >
            Pending ({statusCounts.pending})
          </button>
          <button
            onClick={() => setStatusFilter('reviewed')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              statusFilter === 'reviewed'
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700'
            }`}
          >
            Reviewed ({statusCounts.reviewed})
          </button>
          <button
            onClick={() => setStatusFilter('shortlisted')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              statusFilter === 'shortlisted'
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                : 'bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700'
            }`}
          >
            Shortlisted ({statusCounts.shortlisted})
          </button>
          <button
            onClick={() => setStatusFilter('interviewed')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              statusFilter === 'interviewed'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700'
            }`}
          >
            Interviewed ({statusCounts.interviewed})
          </button>
          <button
            onClick={() => setStatusFilter('offered')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              statusFilter === 'offered'
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700'
            }`}
          >
            Offered ({statusCounts.offered})
          </button>
          <button
            onClick={() => setStatusFilter('rejected')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              statusFilter === 'rejected'
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700'
            }`}
          >
            Rejected ({statusCounts.rejected})
          </button>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((app) => (
          <div
            key={app.id}
            className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all duration-200"
          >
            {/* Application Header */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-xl">
                      {app.company.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg mb-1">{app.job_title}</h3>
                    <p className="text-zinc-400 text-sm">{app.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(app.status)}
                  <button
                    onClick={() => setExpandedApp(expandedApp === app.id ? null : app.id)}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all duration-200"
                  >
                    {expandedApp === app.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>
              </div>

              {/* Job Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2 text-zinc-400 text-sm">
                  <MapPin size={16} />
                  <span>{app.location}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400 text-sm">
                  <Briefcase size={16} />
                  <span>{app.employment_type}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400 text-sm">
                  <DollarSign size={16} />
                  <span>{app.salary_range}</span>
                </div>
              </div>

              {/* Dates */}
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>Applied: {new Date(app.applied_date).toLocaleDateString()}</span>
                <span>Updated: {new Date(app.updated_date).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedApp === app.id && (
              <div className="border-t border-zinc-800 p-6 bg-zinc-800/30">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Timeline */}
                  <div>
                    <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                      <Calendar size={18} />
                      Application Timeline
                    </h4>
                    <div className="space-y-4">
                      {app.timeline.map((event, index) => {
                        const config = getStatusConfig(event.status.toLowerCase());
                        const Icon = config.icon;
                        const isLast = index === app.timeline.length - 1;

                        return (
                          <div key={index} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className={`p-2 rounded-lg ${config.bg} ${config.text}`}>
                                <Icon size={16} />
                              </div>
                              {!isLast && (
                                <div className="w-0.5 h-full bg-zinc-700 my-1" />
                              )}
                            </div>
                            <div className="flex-1 pb-4">
                              <p className="text-white font-medium text-sm mb-1">{event.status}</p>
                              <p className="text-zinc-400 text-xs mb-1">{event.description}</p>
                              <p className="text-zinc-500 text-xs">
                                {new Date(event.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Cover Letter */}
                  <div>
                    <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                      <FileText size={18} />
                      Cover Letter
                    </h4>
                    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4">
                      <p className="text-zinc-300 text-sm leading-relaxed">{app.cover_letter}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-3">
                  <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all duration-200 flex items-center gap-2">
                    <ExternalLink size={16} />
                    View Job Posting
                  </button>
                  <button className="px-4 py-2 bg-zinc-800 border border-zinc-700 text-white rounded-lg hover:bg-zinc-700 transition-all duration-200">
                    Withdraw Application
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-4">
              <FileText className="text-zinc-400" size={32} />
            </div>
            <h3 className="text-white font-semibold mb-2">No applications found</h3>
            <p className="text-zinc-400 text-sm">
              {statusFilter ? `No applications with status: ${statusFilter}` : 'Start applying to jobs to see them here'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
