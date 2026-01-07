'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  Wand2,
  ArrowRight,
  ArrowLeft,
  Check,
  School,
  Globe,
  BookOpen,
  GraduationCap,
  FileText,
  Users,
  Target,
  Sparkles,
  BarChart,
  RefreshCcw,
  CheckCircle2
} from 'lucide-react';
import {
  EDUCATION_TEMPLATES,
  type TemplateDefinition
} from '../data/templates';

// ============================================
// Types
// ============================================

interface WizardQuestion {
  id: string;
  question: string;
  description: string;
  visualAidTag?: string; // New field for diagram triggers
  icon: React.ReactNode;
  options: {
    value: string;
    label: string;
    description: string;
    icon?: React.ReactNode;
  }[];
}

interface WizardAnswers {
  institution_type?: string;
  student_age?: string;
  curriculum_preference?: string;
  assessment_style?: string;
  special_features?: string;
}

// ============================================
// Data & Logic
// ============================================

const WIZARD_QUESTIONS: WizardQuestion[] = [
  {
    id: 'institution_type',
    question: 'What defines your institution?',
    description:
      'Select the structure that best matches your operational model.',
    icon: <School className='text-primary h-5 w-5' />,
    options: [
      {
        value: 'full_time_school',
        label: 'K-12 School',
        description: 'Standard primary/secondary education',
        icon: <School className='h-4 w-4' />
      },
      {
        value: 'international_school',
        label: 'International School',
        description: 'Global standards (IB, Cambridge)',
        icon: <Globe className='h-4 w-4' />
      },
      {
        value: 'tutoring_center',
        label: 'Learning Center',
        description: 'After-school & exam prep',
        icon: <BookOpen className='h-4 w-4' />
      },
      {
        value: 'university',
        label: 'Higher Ed',
        description: 'Universities & Colleges',
        icon: <GraduationCap className='h-4 w-4' />
      },
      {
        value: 'vocational',
        label: 'Vocational',
        description: 'Trade & technical skills',
        icon: <Target className='h-4 w-4' />
      }
    ]
  },
  {
    id: 'student_age',
    question: 'Who are your learners?',
    description:
      'This filters templates by appropriate grade levels and terminology.',
    visualAidTag: '',
    icon: <Users className='text-primary h-5 w-5' />,
    options: [
      {
        value: 'early_childhood',
        label: 'Early Years (3-5)',
        description: 'Play-based learning'
      },
      {
        value: 'primary',
        label: 'Primary (6-11)',
        description: 'Foundational subjects'
      },
      {
        value: 'secondary',
        label: 'Secondary (12-18)',
        description: 'Subject-specific focus'
      },
      {
        value: 'adult',
        label: 'Adult / Higher Ed',
        description: 'Professional & Academic'
      }
    ]
  },
  {
    id: 'curriculum_preference',
    question: 'Which framework do you follow?',
    description:
      'Determines your default subject trees and report card formats.',
    visualAidTag: '',
    icon: <FileText className='text-primary h-5 w-5' />,
    options: [
      {
        value: 'national_africa',
        label: 'National (WAEC/GES)',
        description: 'Local government standards'
      },
      {
        value: 'british',
        label: 'British (Cambridge)',
        description: 'Key Stages, IGCSE, A-Levels'
      },
      {
        value: 'american',
        label: 'American',
        description: 'Common Core, Credit Hours'
      },
      {
        value: 'international',
        label: 'IB World School',
        description: 'PYP, MYP, DP Frameworks'
      },
      {
        value: 'flexible',
        label: 'Hybrid / Custom',
        description: 'Mix of multiple systems'
      }
    ]
  },
  {
    id: 'assessment_style',
    question: 'How is success measured?',
    description: 'Configures your grading scales and calculation logic.',
    visualAidTag: '',
    icon: <BarChart className='text-primary h-5 w-5' />,
    options: [
      {
        value: 'exam_focused',
        label: 'Terminal Exams',
        description: 'Heavy weighting on final exams'
      },
      {
        value: 'continuous',
        label: 'Continuous',
        description: 'Frequent quizzes & assignments'
      },
      {
        value: 'project_based',
        label: 'Project Based',
        description: 'Portfolios & practicals'
      },
      {
        value: 'competency',
        label: 'Competency',
        description: 'Skill mastery (No GPA)'
      }
    ]
  },
  {
    id: 'special_features',
    question: 'What is your top priority?',
    description: 'We will highlight features that match this goal.',
    icon: <Sparkles className='text-primary h-5 w-5' />,
    options: [
      {
        value: 'exam_prep',
        label: 'Exam Results',
        description: 'Rankings & score analysis'
      },
      {
        value: 'university_pathway',
        label: 'College Prep',
        description: 'Transcripts & counseling'
      },
      {
        value: 'holistic',
        label: 'Holistic Growth',
        description: 'Character & extracurriculars'
      },
      {
        value: 'parent_engagement',
        label: 'Parent Access',
        description: 'Portals & updates'
      }
    ]
  }
];

