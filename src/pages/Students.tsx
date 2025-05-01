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
  id: number;
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
      const { data, error } = await supabase.from('student').select('*');
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
      const { data, error } = await supabase.from('grade').select('id, code');
      if (error) {
        console.error('Error fetching grades:', error);
        toast.error("Failed to load grades");
        return [];
      }
      return data;
    }
  });

  const addStudentMutation = useMutation({
    mutationFn: async (newStudent: Omit<Student, 'id'>) => {
      const { data, error } = await supabase.from('student').insert([newStudent]).select();
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
      const { error } = await supabase.from('student').delete().eq('id', id);
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

          const { data, error } = await supabase.from('student').insert(students).select();
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
    deleteStudentMutation.mutate(id);
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

  // You can continue rendering your JSX below as-is using gradeData directly in dropdowns

  return (
    <div className="space-y-6">
      {/* ... your JSX code remains unchanged ... */}
    </div>
  );
};

export default StudentsPage;
