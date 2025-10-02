'use client';

import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black">
      <Sidebar userRole="employer" />
      <Navbar userName="Employer Name" userEmail="employer@example.com" />
      <main className="lg:ml-64 pt-16">
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
