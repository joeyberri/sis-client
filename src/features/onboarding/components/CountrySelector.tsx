'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

const COUNTRIES = [
  { code: 'GH', name: 'Ghana', emoji: '🇬🇭', region: 'West Africa' },
  { code: 'US', name: 'USA', emoji: '🇺🇸', region: 'North America' },
  { code: 'UK', name: 'United Kingdom', emoji: '🇬🇧', region: 'Europe' },
  { code: 'NG', name: 'Nigeria', emoji: '🇳🇬', region: 'West Africa' },
  { code: 'KE', name: 'Kenya', emoji: '🇰🇪', region: 'East Africa' },
  { code: 'AU', name: 'Australia', emoji: '🇦🇺', region: 'Oceania' },
];

interface CountrySelectorProps {
  selectedCountry?: string;
  onSelect: (country: string) => void;
  loading?: boolean;
}

export function CountrySelector({ selectedCountry, onSelect, loading }: CountrySelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {COUNTRIES.map((country) => (
        <Card
          key={country.code}
          className={`cursor-pointer transition-all hover:border-primary/50 hover:shadow-md group ${
            selectedCountry === country.code ? 'border-primary ring-1 ring-primary bg-primary/5' : ''
          }`}
          onClick={() => !loading && onSelect(country.code)}
        >
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <span className="text-4xl group-hover:scale-110 transition-transform">{country.emoji}</span>
              {selectedCountry === country.code && (
                <CheckCircle2 className="w-5 h-5 text-primary" />
              )}
            </div>
            <CardTitle className="text-lg mt-4 font-serif">{country.name}</CardTitle>
            <CardDescription className="text-xs uppercase tracking-widest font-medium">{country.region}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
