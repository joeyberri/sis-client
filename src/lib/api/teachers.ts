import { BaseApiClient } from './base-client';

// Teacher type definitions
export interface Teacher {
  id: string;
  name: string;
  email: string;
  subject?: string;
  department?: string;
  phone?: string;
  address?: string;
  qualifications?: string;
  hire_date?: string;
  status?: 'active' | 'inactive' | 'suspended';
  created_at?: string;
  updated_at?: string;
}

export interface CreateTeacherData {
  name: string;
  email: string;
  subject?: string;
  department?: string;
  phone?: string;
  address?: string;
  qualifications?: string;
}

export interface UpdateTeacherData extends Partial<CreateTeacherData> {
  status?: 'active' | 'inactive' | 'suspended';
}

export class TeachersApiClient extends BaseApiClient {
  // Get all teachers
  async getTeachers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    subject?: string;
    department?: string;
    status?: string;
  }) {
    return this.get<Teacher[]>('/teachers', params);
  }

  // Get a single teacher
  async getTeacher(id: string) {
    return this.get<Teacher>(`/teachers/${id}`);
  }

  // Create a new teacher
  async createTeacher(data: CreateTeacherData) {
    return this.post<Teacher>('/teachers', data);
  }

  // Update an existing teacher
  async updateTeacher(id: string, data: UpdateTeacherData) {
    return this.put<Teacher>(`/teachers/${id}`, data);
  }

  // Delete a teacher
  async deleteTeacher(id: string) {
    return this.delete(`/teachers/${id}`);
  }

  // Bulk operations
  async bulkUpsert(items: CreateTeacherData[]) {
    return this.post('/bulk/teachers', items);
  }

  // Get teacher timetable
  async getTeacherTimetable(teacherId: string) {
    return this.get(`/api/timetable/teacher/${teacherId}`);
  }
}
