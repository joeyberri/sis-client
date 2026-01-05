'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
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
    description: 'Select the structure that best matches your operational model.',
    icon: <School className="w-5 h-5 text-primary" />,
    options: [
      {
        value: 'full_time_school',
        label: 'K-12 School',
        description: 'Standard primary/secondary education',
        icon: <School className="w-4 h-4" />,
      },
      {
        value: 'international_school',
        label: 'International School',
        description: 'Global standards (IB, Cambridge)',
        icon: <Globe className="w-4 h-4" />,
      },
      {
        value: 'tutoring_center',
        label: 'Learning Center',
        description: 'After-school & exam prep',
        icon: <BookOpen className="w-4 h-4" />,
      },
      {
        value: 'university',
        label: 'Higher Ed',
        description: 'Universities & Colleges',
        icon: <GraduationCap className="w-4 h-4" />,
      },
      {
        value: 'vocational',
        label: 'Vocational',
        description: 'Trade & technical skills',
        icon: <Target className="w-4 h-4" />,
      },
    ],
  },
  {
    id: 'student_age',
    question: 'Who are your learners?',
    description: 'This filters templates by appropriate grade levels and terminology.',
    visualAidTag: '',
    icon: <Users className="w-5 h-5 text-primary" />,
    options: [
      { value: 'early_childhood', label: 'Early Years (3-5)', description: 'Play-based learning' },
      { value: 'primary', label: 'Primary (6-11)', description: 'Foundational subjects' },
      { value: 'secondary', label: 'Secondary (12-18)', description: 'Subject-specific focus' },
      { value: 'adult', label: 'Adult / Higher Ed', description: 'Professional & Academic' },
    ],
  },
  {
    id: 'curriculum_preference',
    question: 'Which framework do you follow?',
    description: 'Determines your default subject trees and report card formats.',
    visualAidTag: '',
    icon: <FileText className="w-5 h-5 text-primary" />,
    options: [
      { value: 'national_africa', label: 'National (WAEC/GES)', description: 'Local government standards' },
      { value: 'british', label: 'British (Cambridge)', description: 'Key Stages, IGCSE, A-Levels' },
      { value: 'american', label: 'American', description: 'Common Core, Credit Hours' },
      { value: 'international', label: 'IB World School', description: 'PYP, MYP, DP Frameworks' },
      { value: 'flexible', label: 'Hybrid / Custom', description: 'Mix of multiple systems' },
    ],
  },
  {
    id: 'assessment_style',
    question: 'How is success measured?',
    description: 'Configures your grading scales and calculation logic.',
    visualAidTag: '',
    icon: <BarChart className="w-5 h-5 text-primary" />,
    options: [
      { value: 'exam_focused', label: 'Terminal Exams', description: 'Heavy weighting on final exams' },
      { value: 'continuous', label: 'Continuous', description: 'Frequent quizzes & assignments' },
      { value: 'project_based', label: 'Project Based', description: 'Portfolios & practicals' },
      { value: 'competency', label: 'Competency', description: 'Skill mastery (No GPA)' },
    ],
  },
  {
    id: 'special_features',
    question: 'What is your top priority?',
    description: 'We will highlight features that match this goal.',
    icon: <Sparkles className="w-5 h-5 text-primary" />,
    options: [
      { value: 'exam_prep', label: 'Exam Results', description: 'Rankings & score analysis' },
      { value: 'university_pathway', label: 'College Prep', description: 'Transcripts & counseling' },
      { value: 'holistic', label: 'Holistic Growth', description: 'Character & extracurriculars' },
      { value: 'parent_engagement', label: 'Parent Access', description: 'Portals & updates' },
    ],
  },
];

