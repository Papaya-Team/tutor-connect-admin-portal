
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download } from 'lucide-react';

interface UploadCsvDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (file: File) => void;
  onDownloadTemplate: () => void;
  isUploading: boolean;
}

const UploadCsvDialog: React.FC<UploadCsvDialogProps> = ({
  isOpen,
  onOpenChange,
  onUpload,
  onDownloadTemplate,
  isUploading
}) => {
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCsvFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (csvFile) {
      onUpload(csvFile);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
              File should have headers: name, email, grade_id, language_id, campus_id
            </p>
          </div>
          
          <div className="text-sm">
            <p className="font-medium mb-1">Need a template?</p>
            <Button
              variant="link"
              className="p-0 h-auto flex items-center gap-1 text-primary"
              onClick={onDownloadTemplate}
            >
              <Download size={14} />
              Download CSV Template
            </Button>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!csvFile || isUploading}>
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadCsvDialog;
