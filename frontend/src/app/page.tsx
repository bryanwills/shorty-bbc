import { Metadata } from 'next';
import { Dashboard } from '@/components/dashboard';

export const metadata: Metadata = {
  title: 'Dashboard - Shorty',
  description: 'Manage your shortened URLs',
};

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background">
      <Dashboard />
    </main>
  );
}