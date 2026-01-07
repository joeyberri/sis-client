import { BaseApiClient } from './base-client';

// Grading type definitions
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

export interface Assignment {
  id: string;
  subjectId: string;
  title: string;
  description?: string;
  dueDate?: string;
  totalPoints?: number;
  weight?: number;
  type: 'homework' | 'quiz' | 'test' | 'project' | 'exam';
  status: 'draft' | 'published' | 'graded' | 'closed';
  created_at?: string;
  updated_at?: string;
}

export interface Grade {
  id: string;
  assignmentId: string;
  studentId: string;
  points?: number;
  percentage?: number;
  letterGrade?: string;
  comments?: string;
  gradedBy: string;
  gradedAt: string;
  created_at?: string;
  updated_at?: string;
}

export interface AttendanceSession {
  id: string;
  subjectId: string;
  classId?: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'lecture' | 'lab' | 'tutorial' | 'exam';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  teacherId: string;
  room?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  checkInTime?: string;
  checkOutTime?: string;
  notes?: string;
  markedBy?: string;
  created_at?: string;
  updated_at?: string;
}

export interface GradebookEntry {
  studentId: string;
  studentName: string;
  grades: Array<{
    assignmentId: string;
    assignmentTitle: string;
    points?: number;
    percentage?: number;
    letterGrade?: string;
    weight?: number;
  }>;
  overallGrade?: {
    percentage: number;
    letterGrade: string;
    gpa?: number;
  };
}

export class GradingApiClient extends BaseApiClient {
  // ============ SUBJECTS ============

