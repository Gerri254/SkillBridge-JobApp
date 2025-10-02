'use client';

import React, { useState } from 'react';
import { Search, Bell, User, ChevronDown } from 'lucide-react';

interface NavbarProps {
  userName?: string;
  userEmail?: string;
  notificationCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  userName = 'John Doe',
  userEmail = 'john@example.com',
  notificationCount = 3,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'New job match', message: 'Frontend Developer at Tech Corp', time: '5m ago', unread: true },
    { id: 2, title: 'Application update', message: 'Your application was viewed', time: '1h ago', unread: true },
    { id: 3, title: 'Profile view', message: 'A recruiter viewed your profile', time: '2h ago', unread: true },
  ];

  return (
    <nav className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-[#000000] border-b border-zinc-800 z-20">
      <div className="h-full px-4 lg:px-8 flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
            <input
              type="text"
              placeholder="Search jobs, companies, skills..."
              className="
                w-full bg-zinc-900 border border-zinc-800 rounded-lg
                pl-10 pr-4 py-2 text-white placeholder-zinc-500
                focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20
                transition-all duration-200
              "
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4 ml-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="relative p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all duration-200"
            >
              <Bell size={20} />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg overflow-hidden">
                <div className="p-4 border-b border-zinc-800">
                  <h3 className="text-white font-semibold">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 border-b border-zinc-800 hover:bg-zinc-800/50 cursor-pointer transition-colors ${
                        notif.unread ? 'bg-purple-500/5' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">{notif.title}</p>
                          <p className="text-zinc-400 text-xs mt-1">{notif.message}</p>
                          <p className="text-zinc-500 text-xs mt-1">{notif.time}</p>
                        </div>
                        {notif.unread && (
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-1" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center border-t border-zinc-800">
                  <button className="text-purple-400 text-sm hover:text-purple-300 transition-colors">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-3 p-2 hover:bg-zinc-800 rounded-lg transition-all duration-200"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-white text-sm font-medium">{userName}</p>
                <p className="text-zinc-400 text-xs">{userEmail}</p>
              </div>
              <ChevronDown size={16} className="text-zinc-400" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg overflow-hidden">
                <div className="p-4 border-b border-zinc-800">
                  <p className="text-white font-medium">{userName}</p>
                  <p className="text-zinc-400 text-sm">{userEmail}</p>
                </div>
                <div className="py-2">
                  <a
                    href="/profile"
                    className="block px-4 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                  >
                    Profile Settings
                  </a>
                  <a
                    href="/settings"
                    className="block px-4 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                  >
                    Account Settings
                  </a>
                  <a
                    href="/help"
                    className="block px-4 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                  >
                    Help & Support
                  </a>
                </div>
                <div className="border-t border-zinc-800 py-2">
                  <button className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 transition-colors">
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showUserMenu || showNotifications) && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => {
            setShowUserMenu(false);
            setShowNotifications(false);
          }}
        />
      )}
    </nav>
  );
};
