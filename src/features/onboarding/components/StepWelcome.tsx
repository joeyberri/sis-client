'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Zap,
  Globe,
  GraduationCap,
  ArrowRight,
  LayoutTemplate,
  CheckCircle2
} from 'lucide-react';

interface StepWelcomeProps {
  onContinue: () => void;
}

export function StepWelcome({ onContinue }: StepWelcomeProps) {
  return (
    <div className='animate-in fade-in slide-in-from-bottom-8 mx-auto w-full max-w-2xl duration-700'>
      <Card className='border-border/50 shadow-primary/5 bg-card/50 shadow-2xl backdrop-blur-sm'>
        <CardHeader className='space-y-6 pb-8 text-center'>
          {/* Logo / Icon Container */}
          <div className='flex justify-center'>
            <div className='group relative'>
              <div className='bg-primary/20 group-hover:bg-primary/30 absolute inset-0 rounded-full blur-xl transition-all duration-500' />
              <div className='bg-background border-primary/10 relative rounded-3xl border p-6 shadow-sm'>
                <GraduationCap className='text-primary h-12 w-12' />
              </div>
              <Badge
                variant='secondary'
                className='absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 whitespace-nowrap shadow-sm'
              >
                v2.0 Setup Wizard
              </Badge>
            </div>
          </div>

          <div className='space-y-3 pt-4'>
            <CardTitle className='text-foreground text-4xl font-bold tracking-tight'>
              Welcome to Redevise SIS
            </CardTitle>
            <CardDescription className='mx-auto max-w-md text-lg leading-relaxed'>
              Let's configure your school's digital infrastructure. This wizard
              will tailor the system to your curriculum.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className='space-y-6'>
          <div className='grid gap-4'>
            <FeatureItem
              icon={<Zap className='h-5 w-5 text-amber-500' />}
              title='Lightning Fast Setup'
              description='Deploy a complete academic structure in minutes, not days.'
            />
            <FeatureItem
              icon={<Globe className='h-5 w-5 text-blue-500' />}
              title='Global Standards'
              description='Pre-loaded with WAEC, Cambridge, and IB frameworks.'
            />
            <FeatureItem
              icon={<LayoutTemplate className='h-5 w-5 text-emerald-500' />}
              title='Smart Templates'
              description='Choose from 20+ preset configurations for your institution type.'
            />
          </div>
        </CardContent>

        <CardFooter className='pt-2 pb-8'>
          <Button
            onClick={onContinue}
            size='lg'
            className='shadow-primary/25 hover:shadow-primary/40 group h-14 w-full text-lg font-medium shadow-lg transition-all'
          >
            Start Configuration
            <ArrowRight className='ml-2 h-5 w-5 transition-transform group-hover:translate-x-1' />
          </Button>
        </CardFooter>
      </Card>

      <p className='text-muted-foreground mt-6 text-center text-xs'>
        Press{' '}
        <kbd className='bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none'>
          Enter
        </kbd>{' '}
        to continue
      </p>
    </div>
  );
}

// Sub-component for cleaner code
function FeatureItem({
  icon,
  title,
  description
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className='hover:bg-muted/50 hover:border-border/50 flex items-start gap-4 rounded-xl border border-transparent p-4 transition-colors'>
      <div className='bg-background shrink-0 rounded-xl border p-2.5 shadow-sm'>
        {icon}
      </div>
      <div className='space-y-1'>
        <h3 className='text-foreground flex items-center gap-2 font-semibold'>
          {title}
        </h3>
        <p className='text-muted-foreground text-sm leading-snug'>
          {description}
        </p>
      </div>
    </div>
  );
}
