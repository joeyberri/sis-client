'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  X,
} from 'lucide-react';
import { EnhancedTemplateSelector } from './components/EnhancedTemplateSelector';
import type { TemplateDefinition } from './data/templates';

// ============================================
// Types & Constants
// ============================================

const STEPS = [
  { id: 0, title: 'Welcome', subtitle: 'Get Started', icon: Sparkles },
  { id: 1, title: 'Template', subtitle: 'Education System', icon: BookOpen },
  { id: 2, title: 'Identity', subtitle: 'Brand Your School', icon: Building },
  { id: 3, title: 'Launch', subtitle: "You're Ready!", icon: Rocket },
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
    <div className="space-y-4" aria-label="Progress">
      <Progress value={progress} className="h-2 transition-all duration-500 ease-in-out" />
      
      <div className="flex justify-between relative">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          
          return (
            <div 
              key={step.id} 
              className={cn(
                "flex flex-col items-center text-center z-10",
                index === 0 ? 'items-start' : index === STEPS.length - 1 ? 'items-end' : ''
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 border-2",
                  isCompleted ? "bg-primary border-primary text-white" :
                  isCurrent ? "bg-background border-primary text-primary shadow-[0_0_0_4px_rgba(var(--primary),0.1)]" :
                  "bg-muted border-muted-foreground/20 text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </div>
              <div className="hidden sm:block">
                <p className={cn("text-sm font-medium transition-colors", isCurrent ? "text-primary" : "text-muted-foreground")}>
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground">{step.subtitle}</p>
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
    <div className="max-w-2xl mx-auto text-center space-y-8 py-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="relative mx-auto w-24 h-24 group cursor-default">
        <div className="absolute inset-0 bg-primary/20 rounded-3xl rotate-6 transition-transform group-hover:rotate-12"></div>
        <div className="relative bg-primary rounded-3xl w-full h-full flex items-center justify-center text-white shadow-xl">
          <GraduationCap className="w-12 h-12" />
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Welcome to Redevise SIS</h1>
        <p className="text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Let's configure your school's digital infrastructure. It only takes a few moments to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        {[
          { icon: School, title: 'Smart Templates', desc: 'Pre-configured workflows' },
          { icon: BookOpen, title: 'Complete Setup', desc: 'Grades & calendars ready' },
          { icon: Sparkles, title: 'Fully Custom', desc: 'Adaptable to your needs' },
        ].map((feature, i) => (
          <Card key={i} className="border-none bg-muted/50 hover:bg-muted/80 transition-colors">
            <CardContent className="p-4 text-center">
              <feature.icon className="w-8 h-8 mx-auto text-primary mb-2 opacity-80" />
              <h3 className="font-semibold text-sm">{feature.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{feature.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button size="lg" onClick={onContinue} className="px-10 h-12 text-lg shadow-lg hover:shadow-primary/25 transition-all">
        Get Started <ArrowRight className="w-5 h-5 ml-2" />
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

function SchoolDetailsStep({ data, updateData, loading, onBack, onComplete }: SchoolDetailsStepProps) {
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
      alert("File is too large. Max 2MB.");
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
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
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
    <div className="max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Your School Identity</h2>
        <p className="text-muted-foreground">Define how your school appears on reports and portals.</p>
      </div>

      {data.template && (
        <Alert className="bg-primary/5 border-primary/20">
          <AlertDescription className="flex items-center gap-3">
            <span className="text-2xl" role="img" aria-label="Template icon">{data.template.emoji}</span>
            <div>
              <span className="font-semibold text-foreground">Selected Template:</span>
              <span className="ml-2 text-muted-foreground">{data.template.name}</span>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="schoolName">School Name <span className="text-destructive">*</span></Label>
          <Input
            id="schoolName"
            placeholder="e.g. Lincoln High School"
            value={data.schoolName}
            onChange={(e) => {
              updateData({ schoolName: e.target.value });
              if(validationError) setValidationError('');
            }}
            className={cn("h-12 text-lg", validationError && "border-destructive focus-visible:ring-destructive")}
          />
          {validationError && <p className="text-sm text-destructive font-medium flex items-center"><AlertCircle className="w-4 h-4 mr-1"/> {validationError}</p>}
        </div>

        <div className="space-y-2">
          <Label>School Logo (Optional)</Label>
          <div
            className={cn(
              "relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer group",
              dragActive ? "border-primary bg-primary/5 scale-[1.01]" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/20",
              data.logoPreviewUrl ? "border-solid border-muted/50" : ""
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Upload school logo"
          >
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleFileChange}
            />

            {data.logoPreviewUrl ? (
              <div className="relative group/image">
                 <div className="w-32 h-32 mx-auto rounded-lg overflow-hidden border bg-white flex items-center justify-center">
                    <img src={data.logoPreviewUrl} alt="Preview" className="w-full h-full object-contain" />
                 </div>
                 <div className="absolute top-0 right-0 p-2 opacity-0 group-hover/image:opacity-100 transition-opacity">
                    <Button 
                      size="icon" 
                      variant="destructive" 
                      className="h-8 w-8 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateData({ schoolLogo: null, logoPreviewUrl: null });
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                 </div>
                 <p className="mt-4 text-sm text-muted-foreground group-hover:text-primary transition-colors">Click or drag to replace</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto group-hover:bg-primary/10 transition-colors">
                  <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG (max 2MB)</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-6">
        <Button 
          size="lg" 
          onClick={handleNext} 
          disabled={loading} 
          className="h-12 text-lg shadow-lg w-full sm:w-auto"
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Setting up workspace...</>
          ) : (
            <>Complete Setup <Rocket className="w-5 h-5 ml-2" /></>
          )}
        </Button>
        <Button variant="ghost" onClick={onBack} disabled={loading} className="text-muted-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Templates
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
    <div className="max-w-2xl mx-auto text-center space-y-8 py-8 animate-in zoom-in-95 fade-in duration-700">
      <div className="relative mx-auto w-24 h-24">
        <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping duration-[2000ms]"></div>
        <div className="relative bg-green-500 rounded-full w-full h-full flex items-center justify-center text-white shadow-lg shadow-green-500/30">
          <Check className="w-12 h-12" />
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-foreground">{schoolName} is Live!</h1>
        <p className="text-xl text-muted-foreground">
          Your environment has been provisioned successfully.
        </p>
      </div>

      <Card className="text-left bg-muted/30">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4 text-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" /> Recommended Next Steps
          </h3>
          <ul className="space-y-3">
            {[
              'Invite staff members & assign roles',
              'Import student roster via CSV',
              'Configure academic calendar terms',
              'Set up grading policies'
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-background border flex items-center justify-center text-xs font-medium text-foreground">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Button
        size="lg"
        onClick={() => router.push('/dashboard')}
        className="px-8 h-12 text-lg shadow-lg"
      >
        Go to Dashboard <ArrowRight className="w-5 h-5 ml-2" />
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

  // Consolidated State
  const [formData, setFormData] = useState<OnboardingData>({
    schoolName: '',
    schoolLogo: null,
    logoPreviewUrl: null,
    template: null,
  });

  const updateFormData = (updates: Partial<OnboardingData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
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
      
      // Simulate API Logic
      // const formDataToSend = new FormData();
      // formDataToSend.append('logo', formData.schoolLogo);
      // formDataToSend.append('name', formData.schoolName);
      // await api.post(...)
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsComplete(true);
      setCurrentStep(3);
    } catch (err) {
      setError('Failed to provision school. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b shrink-0">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">R</div>
              <div>
                <h1 className="text-lg font-bold tracking-tight">Redevise SIS</h1>
                <p className="text-xs text-muted-foreground font-medium">Setup Wizard</p>
              </div>
            </div>
            <div className="sm:hidden text-sm font-medium text-muted-foreground">
              {currentStep + 1} / {STEPS.length}
            </div>
          </div>
          <StepIndicator currentStep={currentStep} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
          {error && (
            <Alert variant="destructive" className="mb-6 animate-in slide-in-from-top-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {currentStep === 0 && (
            <WelcomeStep onContinue={() => setCurrentStep(1)} />
          )}

          {currentStep === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Choose Your System</h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Select the structure that best fits your institution. This sets up default grading scales and terminology.
                </p>
              </div>

              <EnhancedTemplateSelector
                selectedTemplateId={formData.template?.id}
                onSelect={(tpl) => updateFormData({ template: tpl })}
                loading={loading}
              />

              <div className="flex flex-col items-center gap-4 pt-4">
                <Button
                  size="lg"
                  onClick={() => setCurrentStep(2)}
                  disabled={!formData.template}
                  className="px-8 h-12 text-lg shadow-lg min-w-[200px]"
                >
                  Continue <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button variant="ghost" onClick={() => setCurrentStep(0)} className="text-muted-foreground">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
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