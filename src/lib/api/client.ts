import { BaseApiClient } from './base-client';
import { StudentsApiClient } from './students';
import { TeachersApiClient } from './teachers';
import { ClassesApiClient } from './classes';
import { GradingApiClient } from './grading';
import { FeesApiClient } from './fees';
import { AcademicApiClient } from './academic';

// Unified API Client that provides access to all modular clients
class ApiClient extends BaseApiClient {
  // Modular API clients
  public students: StudentsApiClient;
  public teachers: TeachersApiClient;
  public classes: ClassesApiClient;
  public grading: GradingApiClient;
  public fees: FeesApiClient;
  public academic: AcademicApiClient;

  constructor() {
    super(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');
    // Initialize all modular clients with the same base configuration
    this.students = new StudentsApiClient();
    this.teachers = new TeachersApiClient();
    this.classes = new ClassesApiClient();
    this.grading = new GradingApiClient();
    this.fees = new FeesApiClient();
    this.academic = new AcademicApiClient();

    // Share the same token across all clients
    this.students.currentToken = this.currentToken;
    this.teachers.currentToken = this.currentToken;
    this.classes.currentToken = this.currentToken;
    this.grading.currentToken = this.currentToken;
    this.fees.currentToken = this.currentToken;
    this.academic.currentToken = this.currentToken;
  }

  // Override setAuthToken to update all modular clients
  setAuthToken(token: string | null) {
    super.setAuthToken(token);
    this.students.currentToken = token;
    this.teachers.currentToken = token;
    this.classes.currentToken = token;
    this.grading.currentToken = token;
    this.fees.currentToken = token;
    this.academic.currentToken = token;
  }

  // Students endpoints
  async getStudents(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const response = await this.client.get('/students', { params });
    return response.data;
  }

  async getStudent(id: string) {
    const response = await this.client.get(`/students/${id}`);
    return response.data;
  }

  async createStudent(data: {
    name: string;
    email: string;
    grade?: string;
    class?: string;
    phone?: string;
    address?: string;
  }) {
    const response = await this.client.post('/students', data);
    return response.data;
  }

  async updateStudent(
    id: string,
    data: Partial<{
      name: string;
      email: string;
      grade?: string;
      class?: string;
      phone?: string;
      address?: string;
      status?: string;
    }>
  ) {
    const response = await this.client.put(`/students/${id}`, data);
    return response.data;
  }

  async inviteUser(data: { name: string; email: string; role: string }) {
    const response = await this.client.post('/auth/invite', data);
    return response.data;
  }

  // Storage endpoints
  async getStorageStats() {
    const response = await this.client.get('/storage/me');
    return response.data;
  }

  async getFiles(params?: {
    mimeType?: string;
    limit?: number;
    offset?: number;
  }) {
    const response = await this.client.get('/storage/files', { params });
    return response.data;
  }

  async uploadFile(file: File, isPublic: boolean = false) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('isPublic', isPublic.toString());

    const response = await this.client.post('/storage/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  async deleteFile(fileId: string) {
    const response = await this.client.delete(`/storage/files/${fileId}`);
    return response.data;
  }

  async deleteStudent(id: string) {
    const response = await this.client.delete(`/students/${id}`);
    return response.data;
  }

  // Teachers endpoints
  async getTeachers(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const response = await this.client.get('/teachers', { params });
    return response.data;
  }

  async getTeacher(id: string) {
    const response = await this.client.get(`/teachers/${id}`);
    return response.data;
  }

  async createTeacher(data: {
    name: string;
    email: string;
    subject?: string;
    department?: string;
    phone?: string;
    address?: string;
    qualifications?: string;
  }) {
    const response = await this.client.post('/teachers', data);
    return response.data;
  }

  async updateTeacher(
    id: string,
    data: Partial<{
      name: string;
      email: string;
      subject?: string;
      department?: string;
      phone?: string;
      address?: string;
      qualifications?: string;
      status?: string;
    }>
  ) {
    const response = await this.client.put(`/teachers/${id}`, data);
    return response.data;
  }

  async deleteTeacher(id: string) {
    const response = await this.client.delete(`/teachers/${id}`);
    return response.data;
  }

  // Classes endpoints
  async getClasses(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const response = await this.client.get('/classes', { params });
    return response.data;
  }

  async getClass(id: string) {
    const response = await this.client.get(`/classes/${id}`);
    return response.data;
  }

  async createClass(data: {
    name: string;
    subject: string;
    teacher: string;
    grade: string;
    maxCapacity: number;
    academicYear: string;
    description?: string;
    schedule: Array<{
      day: string;
      startTime: string;
      endTime: string;
      room: string;
    }>;
  }) {
    const response = await this.client.post('/classes', data);
    return response.data;
  }

  async updateClass(
    id: string,
    data: Partial<{
      name: string;
      subject: string;
      teacher: string;
      grade: string;
      maxCapacity: number;
      academicYear: string;
      description?: string;
      schedule: Array<{
        day: string;
        startTime: string;
        endTime: string;
        room: string;
      }>;
    }>
  ) {
    const response = await this.client.put(`/classes/${id}`, data);
    return response.data;
  }

  async deleteClass(id: string) {
    const response = await this.client.delete(`/classes/${id}`);
    return response.data;
  }

  // Subjects endpoints (stub - not implemented on server)
  // Subjects endpoints (grading module)
  async getSubjects(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const response = await this.client.get('/grading/subjects', { params });
    return response.data;
  }

  async getSubject(id: string) {
    const response = await this.client.get(`/grading/subjects/${id}`);
    return response.data;
  }

  async createSubject(data: any) {
    const response = await this.client.post('/grading/subjects', data);
    return response.data;
  }

  async updateSubject(id: string, data: any) {
    const response = await this.client.put(`/grading/subjects/${id}`, data);
    return response.data;
  }

  async deleteSubject(id: string) {
    const response = await this.client.delete(`/grading/subjects/${id}`);
    return response.data;
  }

  // Assessments endpoints
  async getAssessments(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const response = await this.client.get('/assessments', { params });
    return response.data;
  }

  async getAssessment(id: string) {
    const response = await this.client.get(`/assessments/${id}`);
    return response.data;
  }

  async createAssessment(data: any) {
    const response = await this.client.post('/assessments', data);
    return response.data;
  }

  async updateAssessment(id: string, data: any) {
    const response = await this.client.put(`/assessments/${id}`, data);
    return response.data;
  }

  async deleteAssessment(id: string) {
    const response = await this.client.delete(`/assessments/${id}`);
    return response.data;
  }

  // Gradebook endpoints
  async getGradebook(classId?: string) {
    const params = classId ? { classId } : undefined;
    const response = await this.client.get('/grading/gradebook', { params });
    return response.data;
  }

  async getSubjectGradebook(subjectId: string) {
    const response = await this.client.get(
      `/grading/gradebook/subjects/${subjectId}`
    );
    return response.data;
  }

  // Assignments endpoints (grading)
  async getAssignments(params?: any) {
    const response = await this.client.get('/grading/assignments', { params });
    return response.data;
  }

  async getAssignment(id: string) {
    const response = await this.client.get(`/grading/assignments/${id}`);
    return response.data;
  }

  async createAssignment(data: any) {
    const response = await this.client.post('/grading/assignments', data);
    return response.data;
  }

  async updateAssignment(id: string, data: any) {
    const response = await this.client.put(`/grading/assignments/${id}`, data);
    return response.data;
  }

  async deleteAssignment(id: string) {
    const response = await this.client.delete(`/grading/assignments/${id}`);
    return response.data;
  }

  // Grades endpoints (grading)
  async getGrades(params?: any) {
    const response = await this.client.get('/grading/grades', { params });
    return response.data;
  }

  async getGrade(id: string) {
    const response = await this.client.get(`/grading/grades/${id}`);
    return response.data;
  }

  async createGrade(data: any) {
    const response = await this.client.post('/grading/grades', data);
    return response.data;
  }

  async updateGrade(id: string, data: any) {
    const response = await this.client.put(`/grading/grades/${id}`, data);
    return response.data;
  }

  async deleteGrade(id: string) {
    const response = await this.client.delete(`/grading/grades/${id}`);
    return response.data;
  }

  // Attendance endpoints
  async getAttendanceSessions(params?: any) {
    const response = await this.client.get('/grading/attendance/sessions', {
      params
    });
    return response.data;
  }

  // Backwards-compatible helper used by some pages
  async getAttendance(params?: { classId?: string; date?: string }) {
    return this.getAttendanceSessions(params);
  }

  async getAttendanceSession(id: string) {
    const response = await this.client.get(
      `/grading/attendance/sessions/${id}`
    );
    return response.data;
  }

  async createAttendanceSession(data: any) {
    const response = await this.client.post(
      '/grading/attendance/sessions',
      data
    );
    return response.data;
  }

  async updateAttendanceSession(id: string, data: any) {
    const response = await this.client.put(
      `/grading/attendance/sessions/${id}`,
      data
    );
    return response.data;
  }

  async deleteAttendanceSession(id: string) {
    const response = await this.client.delete(
      `/grading/attendance/sessions/${id}`
    );
    return response.data;
  }

  async getAttendanceRecords(params?: any) {
    const response = await this.client.get('/grading/attendance/records', {
      params
    });
    return response.data;
  }

  async getAttendanceRecord(id: string) {
    const response = await this.client.get(`/grading/attendance/records/${id}`);
    return response.data;
  }

  async createAttendanceRecord(data: any) {
    const response = await this.client.post(
      '/grading/attendance/records',
      data
    );
    return response.data;
  }

  async updateAttendanceRecord(id: string, data: any) {
    const response = await this.client.put(
      `/grading/attendance/records/${id}`,
      data
    );
    return response.data;
  }

  async deleteAttendanceRecord(id: string) {
    const response = await this.client.delete(
      `/grading/attendance/records/${id}`
    );
    return response.data;
  }

  async bulkMarkAttendance(
    classId: string,
    date: string,
    records: Array<{
      studentId: string;
      status: string;
      notes?: string;
    }>
  ) {
    const response = await this.client.post('/grading/attendance/bulk', {
      classId,
      date,
      records
    });
    return response.data;
  }

  // Reports endpoints
  async getReports(params?: any) {
    const response = await this.client.get('/reports', { params });
    return response.data;
  }

  async createReport(data: any) {
    const response = await this.client.post('/reports', data);
    return response.data;
  }

  async scheduleReport(data: any) {
    const response = await this.client.post('/reports/schedule', data);
    return response.data;
  }

  // Alerts endpoints
  async getAlerts(params?: any) {
    const response = await this.client.get('/alerts', { params });
    return response.data;
  }

  async createAlert(data: any) {
    const response = await this.client.post('/alerts', data);
    return response.data;
  }

  async deleteAlert(alertId: string) {
    const response = await this.client.delete(`/alerts/${alertId}`);
    return response.data;
  }

  async markAlertAsRead(alertId: string) {
    const response = await this.client.patch(`/alerts/${alertId}/read`);
    return response.data;
  }

  // Parents / guardians endpoints
  async getParents(params?: any) {
    const response = await this.client.get('/parents', { params });
    return response.data;
  }

  async getParent(id: string) {
    const response = await this.client.get(`/parents/${id}`);
    return response.data;
  }

  async createParent(data: any) {
    const response = await this.client.post('/parents', data);
    return response.data;
  }

  async updateParent(id: string, data: any) {
    const response = await this.client.put(`/parents/${id}`, data);
    return response.data;
  }

  async deleteParent(id: string) {
    const response = await this.client.delete(`/parents/${id}`);
    return response.data;
  }

  async inviteParent(data: any) {
    const response = await this.client.post('/parents/invite', data);
    return response.data;
  }

  async linkParentToStudent(
    parentId: string,
    studentId: string,
    relation?: string
  ) {
    const response = await this.client.post(`/parents/${parentId}/link`, {
      studentId,
      relation
    });
    return response.data;
  }

  async unlinkParentFromStudent(parentId: string, studentId: string) {
    const response = await this.client.delete(
      `/parents/${parentId}/unlink/${studentId}`
    );
    return response.data;
  }

  // Fees / invoices / payments endpoints
  async getFees(params?: any) {
    const response = await this.client.get('/fees', { params });
    return response.data;
  }

  async getInvoices(params?: any) {
    const response = await this.client.get('/invoices', { params });
    return response.data;
  }

  async createInvoice(data: {
    studentId: string;
    feeStructureId: string;
    dueDate: string;
  }) {
    const response = await this.client.post('/invoices', data);
    return response.data;
  }

  async sendInvoice(invoiceId: string) {
    const response = await this.client.post(`/invoices/${invoiceId}/send`);
    return response.data;
  }

  async markInvoicePaid(invoiceId: string) {
    const response = await this.client.patch(
      `/invoices/${invoiceId}/mark-paid`
    );
    return response.data;
  }

  async getPayments(params?: any) {
    const response = await this.client.get('/payments', { params });
    return response.data;
  }

  async reconcilePayment(paymentId: string) {
    const response = await this.client.patch(
      `/payments/${paymentId}/reconcile`
    );
    return response.data;
  }

  async cancelPayment(paymentId: string) {
    const response = await this.client.patch(`/payments/${paymentId}/cancel`);
    return response.data;
  }

  // Documents endpoints
  async getDocuments(params?: any) {
    const response = await this.client.get('/documents', { params });
    return response.data;
  }

  async uploadDocument(data: any) {
    // Note: backend should accept multipart/form-data. Caller must set Content-Type accordingly.
    const response = await this.client.post('/documents', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  // Promotions / bulk actions
  async promoteStudents(data: any) {
    const response = await this.client.post('/students/promotions', data);
    return response.data;
  }

  // Timetable endpoints
  async getTimetables(params?: any) {
    const response = await this.client.get('/timetables', { params });
    return response.data;
  }

  async updateTimetable(id: string, data: any) {
    const response = await this.client.put(`/timetables/${id}`, data);
    return response.data;
  }

  // Generic GET method
  async get(path: string, params?: any) {
    const response = await this.client.get(path, { params });
    return response.data;
  }

  // Generic POST method
  async post(path: string, data?: any) {
    const response = await this.client.post(path, data);
    return response.data;
  }

  // Generic PUT method
  async put(path: string, data?: any) {
    const response = await this.client.put(path, data);
    return response.data;
  }

  // Auth endpoints
  async getCurrentUser() {
    const response = await this.client.get('/auth/me');
    return response.data;
  }

  // Users endpoints
  async getUsers(params?: any) {
    const response = await this.client.get('/users', { params });
    return response.data;
  }

  async getUser(id: string) {
    const response = await this.client.get(`/users/${id}`);
    return response.data;
  }

  async createUser(data: any) {
    const response = await this.client.post('/users', data);
    return response.data;
  }

  async updateUser(id: string, data: any) {
    const response = await this.client.put(`/users/${id}`, data);
    return response.data;
  }

  async deleteUser(id: string) {
    const response = await this.client.delete(`/users/${id}`);
    return response.data;
  }

  // Generic DELETE method
  async delete(path: string) {
    const response = await this.client.delete(path);
    return response.data;
  }

  /**
   * Smart Query Builder (Firestore-like)
   * Query any resource with filters, sorting, pagination
   * Example: query('students', { where: [{field: 'grade', operator: 'eq', value: '10'}], orderBy: [{field: 'name', direction: 'asc'}], limit: 20 })
   */
  async query(resource: string, options?: any) {
    const params = new URLSearchParams();

    // Add where clauses
    if (options?.where && Array.isArray(options.where)) {
      options.where.forEach((clause: any) => {
        params.append(
          'where',
          `${clause.field}:${clause.operator}:${clause.value}`
        );
      });
    }

    // Add orderBy
    if (options?.orderBy && Array.isArray(options.orderBy)) {
      options.orderBy.forEach((order: any) => {
        params.append('orderBy', `${order.field}:${order.direction || 'asc'}`);
      });
    }

    // Add pagination
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.offset) params.append('offset', options.offset.toString());

    // Add field selection
    if (options?.select && Array.isArray(options.select)) {
      params.append('select', options.select.join(','));
    }

    const response = await this.client.get(`/query/${resource}`, { params });
    return response.data;
  }

  /**
   * Bulk Create/Update
   * Create or update multiple records at once
   * Example: bulkUpsert('students', [{ email: 'a@b.com', name: 'A' }, ...])
   */
  async bulkUpsert(resource: string, items: any[]) {
    const response = await this.client.post(`/bulk/${resource}`, items);
    return response.data;
  }

  /**
   * Saved Views - List all saved views
   */
  async listViews(module?: string) {
    const params = module ? { module } : undefined;
    const response = await this.client.get('/views', { params });
    return response.data;
  }

  /**
   * Saved Views - Get a specific view
   */
  async getView(viewId: string) {
    const response = await this.client.get(`/views/${viewId}`);
    return response.data;
  }

  /**
   * Saved Views - Get a view by share token (public)
   */
  async getSharedView(shareToken: string) {
    const response = await this.client.get(`/views/share/${shareToken}`);
    return response.data;
  }

  /**
   * Saved Views - Create a new saved view
   */
  async createView(data: {
    name: string;
    description?: string;
    module: string;
    query: any;
    isPublic?: boolean;
  }) {
    const response = await this.client.post('/views', data);
    return response.data;
  }

  /**
   * Saved Views - Update an existing view
   */
  async updateView(
    viewId: string,
    data: Partial<{
      name: string;
      description?: string;
      query: any;
      isPublic?: boolean;
    }>
  ) {
    const response = await this.client.put(`/views/${viewId}`, data);
    return response.data;
  }

  /**
   * Saved Views - Delete a view
   */
  async deleteView(viewId: string) {
    const response = await this.client.delete(`/views/${viewId}`);
    return response.data;
  }

  /**
   * Saved Views - Share a view (make public)
   */
  async shareView(viewId: string, makePublic: boolean) {
    const response = await this.client.post(`/views/${viewId}/share`, {
      makePublic
    });
    return response.data;
  }

  /**
   * Saved Views - Clone a view for current user
   */
  async cloneView(viewId: string, newName?: string) {
    const response = await this.client.post(`/views/${viewId}/clone`, {
      newName
    });
    return response.data;
  }

  /**
   * Analytics - Get admin dashboard analytics
   */
  async getAnalytics() {
    const response = await this.client.get('/analytics/admin-dashboard');
    return response.data;
  }

  // ============================================
  // ACADEMIC YEAR & TERM MANAGEMENT
  // ============================================

  async getAcademicYears(params?: { status?: string }) {
    const response = await this.client.get('/api/academic/years', { params });
    return response.data;
  }

  async getCurrentAcademicYear() {
    const response = await this.client.get('/api/academic/years/current');
    return response.data;
  }

  async createAcademicYear(data: {
    name: string;
    startDate: string;
    endDate: string;
    isCurrent?: boolean;
  }) {
    const response = await this.client.post('/api/academic/years', data);
    return response.data;
  }

  async updateAcademicYear(
    id: string,
    data: Partial<{
      name: string;
      startDate: string;
      endDate: string;
      status: string;
      isCurrent: boolean;
    }>
  ) {
    const response = await this.client.put(`/api/academic/years/${id}`, data);
    return response.data;
  }

  async getAcademicTerms(academicYearId?: string) {
    if (academicYearId) {
      const response = await this.client.get(
        `/api/academic/years/${academicYearId}/terms`
      );
      return response.data;
    }
    // Get all terms
    const response = await this.client.get('/api/academic/terms');
    return response.data;
  }

  async getCurrentTerm() {
    const response = await this.client.get('/api/academic/terms/current');
    return response.data;
  }

  async createAcademicTerm(
    academicYearId: string,
    data: {
      name: string;
      startDate: string;
      endDate: string;
      termNumber: number;
    }
  ) {
    const response = await this.client.post(
      `/api/academic/years/${academicYearId}/terms`,
      data
    );
    return response.data;
  }

  async updateAcademicTerm(
    id: string,
    data: Partial<{
      name: string;
      startDate: string;
      endDate: string;
      isCurrent: boolean;
    }>
  ) {
    const response = await this.client.put(`/api/academic/terms/${id}`, data);
    return response.data;
  }

  // ============================================
  // CLASS & ENROLLMENT MANAGEMENT
  // ============================================

  async getClassesList(params?: {
    academicYearId?: string;
    grade?: string;
    search?: string;
  }) {
    const response = await this.client.get('/api/classes', { params });
    return response.data;
  }

  async getClassById(id: string) {
    const response = await this.client.get(`/api/classes/${id}`);
    return response.data;
  }

  async createClassroom(data: {
    name: string;
    grade: string;
    section?: string;
    academicYearId: string;
    classTeacherId?: string;
    roomNumber?: string;
    capacity?: number;
  }) {
    const response = await this.client.post('/api/classes', data);
    return response.data;
  }

  async updateClassroom(
    id: string,
    data: Partial<{
      name: string;
      grade: string;
      section: string;
      classTeacherId: string;
      roomNumber: string;
      capacity: number;
    }>
  ) {
    const response = await this.client.put(`/api/classes/${id}`, data);
    return response.data;
  }

  async deleteClassroom(id: string) {
    const response = await this.client.delete(`/api/classes/${id}`);
    return response.data;
  }

  async getClassEnrollments(classId: string) {
    const response = await this.client.get(
      `/api/classes/${classId}/enrollments`
    );
    return response.data;
  }

  async enrollStudentsInClass(classId: string, studentIds: string[]) {
    const response = await this.client.post(
      `/api/classes/${classId}/enrollments`,
      { studentIds }
    );
    return response.data;
  }

  async removeStudentFromClass(classId: string, studentId: string) {
    const response = await this.client.delete(
      `/api/classes/${classId}/enrollments/${studentId}`
    );
    return response.data;
  }

  async getStudentClasses(studentId: string) {
    const response = await this.client.get(
      `/api/students/${studentId}/classes`
    );
    return response.data;
  }

  async assignSubjectsToClass(classId: string, subjectIds: string[]) {
    const response = await this.client.post(
      `/api/classes/${classId}/subjects`,
      { subjectIds }
    );
    return response.data;
  }

  // ============================================
  // FEE MANAGEMENT
  // ============================================

  async getFeeStructures(params?: {
    academicYearId?: string;
    grade?: string;
    type?: string;
  }) {
    const response = await this.client.get('/api/fees/structures', { params });
    return response.data;
  }

  async getFeeStructure(id: string) {
    const response = await this.client.get(`/api/fees/structures/${id}`);
    return response.data;
  }

  async createFeeStructure(data: {
    name: string;
    description?: string;
    amount: number;
    type: string;
    frequency: string;
    academicYearId: string;
    grade?: string;
    dueDate?: string;
  }) {
    const response = await this.client.post('/api/fees/structures', data);
    return response.data;
  }

  async updateFeeStructure(
    id: string,
    data: Partial<{
      name: string;
      description: string;
      amount: number;
      type: string;
      frequency: string;
      grade: string;
      dueDate: string;
      isActive: boolean;
    }>
  ) {
    const response = await this.client.put(`/api/fees/structures/${id}`, data);
    return response.data;
  }

  async deleteFeeStructure(id: string) {
    const response = await this.client.delete(`/api/fees/structures/${id}`);
    return response.data;
  }

  async getStudentFeeStatus(studentId: string, academicYearId?: string) {
    const response = await this.client.get(
      `/api/fees/students/${studentId}/status`,
      { params: { academicYearId } }
    );
    return response.data;
  }

  async recordFeePayment(data: {
    studentId: string;
    feeStructureId?: string;
    amount: number;
    paymentMethod: string;
    reference?: string;
    notes?: string;
  }) {
    const response = await this.client.post('/api/fees/payments', data);
    return response.data;
  }

  async getFeePayments(params?: {
    studentId?: string;
    feeStructureId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const response = await this.client.get('/api/fees/payments', { params });
    return response.data;
  }

  async getFeeCollectionSummary(params?: {
    academicYearId?: string;
    termId?: string;
  }) {
    const response = await this.client.get('/api/fees/collection-summary', {
      params
    });
    return response.data;
  }

  // ============================================
  // REPORT CARD MANAGEMENT
  // ============================================

  async generateReportCards(data: {
    studentIds?: string[];
    classId?: string;
    termId: string;
  }) {
    const response = await this.client.post(
      '/api/reports/report-cards/generate',
      data
    );
    return response.data;
  }

  async downloadReportCard(studentId: string, termId: string) {
    const response = await this.client.get(
      `/api/reports/report-cards/student/${studentId}/download`,
      {
        params: { termId },
        responseType: 'blob'
      }
    );
    return response.data;
  }

  async getClassReportCards(classId: string, termId: string) {
    const response = await this.client.get(
      `/api/reports/report-cards/class/${classId}`,
      { params: { termId } }
    );
    return response.data;
  }

  async getStudentReportCard(studentId: string, termId: string) {
    const response = await this.client.get(
      `/api/reports/report-cards/student/${studentId}`,
      { params: { termId } }
    );
    return response.data;
  }

  async getStudentReportHistory(studentId: string) {
    const response = await this.client.get(
      `/api/reports/report-cards/student/${studentId}/history`
    );
    return response.data;
  }

  async publishReportCards(data: { reportCardIds: string[] }) {
    const response = await this.client.post(
      '/api/reports/report-cards/publish',
      data
    );
    return response.data;
  }

  async addReportCardComment(
    reportCardId: string,
    data: { comment: string; commentType: string }
  ) {
    const response = await this.client.put(
      `/api/reports/report-cards/${reportCardId}/comments`,
      data
    );
    return response.data;
  }

  // ============================================
  // TIMETABLE MANAGEMENT
  // ============================================

  async getClassTimetable(classId: string) {
    const response = await this.client.get(`/api/timetable/class/${classId}`);
    return response.data;
  }

  async getTeacherTimetable(teacherId: string) {
    const response = await this.client.get(
      `/api/timetable/teacher/${teacherId}`
    );
    return response.data;
  }

  async getTimetableSlots(params?: any) {
    const response = await this.client.get('/api/timetable/slots', { params });
    return response.data;
  }

  async createTimetableSlot(data: {
    classId: string;
    subjectId?: string;
    teacherId?: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    room?: string;
  }) {
    const response = await this.client.post('/api/timetable/slots', data);
    return response.data;
  }

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
    const response = await this.client.put(`/api/timetable/slots/${id}`, data);
    return response.data;
  }

  async deleteTimetableSlot(id: string) {
    const response = await this.client.delete(`/api/timetable/slots/${id}`);
    return response.data;
  }

  async generateTimetableTemplate(
    classId: string,
    data: {
      periodsPerDay: number;
      periodDuration: number;
      breakTimes: { start: string; end: string }[];
    }
  ) {
    const response = await this.client.post(
      `/api/timetable/class/${classId}/generate-template`,
      data
    );
    return response.data;
  }

  // ============================================
  // NOTIFICATION MANAGEMENT
  // ============================================

  async getNotifications(params?: {
    unreadOnly?: boolean;
    type?: string;
    limit?: number;
    page?: number;
  }) {
    const response = await this.client.get('/api/notifications', { params });
    return response.data;
  }

  async markNotificationRead(id: string) {
    const response = await this.client.put(`/api/notifications/${id}/read`);
    return response.data;
  }

  async markAllNotificationsRead() {
    const response = await this.client.put('/api/notifications/read-all');
    return response.data;
  }

  async createNotification(data: {
    userId: string;
    title: string;
    message: string;
    type?: string;
    entityType?: string;
    entityId?: string;
  }) {
    const response = await this.client.post('/api/notifications', data);
    return response.data;
  }

  async sendBulkNotifications(data: {
    userIds: string[];
    title: string;
    message: string;
    type?: string;
  }) {
    const response = await this.client.post('/api/notifications/bulk', data);
    return response.data;
  }

  async sendRoleNotification(data: {
    role: string;
    title: string;
    message: string;
    type?: string;
  }) {
    const response = await this.client.post(
      '/api/notifications/send-to-role',
      data
    );
    return response.data;
  }

  async deleteNotification(id: string) {
    const response = await this.client.delete(`/api/notifications/${id}`);
    return response.data;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
