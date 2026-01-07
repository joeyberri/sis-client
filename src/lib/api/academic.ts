import { BaseApiClient } from './base-client';

// Academic type definitions
export interface AcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  tenantId: string;
  created_at?: string;
  updated_at?: string;
  terms?: AcademicTerm[];
}

export interface AcademicTerm {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  displayOrder: number;
  isCurrent: boolean;
  academicYearId: string;
  tenantId: string;
  gradingPeriods?: any;
  created_at?: string;
  updated_at?: string;
  academicYear?: AcademicYear;
}

export interface TimetableSlot {
  id: string;
  classId: string;
  subjectId?: string;
  teacherId?: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string;
  endTime: string;
  room?: string;
  academicYearId: string;
  tenantId: string;
  created_at?: string;
  updated_at?: string;
}

export interface Subject {
  id: string;
  name: string;
  code?: string;
  description?: string;
  grade: string;
  teacherId?: string;
  academicYearId: string;
  isActive: boolean;
  created_at?: string;
  updated_at?: string;
}

export class AcademicApiClient extends BaseApiClient {
  // ============ ACADEMIC YEARS ============

  // Get all academic years
  async getAcademicYears(params?: { status?: string; includeTerms?: boolean }) {
    return this.get<{ success: boolean; data: AcademicYear[] }>(
      '/api/academic/years',
      params
    );
  }

  // Get the current academic year
  async getCurrentAcademicYear() {
    return this.get<{ success: boolean; data: AcademicYear }>(
      '/api/academic/years/current'
    );
  }

  // Create a new academic year
  async createAcademicYear(data: {
    name: string;
    startDate: string;
    endDate: string;
    isCurrent?: boolean;
    status?: 'upcoming' | 'active' | 'completed' | 'cancelled';
  }) {
    return this.post<{ success: boolean; data: AcademicYear }>(
      '/api/academic/years',
      data
    );
  }

  // Update an academic year
  async updateAcademicYear(
    id: string,
    data: Partial<{
      name: string;
      startDate: string;
      endDate: string;
      isCurrent: boolean;
      status: 'upcoming' | 'active' | 'completed' | 'cancelled';
    }>
  ) {
    return this.put<{ success: boolean; data: AcademicYear }>(
      `/api/academic/years/${id}`,
      data
    );
  }

  // Delete an academic year
  async deleteAcademicYear(id: string) {
    return this.delete<{ success: boolean; message: string }>(
      `/api/academic/years/${id}`
    );
  }

  // ============ ACADEMIC TERMS ============

  // Get all academic terms
  async getAcademicTerms(academicYearId?: string) {
    if (academicYearId) {
      return this.get<{ success: boolean; data: AcademicTerm[] }>(
        `/api/academic/years/${academicYearId}/terms`
      );
    }
    return this.get<{ success: boolean; data: AcademicTerm[] }>(
      '/api/academic/terms'
    );
  }

  // Get the current academic term
  async getCurrentTerm() {
    return this.get<{ success: boolean; data: AcademicTerm }>(
      '/api/academic/terms/current'
    );
  }

  // Create a new academic term
  async createAcademicTerm(data: {
    academicYearId: string;
    name: string;
    startDate: string;
    endDate: string;
    displayOrder: number;
    gradingPeriods?: any;
  }) {
    return this.post<{ success: boolean; data: AcademicTerm }>(
      '/api/academic/terms',
      data
    );
  }

  // Update an academic term
  async updateAcademicTerm(
    id: string,
    data: Partial<{
      name: string;
      startDate: string;
      endDate: string;
      isCurrent: boolean;
      gradingPeriods: any;
    }>
  ) {
    return this.put<{ success: boolean; data: AcademicTerm }>(
      `/api/academic/terms/${id}`,
      data
    );
  }

  // Delete an academic term
  async deleteAcademicTerm(id: string) {
    return this.delete<{ success: boolean; message: string }>(
      `/api/academic/terms/${id}`
    );
  }

  // ============ TIMETABLE MANAGEMENT ============

  // Get timetable slots
  async getTimetableSlots(params?: {
    classId?: string;
    teacherId?: string;
    dayOfWeek?: number;
    academicYearId?: string;
  }) {
    return this.get<{ success: boolean; data: TimetableSlot[] }>(
      '/api/timetable/slots',
      params
    );
  }

  // Get class timetable
  async getClassTimetable(classId: string) {
    return this.get<{ success: boolean; data: TimetableSlot[] }>(
      `/api/timetable/class/${classId}`
    );
  }

  // Get teacher timetable
  async getTeacherTimetable(teacherId: string) {
    return this.get<{ success: boolean; data: TimetableSlot[] }>(
      `/api/timetable/teacher/${teacherId}`
    );
  }

  // Create timetable slot
  async createTimetableSlot(data: {
    classId: string;
    subjectId?: string;
    teacherId?: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    room?: string;
  }) {
    return this.post<{ success: boolean; data: TimetableSlot }>(
      '/api/timetable/slots',
      data
    );
  }

  // Update timetable slot
  async updateTimetableSlot(
    id: string,
    data: Partial<{
      classId: string;
      subjectId: string;
      teacherId: string;
      dayOfWeek: number;
      startTime: string;
      endTime: string;
      room: string;
    }>
  ) {
    return this.put<{ success: boolean; data: TimetableSlot }>(
      `/api/timetable/slots/${id}`,
      data
    );
  }

  // Delete timetable slot
  async deleteTimetableSlot(id: string) {
    return this.delete<{ success: boolean; message: string }>(
      `/api/timetable/slots/${id}`
    );
  }

  // Generate timetable template
  async generateTimetableTemplate(
    classId: string,
    data: {
      periodsPerDay: number;
      periodDuration: number;
      breakTimes: { start: string; end: string }[];
    }
  ) {
    return this.post<{ success: boolean; data: TimetableSlot[] }>(
      `/api/timetable/class/${classId}/generate-template`,
      data
    );
  }

  // ============ SUBJECTS MANAGEMENT ============

  // Get all subjects
  async getSubjects(params?: {
    academicYearId?: string;
    grade?: string;
    teacherId?: string;
    isActive?: boolean;
  }) {
    return this.get<Subject[]>('/grading/subjects', params);
  }

  // Get a single subject
  async getSubject(id: string) {
    return this.get<Subject>(`/grading/subjects/${id}`);
  }

  // Create a new subject
  async createSubject(data: {
    name: string;
    code?: string;
    description?: string;
    grade: string;
    teacherId?: string;
    academicYearId: string;
  }) {
    return this.post<Subject>('/grading/subjects', data);
  }

  // Update a subject
  async updateSubject(
    id: string,
    data: Partial<{
      name: string;
      code: string;
      description: string;
      grade: string;
      teacherId: string;
      isActive: boolean;
    }>
  ) {
    return this.put<Subject>(`/grading/subjects/${id}`, data);
  }

  // Delete a subject
  async deleteSubject(id: string) {
    return this.delete(`/grading/subjects/${id}`);
  }
}
