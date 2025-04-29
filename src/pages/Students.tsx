
import React, { useState } from 'react';
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
  Plus, 
  Search, 
  Download, 
  Upload,
  Trash
} from 'lucide-react';
import { toast } from "sonner";

// Define student interface
interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  grade: string;
  school: string;
}

const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  
  // Form state for adding a new student
  const [newStudent, setNewStudent] = useState({
    firstName: '',
    lastName: '',
    email: '',
    grade: '',
    school: '',
  });

  // Handle input change for new student form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewStudent({
      ...newStudent,
      [name]: value,
    });
  };

  // Handle adding a new student
  const handleAddStudent = () => {
    setIsLoading(true);
    
    // Validate required fields
    if (!newStudent.firstName || !newStudent.lastName || !newStudent.email) {
      toast.error("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newStudent.email)) {
      toast.error("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      const student: Student = {
        id: Date.now().toString(),
        ...newStudent,
      };
      
      setStudents([...students, student]);
      setNewStudent({
        firstName: '',
        lastName: '',
        email: '',
        grade: '',
        school: '',
      });
      
      toast.success("Student added successfully");
      setIsAddDialogOpen(false);
      setIsLoading(false);
    }, 500);
  };

  // Handle file selection for CSV upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCsvFile(e.target.files[0]);
    }
  };

  // Process CSV file upload
  const handleCsvUpload = () => {
    if (!csvFile) {
      toast.error("Please select a CSV file");
      return;
    }

    setIsLoading(true);

    // Simulate processing CSV file
    setTimeout(() => {
      // This is where you would actually process the CSV
      // For now, we'll just add some mock data
      
      const mockStudents: Student[] = [
        {
          id: (Date.now() + 1).toString(),
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          grade: '10',
          school: 'Lincoln High School',
        },
        {
          id: (Date.now() + 2).toString(),
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          grade: '11',
          school: 'Lincoln High School',
        },
      ];
      
      setStudents([...students, ...mockStudents]);
      toast.success(`Successfully uploaded 2 students`);
      setCsvFile(null);
      setIsUploadDialogOpen(false);
      setIsLoading(false);
    }, 1000);
  };

  // Handle student deletion
  const handleDeleteStudent = (id: string) => {
    setStudents(students.filter(student => student.id !== id));
    toast.success("Student removed successfully");
  };

  // Filter students based on search query
  const filteredStudents = students.filter(student => 
    student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.school.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Create and download a sample CSV template
  const downloadCsvTemplate = () => {
    const header = "firstName,lastName,email,grade,school";
    const sampleData = "John,Doe,john.doe@example.com,10,Lincoln High School\nJane,Smith,jane.smith@example.com,11,Washington Middle School";
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
                    File should have headers: firstName, lastName, email, grade, school
                  </p>
                </div>
                
                <div className="text-sm">
                  <p className="font-medium mb-1">Need a template?</p>
                  <Button
                    variant="link"
                    className="p-0 h-auto flex items-center gap-1 text-tutor-600"
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
              
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={newStudent.firstName}
                      onChange={handleInputChange}
                      placeholder="John"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={newStudent.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={newStudent.email}
                    onChange={handleInputChange}
                    placeholder="john.doe@example.com"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="grade" className="text-sm font-medium">
                      Grade
                    </label>
                    <Input
                      id="grade"
                      name="grade"
                      value={newStudent.grade}
                      onChange={handleInputChange}
                      placeholder="10"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="school" className="text-sm font-medium">
                      School
                    </label>
                    <Input
                      id="school"
                      name="school"
                      value={newStudent.school}
                      onChange={handleInputChange}
                      placeholder="Lincoln High School"
                    />
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddStudent} disabled={isLoading}>
                  {isLoading ? 'Adding...' : 'Add Student'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Search and filters */}
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
      
      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Students</CardTitle>
          <CardDescription>
            {students.length === 0 ? 'No students added yet.' : 
              `Showing ${filteredStudents.length} of ${students.length} students`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
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
                    <TableHead>Email</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>School</TableHead>
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
                        <TableCell className="font-medium">
                          {student.firstName} {student.lastName}
                        </TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.grade || '-'}</TableCell>
                        <TableCell>{student.school || '-'}</TableCell>
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
