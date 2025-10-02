'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  User,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

interface SidebarProps {
  userRole?: 'candidate' | 'employer';
}

export const Sidebar: React.FC<SidebarProps> = ({ userRole = 'candidate' }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  const candidateNavItems = [
    { name: 'Dashboard', href: '/candidate/dashboard', icon: LayoutDashboard },
    { name: 'Jobs', href: '/candidate/jobs', icon: Briefcase },
    { name: 'Applications', href: '/candidate/applications', icon: FileText },
    { name: 'Resume', href: '/candidate/resume', icon: FileText },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const employerNavItems = [
    { name: 'Dashboard', href: '/employer/dashboard', icon: LayoutDashboard },
    { name: 'Jobs', href: '/employer/jobs', icon: Briefcase },
    { name: 'Post Job', href: '/employer/jobs/create', icon: FileText },
    { name: 'Applications', href: '/employer/applications', icon: FileText },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const navItems = userRole === 'candidate' ? candidateNavItems : employerNavItems;

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-zinc-800">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">SkillBridge</h1>
            <p className="text-xs text-zinc-400">Connect & Grow</p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg
                transition-all duration-200
                ${isActive
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                }
              `}
              onClick={() => setIsOpen(false)}
            >
              <Icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-zinc-800">
        <button
          className="
            w-full flex items-center gap-3 px-4 py-3 rounded-lg
            text-red-400 hover:bg-red-500/10 hover:text-red-300
            transition-all duration-200
          "
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - Mobile */}
      <aside
        className={`
          lg:hidden fixed top-0 left-0 h-full w-64 bg-[#000000] border-r border-zinc-800 z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          flex flex-col
        `}
      >
        <NavContent />
      </aside>

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col fixed top-0 left-0 h-full w-64 bg-[#000000] border-r border-zinc-800 z-30">
        <NavContent />
      </aside>
    </>
  );
};
