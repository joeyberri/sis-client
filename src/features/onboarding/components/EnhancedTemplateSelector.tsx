'use client';

import { useState, useMemo } from 'react';
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
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Search,
  CheckCircle2,
  Wand2,
  ChevronRight,
  Globe,
  School,
  GraduationCap,
  BookOpen,
  Sparkles,
  Heart,
  Wrench,
  Church,
  BarChart3,
  Calendar,
  Target,
  Layout,
  Filter,
  X
} from 'lucide-react';
import {
  TEMPLATE_CATEGORIES,
  getPopularTemplates,
  searchTemplates,
  getTemplatesByCategory,
  type TemplateDefinition,
  type TemplateCategory
} from '../data/templates';
import { TemplateRecommendationWizard } from './TemplateRecommendationWizard';
import { cn } from '@/lib/utils';

// ============================================
// Types & Helpers
// ============================================

const CATEGORY_ICONS: Record<TemplateCategory, React.ReactNode> = {
  k12_standard: <School className='h-4 w-4' />,
  k12_montessori: <Sparkles className='h-4 w-4' />,
  k12_international: <Globe className='h-4 w-4' />,
  k12_religious: <Church className='h-4 w-4' />,
  vocational: <Wrench className='h-4 w-4' />,
  higher_education: <GraduationCap className='h-4 w-4' />,
  special_education: <Heart className='h-4 w-4' />,
  tutoring_center: <BookOpen className='h-4 w-4' />
};

// Helper to determine the best visual aid for a template type
const getTemplateVisualAid = (template: TemplateDefinition) => {
  if (template.category === 'k12_montessori') return '';
  if (template.category === 'vocational') return '';
  if (template.category === 'higher_education') return '';
  if (template.id.includes('uk')) return '';
  if (template.id.includes('us')) return '';
  return null;
};

// ============================================
// Component: Template Detail Sheet
// ============================================

interface TemplateDetailSheetProps {
  template: TemplateDefinition | null;
  onClose: () => void;
  onSelect: () => void;
  isSelected: boolean;
}

