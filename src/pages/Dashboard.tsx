
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name || 'Admin'}</h1>
        <p className="text-muted-foreground">Here's an overview of your tutoring program</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">
              Get started by adding students
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tutors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">
              Tutors ready to teach
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Schools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">
              Partner educational institutions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">
              Scheduled in the next 7 days
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 grid-cols-2 md:grid-cols-3">
            {[
              {title: 'Add Students', link: '/students', desc: 'Register new students in the system.'},
              {title: 'Manage Tutors', link: '/tutors', desc: 'View and update tutor profiles.'},
              {title: 'View Schedule', link: '/schedule', desc: 'Check upcoming tutoring sessions.'},
              {title: 'Client Management', link: '/clients', desc: 'Handle school and district accounts.'},
              {title: 'Subjects', link: '/subjects', desc: 'Manage available course subjects.'},
              {title: 'Settings', link: '/settings', desc: 'Configure system preferences.'},
            ].map((item, i) => (
              <a href={item.link} key={i} className="group">
                <div className="border rounded-lg p-4 transition-all group-hover:border-tutor-400 group-hover:bg-tutor-50">
                  <h3 className="font-medium text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </a>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="h-6 w-6 rounded-full bg-tutor-100 text-tutor-600 flex items-center justify-center font-medium text-sm">1</div>
                <p className="text-sm">Add your first students</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-6 w-6 rounded-full bg-tutor-100 text-tutor-600 flex items-center justify-center font-medium text-sm">2</div>
                <p className="text-sm">Connect your Supabase database</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-6 w-6 rounded-full bg-tutor-100 text-tutor-600 flex items-center justify-center font-medium text-sm">3</div>
                <p className="text-sm">Set up your tutoring schedule</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-6 w-6 rounded-full bg-tutor-100 text-tutor-600 flex items-center justify-center font-medium text-sm">4</div>
                <p className="text-sm">Create your first tutoring session</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
