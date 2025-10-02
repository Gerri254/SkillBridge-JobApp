'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Briefcase, TrendingUp, Users, Zap, ArrowRight, CheckCircle, Star, Target } from 'lucide-react';

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!loading && user) {
      // Redirect authenticated users to their dashboard
      if (user.role === 'candidate') {
        router.push('/candidate/dashboard');
      } else if (user.role === 'employer') {
        router.push('/employer/dashboard');
      }
    }
  }, [user, loading, router]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">SkillBridge</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-zinc-300 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-6 py-2 rounded-lg font-semibold transition-all duration-200 gradient-primary text-white hover:opacity-90"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 mb-8">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-zinc-300">AI-Powered Job Matching Platform</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Connect Talent with
              <span className="gradient-text"> Opportunity</span>
            </h1>

            <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
              SkillBridge uses advanced AI to match talented professionals with their dream jobs.
              Find the perfect fit with our intelligent matching algorithm.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 gradient-primary text-white hover:opacity-90 hover:scale-105 flex items-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 bg-zinc-900 border border-zinc-800 text-white hover:border-zinc-700"
              >
                Sign In
              </Link>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-zinc-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Free forever</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">10K+</div>
              <div className="text-zinc-400">Active Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">50K+</div>
              <div className="text-zinc-400">Candidates</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">5K+</div>
              <div className="text-zinc-400">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">95%</div>
              <div className="text-zinc-400">Match Success</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose SkillBridge?</h2>
            <p className="text-xl text-zinc-400">Powered by AI to find your perfect match</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 hover:border-zinc-700 transition-all">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI-Powered Matching</h3>
              <p className="text-zinc-400">
                Our advanced AI analyzes your skills, experience, and preferences to find jobs that truly fit you.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 hover:border-zinc-700 transition-all">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-600 to-purple-600 flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Recommendations</h3>
              <p className="text-zinc-400">
                Get personalized job recommendations based on your profile with match percentages.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 hover:border-zinc-700 transition-all">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Track Progress</h3>
              <p className="text-zinc-400">
                Monitor your applications, interviews, and job offers all in one beautiful dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-zinc-400">Get started in 3 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mb-6 font-bold text-xl">
                  1
                </div>
                <h3 className="text-xl font-bold mb-3">Create Your Profile</h3>
                <p className="text-zinc-400">
                  Sign up and upload your resume. Our AI will parse and analyze your skills.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-600 to-purple-600 flex items-center justify-center mb-6 font-bold text-xl">
                  2
                </div>
                <h3 className="text-xl font-bold mb-3">Get Matched</h3>
                <p className="text-zinc-400">
                  Receive personalized job recommendations with match scores based on your profile.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center mb-6 font-bold text-xl">
                  3
                </div>
                <h3 className="text-xl font-bold mb-3">Apply & Land</h3>
                <p className="text-zinc-400">
                  Apply with one click and track your applications until you land your dream job.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-2xl p-12">
            <h2 className="text-4xl font-bold mb-4">Ready to Find Your Dream Job?</h2>
            <p className="text-xl text-zinc-300 mb-8">
              Join thousands of professionals who found their perfect match on SkillBridge
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 gradient-primary text-white hover:opacity-90 hover:scale-105"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">SkillBridge</span>
              </div>
              <p className="text-zinc-400 text-sm">
                Connect talent with opportunity through AI-powered job matching.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">For Candidates</h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><Link href="/register" className="hover:text-white transition-colors">Find Jobs</Link></li>
                <li><Link href="/register" className="hover:text-white transition-colors">Upload Resume</Link></li>
                <li><Link href="/register" className="hover:text-white transition-colors">Track Applications</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">For Employers</h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><Link href="/register" className="hover:text-white transition-colors">Post Jobs</Link></li>
                <li><Link href="/register" className="hover:text-white transition-colors">Find Candidates</Link></li>
                <li><Link href="/register" className="hover:text-white transition-colors">Manage Applications</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-8 text-center text-sm text-zinc-400">
            <p>&copy; 2025 SkillBridge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
