
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Pencil, Trash, ArrowDown, ArrowUp } from 'lucide-react';
import { Student } from '@/types/student';

interface StudentTableProps {
  students: Student[];
  isLoading: boolean;
  gradeMap: Record<string, string>;
  languageMap: Record<string, string>;
  campusMap: Record<string, string>;
  onEdit: (student: Student) => void;
  onDelete: (id: number) => void;
  sortConfig: {
    key: keyof Student | null;
    direction: 'asc' | 'desc';
  };
  onSort: (key: keyof Student) => void;
}

const StudentTable: React.FC<StudentTableProps> = ({
  students,
  isLoading,
  gradeMap,
  languageMap,
  campusMap,
  onEdit,
  onDelete,
  sortConfig,
  onSort
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="text-center py-8">
        <p>No students matching your search</p>
      </div>
    );
  }

  const renderSortIcon = (key: keyof Student) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? 
      <ArrowUp size={14} className="ml-1" /> : 
      <ArrowDown size={14} className="ml-1" />;
  };

  const getSortableHeader = (label: string, key: keyof Student) => (
    <div 
      className="flex items-center cursor-pointer" 
      onClick={() => onSort(key)}
    >
      {label}
      {renderSortIcon(key)}
    </div>
  );

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{getSortableHeader('Name', 'name')}</TableHead>
            <TableHead>{getSortableHeader('Email', 'email')}</TableHead>
            <TableHead>{getSortableHeader('Grade', 'grade_id')}</TableHead>
            <TableHead>{getSortableHeader('Language', 'language_id')}</TableHead>
            <TableHead>{getSortableHeader('Campus', 'campus_id')}</TableHead>
            <TableHead className="w-[140px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="font-medium">{student.name}</TableCell>
              <TableCell>{student.email || '-'}</TableCell>
              <TableCell>{gradeMap[student.grade_id!] || '-'}</TableCell>
              <TableCell>{languageMap[student.language_id!] || '-'}</TableCell>
              <TableCell>{campusMap[student.campus_id!] || '-'}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(student)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(Number(student.id))}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StudentTable;
