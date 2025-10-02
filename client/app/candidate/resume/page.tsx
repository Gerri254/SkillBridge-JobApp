'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Upload,
  Download,
  Trash2,
  Eye,
  Edit,
  Plus,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  Code,
} from 'lucide-react';
import api from '@/lib/api';

interface Resume {
  id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  uploaded_at: string;
  is_primary: boolean;
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  field_of_study: string;
  start_date: string;
  end_date: string;
  description: string;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string;
  current: boolean;
  description: string;
}

export default function ResumePage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchResumeData();
  }, []);

  const fetchResumeData = async () => {
    try {
      setLoading(true);

      // Fetch resumes
      const resumesRes = await api.get('/resumes/my');
      setResumes(resumesRes.data.data || []);

      // Fetch profile data (education, experience, skills)
      const profileRes = await api.get('/auth/me');
      const profileData = profileRes.data.data || {};

      setEducation(profileData.education || []);
      setExperience(profileData.experience || []);
      setSkills(profileData.skills || []);

    } catch (error) {
      console.error('Error fetching resume data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      await api.post('/resumes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Refresh resumes list
      await fetchResumeData();
    } catch (error) {
      console.error('Error uploading resume:', error);
      alert('Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteResume = async (resumeId: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;

    try {
      await api.delete(`/resumes/${resumeId}`);
      setResumes(resumes.filter(r => r.id !== resumeId));
    } catch (error) {
      console.error('Error deleting resume:', error);
      alert('Failed to delete resume');
    }
  };

  const handleSetPrimary = async (resumeId: string) => {
    try {
      await api.patch(`/resumes/${resumeId}/primary`);
      await fetchResumeData();
    } catch (error) {
      console.error('Error setting primary resume:', error);
      alert('Failed to set primary resume');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Present';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
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
          <h1 className="text-3xl font-bold text-white mb-2">Resume & Profile</h1>
          <p className="text-zinc-400">Manage your resumes and professional information</p>
        </div>
      </div>

      {/* Resume Upload Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText size={24} className="text-purple-400" />
            Uploaded Resumes
          </h2>
          <label className="cursor-pointer px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-all duration-200 flex items-center gap-2">
            <Upload size={20} />
            {uploading ? 'Uploading...' : 'Upload Resume'}
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>

        {resumes.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-zinc-800 rounded-lg">
            <FileText size={48} className="mx-auto text-zinc-600 mb-4" />
            <p className="text-zinc-400 mb-2">No resumes uploaded yet</p>
            <p className="text-zinc-600 text-sm">Upload your resume to start applying for jobs</p>
          </div>
        ) : (
          <div className="space-y-3">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 hover:border-zinc-600 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-3 bg-purple-500/10 rounded-lg">
                      <FileText className="text-purple-400" size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-semibold">{resume.file_name}</h3>
                        {resume.is_primary && (
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                            Primary
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-zinc-400 text-sm">{formatFileSize(resume.file_size)}</span>
                        <span className="text-zinc-600">•</span>
                        <span className="text-zinc-400 text-sm">
                          Uploaded {formatDate(resume.uploaded_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={resume.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-all duration-200"
                      title="View"
                    >
                      <Eye size={18} />
                    </a>
                    <a
                      href={resume.file_url}
                      download
                      className="p-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-all duration-200"
                      title="Download"
                    >
                      <Download size={18} />
                    </a>
                    {!resume.is_primary && (
                      <button
                        onClick={() => handleSetPrimary(resume.id)}
                        className="px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-sm rounded-lg transition-all duration-200"
                      >
                        Set Primary
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteResume(resume.id)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all duration-200"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Experience Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Briefcase size={24} className="text-blue-400" />
            Work Experience
          </h2>
          <button className="px-4 py-2 bg-zinc-800 border border-zinc-700 text-white rounded-lg hover:bg-zinc-700 transition-all duration-200 flex items-center gap-2">
            <Plus size={18} />
            Add Experience
          </button>
        </div>

        {experience.length === 0 ? (
          <p className="text-zinc-400 text-center py-8">No work experience added yet</p>
        ) : (
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="border-l-2 border-purple-500 pl-4">
                <h3 className="text-white font-semibold">{exp.title}</h3>
                <p className="text-zinc-400">{exp.company} • {exp.location}</p>
                <p className="text-zinc-500 text-sm mt-1">
                  {formatDate(exp.start_date)} - {exp.current ? 'Present' : formatDate(exp.end_date)}
                </p>
                <p className="text-zinc-300 text-sm mt-2">{exp.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Education Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <GraduationCap size={24} className="text-green-400" />
            Education
          </h2>
          <button className="px-4 py-2 bg-zinc-800 border border-zinc-700 text-white rounded-lg hover:bg-zinc-700 transition-all duration-200 flex items-center gap-2">
            <Plus size={18} />
            Add Education
          </button>
        </div>

        {education.length === 0 ? (
          <p className="text-zinc-400 text-center py-8">No education added yet</p>
        ) : (
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id} className="border-l-2 border-green-500 pl-4">
                <h3 className="text-white font-semibold">{edu.degree}</h3>
                <p className="text-zinc-400">{edu.institution}</p>
                <p className="text-zinc-500 text-sm mt-1">
                  {edu.field_of_study} • {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                </p>
                {edu.description && (
                  <p className="text-zinc-300 text-sm mt-2">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Skills Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Code size={24} className="text-orange-400" />
            Skills
          </h2>
          <button className="px-4 py-2 bg-zinc-800 border border-zinc-700 text-white rounded-lg hover:bg-zinc-700 transition-all duration-200 flex items-center gap-2">
            <Plus size={18} />
            Add Skills
          </button>
        </div>

        {skills.length === 0 ? (
          <p className="text-zinc-400 text-center py-8">No skills added yet</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-lg text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
