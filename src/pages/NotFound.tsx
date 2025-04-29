
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-bold text-tutor-600">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mt-4">Page not found</h2>
        <p className="text-gray-600 mt-2 mb-6">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <Button asChild>
          <Link to="/dashboard">
            Back to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
