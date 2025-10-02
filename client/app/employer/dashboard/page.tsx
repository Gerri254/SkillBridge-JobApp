'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Users,
  UserCheck,
  CheckCircle,
  TrendingUp,
  Clock,
  Star,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import api from '@/lib/api';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendUp,
}) => {
  return (
    <div className="bg-[#282828] rounded-lg p-6 border border-zinc-800 hover:border-purple-500/50 transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-lg">
          {icon}
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              trendUp ? 'text-green-400' : 'text-red-400'
            }`}
          >
            <TrendingUp
              size={16}
              className={trendUp ? '' : 'rotate-180'}
            />
            {trend}
          </div>
        )}
      </div>
      <h3 className="text-zinc-400 text-sm font-medium mb-1">{title}</h3>
      <p className="text-white text-3xl font-bold">{value}</p>
    </div>
  );
};

interface Application {
  id: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  appliedDate: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected';
  matchScore: number;
}

interface TopApplicant {
  id: string;
  name: string;
  email: string;
  skills: string[];
  experience: string;
  matchScore: number;
  avatar?: string;
}

export default function EmployerDashboard() {
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    shortlisted: 0,
    filledPositions: 0,
  });

  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [topApplicants, setTopApplicants] = useState<TopApplicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobPerformanceData, setJobPerformanceData] = useState<Array<{month: string; applications: number; views: number}>>([]);
  const [applicationStatusData, setApplicationStatusData] = useState<Array<{name: string; count: number}>>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch employer jobs
      const jobsRes = await api.get('/jobs/my');
      const jobs = jobsRes.data.data || [];
      const activeJobs = jobs.filter((job: Record<string, unknown>) => job.status === 'active').length;

      // Fetch applications for employer's jobs
      const applicationsRes = await api.get('/matching/employer/applications');
      const applications = applicationsRes.data.data || [];

      // Calculate stats
      const totalApplications = applications.length;
      const shortlisted = applications.filter(
        (app: Record<string, unknown>) => app.status === 'shortlisted'
      ).length;
      const filledPositions = jobs.filter((job: Record<string, unknown>) => job.status === 'filled').length;

      setStats({
        activeJobs,
        totalApplications,
        shortlisted,
        filledPositions,
      });

      // Set recent applications (limit to 4)
      setRecentApplications(applications.slice(0, 4));

      // Extract top applicants (by match score)
      const topCandidates = applications
        .sort((a: Record<string, unknown>, b: Record<string, unknown>) => ((b.match_percentage as number) || 0) - ((a.match_percentage as number) || 0))
        .slice(0, 3)
        .map((app: Record<string, unknown>) => ({
          id: (app.candidate_id as string) || (app.id as string),
          name: (app.candidate_name as string) || 'Unknown Candidate',
          email: (app.candidate_email as string) || '',
          skills: (app.candidate_skills as string[]) || [],
          experience: (app.candidate_experience as string) || 'N/A',
          matchScore: (app.match_percentage as number) || 0,
        }));

      setTopApplicants(topCandidates);

      // Calculate application status breakdown
      const statusCounts = applications.reduce((acc: Array<{name: string; count: number}>, app: Record<string, unknown>) => {
        const status = (app.status as string) || 'pending';
        const statusName = status.charAt(0).toUpperCase() + status.slice(1);
        const existing = acc.find((item: {name: string; count: number}) => item.name === statusName);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ name: statusName, count: 1 });
        }
        return acc;
      }, []);

      setApplicationStatusData(statusCounts);

      // Generate mock performance data (since we don't have historical data)
      setJobPerformanceData([
        { month: 'Apr', applications: 0, views: 0 },
        { month: 'May', applications: 0, views: 0 },
        { month: 'Jun', applications: 0, views: 0 },
        { month: 'Jul', applications: 0, views: 0 },
        { month: 'Aug', applications: 0, views: 0 },
        { month: 'Sep', applications: 0, views: 0 },
        { month: 'Oct', applications: totalApplications, views: totalApplications * 5 },
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'reviewed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'shortlisted':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Employer Dashboard
          </h1>
          <p className="text-zinc-400">
            Welcome back! Here is what is happening with your job postings.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Active Jobs"
          value={stats.activeJobs}
          icon={<Briefcase className="text-purple-400" size={24} />}
          trend="+2"
          trendUp={true}
        />
        <StatsCard
          title="Total Applications"
          value={stats.totalApplications}
          icon={<Users className="text-blue-400" size={24} />}
          trend="+15%"
          trendUp={true}
        />
        <StatsCard
          title="Shortlisted"
          value={stats.shortlisted}
          icon={<UserCheck className="text-green-400" size={24} />}
          trend="+8"
          trendUp={true}
        />
        <StatsCard
          title="Filled Positions"
          value={stats.filledPositions}
          icon={<CheckCircle className="text-pink-400" size={24} />}
          trend="+3"
          trendUp={true}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Job Performance Chart */}
        <div className="bg-[#282828] rounded-lg p-6 border border-zinc-800">
          <h2 className="text-xl font-bold text-white mb-4">
            Job Performance
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={jobPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
              <XAxis dataKey="month" stroke="#a1a1aa" />
              <YAxis stroke="#a1a1aa" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  border: '1px solid #3f3f46',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="applications"
                stroke="#a855f7"
                strokeWidth={2}
                dot={{ fill: '#a855f7' }}
              />
              <Line
                type="monotone"
                dataKey="views"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Application Status Chart */}
        <div className="bg-[#282828] rounded-lg p-6 border border-zinc-800">
          <h2 className="text-xl font-bold text-white mb-4">
            Application Status
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={applicationStatusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
              <XAxis dataKey="name" stroke="#a1a1aa" />
              <YAxis stroke="#a1a1aa" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  border: '1px solid #3f3f46',
                  borderRadius: '8px',
                }}
              />
              <Bar
                dataKey="count"
                fill="url(#colorGradient)"
                radius={[8, 8, 0, 0]}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.8} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Applications and Top Applicants */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="bg-[#282828] rounded-lg p-6 border border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">
              Recent Applications
            </h2>
            <Link href="/employer/applications" className="text-purple-400 text-sm hover:text-purple-300 transition-colors">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentApplications.map((application) => (
              <div
                key={application.id}
                className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800 hover:border-purple-500/50 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-white font-semibold">
                      {application.candidateName}
                    </h3>
                    <p className="text-zinc-400 text-sm">
                      {application.jobTitle}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-purple-500/20 px-2 py-1 rounded">
                    <Star size={14} className="text-purple-400" />
                    <span className="text-purple-400 text-sm font-semibold">
                      {application.matchScore}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      application.status
                    )}`}
                  >
                    {application.status.charAt(0).toUpperCase() +
                      application.status.slice(1)}
                  </span>
                  <div className="flex items-center gap-1 text-zinc-500 text-xs">
                    <Clock size={14} />
                    {new Date(application.appliedDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Applicants */}
        <div className="bg-[#282828] rounded-lg p-6 border border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Top Applicants</h2>
            <Link href="/employer/applications" className="text-purple-400 text-sm hover:text-purple-300 transition-colors">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {topApplicants.map((applicant, index) => (
              <div
                key={applicant.id}
                className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800 hover:border-purple-500/50 transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        #{index + 1}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-white font-semibold">
                          {applicant.name}
                        </h3>
                        <p className="text-zinc-400 text-sm">
                          {applicant.experience} experience
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-purple-500/20 px-2 py-1 rounded">
                        <Star size={14} className="text-purple-400" />
                        <span className="text-purple-400 text-sm font-semibold">
                          {applicant.matchScore}%
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {applicant.skills.slice(0, 3).map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-zinc-800 text-zinc-300 text-xs rounded"
                        >
                          {skill}
                        </span>
                      ))}
                      {applicant.skills.length > 3 && (
                        <span className="px-2 py-1 bg-zinc-800 text-zinc-300 text-xs rounded">
                          +{applicant.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