  // Get all subjects
  async getSubjects(params?: {
    page?: number;
    limit?: number;
    search?: string;
    teacherId?: string;
    grade?: string;
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

  // ============ ASSIGNMENTS ============

  // Get all assignments
  async getAssignments(params?: {
    subjectId?: string;
    teacherId?: string;
    status?: string;
    dueBefore?: string;
    dueAfter?: string;
  }) {
    return this.get<Assignment[]>('/grading/assignments', params);
  }

  // Get assignments by subject
  async getAssignmentsBySubject(subjectId: string) {
    return this.get<Assignment[]>(`/grading/subjects/${subjectId}/assignments`);
  }

  // Get a single assignment
  async getAssignment(id: string) {
    return this.get<Assignment>(`/grading/assignments/${id}`);
  }

  // Create a new assignment
  async createAssignment(data: {
    subjectId: string;
    title: string;
    description?: string;
    dueDate?: string;
    totalPoints?: number;
    weight?: number;
    type: 'homework' | 'quiz' | 'test' | 'project' | 'exam';
  }) {
    return this.post<Assignment>('/grading/assignments', data);
  }

  // Update an assignment
  async updateAssignment(
    id: string,
    data: Partial<{
      title: string;
      description: string;
      dueDate: string;
      totalPoints: number;
      weight: number;
      type: string;
      status: string;
    }>
  ) {
    return this.put<Assignment>(`/grading/assignments/${id}`, data);
  }

  // Delete an assignment
  async deleteAssignment(id: string) {
    return this.delete(`/grading/assignments/${id}`);
  }

  // ============ GRADES ============

  // Get all grades
  async getGrades(params?: {
    studentId?: string;
    assignmentId?: string;
    subjectId?: string;
    gradedBy?: string;
  }) {
    return this.get<Grade[]>('/grading/grades', params);
  }

  // Get grades by student
  async getGradesByStudent(studentId: string) {
    return this.get<Grade[]>(`/grading/students/${studentId}/grades`);
  }

  // Get grades by assignment
  async getGradesByAssignment(assignmentId: string) {
    return this.get<Grade[]>(`/grading/assignments/${assignmentId}/grades`);
  }

  // Get a single grade
  async getGrade(id: string) {
    return this.get<Grade>(`/grading/grades/${id}`);
  }

  // Create a new grade
  async createGrade(data: {
    assignmentId: string;
    studentId: string;
    points?: number;
    percentage?: number;
    letterGrade?: string;
    comments?: string;
  }) {
    return this.post<Grade>('/grading/grades', data);
  }

  // Update a grade
  async updateGrade(
    id: string,
    data: Partial<{
      points: number;
      percentage: number;
      letterGrade: string;
      comments: string;
    }>
  ) {
    return this.put<Grade>(`/grading/grades/${id}`, data);
  }

  // Delete a grade
  async deleteGrade(id: string) {
    return this.delete(`/grading/grades/${id}`);
  }

  // Bulk update grades
  async bulkUpdateGrades(
    assignmentId: string,
    grades: Array<{
      studentId: string;
      points?: number;
      percentage?: number;
      letterGrade?: string;
      comments?: string;
    }>
  ) {
    return this.put(
      `/grading/gradebook/assignments/${assignmentId}/bulk-grades`,
      { grades }
    );
  }

  // ============ GRADEBOOK ============

  // Get gradebook
  async getGradebook(classId?: string) {
    return this.get<{ success: boolean; data: GradebookEntry[] }>(
      '/grading/gradebook',
      { classId }
    );
  }

  // Get subject gradebook
  async getSubjectGradebook(subjectId: string) {
    return this.get<{ success: boolean; data: GradebookEntry[] }>(
      `/grading/gradebook/subjects/${subjectId}`
    );
  }

  // Generate grade report
  async generateGradeReport(subjectId: string) {
    return this.get(`/grading/gradebook/reports/subjects/${subjectId}`);
  }

  // Get student progress
  async getStudentProgress(studentId: string, subjectId: string) {
    return this.get(
      `/grading/gradebook/progress/students/${studentId}/subjects/${subjectId}`
    );
  }

  // Get class analytics
  async getClassAnalytics(subjectId: string) {
    return this.get(`/grading/gradebook/analytics/subjects/${subjectId}`);
  }

  // Get student grade summary
  async getStudentGradeSummary(studentId: string) {
    return this.get(`/grading/students/${studentId}/grade-summary`);
  }

  // ============ ATTENDANCE ============

  // Get attendance sessions
  async getAttendanceSessions(params?: {
    subjectId?: string;
    classId?: string;
    date?: string;
    status?: string;
  }) {
    return this.get<AttendanceSession[]>(
      '/grading/attendance/sessions',
      params
    );
  }

  // Get a single session
  async getAttendanceSession(id: string) {
    return this.get<AttendanceSession>(`/grading/attendance/sessions/${id}`);
  }

  // Get sessions by subject
  async getSessionsBySubject(subjectId: string) {
    return this.get<AttendanceSession[]>(
      `/grading/attendance/sessions/subject/${subjectId}`
    );
  }

  // Create attendance session
  async createAttendanceSession(data: {
    subjectId: string;
    classId?: string;
    date: string;
    startTime: string;
    endTime: string;
    type: 'lecture' | 'lab' | 'tutorial' | 'exam';
    room?: string;
    notes?: string;
  }) {
    return this.post<AttendanceSession>('/grading/attendance/sessions', data);
  }

  // Update attendance session
  async updateAttendanceSession(
    id: string,
    data: Partial<{
      date: string;
      startTime: string;
      endTime: string;
      type: string;
      status: string;
      room: string;
      notes: string;
    }>
  ) {
    return this.put<AttendanceSession>(
      `/grading/attendance/sessions/${id}`,
      data
    );
  }

  // Delete attendance session
  async deleteAttendanceSession(id: string) {
    return this.delete(`/grading/attendance/sessions/${id}`);
  }

  // Get attendance records
  async getAttendanceRecords(params?: {
    sessionId?: string;
    studentId?: string;
    date?: string;
    status?: string;
  }) {
    return this.get<AttendanceRecord[]>('/grading/attendance/records', params);
  }

  // Get records by session
  async getRecordsBySession(sessionId: string) {
    return this.get<AttendanceRecord[]>(
      `/grading/attendance/records/session/${sessionId}`
    );
  }

  // Get records by student
  async getRecordsByStudent(studentId: string) {
    return this.get<AttendanceRecord[]>(
      `/grading/attendance/records/student/${studentId}`
    );
  }

  // Get a single record
  async getAttendanceRecord(id: string) {
    return this.get<AttendanceRecord>(`/grading/attendance/records/${id}`);
  }

  // Create attendance record
  async createAttendanceRecord(data: {
    sessionId: string;
    studentId: string;
    status: 'present' | 'absent' | 'late' | 'excused';
    notes?: string;
  }) {
    return this.post<AttendanceRecord>('/grading/attendance/records', data);
  }

  // Update attendance record
  async updateAttendanceRecord(
    id: string,
    data: Partial<{
      status: 'present' | 'absent' | 'late' | 'excused';
      notes: string;
    }>
  ) {
    return this.put<AttendanceRecord>(
      `/grading/attendance/records/${id}`,
      data
    );
  }

  // Delete attendance record
  async deleteAttendanceRecord(id: string) {
    return this.delete(`/grading/attendance/records/${id}`);
  }

  // Bulk mark attendance
  async bulkMarkAttendance(
    classId: string,
    date: string,
    records: Array<{
      studentId: string;
      status: 'present' | 'absent' | 'late' | 'excused';
      notes?: string;
    }>
  ) {
    return this.post('/grading/attendance/bulk-update', {
      classId,
      date,
      records
    });
  }

  // Student check-in/check-out
  async studentCheckIn(sessionId: string) {
    return this.post(`/grading/attendance/checkin/${sessionId}`);
  }

  async studentCheckOut(sessionId: string) {
    return this.post(`/grading/attendance/checkout/${sessionId}`);
  }

  // Get student attendance summary
  async getStudentAttendanceSummary(studentId: string) {
    return this.get(`/grading/attendance/summary/student/${studentId}`);
  }

  // Generate attendance report
  async generateSubjectAttendanceReport(subjectId: string) {
    return this.get(`/grading/attendance/report/subject/${subjectId}`);
  }
}
