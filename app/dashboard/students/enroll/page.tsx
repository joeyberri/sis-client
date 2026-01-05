'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/context/user/user-context';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api/client';
import { EmptyState, ErrorState, LoadingState } from '@/components/empty-state';
import { UserPlus, CheckCircle2, AlertCircle } from 'lucide-react';

interface EnrollmentForm {
  firstName: string;
  lastName: string;
  email: string;
  grade: string;
  enrollmentDate: string;
  phone?: string;
  notes?: string;
}

export default function EnrollStudentPage() {
  const { isAdmin } = useUser();
  const [form, setForm] = useState<EnrollmentForm>({
    firstName: '',
    lastName: '',
    email: '',
    grade: '10',
    enrollmentDate: new Date().toISOString().split('T')[0],
    phone: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isAdmin) {
    return (
      <PageContainer>
        <ErrorState
          title="Access Denied"
          description="Only administrators can enroll students."
        />
      </PageContainer>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGradeChange = (value: string) => {
    setForm((prev) => ({ ...prev, grade: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!form.firstName || !form.lastName || !form.email || !form.grade) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setSubmitted(true);

      // Create student via bulk API (more flexible than single create)
      const result = await apiClient.bulkUpsert('students', [
        {
          email: form.email,
          name: `${form.firstName} ${form.lastName}`,
          grade: form.grade,
          enrolledDate: form.enrollmentDate,
          phone: form.phone || undefined,
          notes: form.notes || undefined,
          status: 'active'
        }
      ]);

      if (result.successful > 0) {
        setSuccessMessage(`✓ Student "${form.firstName} ${form.lastName}" enrolled successfully!`);
        // Reset form
        setForm({
          firstName: '',
          lastName: '',
          email: '',
          grade: '10',
          enrollmentDate: new Date().toISOString().split('T')[0],
          phone: '',
          notes: ''
        });
        setSubmitted(false);

        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(null), 5000);
      } else if (result.failed > 0) {
        setError(
          result.errors?.[0]?.error ||
          'Failed to enroll student. Please check the form and try again.'
        );
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while enrolling the student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Enroll New Student</h1>
          <p className="text-muted-foreground mt-1">
            Add a new student to the school system
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <p className="text-green-800 font-medium">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        {/* Enrollment Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Student Information
            </CardTitle>
            <CardDescription>
              Fill out the form below to enroll a new student
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-2">
                    First Name *
                  </label>
                  <Input
                    name="firstName"
                    placeholder="e.g., John"
                    value={form.firstName}
                    onChange={handleInputChange}
                    disabled={loading}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">
                    Last Name *
                  </label>
                  <Input
                    name="lastName"
                    placeholder="e.g., Smith"
                    value={form.lastName}
                    onChange={handleInputChange}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* Email & Grade */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-2">
                    Email Address *
                  </label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="e.g., john.smith@school.com"
                    value={form.email}
                    onChange={handleInputChange}
                    disabled={loading}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">
                    Grade Level *
                  </label>
                  <Select value={form.grade} onValueChange={handleGradeChange} disabled={loading}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9">Grade 9</SelectItem>
                      <SelectItem value="10">Grade 10</SelectItem>
                      <SelectItem value="11">Grade 11</SelectItem>
                      <SelectItem value="12">Grade 12</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Enrollment Date & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-2">
                    Enrollment Date
                  </label>
                  <Input
                    name="enrollmentDate"
                    type="date"
                    value={form.enrollmentDate}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">
                    Phone Number
                  </label>
                  <Input
                    name="phone"
                    placeholder="e.g., +1 (555) 123-4567"
                    value={form.phone}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-sm font-medium block mb-2">
                  Additional Notes
                </label>
                <Textarea
                  name="notes"
                  placeholder="Any special notes or information about the student..."
                  value={form.notes}
                  onChange={handleInputChange}
                  disabled={loading}
                  rows={4}
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={loading || submitted}
                  className="flex-1"
                >
                  {loading ? 'Enrolling...' : 'Enroll Student'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setForm({
                      firstName: '',
                      lastName: '',
                      email: '',
                      grade: '10',
                      enrollmentDate: new Date().toISOString().split('T')[0],
                      phone: '',
                      notes: ''
                    });
                    setError(null);
                    setSuccessMessage(null);
                  }}
                  disabled={loading}
                >
                  Clear
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>✓ Email addresses must be unique</p>
            <p>✓ The student will be created with "active" status</p>
            <p>✓ You can bulk enroll multiple students from the Students page</p>
            <p>✓ Student records can be edited in the main Students list</p>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
