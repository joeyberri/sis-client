import { useState } from 'react';
import { useSchoolConfig, getGradeFromScore, calculateWeightedGrade } from '@/hooks/useSchoolConfig';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';

interface StudentGrade {
  studentId: string;
  studentName: string;
  subjectId: string;
  subjectName: string;
  caScore: number;
  examScore: number;
}

export function ConfigDrivenGradingForm({ tenantId }: { tenantId: string }) {
  const { config, loading: configLoading, error: configError } = useSchoolConfig(tenantId);
  const [grades, setGrades] = useState<StudentGrade[]>([
    {
      studentId: '',
      studentName: '',
      subjectId: '',
      subjectName: '',
      caScore: 0,
      examScore: 0,
    },
  ]);
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

  const subjects = config.subjectFramework.coreSubjects;
  const gradeScales = config.gradingSystem.gradeScales;
  const assessmentFramework = config.assessmentFramework;

  function calculateGrade(caScore: number, examScore: number) {
    const weighted = calculateWeightedGrade(
      caScore,
      examScore,
      assessmentFramework
    );
    return getGradeFromScore(weighted, gradeScales);
  }

  function handleGradeChange(index: number, field: keyof StudentGrade, value: any) {
    const newGrades = [...grades];
    if (field === 'caScore' || field === 'examScore') {
      newGrades[index] = {
        ...newGrades[index],
        [field]: parseFloat(value) || 0,
      };
    } else {
      newGrades[index] = {
        ...newGrades[index],
        [field]: value,
      };
    }
    setGrades(newGrades);
  }

  function addGradeRow() {
    setGrades([
      ...grades,
      {
        studentId: '',
        studentName: '',
        subjectId: '',
        subjectName: '',
        caScore: 0,
        examScore: 0,
      },
    ]);
  }

  async function handleSave() {
    try {
      setSaving(true);
      // TODO: Save grades to API
      alert('Grades saved successfully!');
    } catch (error) {
      alert('Failed to save grades');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Grades</CardTitle>
        <CardDescription>
          Configure your grades using {config.gradingSystem.name} grading system
          ({assessmentFramework.caPercentage}% CA, {assessmentFramework.examPercentage}% Exam)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Assessment Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
          <h4 className="font-semibold text-sm">Assessment Structure</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-600">Continuous Assessment (CA)</div>
              <div className="font-semibold text-sm">{assessmentFramework.caPercentage}%</div>
              <div className="text-xs text-gray-500 mt-1">
                {assessmentFramework.assessmentTypes
                  .filter((t) => t.isCA)
                  .map((t) => t.name)
                  .join(', ')}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600">Exam</div>
              <div className="font-semibold text-sm">{assessmentFramework.examPercentage}%</div>
              <div className="text-xs text-gray-500 mt-1">
                {assessmentFramework.assessmentTypes
                  .filter((t) => !t.isCA)
                  .map((t) => t.name)
                  .join(', ')}
              </div>
            </div>
          </div>
        </div>

        {/* Grading Scale Reference */}
        <div>
          <h4 className="font-semibold text-sm mb-3">Grading Scale</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {gradeScales.map((grade) => (
              <div
                key={grade.id}
                className="p-2 rounded border text-center"
                style={{ backgroundColor: grade.color + '20', borderColor: grade.color || '#ccc' }}
              >
                <div className="font-bold text-sm" style={{ color: grade.color }}>
                  {grade.label}
                </div>
                <div className="text-xs text-gray-600">
                  {grade.minScore.toFixed(0)}-{grade.maxScore.toFixed(0)}%
                </div>
                <div className="text-xs text-gray-500">GPA {grade.gpaValue}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Grades Input Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-2 px-2">Student</th>
                <th className="text-left py-2 px-2">Subject</th>
                <th className="text-center py-2 px-2">CA Score ({assessmentFramework.caPercentage}%)</th>
                <th className="text-center py-2 px-2">Exam ({assessmentFramework.examPercentage}%)</th>
                <th className="text-center py-2 px-2">Total</th>
                <th className="text-center py-2 px-2">Grade</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((grade, index) => {
                const calculated = calculateGrade(grade.caScore, grade.examScore);
                const total = calculateWeightedGrade(
                  grade.caScore,
                  grade.examScore,
                  assessmentFramework
                );
                return (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2">
                      <Input
                        placeholder="Student name"
                        value={grade.studentName}
                        onChange={(e) =>
                          handleGradeChange(index, 'studentName', e.target.value)
                        }
                        className="h-8"
                      />
                    </td>
                    <td className="py-3 px-2">
                      <select
                        value={grade.subjectId}
                        onChange={(e) => {
                          const subject = subjects.find((s) => s.id === e.target.value);
                          handleGradeChange(index, 'subjectId', e.target.value);
                          if (subject) {
                            handleGradeChange(index, 'subjectName', subject.name);
                          }
                        }}
                        className="h-8 px-2 border rounded w-full text-sm"
                      >
                        <option value="">Select subject</option>
                        {subjects.map((subject) => (
                          <option key={subject.id} value={subject.id}>
                            {subject.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-2">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={grade.caScore || ''}
                        onChange={(e) => handleGradeChange(index, 'caScore', e.target.value)}
                        className="h-8 text-center"
                        placeholder="0"
                      />
                    </td>
                    <td className="py-3 px-2">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={grade.examScore || ''}
                        onChange={(e) => handleGradeChange(index, 'examScore', e.target.value)}
                        className="h-8 text-center"
                        placeholder="0"
                      />
                    </td>
                    <td className="py-3 px-2 text-center font-semibold">
                      {total.toFixed(1)}%
                    </td>
                    <td className="py-3 px-2 text-center">
                      {calculated ? (
                        <Badge
                          style={{
                            background: (calculated.color || '#ccc') + '40',
                            color: calculated.color,
                            borderColor: calculated.color,
                          }}
                          variant="outline"
                          className="text-sm font-bold"
                        >
                          {calculated.label}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={addGradeRow} disabled={saving}>
            Add Row
          </Button>
          <Button onClick={handleSave} disabled={saving} className="flex-1">
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Grades'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
