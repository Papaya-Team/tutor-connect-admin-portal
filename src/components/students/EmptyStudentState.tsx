
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Upload } from 'lucide-react';

interface EmptyStudentStateProps {
  onAddClick: () => void;
  onImportClick: () => void;
}

const EmptyStudentState: React.FC<EmptyStudentStateProps> = ({ onAddClick, onImportClick }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="mb-4 rounded-full bg-gray-100 p-3">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-400"
        >
          <path
            d="M15 19C15 16.7909 12.3137 15 9 15C5.68629 15 3 16.7909 3 19M9 12C6.79086 12 5 10.2091 5 8C5 5.79086 6.79086 4 9 4C11.2091 4 13 5.79086 13 8C13 10.2091 11.2091 12 9 12ZM21 19C21 16.7909 18.7614 15 16 15C13.2386 15 11 16.7909 11 19M17 8C17 10.2091 15.2091 12 13 12C12.3255 12 11.6873 11.8458 11.1279 11.5651C11.7025 10.5626 12 9.3288 12 8C12 6.67121 11.7025 5.43737 11.1279 4.43491C11.6873 4.15421 12.3255 4 13 4C15.2091 4 17 5.79086 17 8Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
      </div>
      <p className="text-lg font-medium">No students found</p>
      <p className="text-sm text-muted-foreground mb-4">
        Get started by adding your first student
      </p>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          className="gap-1"
          onClick={onImportClick}
        >
          <Upload size={16} />
          Import CSV
        </Button>
        <Button
          className="gap-1"
          onClick={onAddClick}
        >
          <Plus size={16} />
          Add Student
        </Button>
      </div>
    </div>
  );
};

export default EmptyStudentState;
