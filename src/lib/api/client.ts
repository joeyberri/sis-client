import axios, { AxiosInstance, AxiosResponse } from 'axios';

class ApiClient {
  private client: AxiosInstance;
  public currentToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.client.interceptors.request.use(
      async (config) => {
        // Use Clerk token if available
        if (this.currentToken) {
          config.headers.Authorization = `Bearer ${this.currentToken}`;
        }

        // Add tenant header - let server determine correct tenant from org context
        // const tenantId = localStorage.getItem("X-Tenant-ID") || "default";
        // config.headers["X-Tenant-ID"] = tenantId;

        // Dev: allow a local debug flag to prevent automatic redirect on 401 and to help debugging
        try {
          const noRedirect = typeof window !== 'undefined' && window.localStorage?.getItem('DEV_NO_REDIRECT') === '1';
          if (noRedirect) {
            config.headers['X-DEV-NO-REDIRECT'] = '1';
          }
        } catch (e) {
          // ignore in non-browser environments
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        try {
          if (error.response?.status === 401) {
            // If developer debugging flag is set, skip redirect so dev can inspect the response
            const noRedirect = typeof window !== 'undefined' && window.localStorage?.getItem('DEV_NO_REDIRECT') === '1';
            const isAuthPage = typeof window !== 'undefined' && window.location?.pathname?.startsWith('/auth');
            
            if (!noRedirect && !isAuthPage) {
              // Handle unauthorized - redirect to sign in (but not if already on auth page)
              window.location.href = '/auth/sign-in';
            } else {
              // eslint-disable-next-line no-console
              console.warn('[apiClient] 401 received but not redirecting (isAuthPage=' + isAuthPage + ', DEV_NO_REDIRECT=' + noRedirect + ')');
            }
          }
        } catch (e) {
          // ignore errors reading localStorage
        }
        return Promise.reject(error);
      }
    );
  }

  // Allow external code to set the auth token (Clerk token) explicitly
  setAuthToken(token: string | null) {
    this.currentToken = token;
    // Development helper: optionally log (masked) token for local debugging when explicitly enabled
    try {
      if (process.env.NODE_ENV !== 'production') {
        const show = typeof window !== 'undefined' && window.localStorage?.getItem('DEV_SHOW_TOKEN') === '1';
        if (show) {
          const masked = token ? `***${token.slice(-6)}` : null;
          // eslint-disable-next-line no-console
          console.log('[apiClient] setAuthToken (masked)=', masked);
        }
      }
    } catch (e) {
      // ignore in non-browser environments
    }
  }

  // Students endpoints
  async getStudents(params?: { page?: number; limit?: number; search?: string }) {
    const response = await this.client.get('/students', { params });
    return response.data;
  }

  async getStudent(id: string) {
    const response = await this.client.get(`/students/${id}`);
    return response.data;
  }

  async createStudent(data: { name: string; email: string; grade?: string; class?: string; phone?: string; address?: string }) {
    const response = await this.client.post('/students', data);
    return response.data;
  }

  async updateStudent(id: string, data: Partial<{ name: string; email: string; grade?: string; class?: string; phone?: string; address?: string }>) {
    const response = await this.client.put(`/students/${id}`, data);
    return response.data;
  }

  async deleteStudent(id: string) {
    const response = await this.client.delete(`/students/${id}`);
    return response.data;
  }

  // Teachers endpoints
  async getTeachers(params?: { page?: number; limit?: number; search?: string }) {
    const response = await this.client.get('/teachers', { params });
    return response.data;
  }

  async getTeacher(id: string) {
    const response = await this.client.get(`/teachers/${id}`);
    return response.data;
  }

  async createTeacher(data: { name: string; email: string; subject?: string; department?: string; phone?: string; address?: string; qualifications?: string }) {
    const response = await this.client.post('/teachers', data);
    return response.data;
  }

  async updateTeacher(id: string, data: Partial<{ name: string; email: string; subject?: string; department?: string; phone?: string; address?: string; qualifications?: string }>) {
    const response = await this.client.put(`/teachers/${id}`, data);
    return response.data;
  }

  async deleteTeacher(id: string) {
    const response = await this.client.delete(`/teachers/${id}`);
    return response.data;
  }