function TemplateDetailSheet({
  template,
  onClose,
  onSelect,
  isSelected
}: TemplateDetailSheetProps) {
  if (!template) return null;

  const visualAidTag = getTemplateVisualAid(template);

  return (
    <Sheet open={!!template} onOpenChange={onClose}>
      <SheetContent className='flex w-full flex-col gap-0 p-0 sm:w-[540px]'>
        <ScrollArea className='h-full flex-1'>
          <div className='p-6'>
            {/* Header */}
            <SheetHeader className='pb-6'>
              <div className='flex items-start gap-4'>
                <div className='bg-primary/5 border-primary/10 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl border text-4xl'>
                  {template.emoji}
                </div>
                <div className='space-y-1'>
                  <Badge variant='outline' className='mb-1'>
                    {template.category.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <SheetTitle className='text-2xl'>{template.name}</SheetTitle>
                  <SheetDescription>
                    {template.country} • {template.educationLevel}
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <div className='space-y-8'>
              {/* About Section */}
              <section className='space-y-3'>
                <h4 className='flex items-center gap-2 text-sm font-semibold'>
                  <Layout className='text-primary h-4 w-4' /> Structure Overview
                </h4>
                <p className='text-muted-foreground text-sm leading-relaxed'>
                  {template.detailedDescription}
                </p>

                {/* Visual Aid Trigger */}
                {visualAidTag && (
                  <div className='bg-muted/30 text-muted-foreground mt-4 rounded-lg border border-dashed p-4 text-center text-xs italic'>
                    <span className='mb-1 block font-semibold not-italic'>
                      Structure Visualization
                    </span>
                    {visualAidTag}
                  </div>
                )}
              </section>

              <Separator />

              {/* Technical Details Grid */}
              <section className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <Card className='bg-muted/20 border-none shadow-none'>
                  <CardContent className='space-y-2 p-4'>
                    <div className='text-muted-foreground flex items-center gap-2 text-xs font-medium'>
                      <BarChart3 className='h-3 w-3' /> Grading System
                    </div>
                    <p className='text-sm font-medium'>
                      {template.gradingSystem.description}
                    </p>
                  </CardContent>
                </Card>
                <Card className='bg-muted/20 border-none shadow-none'>
                  <CardContent className='space-y-2 p-4'>
                    <div className='text-muted-foreground flex items-center gap-2 text-xs font-medium'>
                      <Calendar className='h-3 w-3' /> Schedule Format
                    </div>
                    <p className='text-sm font-medium'>
                      {template.academicCalendar.description}
                    </p>
                  </CardContent>
                </Card>
              </section>

              {/* Sample Curriculum */}
              <section>
                <h4 className='mb-3 flex items-center gap-2 text-sm font-semibold'>
                  <BookOpen className='text-primary h-4 w-4' /> Default Subjects
                </h4>
                <div className='flex flex-wrap gap-2'>
                  {template.sampleCurriculum.map((subject, i) => (
                    <Badge
                      key={i}
                      variant='secondary'
                      className='bg-secondary/50 px-3 py-1'
                    >
                      {subject}
                    </Badge>
                  ))}
                </div>
              </section>

              <Separator />

              {/* Pros/Cons */}
              <section className='grid grid-cols-2 gap-6'>
                <div className='space-y-2'>
                  <h4 className='text-xs font-bold tracking-wide text-green-600 uppercase'>
                    Best For
                  </h4>
                  <ul className='space-y-2'>
                    {template.idealFor.map((item, i) => (
                      <li
                        key={i}
                        className='text-muted-foreground flex items-start gap-2 text-sm'
                      >
                        <CheckCircle2 className='mt-1 h-3 w-3 shrink-0 text-green-600' />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className='space-y-2'>
                  <h4 className='text-xs font-bold tracking-wide text-orange-600 uppercase'>
                    Considerations
                  </h4>
                  <ul className='space-y-2'>
                    {template.notIdealFor.map((item, i) => (
                      <li
                        key={i}
                        className='text-muted-foreground flex items-start gap-2 text-sm'
                      >
                        <div className='mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400' />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </div>
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className='bg-background/95 supports-[backdrop-filter]:bg-background/60 border-t p-6 backdrop-blur'>
          <Button
            onClick={onSelect}
            className='h-12 w-full text-lg'
            variant={isSelected ? 'secondary' : 'default'}
            disabled={isSelected}
          >
            {isSelected ? (
              <>
                <CheckCircle2 className='mr-2 h-5 w-5 text-green-600' />
                Template Selected
              </>
            ) : (
              'Use This Template'
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ============================================
// Component: Template Card
// ============================================

interface TemplateCardProps {
  template: TemplateDefinition;
  isSelected: boolean;
  onSelect: () => void;
  onViewDetails: () => void;
}

function TemplateCard({
  template,
  isSelected,
  onSelect,
  onViewDetails
}: TemplateCardProps) {
  return (
    <Card
      className={cn(
        'group relative flex cursor-pointer flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-md',
        isSelected
          ? 'border-primary ring-primary bg-primary/5 shadow-md ring-1'
          : 'hover:border-primary/50'
      )}
      onClick={onSelect}
    >
      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between'>
          <div className='bg-background flex h-12 w-12 items-center justify-center rounded-lg border text-2xl shadow-sm transition-transform duration-300 group-hover:scale-110'>
            {template.emoji}
          </div>
          {isSelected && (
            <span className='text-primary bg-background ring-border absolute top-4 right-4 flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium shadow-sm ring-1'>
              <CheckCircle2 className='fill-primary h-3.5 w-3.5 text-white' />
              Selected
            </span>
          )}
        </div>
        <div className='mt-4'>
          <CardTitle className='mb-1 text-base leading-tight font-semibold'>
            {template.name}
          </CardTitle>
          <CardDescription className='flex items-center gap-2 text-xs'>
            <span className='bg-muted-foreground/30 inline-block h-2 w-2 rounded-full' />
            {template.country}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className='flex-1 pb-3'>
        <p className='text-muted-foreground line-clamp-3 text-sm leading-relaxed'>
          {template.description}
        </p>
      </CardContent>

      <CardFooter className='mt-auto flex items-center gap-2 pt-0'>
        <Button
          variant='ghost'
          size='sm'
          className='text-muted-foreground group-hover:text-primary flex-1 justify-between pl-2 transition-colors'
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails();
          }}
        >
          Details
          <ChevronRight className='h-4 w-4 opacity-50 transition-opacity group-hover:opacity-100' />
        </Button>
      </CardFooter>
    </Card>
  );
}

// ============================================
// Component: Main Selector
// ============================================

interface EnhancedTemplateSelectorProps {
  selectedTemplateId?: string;
  onSelect: (template: TemplateDefinition) => void;
  loading?: boolean;
}

export function EnhancedTemplateSelector({
  selectedTemplateId,
  onSelect,
  loading
}: EnhancedTemplateSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'browse' | 'wizard'>('browse');
  const [activeCategory, setActiveCategory] = useState<
    TemplateCategory | 'popular'
  >('popular');
  const [detailTemplate, setDetailTemplate] =
    useState<TemplateDefinition | null>(null);

  // Derived state for filtering
  const filteredTemplates = useMemo(() => {
    let results = [];

    // 1. Base set selection
    if (searchQuery) {
      results = searchTemplates(searchQuery);
    } else if (activeCategory === 'popular') {
      results = getPopularTemplates(12);
    } else {
      results = getTemplatesByCategory(activeCategory as TemplateCategory);
    }

    // 2. Region filtering
    if (regionFilter !== 'all') {
      results = results.filter((t) =>
        t.country.toLowerCase().includes(regionFilter.toLowerCase())
      );
    }

    return results;
  }, [searchQuery, activeCategory, regionFilter]);

  // Handle template selection and close details
  const handleSelect = (template: TemplateDefinition) => {
    if (loading) return;
    onSelect(template);
    setDetailTemplate(null);
  };

  return (
    <div className='space-y-6'>
      {/* Top Bar: Wizard Toggle & Search */}
      <div className='flex flex-col items-end justify-between gap-4 md:flex-row md:items-center'>
        <div className='flex w-full flex-1 gap-3'>
          <div className='relative flex-1'>
            <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
            <Input
              placeholder='Search curriculum, country, or system...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='bg-background h-10 pl-10'
            />
          </div>

          {/* Region Filter - Visual Aid:  is implied here by the globe icon */}
          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger className='h-10 w-[140px] md:w-[180px]'>
              <Filter className='text-muted-foreground mr-2 h-4 w-4' />
              <SelectValue placeholder='Region' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Regions</SelectItem>
              <SelectItem value='us'>United States</SelectItem>
              <SelectItem value='uk'>United Kingdom</SelectItem>
              <SelectItem value='international'>International</SelectItem>
              <SelectItem value='asia'>Asia</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant={activeTab === 'wizard' ? 'secondary' : 'outline'}
          onClick={() =>
            setActiveTab(activeTab === 'wizard' ? 'browse' : 'wizard')
          }
          className='h-10 shrink-0'
        >
          <Wand2 className='mr-2 h-4 w-4' />
          {activeTab === 'wizard' ? 'Exit Assistant' : 'Help Me Choose'}
        </Button>
      </div>

      {activeTab === 'wizard' ? (
        <TemplateRecommendationWizard
          onSelectTemplate={(template) => {
            onSelect(template);
            setActiveTab('browse');
          }}
          onCancel={() => setActiveTab('browse')}
        />
      ) : (
        <div className='animate-in fade-in slide-in-from-bottom-2 space-y-6 duration-500'>
          {/* Category Tabs */}
          {!searchQuery && (
            <div className='relative'>
              <ScrollArea className='w-full pb-4 whitespace-nowrap'>
                <div className='flex gap-2'>
                  <Button
                    variant={activeCategory === 'popular' ? 'default' : 'ghost'}
                    size='sm'
                    onClick={() => setActiveCategory('popular')}
                    className='rounded-full px-4'
                  >
                    Popular
                  </Button>
                  <Separator orientation='vertical' className='mx-1 h-6' />
                  {(
                    Object.entries(TEMPLATE_CATEGORIES) as [
                      TemplateCategory,
                      (typeof TEMPLATE_CATEGORIES)[TemplateCategory]
                    ][]
                  ).map(([key, value]) => (
                    <Button
                      key={key}
                      variant={activeCategory === key ? 'secondary' : 'ghost'}
                      size='sm'
                      onClick={() => setActiveCategory(key)}
                      className={cn(
                        'rounded-full px-4 transition-all',
                        activeCategory === key &&
                          'bg-secondary text-secondary-foreground font-medium shadow-sm'
                      )}
                    >
                      <span className='mr-2 opacity-70'>
                        {CATEGORY_ICONS[key]}
                      </span>
                      {value.label}
                    </Button>
                  ))}
                </div>
              </ScrollArea>

              <div className='bg-muted/30 text-muted-foreground flex items-center gap-3 rounded-lg border p-3 text-sm'>
                <InfoIcon
                  category={activeCategory as TemplateCategory | 'popular'}
                />
                {activeCategory === 'popular'
                  ? 'Showing the most frequently used templates across our global network.'
                  : TEMPLATE_CATEGORIES[activeCategory as TemplateCategory]
                      .description}
              </div>
            </div>
          )}

          {/* Grid Content */}
          {filteredTemplates.length > 0 ? (
            <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'>
              {filteredTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  isSelected={selectedTemplateId === template.id}
                  onSelect={() => handleSelect(template)}
                  onViewDetails={() => setDetailTemplate(template)}
                />
              ))}
            </div>
          ) : (
            <div className='bg-muted/5 flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-16 text-center'>
              <div className='bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
                <Search className='text-muted-foreground/50 h-8 w-8' />
              </div>
              <h3 className='text-lg font-semibold'>No matching templates</h3>
              <p className='text-muted-foreground mt-2 mb-6 max-w-sm'>
                We couldn't find any templates matching "{searchQuery}" in{' '}
                {regionFilter === 'all' ? 'any region' : regionFilter}.
              </p>
              <Button
                variant='outline'
                onClick={() => {
                  setSearchQuery('');
                  setRegionFilter('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Details Sheet */}
      <TemplateDetailSheet
        template={detailTemplate}
        onClose={() => setDetailTemplate(null)}
        onSelect={() => detailTemplate && handleSelect(detailTemplate)}
        isSelected={detailTemplate?.id === selectedTemplateId}
      />
    </div>
  );
}

// Small helper for the info banner
function InfoIcon({ category }: { category: TemplateCategory | 'popular' }) {
  if (category === 'popular')
    return <Target className='text-primary h-4 w-4' />;
  return <Layout className='text-primary h-4 w-4' />;
}
