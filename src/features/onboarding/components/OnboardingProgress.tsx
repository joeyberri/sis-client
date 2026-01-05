'use client';

import { CheckCircle2 } from 'lucide-react';

interface Step {
  id: number;
  title: string;
}

interface OnboardingProgressProps {
  steps: Step[];
  currentStep: number;
}

export function OnboardingProgress({ steps, currentStep }: OnboardingProgressProps) {
  return (
    <div className="relative px-4">
      <div className="absolute top-5 left-0 w-full h-0.5 bg-muted -z-10" />
      <div
        className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-700 ease-in-out -z-10"
        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
      />
      <div className="flex justify-between">
        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;

          return (
            <div key={step.id} className="flex flex-col items-center group">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20'
                    : isActive
                    ? 'bg-background border-primary text-primary ring-4 ring-primary/10'
                    : 'bg-background border-muted text-muted-foreground'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <span className={`text-sm font-bold ${isActive ? 'scale-110' : ''}`}>{step.id + 1}</span>
                )}
              </div>
              <span
                className={`text-[10px] md:text-xs mt-3 font-bold uppercase tracking-widest transition-colors duration-300 ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
