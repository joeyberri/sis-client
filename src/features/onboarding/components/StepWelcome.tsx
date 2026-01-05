'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
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
    <div className="w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
      <Card className="border-border/50 shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center space-y-6 pb-8">
          {/* Logo / Icon Container */}
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/30 transition-all duration-500" />
              <div className="relative p-6 bg-background border border-primary/10 rounded-3xl shadow-sm">
                <GraduationCap className="w-12 h-12 text-primary" />
              </div>
              <Badge 
                variant="secondary" 
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 shadow-sm whitespace-nowrap"
              >
                v2.0 Setup Wizard
              </Badge>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <CardTitle className="text-4xl font-bold tracking-tight text-foreground">
              Welcome to Redevise SIS
            </CardTitle>
            <CardDescription className="text-lg max-w-md mx-auto leading-relaxed">
              Let's configure your school's digital infrastructure. This wizard will tailor the system to your curriculum.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <FeatureItem 
              icon={<Zap className="w-5 h-5 text-amber-500" />}
              title="Lightning Fast Setup"
              description="Deploy a complete academic structure in minutes, not days."
            />
            <FeatureItem 
              icon={<Globe className="w-5 h-5 text-blue-500" />}
              title="Global Standards"
              description="Pre-loaded with WAEC, Cambridge, and IB frameworks."
            />
            <FeatureItem 
              icon={<LayoutTemplate className="w-5 h-5 text-emerald-500" />}
              title="Smart Templates"
              description="Choose from 20+ preset configurations for your institution type."
            />
          </div>
        </CardContent>

        <CardFooter className="pt-2 pb-8">
          <Button 
            onClick={onContinue} 
            size="lg" 
            className="w-full h-14 text-lg font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all group"
          >
            Start Configuration
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardFooter>
      </Card>
      
      <p className="text-center text-xs text-muted-foreground mt-6">
        Press <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">Enter</kbd> to continue
      </p>
    </div>
  );
}

// Sub-component for cleaner code
function FeatureItem({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl border border-transparent hover:bg-muted/50 hover:border-border/50 transition-colors">
      <div className="p-2.5 bg-background border shadow-sm rounded-xl shrink-0">
        {icon}
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-snug">
          {description}
        </p>
      </div>
    </div>
  );
}