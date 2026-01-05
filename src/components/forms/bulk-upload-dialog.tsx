'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Upload, FileText, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export interface BulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resource: 'students' | 'teachers' | 'classes';
  onUpload: (data: any[]) => Promise<void>;
}

interface ParsedRow {
  [key: string]: any;
}

export function BulkUploadDialog({ open, onOpenChange, resource, onUpload }: BulkUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedRow[]>([]);

  const resourceTemplates: Record<string, { requiredFields: string[]; exampleRows: any[] }> = {
    students: {
      requiredFields: ['name', 'email', 'grade'],
      exampleRows: [
        { name: 'John Doe', email: 'john@school.edu', grade: '10A', enrolledDate: '2024-01-01', phone: '+1234567890' },
        { name: 'Jane Smith', email: 'jane@school.edu', grade: '10B', enrolledDate: '2024-01-02', phone: '+0987654321' },
      ],
    },
    teachers: {
      requiredFields: ['name', 'email', 'subject'],
      exampleRows: [
        { name: 'Dr. Sarah Johnson', email: 'sarah@school.edu', subject: 'Mathematics', department: 'STEM', phone: '+1234567890' },
        { name: 'Prof. Michael Chen', email: 'michael@school.edu', subject: 'Physics', department: 'STEM', phone: '+0987654321' },
      ],
    },
    classes: {
      requiredFields: ['name', 'subject', 'teacher', 'grade', 'maxCapacity'],
      exampleRows: [
        { name: 'Mathematics 10A', subject: 'Mathematics', teacher: 'Dr. Sarah Johnson', grade: '10', maxCapacity: '30', academicYear: '2024' },
        { name: 'Physics 10B', subject: 'Physics', teacher: 'Prof. Michael Chen', grade: '10', maxCapacity: '28', academicYear: '2024' },
      ],
    },
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setError(null);
    setSuccess(false);
    setParsedData([]);

    // Validate file type
    const validTypes = ['.csv', '.xlsx', '.xls'];
    const fileExtension = selectedFile.name.toLowerCase().substring(selectedFile.name.lastIndexOf('.'));

    if (!validTypes.includes(fileExtension)) {
      setError('Please upload a CSV or Excel file (.csv, .xlsx, .xls)');
      return;
    }

    try {
      setFile(selectedFile);
      const data = await parseFile(selectedFile);
      
      if (data.length === 0) {
        setError('No data found in the file');
        return;
      }

      // Validate required fields
      const template = resourceTemplates[resource];
      const firstRow = data[0];
      const missingFields = template.requiredFields.filter(
        (field) => !(field.toLowerCase() in Object.keys(firstRow).map(k => k.toLowerCase()).reduce((acc: any, k) => ({ ...acc, [k]: true }), {}))
      );

      if (missingFields.length > 0) {
        setError(`Missing required columns: ${missingFields.join(', ')}`);
        return;
      }

      setParsedData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error parsing file');
    }
  };

  const parseFile = async (file: File): Promise<ParsedRow[]> => {
    return new Promise(async (resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (event) => {
        try {
          const data = event.target?.result;

          if (!data) {
            reject(new Error('Failed to read file'));
            return;
          }

          let rows: ParsedRow[] = [];

          if (file.name.endsWith('.csv')) {
            // Parse CSV
            const text = data as string;
            const lines = text.trim().split('\n');
            const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

            for (let i = 1; i < lines.length; i++) {
              const values = lines[i].split(',').map(v => v.trim());
              const row: ParsedRow = {};

              headers.forEach((header, index) => {
                row[header] = values[index] || '';
              });

              if (Object.values(row).some(v => v !== '')) {
                rows.push(row);
              }
            }
          } else {
            // Parse Excel - dynamically import xlsx
            const XLSX = await import('xlsx');
            const workbook = XLSX.read(data, { type: 'binary' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' }).map((row: any) => {
              const normalized: ParsedRow = {};
              Object.keys(row).forEach(key => {
                normalized[key.toLowerCase()] = row[key];
              });
              return normalized;
            });
          }

          resolve(rows);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };

      if (file.name.endsWith('.csv')) {
        reader.readAsText(file);
      } else {
        reader.readAsBinaryString(file);
      }
    });
  };

  const handleUpload = async () => {
    if (parsedData.length === 0) {
      setError('No data to upload');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onUpload(parsedData);
      setSuccess(true);
      setFile(null);
      setParsedData([]);

      // Auto-close after 2 seconds
      setTimeout(() => {
        onOpenChange(false);
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error uploading data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setParsedData([]);
    setError(null);
    setSuccess(false);
    onOpenChange(false);
  };

  const template = resourceTemplates[resource];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Upload {resource}</DialogTitle>
          <DialogDescription>
            Upload a CSV or Excel file to quickly add multiple {resource}. Required columns:{' '}
            <span className="font-semibold">{template.requiredFields.join(', ')}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Upload Area */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Upload File (CSV or Excel)
            </label>
            <div className="flex items-center gap-3">
              <Input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                disabled={isLoading || success}
                className="flex-1"
              />
              <Upload className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
              CSV files should use comma separation. Excel files should have headers in the first row.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success Alert */}
          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Successfully uploaded {parsedData.length} {resource}!
              </AlertDescription>
            </Alert>
          )}

          {/* Parsed Data Preview */}
          {parsedData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Preview ({parsedData.length} rows)</CardTitle>
                <CardDescription>First 5 rows of data to be uploaded</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {parsedData.slice(0, 5).map((row, index) => (
                    <div key={index} className="text-sm border-l-2 border-blue-200 pl-3">
                      <p className="font-semibold text-xs text-muted-foreground">Row {index + 1}</p>
                      <div className="text-xs space-y-1">
                        {Object.entries(row)
                          .filter(([, v]) => v)
                          .map(([k, v]) => (
                            <div key={k}>
                              <span className="font-medium">{k}:</span> {String(v)}
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                  {parsedData.length > 5 && (
                    <p className="text-xs text-muted-foreground italic">
                      ... and {parsedData.length - 5} more rows
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Template Example */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Template Example</CardTitle>
              <CardDescription>Expected format for your file</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="text-xs w-full">
                  <thead>
                    <tr className="border-b">
                      {template.requiredFields.map((field) => (
                        <th key={field} className="text-left py-2 px-2 font-semibold">
                          {field}
                        </th>
                      ))}
                      {Object.keys(template.exampleRows[0])
                        .filter((k) => !template.requiredFields.includes(k))
                        .map((field) => (
                          <th key={field} className="text-left py-2 px-2 font-semibold text-muted-foreground">
                            {field} (optional)
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    {template.exampleRows.map((row, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        {template.requiredFields.map((field) => (
                          <td key={field} className="py-2 px-2">
                            {row[field]}
                          </td>
                        ))}
                        {Object.keys(row)
                          .filter((k) => !template.requiredFields.includes(k))
                          .map((field) => (
                            <td key={field} className="py-2 px-2 text-muted-foreground">
                              {row[field]}
                            </td>
                          ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={parsedData.length === 0 || isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Uploading...' : `Upload ${parsedData.length} ${resource}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
