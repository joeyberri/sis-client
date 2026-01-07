import { useState, useCallback, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';

export interface OnboardingSession {
  id: string;
  tenantId: string;
  currentStep: number;
  selectedCountry?: string;
  selectedEducationLevel?: string;
  selectedTemplateId?: string;
  status: string;
}

export interface GradeScale {
  id: string;
  label: string;
  minScore: number;
  maxScore: number;
  gpaValue: number;
  color?: string;
}

export interface Subject {
  id: string;
  name: string;
  code?: string;
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

export interface GradingSystem {
  id: string;
  name: string;
  scale: string;
  gradeScales: GradeScale[];
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

export interface EducationTemplate {
  id: string;
  name: string;
  country: string;
  educationLevel: string;
  emoji?: string;
  description: string;
  sampleCurriculum: string[];
  features: string[];
  gradingSystem: GradingSystem;
  subjectFramework: SubjectFramework;
  assessmentFramework: AssessmentFramework;
  academicCalendar: AcademicCalendar;
  classStructure: ClassStructure;
}

export function useOnboarding(tenantId: string) {
  const [session, setSession] = useState<OnboardingSession | null>(null);
  const [templates, setTemplates] = useState<EducationTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] =
    useState<EducationTemplate | null>(null);
  const [schoolName, setSchoolName] = useState('');
  const [schoolLogo, setSchoolLogo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSession = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/api/onboarding/session/${tenantId}`);
      setSession(res.data?.session || res.session || null);
    } catch (err) {
      console.error('Failed to load onboarding session:', err);
      setError('Failed to load onboarding session');
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const updateSession = useCallback(
    async (updates: Partial<OnboardingSession>) => {
      try {
        const res = await apiClient.put(
          `/api/onboarding/session/${tenantId}`,
          updates
        );
        const sessionData = res.data?.session || res.session;
        setSession(sessionData);
        return sessionData;
      } catch (err) {
        console.error('Failed to update session:', err);
        setError('Failed to update onboarding progress');
        throw err;
      }
    },
    [tenantId]
  );

  const handleCountrySelect = useCallback(
    async (country: string) => {
      try {
        setLoading(true);
        setError(null);
        await updateSession({
          currentStep: 1,
          selectedCountry: country
        });
        setSelectedTemplate(null);
        setTemplates([]);
      } catch (err) {
        setError('Failed to select country');
      } finally {
        setLoading(false);
      }
    },
    [updateSession]
  );

  const handleLevelSelect = useCallback(
    async (level: string) => {
      try {
        setLoading(true);
        setError(null);

        if (!session?.selectedCountry) {
          setError('Please select a country first');
          return;
        }

        const res = await apiClient.get(
          `/api/onboarding/templates?country=${session.selectedCountry}&level=${level}`
        );
        const data = res.data || res;

        if (!data.success) {
          setError('Failed to fetch templates');
          return;
        }

        setTemplates(data.templates);
        setSelectedTemplate(null);

        await updateSession({
          currentStep: 2,
          selectedEducationLevel: level
        });
      } catch (err) {
        console.error('Failed to select education level:', err);
        setError('Failed to load templates');
      } finally {
        setLoading(false);
      }
    },
    [session?.selectedCountry, updateSession]
  );

  const handleTemplateSelect = useCallback(
    async (template: EducationTemplate) => {
      try {
        setSelectedTemplate(template);
        await updateSession({
          currentStep: 3,
          selectedTemplateId: template.id
        });
      } catch (err) {
        setError('Failed to select template');
      }
    },
    [updateSession]
  );

  const handleSaveConfiguration = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!schoolName.trim()) {
        setError('School name is required');
        return;
      }

      if (!selectedTemplate) {
        setError('Please select a template');
        return;
      }

      const res = await apiClient.post('/api/onboarding/configure', {
        tenantId,
        schoolName: schoolName.trim(),
        schoolLogo: schoolLogo.trim() || null,
        country: session?.selectedCountry,
        educationLevel: session?.selectedEducationLevel,
        selectedTemplateId: selectedTemplate.id
      });

      await updateSession({
        currentStep: 5,
        status: 'completed'
      });

      window.location.href = '/dashboard';
    } catch (err: any) {
      console.error('Failed to save configuration:', err);
      setError(err.message || 'Failed to save configuration');
    } finally {
      setLoading(false);
    }
  }, [
    tenantId,
    schoolName,
    schoolLogo,
    selectedTemplate,
    session,
    updateSession
  ]);

  return {
    session,
    templates,
    selectedTemplate,
    schoolName,
    setSchoolName,
    schoolLogo,
    setSchoolLogo,
    loading,
    error,
    handleCountrySelect,
    handleLevelSelect,
    handleTemplateSelect,
    handleSaveConfiguration,
    updateSession
  };
}
