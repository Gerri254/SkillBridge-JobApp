'use client';

import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#000000]">
      <Sidebar userRole="candidate" />
      <Navbar userName="John Doe" userEmail="john@example.com" notificationCount={3} />
      <main className="lg:ml-64 mt-16 p-4 lg:p-8">
        {children}
      </main>
    </div>
  );
}
