// Export all API clients
export { BaseApiClient } from './base-client';
export {
  StudentsApiClient,
  type Student,
  type CreateStudentData,
  type UpdateStudentData
} from './students';
export {
  TeachersApiClient,
  type Teacher,
  type CreateTeacherData,
  type UpdateTeacherData
} from './teachers';
export {
  ClassesApiClient,
  type Class,
  type CreateClassData,
  type UpdateClassData,
  type ClassEnrollment,
  type ClassSubject
} from './classes';
export {
  GradingApiClient,
  type Subject as GradingSubject,
  type Assignment,
  type Grade,
  type AttendanceSession,
  type AttendanceRecord,
  type GradebookEntry
} from './grading';
export {
  FeesApiClient,
  type FeeStructure,
  type FeePayment,
  type Invoice,
  type StudentFeeStatus,
  type FeeCollectionSummary
} from './fees';
export {
  AcademicApiClient,
  type AcademicYear,
  type AcademicTerm,
  type TimetableSlot
} from './academic';

// Legacy export for backwards compatibility
export { default as apiClient } from './client';
