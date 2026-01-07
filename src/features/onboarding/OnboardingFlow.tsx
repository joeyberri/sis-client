'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils'; // Assuming standard shadcn utils exist
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  Upload,
  School,
  Sparkles,
  GraduationCap,
  BookOpen,
  Building,
  Rocket,
  Image as ImageIcon,
  X
} from 'lucide-react';
import { EnhancedTemplateSelector } from './components/EnhancedTemplateSelector';
import type { TemplateDefinition } from './data/templates';
import apiClient from '@/lib/api/client';

// ============================================
// Types & Constants
// ============================================

const STEPS = [
  { id: 0, title: 'Welcome', subtitle: 'Get Started', icon: Sparkles },
  { id: 1, title: 'Template', subtitle: 'Education System', icon: BookOpen },
  { id: 2, title: 'Identity', subtitle: 'Brand Your School', icon: Building },
  { id: 3, title: 'Launch', subtitle: "You're Ready!", icon: Rocket }
];

interface OnboardingData {
  schoolName: string;
  schoolLogo: File | null;
  logoPreviewUrl: string | null;
  template: TemplateDefinition | null;
}

// ============================================
// Helper: Step Indicator
// ============================================

function StepIndicator({ currentStep }: { currentStep: number }) {
  const progress = (currentStep / (STEPS.length - 1)) * 100;

  return (
    <div className='space-y-4' aria-label='Progress'>
      <Progress
        value={progress}
        className='h-2 transition-all duration-500 ease-in-out'
      />

      <div className='relative flex justify-between'>
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div
              key={step.id}
              className={cn(
                'z-10 flex flex-col items-center text-center',
                index === 0
                  ? 'items-start'
                  : index === STEPS.length - 1
                    ? 'items-end'
                    : ''
              )}
            >
              <div
                className={cn(
                  'mb-2 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300',
                  isCompleted
                    ? 'bg-primary border-primary text-white'
                    : isCurrent
                      ? 'bg-background border-primary text-primary shadow-[0_0_0_4px_rgba(var(--primary),0.1)]'
                      : 'bg-muted border-muted-foreground/20 text-muted-foreground'
                )}
              >
                {isCompleted ? (
                  <Check className='h-5 w-5' />
                ) : (
                  <Icon className='h-5 w-5' />
                )}
              </div>
              <div className='hidden sm:block'>
                <p
                  className={cn(
                    'text-sm font-medium transition-colors',
                    isCurrent ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {step.title}
                </p>
                <p className='text-muted-foreground text-xs'>{step.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// Step 1: Welcome
// ============================================

function WelcomeStep({ onContinue }: { onContinue: () => void }) {
  return (
    <div className='animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-2xl space-y-8 py-8 text-center duration-700'>
      <div className='group relative mx-auto h-24 w-24 cursor-default'>
        <div className='bg-primary/20 absolute inset-0 rotate-6 rounded-3xl transition-transform group-hover:rotate-12'></div>
        <div className='bg-primary relative flex h-full w-full items-center justify-center rounded-3xl text-white shadow-xl'>
          <GraduationCap className='h-12 w-12' />
        </div>
      </div>

      <div className='space-y-4'>
        <h1 className='text-foreground text-4xl font-bold tracking-tight'>
          Welcome to Redevise SIS
        </h1>
        <p className='text-muted-foreground mx-auto max-w-lg text-xl leading-relaxed'>
          Let's configure your school's digital infrastructure. It only takes a
          few moments to get started.
        </p>
      </div>

      <div className='grid grid-cols-1 gap-4 pt-4 sm:grid-cols-3'>
        {[
          {
            icon: School,
            title: 'Smart Templates',
            desc: 'Pre-configured workflows'
          },
          {
            icon: BookOpen,
            title: 'Complete Setup',
            desc: 'Grades & calendars ready'
          },
          {
            icon: Sparkles,
            title: 'Fully Custom',
            desc: 'Adaptable to your needs'
          }
        ].map((feature, i) => (
          <Card
            key={i}
            className='bg-muted/50 hover:bg-muted/80 border-none transition-colors'
          >
            <CardContent className='p-4 text-center'>
              <feature.icon className='text-primary mx-auto mb-2 h-8 w-8 opacity-80' />
              <h3 className='text-sm font-semibold'>{feature.title}</h3>
              <p className='text-muted-foreground mt-1 text-xs'>
                {feature.desc}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        size='lg'
        onClick={onContinue}
        className='hover:shadow-primary/25 h-12 px-10 text-lg shadow-lg transition-all'
      >
        Get Started <ArrowRight className='ml-2 h-5 w-5' />
      </Button>
    </div>
  );
}

// ============================================
// Step 3: School Details (Identity)
// ============================================

interface SchoolDetailsStepProps {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  loading: boolean;
  onBack: () => void;
  onComplete: () => void;
}

function SchoolDetailsStep({
  data,
  updateData,
  loading,
  onBack,
  onComplete
}: SchoolDetailsStepProps) {
  const [dragActive, setDragActive] = useState(false);
  const [validationError, setValidationError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Validate before proceeding
  const handleNext = () => {
    if (!data.schoolName.trim()) {
      setValidationError('School name is required');
      return;
    }
    onComplete();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    // Basic validation
    if (file.size > 2 * 1024 * 1024) {
      alert('File is too large. Max 2MB.');
      return;
    }

    // Create preview URL
    const url = URL.createObjectURL(file);
    updateData({ schoolLogo: file, logoPreviewUrl: url });
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className='animate-in fade-in slide-in-from-bottom-4 mx-auto max-w-xl space-y-8 duration-500'>
      <div className='space-y-2 text-center'>
        <h2 className='text-3xl font-bold tracking-tight'>
          Your School Identity
        </h2>
        <p className='text-muted-foreground'>
          Define how your school appears on reports and portals.
        </p>
      </div>

      {data.template && (
        <Alert className='bg-primary/5 border-primary/20'>
          <AlertDescription className='flex items-center gap-3'>
            <span className='text-2xl' role='img' aria-label='Template icon'>
              {data.template.emoji}
            </span>
            <div>
              <span className='text-foreground font-semibold'>
                Selected Template:
              </span>
              <span className='text-muted-foreground ml-2'>
                {data.template.name}
              </span>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='schoolName'>
            School Name <span className='text-destructive'>*</span>
          </Label>
          <Input
            id='schoolName'
            placeholder='e.g. Lincoln High School'
            value={data.schoolName}
            onChange={(e) => {
              updateData({ schoolName: e.target.value });
              if (validationError) setValidationError('');
            }}
            className={cn(
              'h-12 text-lg',
              validationError &&
                'border-destructive focus-visible:ring-destructive'
            )}
          />
          {validationError && (
            <p className='text-destructive flex items-center text-sm font-medium'>
              <AlertCircle className='mr-1 h-4 w-4' /> {validationError}
            </p>
          )}
        </div>

        <div className='space-y-2'>
          <Label>School Logo (Optional)</Label>
          <div
            className={cn(
              'group relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all',
              dragActive
                ? 'border-primary bg-primary/5 scale-[1.01]'
                : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/20',
              data.logoPreviewUrl ? 'border-muted/50 border-solid' : ''
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) =>
              (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()
            }
            role='button'
            tabIndex={0}
            aria-label='Upload school logo'
          >
            <input
              ref={inputRef}
              type='file'
              className='hidden'
              accept='image/png, image/jpeg, image/jpg'
              onChange={handleFileChange}
            />

            {data.logoPreviewUrl ? (
              <div className='group/image relative'>
                <div className='mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-lg border bg-white'>
                  <img
                    src={data.logoPreviewUrl}
                    alt='Preview'
                    className='h-full w-full object-contain'
                  />
                </div>
                <div className='absolute top-0 right-0 p-2 opacity-0 transition-opacity group-hover/image:opacity-100'>
                  <Button
                    size='icon'
                    variant='destructive'
                    className='h-8 w-8 rounded-full'
                    onClick={(e) => {
                      e.stopPropagation();
                      updateData({ schoolLogo: null, logoPreviewUrl: null });
                    }}
                  >
                    <X className='h-4 w-4' />
                  </Button>
                </div>
                <p className='text-muted-foreground group-hover:text-primary mt-4 text-sm transition-colors'>
                  Click or drag to replace
                </p>
              </div>
            ) : (
              <div className='space-y-3'>
                <div className='bg-muted group-hover:bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full transition-colors'>
                  <Upload className='text-muted-foreground group-hover:text-primary h-8 w-8 transition-colors' />
                </div>
                <div>
                  <p className='text-foreground text-sm font-medium'>
                    Click to upload or drag and drop
                  </p>
                  <p className='text-muted-foreground mt-1 text-xs'>
                    SVG, PNG, JPG (max 2MB)
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-3 pt-6'>
        <Button
          size='lg'
          onClick={handleNext}
          disabled={loading}
          className='h-12 w-full text-lg shadow-lg sm:w-auto'
        >
          {loading ? (
            <>
              <Loader2 className='mr-2 h-5 w-5 animate-spin' /> Setting up
              workspace...
            </>
          ) : (
            <>
              Complete Setup <Rocket className='ml-2 h-5 w-5' />
            </>
          )}
        </Button>
        <Button
          variant='ghost'
          onClick={onBack}
          disabled={loading}
          className='text-muted-foreground'
        >
          <ArrowLeft className='mr-2 h-4 w-4' /> Back to Templates
        </Button>
      </div>
    </div>
  );
}

// ============================================
// Step 4: Success
// ============================================

function SuccessStep({ schoolName }: { schoolName: string }) {
  const router = useRouter();

  return (
    <div className='animate-in zoom-in-95 fade-in mx-auto max-w-2xl space-y-8 py-8 text-center duration-700'>
      <div className='relative mx-auto h-24 w-24'>
        <div className='absolute inset-0 animate-ping rounded-full bg-green-500/20 duration-[2000ms]'></div>
        <div className='relative flex h-full w-full items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/30'>
          <Check className='h-12 w-12' />
        </div>
      </div>

      <div className='space-y-4'>
        <h1 className='text-foreground text-4xl font-bold'>
          {schoolName} is Live!
        </h1>
        <p className='text-muted-foreground text-xl'>
          Your environment has been provisioned successfully.
        </p>
      </div>

      <Card className='bg-muted/30 text-left'>
        <CardContent className='p-6'>
          <h3 className='text-foreground mb-4 flex items-center gap-2 font-semibold'>
            <Sparkles className='text-primary h-4 w-4' /> Recommended Next Steps
          </h3>
          <ul className='space-y-3'>
            {[
              'Invite staff members & assign roles',
              'Import student roster via CSV',
              'Configure academic calendar terms',
              'Set up grading policies'
            ].map((step, i) => (
              <li
                key={i}
                className='text-muted-foreground flex items-start gap-3 text-sm'
              >
                <span className='bg-background text-foreground flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border text-xs font-medium'>
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Button
        size='lg'
        onClick={() => router.push('/dashboard')}
        className='h-12 px-8 text-lg shadow-lg'
      >
        Go to Dashboard <ArrowRight className='ml-2 h-5 w-5' />
      </Button>
    </div>
  );
}

// ============================================
// Main Controller
// ============================================

export function OnboardingFlow({ tenantId }: { tenantId: string }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const { getToken } = useAuth();

  // Consolidated State
  const [formData, setFormData] = useState<OnboardingData>({
    schoolName: '',
    schoolLogo: null,
    logoPreviewUrl: null,
    template: null
  });

  const updateFormData = (updates: Partial<OnboardingData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (formData.logoPreviewUrl) {
        URL.revokeObjectURL(formData.logoPreviewUrl);
      }
    };
  }, [formData.logoPreviewUrl]);

  const handleComplete = async () => {
    if (!formData.template || !formData.schoolName) return;

    try {
      setLoading(true);
      setError(null);

      // Get fresh auth token for API call
      const token = await getToken();
      if (token) {
        apiClient.setAuthToken(token);
      }

      // Build logo data URL if logo is provided
      let schoolLogoData: string | null = null;
      if (formData.schoolLogo) {
        const reader = new FileReader();
        schoolLogoData = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(formData.schoolLogo!);
        });
      }

      // Call real API endpoint
      const response = await apiClient.post('/api/onboarding/configure', {
        tenantId,
        schoolName: formData.schoolName,
        schoolLogo: schoolLogoData,
        country: formData.template.countryCode,
        educationLevel: formData.template.educationLevel,
        selectedTemplateId: formData.template.id,
        customizations: {}
      });

      if (response.success) {
        setIsComplete(true);
        setCurrentStep(3);
      } else {
        throw new Error(response.error || 'Configuration failed');
      }
    } catch (err: any) {
      console.error('Onboarding error:', err);
      setError(
        err.response?.data?.error ||
          err.message ||
          'Failed to provision school. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-background flex min-h-screen flex-col font-sans'>
      {/* Header */}
      <header className='bg-background/80 sticky top-0 z-50 shrink-0 border-b backdrop-blur-md'>
        <div className='mx-auto max-w-5xl px-4 py-4'>
          <div className='mb-6 flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='bg-primary shadow-primary/20 flex h-10 w-10 items-center justify-center rounded-xl text-xl font-bold text-white shadow-lg'>
                R
              </div>
              <div>
                <h1 className='text-lg font-bold tracking-tight'>
                  Redevise SIS
                </h1>
                <p className='text-muted-foreground text-xs font-medium'>
                  Setup Wizard
                </p>
              </div>
            </div>
            <div className='text-muted-foreground text-sm font-medium sm:hidden'>
              {currentStep + 1} / {STEPS.length}
            </div>
          </div>
          <StepIndicator currentStep={currentStep} />
        </div>
      </header>

      {/* Main Content */}
      <main className='min-h-0 flex-1 overflow-y-auto'>
        <div className='mx-auto max-w-4xl px-4 py-8 md:py-12'>
          {error && (
            <Alert
              variant='destructive'
              className='animate-in slide-in-from-top-2 mb-6'
            >
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {currentStep === 0 && (
            <WelcomeStep onContinue={() => setCurrentStep(1)} />
          )}

          {currentStep === 1 && (
            <div className='animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-500'>
              <div className='space-y-2 text-center'>
                <h2 className='text-3xl font-bold tracking-tight'>
                  Choose Your System
                </h2>
                <p className='text-muted-foreground mx-auto max-w-xl'>
                  Select the structure that best fits your institution. This
                  sets up default grading scales and terminology.
                </p>
              </div>

              <EnhancedTemplateSelector
                selectedTemplateId={formData.template?.id}
                onSelect={(tpl) => updateFormData({ template: tpl })}
                loading={loading}
              />

              <div className='flex flex-col items-center gap-4 pt-4'>
                <Button
                  size='lg'
                  onClick={() => setCurrentStep(2)}
                  disabled={!formData.template}
                  className='h-12 min-w-[200px] px-8 text-lg shadow-lg'
                >
                  Continue <ArrowRight className='ml-2 h-5 w-5' />
                </Button>
                <Button
                  variant='ghost'
                  onClick={() => setCurrentStep(0)}
                  className='text-muted-foreground'
                >
                  <ArrowLeft className='mr-2 h-4 w-4' /> Back
                </Button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <SchoolDetailsStep
              data={formData}
              updateData={updateFormData}
              loading={loading}
              onBack={() => setCurrentStep(1)}
              onComplete={handleComplete}
            />
          )}

          {currentStep === 3 && isComplete && (
            <SuccessStep schoolName={formData.schoolName} />
          )}
        </div>
      </main>
    </div>
  );
}

export default OnboardingFlow;
