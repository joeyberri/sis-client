'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ArrowRight, Users, BookOpen, LayoutDashboard } from 'lucide-react';
import { EducationTemplate } from '../hooks/useOnboarding';

interface StepSuccessProps {
  schoolName: string;
  selectedTemplate: EducationTemplate | null;
}

export function StepSuccess({ schoolName, selectedTemplate }: StepSuccessProps) {
  return (
    <Card className="max-w-2xl mx-auto border-primary/20 shadow-2xl shadow-primary/10">
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
            <CheckCircle2 className="h-12 w-12 text-primary" />
          </div>
        </div>
        <div className="space-y-2">
          <CardTitle className="text-3xl font-serif text-primary">Setup Complete!</CardTitle>
          <CardDescription className="text-lg">
            Your school is ready. Welcome to the future of school management.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-8 text-center space-y-3">
          <h3 className="text-2xl font-bold text-primary">{schoolName}</h3>
          <div className="flex justify-center gap-2">
            <Badge variant="outline" className="bg-background">
              {selectedTemplate?.emoji} {selectedTemplate?.name}
            </Badge>
            <Badge variant="outline" className="bg-background">
              {selectedTemplate?.country}
            </Badge>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-center text-muted-foreground uppercase tracking-wider text-xs">Recommended Next Steps</h4>
          <div className="grid gap-3">
            <div className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/50 transition-colors group cursor-pointer">
              <div className="p-2 bg-muted rounded-lg group-hover:bg-primary/10 transition-colors">
                <BookOpen className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">Define Class Structure</p>
                <p className="text-xs text-muted-foreground">Set up your grades, sections, and classrooms.</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/50 transition-colors group cursor-pointer">
              <div className="p-2 bg-muted rounded-lg group-hover:bg-primary/10 transition-colors">
                <Users className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">Invite Staff</p>
                <p className="text-xs text-muted-foreground">Add teachers and administrators to your team.</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
            </div>
          </div>
        </div>

        <Button 
          onClick={() => (window.location.href = '/dashboard')} 
          className="w-full h-12 text-lg font-medium shadow-lg shadow-primary/20 group"
        >
          <LayoutDashboard className="w-5 h-5 mr-2" />
          Go to Dashboard
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
}
