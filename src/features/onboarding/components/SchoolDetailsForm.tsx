'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface SchoolDetailsFormProps {
  schoolName: string;
  setSchoolName: (name: string) => void;
  schoolLogo: string;
  setSchoolLogo: (logo: string) => void;
  loading?: boolean;
}

export function SchoolDetailsForm({
  schoolName,
  setSchoolName,
  schoolLogo,
  setSchoolLogo,
  loading,
}: SchoolDetailsFormProps) {
  return (
    <Card className="border-primary/10 shadow-lg">
      <CardHeader>
        <CardTitle className="font-serif text-2xl text-primary">School Identity</CardTitle>
        <CardDescription>
          Tell us a bit more about your institution to personalize your workspace.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="schoolName" className="text-sm font-semibold">School Name</Label>
          <Input
            id="schoolName"
            placeholder="e.g. St. Andrews International School"
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            disabled={loading}
            className="h-12 border-primary/20 focus-visible:ring-primary"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="schoolLogo" className="text-sm font-semibold">School Logo URL (Optional)</Label>
          <Input
            id="schoolLogo"
            placeholder="https://example.com/logo.png"
            value={schoolLogo}
            onChange={(e) => setSchoolLogo(e.target.value)}
            disabled={loading}
            className="h-12 border-primary/20 focus-visible:ring-primary"
          />
          <p className="text-xs text-muted-foreground">You can also upload a logo later in settings.</p>
        </div>
      </CardContent>
    </Card>
  );
}