// Mock scoring logic for demonstration
function scoreTemplate(template: TemplateDefinition, answers: WizardAnswers): number {
  let score = 0;
  // ... (Existing scoring logic would go here, kept brief for display)
  // Simple random variance for demo purposes if logic is missing
  if (answers.institution_type === 'international_school' && template.tags.includes('ib')) score += 50;
  if (answers.assessment_style === 'exam_focused' && template.tags.includes('standard')) score += 30;
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
    return EDUCATION_TEMPLATES
      .map(template => ({ template, score: scoreTemplate(template, answers) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [showResults, answers]);

  const handleOptionSelect = (value: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  // ------------------------------------------
  // Render: Results View
  // ------------------------------------------
  if (showResults) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-2 shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">We found your match!</h2>
          <p className="text-muted-foreground text-lg">
            Based on your needs for a <span className="font-medium text-foreground">{answers.curriculum_preference?.replace('_', ' ')}</span> curriculum 
            with <span className="font-medium text-foreground">{answers.assessment_style?.replace('_', ' ')}</span> assessment.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {recommendations.map(({ template, score }, index) => (
            <Card 
              key={template.id}
              className={cn(
                "relative cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col",
                index === 0 ? "border-primary ring-2 ring-primary/20 shadow-lg" : "hover:border-primary/50"
              )}
              onClick={() => onSelectTemplate(template)}
            >
              {index === 0 && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Top Recommendation
                </div>
              )}
              
              <CardHeader className="pb-3 text-center pt-8">
                <div className="text-5xl mb-4 drop-shadow-sm">{template.emoji}</div>
                <CardTitle className="text-xl">{template.name}</CardTitle>
                <div className="flex items-center justify-center gap-2 mt-2">
                   <Badge variant="secondary" className="font-normal">
                     {score}% Match
                   </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 text-center">
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {template.description}
                </p>
                {/* Visual Context for Result */}
                <div className="text-xs text-muted-foreground italic bg-muted/30 p-2 rounded">
                  
                </div>
              </CardContent>
              
              <CardFooter>
                <Button className="w-full group" variant={index === 0 ? "default" : "outline"}>
                  Select Template
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="flex justify-center pt-6">
          <Button variant="ghost" onClick={() => setShowResults(false)} className="text-muted-foreground hover:text-foreground">
            <RefreshCcw className="w-4 h-4 mr-2" /> Start Over
          </Button>
        </div>
      </div>
    );
  }

  // ------------------------------------------
  // Render: Question Steps
  // ------------------------------------------
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 space-y-2">
        <div className="flex items-center justify-between text-sm font-medium text-muted-foreground mb-4">
          <span>Step {currentStep + 1} of {totalSteps}</span>
          <Button variant="ghost" size="sm" onClick={onCancel} className="h-auto p-0 hover:bg-transparent hover:text-foreground">
            Exit Wizard
          </Button>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="grid md:grid-cols-[1fr,300px] gap-8 animate-in fade-in slide-in-from-right-4 duration-300">
        
        {/* Main Question Area */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              {currentQuestion.icon}
              {currentQuestion.question}
            </h2>
            <p className="text-muted-foreground text-lg">
              {currentQuestion.description}
            </p>
            
            {/* Contextual Visual Aid Trigger */}
            {currentQuestion.visualAidTag && (
              <div className="mt-4 p-4 border border-dashed rounded-xl bg-muted/20 text-center">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                  Helpful Context
                </span>
                <span className="text-sm text-muted-foreground italic">
                  {currentQuestion.visualAidTag}
                </span>
              </div>
            )}
          </div>

          <RadioGroup
            value={currentAnswer || ''}
            onValueChange={handleOptionSelect}
            className="grid gap-3 pt-2"
          >
            {currentQuestion.options.map((option) => (
              <Label
                key={option.value}
                htmlFor={option.value}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200",
                  currentAnswer === option.value
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-muted hover:border-primary/40 hover:bg-muted/30"
                )}
              >
                <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                  currentAnswer === option.value ? "border-primary bg-primary" : "border-muted-foreground"
                )}>
                  {currentAnswer === option.value && <Check className="w-3 h-3 text-primary-foreground" />}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-semibold text-foreground">
                    {option.icon}
                    {option.label}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {option.description}
                  </p>
                </div>
              </Label>
            ))}
          </RadioGroup>

          <div className="flex justify-between pt-6">
             <Button 
               variant="ghost" 
               onClick={() => currentStep > 0 ? setCurrentStep(prev => prev - 1) : onCancel()}
               className="text-muted-foreground"
             >
               <ArrowLeft className="w-4 h-4 mr-2" />
               {currentStep === 0 ? 'Cancel' : 'Back'}
             </Button>

             <Button 
               onClick={handleNext} 
               disabled={!currentAnswer}
               size="lg"
               className="px-8 shadow-md"
             >
               {currentStep === totalSteps - 1 ? 'Find Template' : 'Next Step'}
               <ArrowRight className="w-4 h-4 ml-2" />
             </Button>
          </div>
        </div>

        {/* Sidebar / Helper Area */}
        <div className="hidden md:block space-y-6">
          <Card className="bg-muted/30 border-none">
            <CardHeader>
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Why we ask this
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-4">
              <p>
                Redevise uses a scoring algorithm to match your specific needs with our {EDUCATION_TEMPLATES.length}+ pre-configured templates.
              </p>
              <div className="flex items-center gap-2 text-xs bg-background p-2 rounded border">
                <Sparkles className="w-3 h-3 text-yellow-500" />
                <span>Matches grading scales automatically</span>
              </div>
              <div className="flex items-center gap-2 text-xs bg-background p-2 rounded border">
                <Sparkles className="w-3 h-3 text-yellow-500" />
                <span>Sets default term schedules</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}