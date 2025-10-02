'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type UserRole = 'candidate' | 'employer';

export default function RegisterPage() {
  const [role, setRole] = useState<UserRole>('candidate');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    phone: '',
    location: '',
    company: '',
    company_website: '',
    company_size: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { email, password, confirmPassword, first_name, last_name, company } = formData;

    if (!email || !password || !confirmPassword || !first_name || !last_name) {
      setError('Please fill in all required fields');
      return false;
    }

    if (role === 'employer' && !company) {
      setError('Company name is required for employers');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const registerData = {
        email: formData.email,
        password: formData.password,
        role,
        first_name: formData.first_name,
        last_name: formData.last_name,
        ...(formData.phone && { phone: formData.phone }),
        ...(formData.location && { location: formData.location }),
        ...(role === 'employer' && {
          company: formData.company,
          ...(formData.company_website && { company_website: formData.company_website }),
          ...(formData.company_size && { company_size: formData.company_size }),
        }),
      };

      const user = await register(registerData);
      // Redirect based on role
      if (user.role === 'candidate') {
        window.location.href = '/candidate/dashboard';
      } else if (user.role === 'employer') {
        window.location.href = '/employer/dashboard';
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 py-8">
      <div className="w-full max-w-2xl animate-fadeIn">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">SkillBridge</h1>
          <p className="text-zinc-400">Join our community of talent and opportunity</p>
        </div>

        {/* Register Card */}
        <div className="card relative overflow-hidden">
          {/* Gradient Border Effect */}
          <div className="absolute inset-0 gradient-primary opacity-20 blur-xl"></div>

          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-zinc-400 mb-6">Sign up to get started</p>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 animate-fadeIn">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-3">
                  I am a...
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRole('candidate')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      role === 'candidate'
                        ? 'border-[#EB9197] bg-[#EB9197]/10'
                        : 'border-zinc-700 bg-transparent hover:border-zinc-600'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">👤</div>
                      <div className="font-semibold text-white">Candidate</div>
                      <div className="text-xs text-zinc-400 mt-1">Looking for opportunities</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('employer')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      role === 'employer'
                        ? 'border-[#EB9197] bg-[#EB9197]/10'
                        : 'border-zinc-700 bg-transparent hover:border-zinc-600'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">🏢</div>
                      <div className="font-semibold text-white">Employer</div>
                      <div className="text-xs text-zinc-400 mt-1">Hiring talent</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-zinc-300 mb-2">
                    First Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="John"
                    disabled={loading}
                    autoComplete="given-name"
                  />
                </div>
                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-zinc-300 mb-2">
                    Last Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Doe"
                    disabled={loading}
                    autoComplete="family-name"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="you@example.com"
                  disabled={loading}
                  autoComplete="email"
                />
              </div>

              {/* Phone & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-zinc-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="+1 (555) 000-0000"
                    disabled={loading}
                    autoComplete="tel"
                  />
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-zinc-300 mb-2">
                    Location
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="City, Country"
                    disabled={loading}
                    autoComplete="address-level2"
                  />
                </div>
              </div>

              {/* Employer-specific fields */}
              {role === 'employer' && (
                <div className="space-y-4 p-4 bg-[#1a1a1a] rounded-lg border border-zinc-700">
                  <h3 className="text-sm font-semibold text-zinc-300">Company Information</h3>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-zinc-300 mb-2">
                      Company Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      value={formData.company}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Acme Inc."
                      disabled={loading}
                      autoComplete="organization"
                    />
                  </div>

                  <div>
                    <label htmlFor="company_website" className="block text-sm font-medium text-zinc-300 mb-2">
                      Company Website
                    </label>
                    <input
                      id="company_website"
                      name="company_website"
                      type="url"
                      value={formData.company_website}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="https://example.com"
                      disabled={loading}
                      autoComplete="url"
                    />
                  </div>

                  <div>
                    <label htmlFor="company_size" className="block text-sm font-medium text-zinc-300 mb-2">
                      Company Size
                    </label>
                    <select
                      id="company_size"
                      name="company_size"
                      value={formData.company_size}
                      onChange={handleChange}
                      className="input-field"
                      disabled={loading}
                    >
                      <option value="">Select size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="501-1000">501-1000 employees</option>
                      <option value="1000+">1000+ employees</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">
                    Password <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Min. 8 characters"
                    disabled={loading}
                    autoComplete="new-password"
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-300 mb-2">
                    Confirm Password <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Repeat password"
                    disabled={loading}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#282828] text-zinc-400">Or</span>
              </div>
            </div>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-zinc-400">
                Already have an account?{' '}
                <Link href="/login" className="link-accent font-semibold">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-zinc-500 text-sm mt-8">
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="link-accent">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="link-accent">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
