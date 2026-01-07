import { BaseApiClient } from './base-client';

// Student type definitions
export interface Student {
  id: string;
  name: string;
  email: string;
  grade?: string;
  class?: string;
  enrollment_date?: string;
  status?: 'active' | 'inactive' | 'suspended';
  phone?: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateStudentData {
  name: string;
  email: string;
  grade?: string;
  class?: string;
  phone?: string;
  address?: string;
}

export interface UpdateStudentData extends Partial<CreateStudentData> {
  status?: 'active' | 'inactive' | 'suspended';
}

export class StudentsApiClient extends BaseApiClient {
  // Get all students
  async getStudents(params?: {
    page?: number;
    limit?: number;
    search?: string;
    grade?: string;
    class?: string;
    status?: string;
  }) {
    return this.get<Student[]>('/students', params);
  }

  // Get a single student
  async getStudent(id: string) {
    return this.get<Student>(`/students/${id}`);
  }

  // Create a new student
  async createStudent(data: CreateStudentData) {
    return this.post<Student>('/students', data);
  }

  // Update an existing student
  async updateStudent(id: string, data: UpdateStudentData) {
    return this.put<Student>(`/students/${id}`, data);
  }

  // Delete a student
  async deleteStudent(id: string) {
    return this.delete(`/students/${id}`);
  }

  // Bulk operations
  async bulkUpsert(items: CreateStudentData[]) {
    return this.post('/bulk/students', items);
  }

  // Promote students (bulk operation)
  async promoteStudents(data: {
    studentIds: string[];
    newGrade: string;
    academicYearId: string;
  }) {
    return this.post('/students/promotions', data);
  }

  // Get student classes
  async getStudentClasses(studentId: string) {
    return this.get(`/api/students/${studentId}/classes`);
  }

  // Get student fee status
  async getStudentFeeStatus(studentId: string, academicYearId?: string) {
    return this.get(`/api/fees/students/${studentId}/status`, {
      academicYearId
    });
  }

  // Get student report card
  async getStudentReportCard(studentId: string, termId: string) {
    return this.get(`/api/reports/report-cards/student/${studentId}`, {
      termId
    });
  }

  // Get student report history
  async getStudentReportHistory(studentId: string) {
    return this.get(`/api/reports/report-cards/student/${studentId}/history`);
  }

  // Download report card
  async downloadReportCard(studentId: string, termId: string) {
    return this.get(`/api/reports/report-cards/student/${studentId}/download`, {
      termId,
      responseType: 'blob'
    });
  }
}
