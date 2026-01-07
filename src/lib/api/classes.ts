import { BaseApiClient } from './base-client';

// Class type definitions
export interface Class {
  id: string;
  name: string;
  code?: string;
  grade: string;
  section?: string;
  academicYearId: string;
  classTeacherId?: string;
  roomNumber?: string;
  capacity: number;
  educationLevel?: string;
  isActive: boolean;
  created_at?: string;
  updated_at?: string;
  // Relations
  classTeacher?: {
    id: string;
    name: string;
    email: string;
  };
  academicYear?: {
    id: string;
    name: string;
  };
  _count?: {
    enrollments: number;
    classSubjects: number;
  };
}

export interface ClassEnrollment {
  id: string;
  classId: string;
  studentId: string;
  rollNumber: string;
  status: 'active' | 'withdrawn';
  enrollmentDate: string;
  withdrawalDate?: string;
  student: {
    id: string;
    name: string;
    email: string;
    studentId?: string;
    gender?: string;
    dateOfBirth?: string;
    profileImage?: string;
    phone?: string;
  };
}

export interface CreateClassData {
  name: string;
  code?: string;
  grade: string;
  section?: string;
  academicYearId: string;
  classTeacherId?: string;
  roomNumber?: string;
  capacity?: number;
  educationLevel?: string;
}

export interface UpdateClassData extends Partial<CreateClassData> {
  isActive?: boolean;
}

export interface ClassSubject {
  id: string;
  classId: string;
  subjectId: string;
  teacherId?: string;
  periodsPerWeek: number;
  subject: {
    id: string;
    name: string;
    code?: string;
  };
}

export class ClassesApiClient extends BaseApiClient {
  // Get all classes
  async getClasses(params?: {
    academicYearId?: string;
    educationLevel?: string;
    gradeLevel?: string;
    search?: string;
    includeStats?: boolean;
  }) {
    return this.get<{ success: boolean; data: Class[] }>(
      '/api/classes',
      params
    );
  }

  // Get a single class with full details
  async getClass(id: string) {
    return this.get<{ success: boolean; data: Class }>('/api/classes/${id}');
  }

  // Create a new class
  async createClass(data: CreateClassData) {
    return this.post<{ success: boolean; data: Class }>('/api/classes', data);
  }

  // Update an existing class
  async updateClass(id: string, data: UpdateClassData) {
    return this.put<{ success: boolean; data: Class }>(
      `/api/classes/${id}`,
      data
    );
  }

  // Delete (deactivate) a class
  async deleteClass(id: string) {
    return this.delete<{ success: boolean; message: string }>(
      `/api/classes/${id}`
    );
  }

  // Get class enrollments
  async getClassEnrollments(classId: string) {
    return this.get<{ success: boolean; data: ClassEnrollment[] }>(
      `/api/classes/${classId}/enrollments`
    );
  }

  // Enroll students in a class
  async enrollStudentsInClass(
    classId: string,
    studentIds: string[],
    rollNumbers?: Record<string, string>
  ) {
    return this.post<{
      success: boolean;
      data: ClassEnrollment[];
      message: string;
    }>(`/api/classes/${classId}/enrollments`, { studentIds, rollNumbers });
  }

  // Remove student from class
  async removeStudentFromClass(classId: string, studentId: string) {
    return this.delete<{ success: boolean; message: string }>(
      `/api/classes/${classId}/enrollments/${studentId}`
    );
  }

  // Assign subjects to class
  async assignSubjectsToClass(
    classId: string,
    subjects: Array<{
      subjectId: string;
      teacherId?: string;
      periodsPerWeek?: number;
    }>
  ) {
    return this.post<{ success: boolean; data: ClassSubject[] }>(
      `/api/classes/${classId}/subjects`,
      { subjects }
    );
  }

  // Get class timetable
  async getClassTimetable(classId: string) {
    return this.get(`/api/timetable/class/${classId}`);
  }

  // Get class gradebook
  async getClassGradebook(classId: string) {
    return this.get('/grading/gradebook', { classId });
  }

  // Generate class report cards
  async generateReportCards(data: {
    studentIds?: string[];
    classId?: string;
    termId: string;
  }) {
    return this.post('/api/reports/report-cards/generate', data);
  }

  // Get class report cards
  async getClassReportCards(classId: string, termId: string) {
    return this.get(`/api/reports/report-cards/class/${classId}`, { termId });
  }

  // Publish report cards
  async publishReportCards(reportCardIds: string[]) {
    return this.post('/api/reports/report-cards/publish', { reportCardIds });
  }
}