  // Classes endpoints
  async getClasses(params?: { page?: number; limit?: number; search?: string }) {
    const response = await this.client.get('/classes', { params });
    return response.data;
  }

  async getClass(id: string) {
    const response = await this.client.get(`/classes/${id}`);
    return response.data;
  }

  async createClass(data: { name: string; subject: string; teacher: string; grade: string; maxCapacity: number; academicYear: string; description?: string; schedule: Array<{ day: string; startTime: string; endTime: string; room: string }> }) {
    const response = await this.client.post('/classes', data);
    return response.data;
  }

  async updateClass(id: string, data: Partial<{ name: string; subject: string; teacher: string; grade: string; maxCapacity: number; academicYear: string; description?: string; schedule: Array<{ day: string; startTime: string; endTime: string; room: string }> }>) {
    const response = await this.client.put(`/classes/${id}`, data);
    return response.data;
  }

  async deleteClass(id: string) {
    const response = await this.client.delete(`/classes/${id}`);
    return response.data;
  }

  // Subjects endpoints (stub - not implemented on server)
  // Subjects endpoints (grading module)
  async getSubjects(params?: { page?: number; limit?: number; search?: string }) {
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
  async getAssessments(params?: { page?: number; limit?: number; search?: string }) {
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
    const response = await this.client.get(`/grading/gradebook/subjects/${subjectId}`);
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
    const response = await this.client.get('/grading/attendance/sessions', { params });
    return response.data;
  }

  // Backwards-compatible helper used by some pages
  async getAttendance(params?: { classId?: string; date?: string }) {
    return this.getAttendanceSessions(params);
  }

  async getAttendanceSession(id: string) {
    const response = await this.client.get(`/grading/attendance/sessions/${id}`);
    return response.data;
  }

  async createAttendanceSession(data: any) {
    const response = await this.client.post('/grading/attendance/sessions', data);
    return response.data;
  }

  async updateAttendanceSession(id: string, data: any) {
    const response = await this.client.put(`/grading/attendance/sessions/${id}`, data);
    return response.data;
  }

  async deleteAttendanceSession(id: string) {
    const response = await this.client.delete(`/grading/attendance/sessions/${id}`);
    return response.data;
  }

  async getAttendanceRecords(params?: any) {
    const response = await this.client.get('/grading/attendance/records', { params });
    return response.data;
  }

  async getAttendanceRecord(id: string) {
    const response = await this.client.get(`/grading/attendance/records/${id}`);
    return response.data;
  }

  async createAttendanceRecord(data: any) {
    const response = await this.client.post('/grading/attendance/records', data);
    return response.data;
  }

  async updateAttendanceRecord(id: string, data: any) {
    const response = await this.client.put(`/grading/attendance/records/${id}`, data);
    return response.data;
  }

  async deleteAttendanceRecord(id: string) {
    const response = await this.client.delete(`/grading/attendance/records/${id}`);
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

  // Parents / guardians endpoints
  async getParents(params?: any) {
    const response = await this.client.get('/parents', { params });
    return response.data;
  }

  async inviteParent(data: any) {
    const response = await this.client.post('/parents/invite', data);
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

  async getPayments(params?: any) {
    const response = await this.client.get('/payments', { params });
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
      headers: { 'Content-Type': 'multipart/form-data' },
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

  // Analytics endpoints
  async getAnalytics(params?: any) {
    const response = await this.client.get('/analytics', { params });
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
        params.append('where', `${clause.field}:${clause.operator}:${clause.value}`);
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
  async createView(data: { name: string; description?: string; module: string; query: any; isPublic?: boolean }) {
    const response = await this.client.post('/views', data);
    return response.data;
  }

  /**
   * Saved Views - Update an existing view
   */
  async updateView(viewId: string, data: Partial<{ name: string; description?: string; query: any; isPublic?: boolean }>) {
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
    const response = await this.client.post(`/views/${viewId}/share`, { makePublic });
    return response.data;
  }

  /**
   * Saved Views - Clone a view for current user
   */
  async cloneView(viewId: string, newName?: string) {
    const response = await this.client.post(`/views/${viewId}/clone`, { newName });
    return response.data;
  }

  /**
   * Analytics - Get admin dashboard analytics
   */
  async getAnalytics() {
    const response = await this.client.get('/analytics/admin-dashboard');
    return response.data;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;