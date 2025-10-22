'use client';

import Dashboard from '@/components/dashboard';
import DashboardHeader from '@/components/dashboard/dashboard-header';
import DashboardFooter from '@/components/dashboard/dashboard-footer';

export default function Page() {
  return (
    <div className='rounded-2xl border border-gray-6 bg-gray-2 px-4 py-6'>
      <DashboardHeader />
      <div className='relative'>
        <Dashboard />
      </div>
      <DashboardFooter />
    </div>
  );
}
