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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"; // or whatever your path is
import { 
  Plus, 
  Search, 
  Download, 
  Upload,
  Trash
} from 'lucide-react';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import Papa from 'papaparse';

interface Student {
  id: number | string;
  name: string;
  grade_id?: string;
  language_id?: string;
  campus_id?: string;
}

const StudentsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  
  const form = useForm<Omit<Student, 'id'>>({
    defaultValues: {
      name: '',
      grade_id: '',
      language_id: '',
      campus_id: '',
    }
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
      form.reset();
      toast.success("Student added successfully");
    },
    onError: (error) => {
      console.error('Error adding student:', error);
      toast.error("Failed to add student");
    }
  });

  const deleteStudentMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error, data } = await supabase
        .from('student')
        .delete()
        .eq('id', id)
        .select();
  
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
  
      console.log('Supabase delete result:', data); // should be at least one record
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCsvFile(e.target.files[0]);
    }
  };

  const handleCsvUpload = () => {
    if (!csvFile) {
      toast.error("Please select a CSV file");
      return;
    }

    Papa.parse(csvFile, {
      header: true,
      complete: async (results) => {
        try {
          const students = results.data.map((row: any) => ({
            name: row.name,
            grade_id: row.grade_id || null,
            language_id: row.language_id || null,
            campus_id: row.campus_id || null,
          }));

          const { data, error } = await supabase
            .from('student')
            .insert(students)
            .select();
          
          if (error) throw error;
          
          queryClient.invalidateQueries({ queryKey: ['students'] });
          toast.success(`Successfully uploaded ${students.length} students`);
          setCsvFile(null);
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
    console.log("Deleting student with ID:", id);
    deleteStudentMutation.mutate(Number(id));
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const downloadCsvTemplate = () => {
    const header = "name,grade_id,language_id,campus_id";
    const sampleData = "John Doe,grade123,lang456,campus789\nJane Smith,grade234,lang567,campus890";
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">Manage students in your tutoring program</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-1">
                <Upload size={16} />
                Import CSV
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Students CSV</DialogTitle>
                <DialogDescription>
                  Upload a CSV file with student information to add multiple students at once.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">CSV File</label>
                  <Input 
                    type="file" 
                    accept=".csv" 
                    onChange={handleFileChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    File should have headers: name, grade_id, language_id, campus_id
                  </p>
                </div>
                
                <div className="text-sm">
                  <p className="font-medium mb-1">Need a template?</p>
                  <Button
                    variant="link"
                    className="p-0 h-auto flex items-center gap-1 text-primary"
                    onClick={downloadCsvTemplate}
                  >
                    <Download size={14} />
                    Download CSV Template
                  </Button>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCsvUpload} disabled={!csvFile || isLoading}>
                  {isLoading ? 'Uploading...' : 'Upload'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1">
                <Plus size={16} />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
                <DialogDescription>
                  Enter the details to add a new student to the system.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddStudent)} className="space-y-4 py-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="John Doe" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="grade_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Grade</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a grade" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {gradeData.map((grade) => (
                                <SelectItem key={grade.id} value={grade.id}>
                                  {grade.code}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="language_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Language</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a language" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {languageData.map((language) => (
                                <SelectItem key={language.id} value={language.id}>
                                  {language.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="campus_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Campus</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a campus" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {campusData.map((campus) => (
                              <SelectItem key={campus.id} value={campus.id}>
                                {campus.name}
                              </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter className="pt-4">
                    <Button variant="outline" type="button" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={addStudentMutation.isPending}>
                      {addStudentMutation.isPending ? 'Adding...' : 'Add Student'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="flex items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Students</CardTitle>
          <CardDescription>
            {isLoading ? 'Loading students...' :
              students.length === 0 ? 'No students added yet.' : 
              `Showing ${filteredStudents.length} of ${students.length} students`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : students.length === 0 ? (
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
                  onClick={() => setIsUploadDialogOpen(true)}
                >
                  <Upload size={16} />
                  Import CSV
                </Button>
                <Button
                  className="gap-1"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  <Plus size={16} />
                  Add Student
                </Button>
              </div>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Campus</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center h-24">
                        No students matching your search
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{gradeMap[student.grade_id!] || '-'}</TableCell>
                        <TableCell>{languageMap[student.language_id!] || '-'}</TableCell>
                        <TableCell>{campusMap[student.campus_id!] || '-'}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteStudent(student.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentsPage;
