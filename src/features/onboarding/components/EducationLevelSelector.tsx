'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

const EDUCATION_LEVELS = [
  { value: 'primary', label: 'Primary School', emoji: '🏫', ageRange: '6-11 years' },
  { value: 'jhs', label: 'Junior High School', emoji: '👨‍🎓', ageRange: '12-14 years' },
  { value: 'shs', label: 'Senior High School', emoji: '👩‍🎓', ageRange: '15-17 years' },
  { value: 'tertiary', label: 'University', emoji: '🎓', ageRange: '18+ years' },
  { value: 'post_tertiary', label: 'Post-Tertiary', emoji: '📚', ageRange: '20+ years' },
];

interface EducationLevelSelectorProps {
  selectedLevel?: string;
  onSelect: (level: string) => void;
  loading?: boolean;
}

export function EducationLevelSelector({ selectedLevel, onSelect, loading }: EducationLevelSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {EDUCATION_LEVELS.map((level) => (
        <Card
          key={level.value}
          className={`cursor-pointer transition-all hover:border-primary/50 hover:shadow-md group ${
            selectedLevel === level.value ? 'border-primary ring-1 ring-primary bg-primary/5' : ''
          }`}
          onClick={() => !loading && onSelect(level.value)}
        >
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <span className="text-4xl group-hover:scale-110 transition-transform">{level.emoji}</span>
              {selectedLevel === level.value && (
                <CheckCircle2 className="w-5 h-5 text-primary" />
              )}
            </div>
            <CardTitle className="text-lg mt-4 font-serif">{level.label}</CardTitle>
            <CardDescription className="text-xs uppercase tracking-widest font-medium">{level.ageRange}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