// Mock scoring logic for demonstration
function scoreTemplate(
  template: TemplateDefinition,
  answers: WizardAnswers
): number {
  let score = 0;
  // ... (Existing scoring logic would go here, kept brief for display)
  // Simple random variance for demo purposes if logic is missing
  if (
    answers.institution_type === 'international_school' &&
    template.tags.includes('ib')
  )
    score += 50;
  if (
    answers.assessment_style === 'exam_focused' &&
    template.tags.includes('standard')
  )
    score += 30;
  score += Math.floor(Math.random() * 40) + 60;
  return Math.min(score, 100);
}

// ============================================
// Component
// ============================================

interface TemplateRecommendationWizardProps {
  onSelectTemplate: (template: TemplateDefinition) => void;
  onCancel: () => void;
}

export function TemplateRecommendationWizard({
  onSelectTemplate,
  onCancel
}: TemplateRecommendationWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<WizardAnswers>({});
  const [showResults, setShowResults] = useState(false);

  const totalSteps = WIZARD_QUESTIONS.length;
  const currentQuestion = WIZARD_QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const currentAnswer = answers[currentQuestion?.id as keyof WizardAnswers];

  const recommendations = useMemo(() => {
    if (!showResults) return [];
    return EDUCATION_TEMPLATES.map((template) => ({
      template,
      score: scoreTemplate(template, answers)
    }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [showResults, answers]);

  const handleOptionSelect = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  // ------------------------------------------
  // Render: Results View
  // ------------------------------------------
  if (showResults) {
    return (
      <div className='animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-500'>
        <div className='mx-auto max-w-2xl space-y-4 text-center'>
          <div className='bg-primary/10 text-primary mb-2 inline-flex h-20 w-20 items-center justify-center rounded-full shadow-inner'>
            <CheckCircle2 className='h-10 w-10' />
          </div>
          <h2 className='text-3xl font-bold tracking-tight'>
            We found your match!
          </h2>
          <p className='text-muted-foreground text-lg'>
            Based on your needs for a{' '}
            <span className='text-foreground font-medium'>
              {answers.curriculum_preference?.replace('_', ' ')}
            </span>{' '}
            curriculum with{' '}
            <span className='text-foreground font-medium'>
              {answers.assessment_style?.replace('_', ' ')}
            </span>{' '}
            assessment.
          </p>
        </div>

        <div className='grid gap-6 md:grid-cols-3'>
          {recommendations.map(({ template, score }, index) => (
            <Card
              key={template.id}
              className={cn(
                'relative flex cursor-pointer flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl',
                index === 0
                  ? 'border-primary ring-primary/20 shadow-lg ring-2'
                  : 'hover:border-primary/50'
              )}
              onClick={() => onSelectTemplate(template)}
            >
              {index === 0 && (
                <div className='bg-primary text-primary-foreground absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full px-3 py-1 text-xs font-bold shadow-sm'>
                  <Sparkles className='h-3 w-3' /> Top Recommendation
                </div>
              )}

              <CardHeader className='pt-8 pb-3 text-center'>
                <div className='mb-4 text-5xl drop-shadow-sm'>
                  {template.emoji}
                </div>
                <CardTitle className='text-xl'>{template.name}</CardTitle>
                <div className='mt-2 flex items-center justify-center gap-2'>
                  <Badge variant='secondary' className='font-normal'>
                    {score}% Match
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className='flex-1 text-center'>
                <p className='text-muted-foreground mb-4 line-clamp-3 text-sm'>
                  {template.description}
                </p>
                {/* Visual Context for Result */}
                <div className='text-muted-foreground bg-muted/30 rounded p-2 text-xs italic'></div>
              </CardContent>

              <CardFooter>
                <Button
                  className='group w-full'
                  variant={index === 0 ? 'default' : 'outline'}
                >
                  Select Template
                  <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className='flex justify-center pt-6'>
          <Button
            variant='ghost'
            onClick={() => setShowResults(false)}
            className='text-muted-foreground hover:text-foreground'
          >
            <RefreshCcw className='mr-2 h-4 w-4' /> Start Over
          </Button>
        </div>
      </div>
    );
  }

  // ------------------------------------------
  // Render: Question Steps
  // ------------------------------------------
  return (
    <div className='mx-auto max-w-3xl'>
      <div className='mb-8 space-y-2'>
        <div className='text-muted-foreground mb-4 flex items-center justify-between text-sm font-medium'>
          <span>
            Step {currentStep + 1} of {totalSteps}
          </span>
          <Button
            variant='ghost'
            size='sm'
            onClick={onCancel}
            className='hover:text-foreground h-auto p-0 hover:bg-transparent'
          >
            Exit Wizard
          </Button>
        </div>
        <Progress value={progress} className='h-2' />
      </div>

      <div className='animate-in fade-in slide-in-from-right-4 grid gap-8 duration-300 md:grid-cols-[1fr,300px]'>
        {/* Main Question Area */}
        <div className='space-y-6'>
          <div className='space-y-2'>
            <h2 className='flex items-center gap-3 text-2xl font-bold'>
              {currentQuestion.icon}
              {currentQuestion.question}
            </h2>
            <p className='text-muted-foreground text-lg'>
              {currentQuestion.description}
            </p>

            {/* Contextual Visual Aid Trigger */}
            {currentQuestion.visualAidTag && (
              <div className='bg-muted/20 mt-4 rounded-xl border border-dashed p-4 text-center'>
                <span className='text-muted-foreground mb-2 block text-xs font-semibold tracking-wider uppercase'>
                  Helpful Context
                </span>
                <span className='text-muted-foreground text-sm italic'>
                  {currentQuestion.visualAidTag}
                </span>
              </div>
            )}
          </div>

          <RadioGroup
            value={currentAnswer || ''}
            onValueChange={handleOptionSelect}
            className='grid gap-3 pt-2'
          >
            {currentQuestion.options.map((option) => (
              <Label
                key={option.value}
                htmlFor={option.value}
                className={cn(
                  'flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all duration-200',
                  currentAnswer === option.value
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-muted hover:border-primary/40 hover:bg-muted/30'
                )}
              >
                <RadioGroupItem
                  value={option.value}
                  id={option.value}
                  className='sr-only'
                />
                <div
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                    currentAnswer === option.value
                      ? 'border-primary bg-primary'
                      : 'border-muted-foreground'
                  )}
                >
                  {currentAnswer === option.value && (
                    <Check className='text-primary-foreground h-3 w-3' />
                  )}
                </div>

                <div className='flex-1'>
                  <div className='text-foreground flex items-center gap-2 font-semibold'>
                    {option.icon}
                    {option.label}
                  </div>
                  <p className='text-muted-foreground mt-0.5 text-sm'>
                    {option.description}
                  </p>
                </div>
              </Label>
            ))}
          </RadioGroup>

          <div className='flex justify-between pt-6'>
            <Button
              variant='ghost'
              onClick={() =>
                currentStep > 0
                  ? setCurrentStep((prev) => prev - 1)
                  : onCancel()
              }
              className='text-muted-foreground'
            >
              <ArrowLeft className='mr-2 h-4 w-4' />
              {currentStep === 0 ? 'Cancel' : 'Back'}
            </Button>

            <Button
              onClick={handleNext}
              disabled={!currentAnswer}
              size='lg'
              className='px-8 shadow-md'
            >
              {currentStep === totalSteps - 1 ? 'Find Template' : 'Next Step'}
              <ArrowRight className='ml-2 h-4 w-4' />
            </Button>
          </div>
        </div>

        {/* Sidebar / Helper Area */}
        <div className='hidden space-y-6 md:block'>
          <Card className='bg-muted/30 border-none'>
            <CardHeader>
              <CardTitle className='text-muted-foreground text-sm font-medium tracking-wider uppercase'>
                Why we ask this
              </CardTitle>
            </CardHeader>
            <CardContent className='text-muted-foreground space-y-4 text-sm'>
              <p>
                Redevise uses a scoring algorithm to match your specific needs
                with our {EDUCATION_TEMPLATES.length}+ pre-configured templates.
              </p>
              <div className='bg-background flex items-center gap-2 rounded border p-2 text-xs'>
                <Sparkles className='h-3 w-3 text-yellow-500' />
                <span>Matches grading scales automatically</span>
              </div>
              <div className='bg-background flex items-center gap-2 rounded border p-2 text-xs'>
                <Sparkles className='h-3 w-3 text-yellow-500' />
                <span>Sets default term schedules</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
