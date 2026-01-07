import { useState, useEffect } from 'react';

export interface GradeScale {
  id: string;
  label: string;
  minScore: number;
  maxScore: number;
  gpaValue: number;
  color?: string;
}

export interface GradingSystem {
  id: string;
  name: string;
  scale: string;
  gradeScales: GradeScale[];
}

export interface Subject {
  id: string;
  name: string;
  code?: string;
  mandatory?: boolean;
  creditHours?: number;
}

export interface ElectiveGroup {
  id: string;
  name: string;
  description?: string;
  maxSelectable: number;
  minSelectable: number;
  subjects: any[];
}

export interface SubjectFramework {
  id: string;
  name: string;
  coreSubjects: Subject[];
  electiveGroups: ElectiveGroup[];
}

export interface Term {
  id: string;
  name: string;
  startMonth: number;
  endMonth: number;
  weeks: number;
}

export interface AcademicCalendar {
  id: string;
  name: string;
  structure: string;
  weeksPerYear: number;
  terms: Term[];
}

export interface ClassLevel {
  id: string;
  name: string;
  code?: string;
  ageRange?: string;
  defaultCapacity: number;
}

export interface ClassStructure {
  id: string;
  name: string;
  classes: ClassLevel[];
}

export interface AssessmentType {
  id: string;
  name: string;
  weight: number;
  isCA: boolean;
}

export interface AssessmentFramework {
  id: string;
  name: string;
  caPercentage: number;
  examPercentage: number;
  passingScore: number;
  assessmentTypes: AssessmentType[];
}

export interface SchoolConfiguration {
  id: string;
  tenantId: string;
  schoolName: string;
  schoolLogo?: string;
  educationLevel: string;
  country: string;
  gradingSystemId: string;
  subjectFrameworkId: string;
  assessmentFrameworkId: string;
  academicCalendarId: string;
  classStructureId: string;
  gradingSystem: GradingSystem;
  subjectFramework: SubjectFramework;
  assessmentFramework: AssessmentFramework;
  academicCalendar: AcademicCalendar;
  classStructure: ClassStructure;
}

/**
 * Hook to load school configuration from API
 * Returns config with all nested data for forms
 */
export function useSchoolConfig(tenantId?: string) {
  const [config, setConfig] = useState<SchoolConfiguration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tenantId) {
      setLoading(false);
      return;
    }

    async function loadConfig() {
      try {
        setLoading(true);
        const res = await fetch(`/api/config/school/${tenantId}`);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        setConfig(data.config);
        setError(null);
      } catch (err) {
        console.error('Failed to load school config:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load school configuration'
        );
      } finally {
        setLoading(false);
      }
    }

    loadConfig();
  }, [tenantId]);

  return { config, loading, error };
}

/**
 * Calculate grade from score using grading system
 */
export function getGradeFromScore(
  score: number,
  gradeScales: GradeScale[]
): GradeScale | null {
  // Sort by minScore descending to find the highest matching grade
  const sorted = [...gradeScales].sort((a, b) => b.minScore - a.minScore);
  return sorted.find((g) => score >= g.minScore) || null;
}

/**
 * Get passing/failing grade
 */
export function isGradePassing(
  score: number,
  assessmentFramework: AssessmentFramework,
  gradeScales: GradeScale[]
): boolean {
  return score >= assessmentFramework.passingScore;
}

/**
 * Calculate weighted grade (CA + Exam)
 */
export function calculateWeightedGrade(
  caScore: number,
  examScore: number,
  assessmentFramework: AssessmentFramework
): number {
  const caWeight = assessmentFramework.caPercentage / 100;
  const examWeight = assessmentFramework.examPercentage / 100;
  return caScore * caWeight + examScore * examWeight;
}
