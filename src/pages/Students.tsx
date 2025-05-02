
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Plus, Upload } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import Papa from 'papaparse';
import { Student } from '@/types/student';
import { useSort } from '@/hooks/useSort';
import StudentTable from '@/components/students/StudentTable';
import EmptyStudentState from '@/components/students/EmptyStudentState';
import StudentFilters from '@/components/students/StudentFilters';
import StudentFormDialog from '@/components/students/StudentFormDialog';
import UploadCsvDialog from '@/components/students/UploadCsvDialog';

const StudentsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [campusFilter, setCampusFilter] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  
  const { sortConfig, requestSort, sortedItems } = useSort<Student>('name', 'asc');
  
  const addForm = useForm<Omit<Student, 'id'>>({
    defaultValues: {
      name: '',
      email: '',
      grade_id: '',
      language_id: '',
      campus_id: '',
    },
    mode: "onBlur"
  });

  const editForm = useForm<Student>({
    defaultValues: {
      id: '',
      name: '',
      email: '',
      grade_id: '',
      language_id: '',
      campus_id: '',
    },
    mode: "onBlur"
  });

  const { data: students = [], isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student')
        .select('*');
      
      if (error) {
        console.error('Error fetching students:', error);
        toast.error("Failed to load students");
        return [];
      }

      return data as Student[];
    }
  });

  const { data: gradeData = [] } = useQuery({
    queryKey: ['grades'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('grade')
        .select('*');
      
      if (error) {
        console.error('Error fetching grades:', error);
        toast.error("Failed to load grades");
        return [];
      }
  
      return data;
    }
  });

  const { data: languageData = [] } = useQuery({
    queryKey: ['languages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('language')
        .select('*');
      
      if (error) {
        console.error('Error fetching languages:', error);
        toast.error("Failed to load languages");
        return [];
      }
  
      return data;
    }
  });

  const { data: campusData = [] } = useQuery({
    queryKey: ['campuses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campus')
        .select('*');
      
      if (error) {
        console.error('Error fetching campuses:', error);
        toast.error("Failed to load campuses");
        return [];
      }
  
      return data;
    }
  });

  const gradeMap = Object.fromEntries(gradeData.map(g => [g.id, g.code]));
  const languageMap = Object.fromEntries(languageData.map(l => [l.id, l.name]));
  const campusMap = Object.fromEntries(campusData.map(c => [c.id, c.name]));

  const addStudentMutation = useMutation({
    mutationFn: async (newStudent: Omit<Student, 'id'>) => {
      const { data, error } = await supabase
        .from('student')
        .insert([newStudent])
        .select();
      
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setIsAddDialogOpen(false);
      addForm.reset();
      toast.success("Student added successfully");
    },
    onError: (error) => {
      console.error('Error adding student:', error);
      toast.error("Failed to add student");
    }
  });

  const updateStudentMutation = useMutation({
    mutationFn: async (updatedStudent: Student) => {
      const { id, ...studentData } = updatedStudent;
      
      const { data, error } = await supabase
        .from('student')
        .update(studentData)
        .eq('id', Number(id))
        .select();
      
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setIsEditDialogOpen(false);
      editForm.reset();
      toast.success("Student updated successfully");
    },
    onError: (error) => {
      console.error('Error updating student:', error);
      toast.error("Failed to update student");
    }
  });

  const deleteStudentMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('student')
        .delete()
        .eq('id', id);
  
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success("Student removed successfully");
    },
    onError: (error) => {
      console.error('Error deleting student:', error);
      toast.error("Failed to delete student");
    }
  });  

  const handleAddStudent = (values: Omit<Student, 'id'>) => {
    addStudentMutation.mutate(values);
  };

  const handleEditStudent = (student: Student) => {
    editForm.reset({
      id: student.id,
      name: student.name,
      email: student.email || '',
      grade_id: student.grade_id || '',
      language_id: student.language_id || '',
      campus_id: student.campus_id || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateStudent = (values: Student) => {
    updateStudentMutation.mutate(values);
  };

  const handleCsvUpload = (csvFile: File) => {
    Papa.parse(csvFile, {
      header: true,
      complete: async (results) => {
        try {
          const students = results.data.map((row: any) => ({
            name: row.name,
            email: row.email || "",
            grade_id: row.grade_id || null,
            language_id: row.language_id || null,
            campus_id: row.campus_id || null,
          }));

          const { error } = await supabase
            .from('student')
            .insert(students);
          
          if (error) throw error;
          
          queryClient.invalidateQueries({ queryKey: ['students'] });
          toast.success(`Successfully uploaded ${students.length} students`);
          setIsUploadDialogOpen(false);
        } catch (error) {
          console.error('Error uploading students:', error);
          toast.error("Failed to upload students");
        }
      },
      error: (error) => {
        console.error('CSV parsing error:', error);
        toast.error("Failed to parse CSV file");
      }
    });
  };

  const handleDeleteStudent = (id: number) => {
    deleteStudentMutation.mutate(id);
  };

  const downloadCsvTemplate = () => {
    const header = "name,email,grade_id,language_id,campus_id";
    const sampleData = "John Doe,john@example.com,grade123,lang456,campus789\nJane Smith,jane@example.com,grade234,lang567,campus890";
    const csvContent = `${header}\n${sampleData}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'student_template.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success("Template downloaded successfully");
  };

  // Apply filters to students
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      student.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesGrade = !gradeFilter || student.grade_id === gradeFilter;
    const matchesLanguage = !languageFilter || student.language_id === languageFilter;
    const matchesCampus = !campusFilter || student.campus_id === campusFilter;
    
    return matchesSearch && matchesGrade && matchesLanguage && matchesCampus;
  });

  // Sort filtered students
  const sortedStudents = sortedItems(filteredStudents);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">Manage students in your tutoring program</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-1" onClick={() => setIsUploadDialogOpen(true)}>
            <Upload size={16} />
            Import CSV
          </Button>
          
          <Button className="gap-1" onClick={() => setIsAddDialogOpen(true)}>
            <Plus size={16} />
            Add Student
          </Button>
        </div>
      </div>
      
      <StudentFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        gradeFilter={gradeFilter}
        onGradeFilterChange={setGradeFilter}
        languageFilter={languageFilter}
        onLanguageFilterChange={setLanguageFilter}
        campusFilter={campusFilter}
        onCampusFilterChange={setCampusFilter}
        grades={gradeData}
        languages={languageData}
        campuses={campusData}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>All Students</CardTitle>
          <CardDescription>
            {isLoading ? 'Loading students...' :
              students.length === 0 ? 'No students added yet.' : 
              `Showing ${sortedStudents.length} of ${students.length} students`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : students.length === 0 ? (
            <EmptyStudentState
              onAddClick={() => setIsAddDialogOpen(true)}
              onImportClick={() => setIsUploadDialogOpen(true)}
            />
          ) : (
            <StudentTable
              students={sortedStudents}
              isLoading={isLoading}
              gradeMap={gradeMap}
              languageMap={languageMap}
              campusMap={campusMap}
              onEdit={handleEditStudent}
              onDelete={handleDeleteStudent}
              sortConfig={sortConfig}
              onSort={requestSort}
            />
          )}
        </CardContent>
      </Card>
      
      {/* Add Student Dialog */}
      <StudentFormDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        title="Add New Student"
        description="Enter the details to add a new student to the system."
        form={addForm}
        onSubmit={handleAddStudent}
        buttonText="Add Student"
        isSubmitting={addStudentMutation.isPending}
        gradeData={gradeData}
        languageData={languageData}
        campusData={campusData}
      />
      
      {/* Edit Student Dialog */}
      <StudentFormDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        title="Edit Student"
        description="Update student information."
        form={editForm}
        onSubmit={handleUpdateStudent}
        buttonText="Update Student"
        isSubmitting={updateStudentMutation.isPending}
        gradeData={gradeData}
        languageData={languageData}
        campusData={campusData}
      />
      
      {/* Upload CSV Dialog */}
      <UploadCsvDialog
        isOpen={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        onUpload={handleCsvUpload}
        onDownloadTemplate={downloadCsvTemplate}
        isUploading={false}
      />
    </div>
  );
};

export default StudentsPage;
