'use client';

import { useUser } from '@/context/user/user-context';
import { useAuth } from '@clerk/nextjs';
import PageContainer from '@/components/layout/page-container';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  Plus,
  Trash2,
  GripVertical,
  Clock,
  Shield,
  Shuffle,
  Eye,
  EyeOff,
  FileText,
  ListChecks,
  Type,
  Hash,
  Upload,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Copy,
  Save,
  BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
type AssessmentType = 'quiz' | 'exam' | 'assignment' | 'test' | 'homework';
type QuestionType =
  | 'multiple_choice'
  | 'true_false'
  | 'short_answer'
  | 'essay'
  | 'fill_blank'
  | 'matching';

interface Question {
  id: string;
  type: QuestionType;
  text: string;
  points: number;
  options?: string[];
  correctAnswer?: string | string[];
  explanation?: string;
  order: number;
}

interface AssessmentSettings {
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showResults: 'immediately' | 'after_due' | 'manual' | 'never';
  allowRetakes: boolean;
  maxRetakes: number;
  timeLimit: number | null;
  preventCopyPaste: boolean;
  preventScreenshot: boolean;
  lockBrowser: boolean;
  showOneQuestion: boolean;
  allowBacktrack: boolean;
  requireCamera: boolean;
  passingScore: number;
}

const defaultSettings: AssessmentSettings = {
  shuffleQuestions: true,
  shuffleOptions: true,
  showResults: 'after_due',
  allowRetakes: false,
  maxRetakes: 1,
  timeLimit: null,
  preventCopyPaste: true,
  preventScreenshot: false,
  lockBrowser: false,
  showOneQuestion: false,
  allowBacktrack: true,
  requireCamera: false,
  passingScore: 60
};

const QUESTION_TYPES: { value: QuestionType; label: string; icon: any }[] = [
  { value: 'multiple_choice', label: 'Multiple Choice', icon: ListChecks },
  { value: 'true_false', label: 'True/False', icon: CheckCircle },
  { value: 'short_answer', label: 'Short Answer', icon: Type },
  { value: 'essay', label: 'Essay', icon: FileText },
  { value: 'fill_blank', label: 'Fill in the Blank', icon: Hash },
  { value: 'matching', label: 'Matching', icon: Copy }
];

const ASSESSMENT_TEMPLATES = [
  {
    id: 'quick-quiz',
    name: 'Quick Quiz',
    description: '10-15 minute timed quiz with multiple choice questions',
    type: 'quiz' as AssessmentType,
    settings: {
      ...defaultSettings,
      timeLimit: 15,
      shuffleQuestions: true,
      shuffleOptions: true,
      showOneQuestion: true,
      allowBacktrack: false,
      preventCopyPaste: true
    }
  },
  {
    id: 'practice-test',
    name: 'Practice Test',
    description: 'Untimed practice with immediate feedback',
    type: 'test' as AssessmentType,
    settings: {
      ...defaultSettings,
      timeLimit: null,
      showResults: 'immediately' as const,
      allowRetakes: true,
      maxRetakes: 3
    }
  },
  {
    id: 'secure-exam',
    name: 'Secure Exam',
    description: 'High-stakes exam with anti-cheating measures',
    type: 'exam' as AssessmentType,
    settings: {
      ...defaultSettings,
      timeLimit: 60,
      shuffleQuestions: true,
      shuffleOptions: true,
      preventCopyPaste: true,
      preventScreenshot: true,
      lockBrowser: true,
      showOneQuestion: true,
      allowBacktrack: false,
      requireCamera: true,
      showResults: 'manual' as const
    }
  },
  {
    id: 'homework',
    name: 'Homework Assignment',
    description: 'Take-home assignment with extended deadline',
    type: 'homework' as AssessmentType,
    settings: {
      ...defaultSettings,
      timeLimit: null,
      allowRetakes: true,
      maxRetakes: 2,
      showResults: 'after_due' as const,
      preventCopyPaste: false,
      allowBacktrack: true
    }
  }
];

