import { useState } from 'react';
import { useSchoolConfig } from '@/hooks/useSchoolConfig';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle } from 'lucide-react';

interface StudentFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  classLevel: string;
  coreSubjects: string[];
  selectedElectives: Record<string, string>; // electiveGroupId -> selectedSubjectId
}

export function ConfigDrivenStudentForm({ tenantId }: { tenantId: string }) {
  const { config, loading: configLoading, error: configError } = useSchoolConfig(tenantId);
  const [formData, setFormData] = useState<StudentFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    classLevel: '',
    coreSubjects: [],
    selectedElectives: {},
  });
  const [saving, setSaving] = useState(false);

  if (configLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (configError || !config) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {configError || 'Failed to load school configuration'}
        </AlertDescription>
      </Alert>
    );
  }

  const classLevels = config.classStructure.classes;
  const coreSubjects = config.subjectFramework.coreSubjects;
  const electiveGroups = config.subjectFramework.electiveGroups;

  function handleInputChange(field: keyof StudentFormData, value: any) {
    setFormData({
      ...formData,
      [field]: value,
    });
  }

  function handleCoreSubjectToggle(subjectId: string) {
    const updated = formData.coreSubjects.includes(subjectId)
      ? formData.coreSubjects.filter((id) => id !== subjectId)
      : [...formData.coreSubjects, subjectId];
    setFormData({
      ...formData,
      coreSubjects: updated,
    });
  }

  function handleElectiveSelect(groupId: string, subjectId: string) {
    setFormData({
      ...formData,
      selectedElectives: {
        ...formData.selectedElectives,
        [groupId]: subjectId,
      },
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      // TODO: Submit to API
      alert('Student created successfully!');
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        classLevel: '',
        coreSubjects: [],
        selectedElectives: {},
      });
    } catch (error) {
      alert('Failed to create student');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enroll New Student</CardTitle>
        <CardDescription>
          Add a student to {config.schoolName || 'your school'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">First Name</label>
                <Input
                  required
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="John"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Last Name</label>
                <Input
                  required
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Doe"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Date of Birth</label>
              <Input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              />
            </div>
          </div>

          {/* Class Assignment */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Class Assignment</h3>
            <div>
              <label className="text-sm font-medium">Class Level</label>
              <select
                required
                value={formData.classLevel}
                onChange={(e) => handleInputChange('classLevel', e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                <option value="">Select a class</option>
                {classLevels.map((classLevel) => (
                  <option key={classLevel.id} value={classLevel.id}>
                    {classLevel.name} ({classLevel.code})
                    {classLevel.ageRange && ` - Age ${classLevel.ageRange}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Core Subjects */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">
              Core Subjects ({coreSubjects.length} required)
            </h3>
            <p className="text-xs text-gray-600">
              These subjects are compulsory for all students in{' '}
              {config.schoolName || 'your school'}.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {coreSubjects.map((subject) => (
                <div key={subject.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`core-${subject.id}`}
                    checked={formData.coreSubjects.includes(subject.id)}
                    onCheckedChange={() => handleCoreSubjectToggle(subject.id)}
                    disabled // Core subjects are automatically selected
                    className="cursor-default"
                  />
                  <label
                    htmlFor={`core-${subject.id}`}
                    className="text-sm font-medium cursor-default"
                  >
                    {subject.name}
                  </label>
                </div>
              ))}
            </div>
            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-xs text-blue-800">
                All {coreSubjects.length} core subjects are automatically assigned to this
                student.
              </AlertDescription>
            </Alert>
          </div>

          {/* Elective Subjects */}
          {electiveGroups.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Optional Subjects (Electives)</h3>
              <p className="text-xs text-gray-600">
                Students select one subject from each elective group.
              </p>
              <div className="space-y-4">
                {electiveGroups.map((group) => (
                  <div key={group.id} className="p-4 border rounded-lg space-y-3">
                    <div>
                      <Badge variant="secondary">{group.name}</Badge>
                      {group.description && (
                        <p className="text-xs text-gray-600 mt-1">{group.description}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {group.subjects.map((subject) => (
                        <label
                          key={subject.id}
                          className="flex items-center space-x-2 p-2 rounded border cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="radio"
                            name={`elective-${group.id}`}
                            value={subject.id}
                            checked={formData.selectedElectives[group.id] === subject.id}
                            onChange={() => handleElectiveSelect(group.id, subject.id)}
                            className="h-4 w-4"
                          />
                          <span className="text-sm font-medium">{subject.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <h4 className="text-sm font-semibold">Summary</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <div>
                <strong>Student:</strong> {formData.firstName} {formData.lastName || '(incomplete)'}
              </div>
              <div>
                <strong>Class:</strong>{' '}
                {formData.classLevel
                  ? classLevels.find((cl) => cl.id === formData.classLevel)?.name
                  : '(not selected)'}
              </div>
              <div>
                <strong>Subjects:</strong> {formData.coreSubjects.length + Object.keys(formData.selectedElectives).length} total
                <br />
                {formData.coreSubjects.length > 0 && (
                  <span className="text-xs text-gray-600 ml-2">
                    • {formData.coreSubjects.length} core
                  </span>
                )}
                {Object.keys(formData.selectedElectives).length > 0 && (
                  <span className="text-xs text-gray-600 ml-2">
                    • {Object.keys(formData.selectedElectives).length} electives
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Submit */}
          <Button type="submit" disabled={saving} className="w-full">
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Student...
              </>
            ) : (
              'Create Student'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
