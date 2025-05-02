
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface StudentFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  gradeFilter: string;
  onGradeFilterChange: (value: string) => void;
  languageFilter: string;
  onLanguageFilterChange: (value: string) => void;
  campusFilter: string;
  onCampusFilterChange: (value: string) => void;
  grades: Array<{ id: string; code: string }>;
  languages: Array<{ id: string; name: string }>;
  campuses: Array<{ id: string; name: string }>;
}

const StudentFilters: React.FC<StudentFiltersProps> = ({
  searchQuery,
  onSearchChange,
  gradeFilter,
  onGradeFilterChange,
  languageFilter,
  onLanguageFilterChange,
  campusFilter,
  onCampusFilterChange,
  grades,
  languages,
  campuses
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-end">
      <div className="w-full md:w-1/3">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        <div className="space-y-1">
          <Label htmlFor="grade-filter">Grade</Label>
          <Select 
            value={gradeFilter} 
            onValueChange={onGradeFilterChange}
          >
            <SelectTrigger id="grade-filter">
              <SelectValue placeholder="All Grades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Grades</SelectItem>
              {grades.map((grade) => (
                <SelectItem key={grade.id} value={grade.id}>{grade.code}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="language-filter">Language</Label>
          <Select 
            value={languageFilter} 
            onValueChange={onLanguageFilterChange}
          >
            <SelectTrigger id="language-filter">
              <SelectValue placeholder="All Languages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Languages</SelectItem>
              {languages.map((language) => (
                <SelectItem key={language.id} value={language.id}>{language.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="campus-filter">Campus</Label>
          <Select 
            value={campusFilter} 
            onValueChange={onCampusFilterChange}
          >
            <SelectTrigger id="campus-filter">
              <SelectValue placeholder="All Campuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Campuses</SelectItem>
              {campuses.map((campus) => (
                <SelectItem key={campus.id} value={campus.id}>{campus.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default StudentFilters;