export default function CreateAssessmentPage() {
  const { user, isAdmin, isTeacher } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<AssessmentType>('quiz');
  const [classId, setClassId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [instructions, setInstructions] = useState('');
  const [weight, setWeight] = useState(10);
  const [totalPoints, setTotalPoints] = useState(100);

  // Questions
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);

  // Settings
  const [settings, setSettings] = useState<AssessmentSettings>(defaultSettings);

  // Classes for dropdown
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  // Fetch classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = await getToken();
        const response = await fetch('/api/classes', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setClasses(data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch classes:', error);
      }
    };
    fetchClasses();
  }, [getToken]);

  // Apply template
  const applyTemplate = (templateId: string) => {
    const template = ASSESSMENT_TEMPLATES.find((t) => t.id === templateId);
    if (template) {
      setType(template.type);
      setSettings(template.settings);
      toast.success(`Applied "${template.name}" template`);
    }
  };

  // Add question
  const addQuestion = (questionType: QuestionType) => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      type: questionType,
      text: '',
      points: 10,
      options:
        questionType === 'multiple_choice'
          ? ['', '', '', '']
          : questionType === 'true_false'
            ? ['True', 'False']
            : undefined,
      correctAnswer: '',
      explanation: '',
      order: questions.length + 1
    };
    setCurrentQuestion(newQuestion);
    setIsQuestionDialogOpen(true);
  };

  // Save question
  const saveQuestion = () => {
    if (!currentQuestion) return;
    if (!currentQuestion.text.trim()) {
      toast.error('Question text is required');
      return;
    }
    const existingIndex = questions.findIndex(
      (q) => q.id === currentQuestion.id
    );
    if (existingIndex >= 0) {
      const updated = [...questions];
      updated[existingIndex] = currentQuestion;
      setQuestions(updated);
    } else {
      setQuestions([...questions, currentQuestion]);
    }
    setIsQuestionDialogOpen(false);
    setCurrentQuestion(null);
    toast.success('Question saved');
  };

  // Delete question
  const deleteQuestion = (questionId: string) => {
    setQuestions(questions.filter((q) => q.id !== questionId));
    toast.success('Question deleted');
  };

  // Update option
  const updateOption = (index: number, value: string) => {
    if (!currentQuestion?.options) return;
    const updated = [...currentQuestion.options];
    updated[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: updated });
  };

  // Add option
  const addOption = () => {
    if (!currentQuestion?.options) return;
    setCurrentQuestion({
      ...currentQuestion,
      options: [...currentQuestion.options, '']
    });
  };

  // Remove option
  const removeOption = (index: number) => {
    if (!currentQuestion?.options || currentQuestion.options.length <= 2)
      return;
    const updated = currentQuestion.options.filter((_, i) => i !== index);
    setCurrentQuestion({ ...currentQuestion, options: updated });
  };

  // Calculate total points
  const calculatedPoints = questions.reduce((sum, q) => sum + q.points, 0);

  // Submit assessment
  const handleSubmit = async (isDraft: boolean = false) => {
    if (!title.trim()) {
      toast.error('Assessment title is required');
      return;
    }
    if (questions.length === 0 && type !== 'assignment') {
      toast.error('Please add at least one question');
      return;
    }
    try {
      setLoading(true);
      const token = await getToken();
      const assessmentData = {
        title,
        description,
        type,
        classId: classId || undefined,
        subjectId: subjectId || undefined,
        dueDate: dueDate
          ? new Date(`${dueDate}T${dueTime || '23:59'}`).toISOString()
          : undefined,
        instructions,
        weight,
        totalPoints: calculatedPoints || totalPoints,
        questions,
        settings,
        status: isDraft ? 'draft' : 'published'
      };
      const response = await fetch('/api/assessments', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(assessmentData)
      });
      if (response.ok) {
        toast.success(
          isDraft
            ? 'Assessment saved as draft'
            : 'Assessment published successfully'
        );
        router.push('/dashboard/assessments');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to create assessment');
      }
    } catch (error) {
      console.error('Error creating assessment:', error);
      toast.error('Failed to create assessment');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin && !isTeacher) {
    return (
      <PageContainer>
        <div className='flex h-64 items-center justify-center'>
          <div className='text-center'>
            <AlertTriangle className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
            <h2 className='text-muted-foreground text-2xl font-bold'>
              Access Denied
            </h2>
            <p className='text-muted-foreground'>
              You don't have permission to create assessments.
            </p>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer scrollable>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Button variant='ghost' size='icon' onClick={() => router.back()}>
              <ArrowLeft className='h-5 w-5' />
            </Button>
            <div>
              <h1 className='text-3xl font-bold'>Create Assessment</h1>
              <p className='text-muted-foreground'>
                Build quizzes, exams, and assignments with advanced settings
              </p>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              onClick={() => handleSubmit(true)}
              disabled={loading}
            >
              <Save className='mr-2 h-4 w-4' />
              Save Draft
            </Button>
            <Button onClick={() => handleSubmit(false)} disabled={loading}>
              {loading ? 'Publishing...' : 'Publish Assessment'}
            </Button>
          </div>
        </div>

        {/* Templates */}
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-lg'>Quick Start Templates</CardTitle>
            <CardDescription>
              Choose a template to get started quickly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
              {ASSESSMENT_TEMPLATES.map((template) => (
                <Card
                  key={template.id}
                  className='hover:border-primary cursor-pointer transition-colors'
                  onClick={() => applyTemplate(template.id)}
                >
                  <CardContent className='p-4'>
                    <h4 className='font-medium'>{template.name}</h4>
                    <p className='text-muted-foreground mt-1 text-xs'>
                      {template.description}
                    </p>
                    <Badge variant='secondary' className='mt-2'>
                      {template.type}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Form */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value='details'>Details</TabsTrigger>
            <TabsTrigger value='questions'>
              Questions ({questions.length})
            </TabsTrigger>
            <TabsTrigger value='settings'>Settings</TabsTrigger>
            <TabsTrigger value='security'>Security</TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value='details' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Assessment Details</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label htmlFor='title'>Title *</Label>
                    <Input
                      id='title'
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder='e.g., Chapter 5 Quiz - Algebra'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='type'>Assessment Type</Label>
                    <Select
                      value={type}
                      onValueChange={(v) => setType(v as AssessmentType)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='quiz'>Quiz</SelectItem>
                        <SelectItem value='exam'>Exam</SelectItem>
                        <SelectItem value='test'>Test</SelectItem>
                        <SelectItem value='assignment'>Assignment</SelectItem>
                        <SelectItem value='homework'>Homework</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='description'>Description</Label>
                  <Textarea
                    id='description'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder='Brief description of the assessment'
                    rows={2}
                  />
                </div>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label htmlFor='class'>Class (optional)</Label>
                    <Select
                      value={classId || 'all'}
                      onValueChange={(val) =>
                        setClassId(val === 'all' ? '' : val)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select class' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Classes</SelectItem>
                        {classes.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='weight'>Grading Weight (%)</Label>
                    <Input
                      id='weight'
                      type='number'
                      value={weight}
                      onChange={(e) => setWeight(Number(e.target.value))}
                      min={0}
                      max={100}
                    />
                  </div>
                </div>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label htmlFor='dueDate'>Due Date</Label>
                    <Input
                      id='dueDate'
                      type='date'
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='dueTime'>Due Time</Label>
                    <Input
                      id='dueTime'
                      type='time'
                      value={dueTime}
                      onChange={(e) => setDueTime(e.target.value)}
                    />
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='instructions'>
                    Instructions for Students
                  </Label>
                  <Textarea
                    id='instructions'
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder='Enter any special instructions or guidelines...'
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Questions Tab */}
          <TabsContent value='questions' className='space-y-4'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between'>
                <div>
                  <CardTitle>Questions</CardTitle>
                  <CardDescription>
                    Total Points: {calculatedPoints} | {questions.length}{' '}
                    question(s)
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className='space-y-4'>
                {/* Add Question Buttons */}
                <div className='flex flex-wrap gap-2'>
                  {QUESTION_TYPES.map((qt) => {
                    const Icon = qt.icon;
                    return (
                      <Button
                        key={qt.value}
                        variant='outline'
                        size='sm'
                        onClick={() => addQuestion(qt.value)}
                      >
                        <Icon className='mr-2 h-4 w-4' />
                        {qt.label}
                      </Button>
                    );
                  })}
                </div>
                {/* Questions List */}
                {questions.length === 0 ? (
                  <div className='text-muted-foreground py-12 text-center'>
                    <BookOpen className='mx-auto mb-4 h-12 w-12 opacity-50' />
                    <p>No questions added yet</p>
                    <p className='text-sm'>
                      Click a button above to add your first question
                    </p>
                  </div>
                ) : (
                  <div className='space-y-3'>
                    {questions.map((question, index) => (
                      <Card key={question.id} className='relative'>
                        <CardContent className='p-4'>
                          <div className='flex items-start gap-4'>
                            <div className='text-muted-foreground flex items-center gap-2'>
                              <GripVertical className='h-5 w-5 cursor-move' />
                              <span className='font-medium'>{index + 1}</span>
                            </div>
                            <div className='min-w-0 flex-1'>
                              <div className='mb-1 flex items-center gap-2'>
                                <Badge variant='outline'>
                                  {
                                    QUESTION_TYPES.find(
                                      (t) => t.value === question.type
                                    )?.label
                                  }
                                </Badge>
                                <Badge>{question.points} pts</Badge>
                              </div>
                              <p className='truncate'>
                                {question.text || 'No question text'}
                              </p>
                            </div>
                            <div className='flex items-center gap-1'>
                              <Button
                                variant='ghost'
                                size='icon'
                                onClick={() => {
                                  setCurrentQuestion(question);
                                  setIsQuestionDialogOpen(true);
                                }}
                              >
                                <Eye className='h-4 w-4' />
                              </Button>
                              <Button
                                variant='ghost'
                                size='icon'
                                onClick={() => deleteQuestion(question.id)}
                              >
                                <Trash2 className='text-destructive h-4 w-4' />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value='settings' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Assessment Settings</CardTitle>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <div className='space-y-0.5'>
                        <Label>Shuffle Questions</Label>
                        <p className='text-muted-foreground text-sm'>
                          Randomize question order for each student
                        </p>
                      </div>
                      <Switch
                        checked={settings.shuffleQuestions}
                        onCheckedChange={(v) =>
                          setSettings({ ...settings, shuffleQuestions: v })
                        }
                      />
                    </div>
                    <div className='flex items-center justify-between'>
                      <div className='space-y-0.5'>
                        <Label>Shuffle Answer Options</Label>
                        <p className='text-muted-foreground text-sm'>
                          Randomize answer options in multiple choice
                        </p>
                      </div>
                      <Switch
                        checked={settings.shuffleOptions}
                        onCheckedChange={(v) =>
                          setSettings({ ...settings, shuffleOptions: v })
                        }
                      />
                    </div>
                    <div className='flex items-center justify-between'>
                      <div className='space-y-0.5'>
                        <Label>Show One Question at a Time</Label>
                        <p className='text-muted-foreground text-sm'>
                          Display questions one by one
                        </p>
                      </div>
                      <Switch
                        checked={settings.showOneQuestion}
                        onCheckedChange={(v) =>
                          setSettings({ ...settings, showOneQuestion: v })
                        }
                      />
                    </div>
                    <div className='flex items-center justify-between'>
                      <div className='space-y-0.5'>
                        <Label>Allow Going Back</Label>
                        <p className='text-muted-foreground text-sm'>
                          Let students revisit previous questions
                        </p>
                      </div>
                      <Switch
                        checked={settings.allowBacktrack}
                        onCheckedChange={(v) =>
                          setSettings({ ...settings, allowBacktrack: v })
                        }
                      />
                    </div>
                  </div>
                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <Label>Time Limit (minutes)</Label>
                      <Input
                        type='number'
                        value={settings.timeLimit || ''}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            timeLimit: e.target.value
                              ? Number(e.target.value)
                              : null
                          })
                        }
                        placeholder='No time limit'
                        min={1}
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label>Passing Score (%)</Label>
                      <Input
                        type='number'
                        value={settings.passingScore}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            passingScore: Number(e.target.value)
                          })
                        }
                        min={0}
                        max={100}
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label>Show Results</Label>
                      <Select
                        value={settings.showResults}
                        onValueChange={(v) =>
                          setSettings({ ...settings, showResults: v as any })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='immediately'>
                            Immediately after submission
                          </SelectItem>
                          <SelectItem value='after_due'>
                            After due date
                          </SelectItem>
                          <SelectItem value='manual'>Manual release</SelectItem>
                          <SelectItem value='never'>Never show</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='flex items-center justify-between'>
                      <div className='space-y-0.5'>
                        <Label>Allow Retakes</Label>
                        <p className='text-muted-foreground text-sm'>
                          Let students retry the assessment
                        </p>
                      </div>
                      <Switch
                        checked={settings.allowRetakes}
                        onCheckedChange={(v) =>
                          setSettings({ ...settings, allowRetakes: v })
                        }
                      />
                    </div>
                    {settings.allowRetakes && (
                      <div className='space-y-2'>
                        <Label>Maximum Retakes</Label>
                        <Input
                          type='number'
                          value={settings.maxRetakes}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              maxRetakes: Number(e.target.value)
                            })
                          }
                          min={1}
                          max={10}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value='security' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Shield className='h-5 w-5' />
                  Security & Anti-Cheating
                </CardTitle>
                <CardDescription>
                  Enable security features to maintain assessment integrity
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <div className='space-y-0.5'>
                        <Label>Prevent Copy/Paste</Label>
                        <p className='text-muted-foreground text-sm'>
                          Disable copying text during assessment
                        </p>
                      </div>
                      <Switch
                        checked={settings.preventCopyPaste}
                        onCheckedChange={(v) =>
                          setSettings({ ...settings, preventCopyPaste: v })
                        }
                      />
                    </div>
                    <div className='flex items-center justify-between'>
                      <div className='space-y-0.5'>
                        <Label>Prevent Screenshots</Label>
                        <p className='text-muted-foreground text-sm'>
                          Block screenshot attempts (limited support)
                        </p>
                      </div>
                      <Switch
                        checked={settings.preventScreenshot}
                        onCheckedChange={(v) =>
                          setSettings({ ...settings, preventScreenshot: v })
                        }
                      />
                    </div>
                    <div className='flex items-center justify-between'>
                      <div className='space-y-0.5'>
                        <Label>Lock Browser Mode</Label>
                        <p className='text-muted-foreground text-sm'>
                          Require full-screen mode during assessment
                        </p>
                      </div>
                      <Switch
                        checked={settings.lockBrowser}
                        onCheckedChange={(v) =>
                          setSettings({ ...settings, lockBrowser: v })
                        }
                      />
                    </div>
                  </div>
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <div className='space-y-0.5'>
                        <Label>Require Camera</Label>
                        <p className='text-muted-foreground text-sm'>
                          Record student during assessment
                        </p>
                      </div>
                      <Switch
                        checked={settings.requireCamera}
                        onCheckedChange={(v) =>
                          setSettings({ ...settings, requireCamera: v })
                        }
                      />
                    </div>
                  </div>
                </div>
                {(settings.preventScreenshot ||
                  settings.lockBrowser ||
                  settings.requireCamera) && (
                  <div className='rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/20'>
                    <div className='flex items-start gap-3'>
                      <AlertTriangle className='mt-0.5 h-5 w-5 text-amber-600' />
                      <div>
                        <h4 className='font-medium text-amber-800 dark:text-amber-200'>
                          High Security Mode
                        </h4>
                        <p className='mt-1 text-sm text-amber-700 dark:text-amber-300'>
                          These security features may require browser
                          permissions and could affect accessibility. Ensure
                          students are informed before the assessment.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Question Dialog */}
      <Dialog
        open={isQuestionDialogOpen}
        onOpenChange={setIsQuestionDialogOpen}
      >
        <DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>
              {currentQuestion?.text ? 'Edit Question' : 'Add Question'}
            </DialogTitle>
            <DialogDescription>
              {currentQuestion &&
                QUESTION_TYPES.find((t) => t.value === currentQuestion.type)
                  ?.label}
            </DialogDescription>
          </DialogHeader>
          {currentQuestion && (
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label>Question Text *</Label>
                <Textarea
                  value={currentQuestion.text}
                  onChange={(e) =>
                    setCurrentQuestion({
                      ...currentQuestion,
                      text: e.target.value
                    })
                  }
                  placeholder='Enter your question...'
                  rows={3}
                />
              </div>
              <div className='space-y-2'>
                <Label>Points</Label>
                <Input
                  type='number'
                  value={currentQuestion.points}
                  onChange={(e) =>
                    setCurrentQuestion({
                      ...currentQuestion,
                      points: Number(e.target.value)
                    })
                  }
                  min={1}
                />
              </div>
              {/* Multiple Choice / True False Options */}
              {(currentQuestion.type === 'multiple_choice' ||
                currentQuestion.type === 'true_false') &&
                currentQuestion.options && (
                  <div className='space-y-3'>
                    <Label>Answer Options</Label>
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className='flex items-center gap-2'>
                        <input
                          type='radio'
                          name='correctAnswer'
                          checked={currentQuestion.correctAnswer === option}
                          onChange={() =>
                            setCurrentQuestion({
                              ...currentQuestion,
                              correctAnswer: option
                            })
                          }
                          className='h-4 w-4'
                        />
                        <Input
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                          disabled={currentQuestion.type === 'true_false'}
                        />
                        {currentQuestion.type === 'multiple_choice' &&
                          currentQuestion.options!.length > 2 && (
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() => removeOption(index)}
                            >
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          )}
                      </div>
                    ))}
                    {currentQuestion.type === 'multiple_choice' && (
                      <Button variant='outline' size='sm' onClick={addOption}>
                        <Plus className='mr-2 h-4 w-4' />
                        Add Option
                      </Button>
                    )}
                    <p className='text-muted-foreground text-xs'>
                      Select the correct answer by clicking the radio button
                    </p>
                  </div>
                )}
              {/* Short Answer / Fill Blank */}
              {(currentQuestion.type === 'short_answer' ||
                currentQuestion.type === 'fill_blank') && (
                <div className='space-y-2'>
                  <Label>Correct Answer(s)</Label>
                  <Input
                    value={
                      Array.isArray(currentQuestion.correctAnswer)
                        ? currentQuestion.correctAnswer.join(', ')
                        : currentQuestion.correctAnswer
                    }
                    onChange={(e) =>
                      setCurrentQuestion({
                        ...currentQuestion,
                        correctAnswer: e.target.value
                      })
                    }
                    placeholder='Enter accepted answers (comma-separated)'
                  />
                  <p className='text-muted-foreground text-xs'>
                    Separate multiple acceptable answers with commas
                  </p>
                </div>
              )}
              <div className='space-y-2'>
                <Label>Explanation (optional)</Label>
                <Textarea
                  value={currentQuestion.explanation || ''}
                  onChange={(e) =>
                    setCurrentQuestion({
                      ...currentQuestion,
                      explanation: e.target.value
                    })
                  }
                  placeholder='Explain the correct answer (shown after submission)'
                  rows={2}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setIsQuestionDialogOpen(false);
                setCurrentQuestion(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={saveQuestion}>Save Question</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
