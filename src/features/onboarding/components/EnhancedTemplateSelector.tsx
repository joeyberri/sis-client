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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  k12_standard: <School className="w-4 h-4" />,
  k12_montessori: <Sparkles className="w-4 h-4" />,
  k12_international: <Globe className="w-4 h-4" />,
  k12_religious: <Church className="w-4 h-4" />,
  vocational: <Wrench className="w-4 h-4" />,
  higher_education: <GraduationCap className="w-4 h-4" />,
  special_education: <Heart className="w-4 h-4" />,
  tutoring_center: <BookOpen className="w-4 h-4" />,
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

function TemplateDetailSheet({ template, onClose, onSelect, isSelected }: TemplateDetailSheetProps) {
  if (!template) return null;

  const visualAidTag = getTemplateVisualAid(template);

  return (
    <Sheet open={!!template} onOpenChange={onClose}>
      <SheetContent className="w-full sm:w-[540px] flex flex-col p-0 gap-0">
        <ScrollArea className="flex-1 h-full">
          <div className="p-6">
            {/* Header */}
            <SheetHeader className="pb-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-4xl border border-primary/10">
                  {template.emoji}
                </div>
                <div className="space-y-1">
                  <Badge variant="outline" className="mb-1">{template.category.replace('_', ' ').toUpperCase()}</Badge>
                  <SheetTitle className="text-2xl">{template.name}</SheetTitle>
                  <SheetDescription>{template.country} • {template.educationLevel}</SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <div className="space-y-8">
              {/* About Section */}
              <section className="space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Layout className="w-4 h-4 text-primary" /> Structure Overview
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {template.detailedDescription}
                </p>
                
                {/* Visual Aid Trigger */}
                {visualAidTag && (
                  <div className="mt-4 p-4 bg-muted/30 border border-dashed rounded-lg text-xs text-muted-foreground text-center italic">
                    <span className="block mb-1 font-semibold not-italic">Structure Visualization</span>
                    {visualAidTag}
                  </div>
                )}
              </section>

              <Separator />

              {/* Technical Details Grid */}
              <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <Card className="bg-muted/20 border-none shadow-none">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <BarChart3 className="w-3 h-3" /> Grading System
                      </div>
                      <p className="text-sm font-medium">{template.gradingSystem.description}</p>
                    </CardContent>
                 </Card>
                 <Card className="bg-muted/20 border-none shadow-none">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <Calendar className="w-3 h-3" /> Schedule Format
                      </div>
                      <p className="text-sm font-medium">{template.academicCalendar.description}</p>
                    </CardContent>
                 </Card>
              </section>

              {/* Sample Curriculum */}
              <section>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" /> Default Subjects
                </h4>
                <div className="flex flex-wrap gap-2">
                  {template.sampleCurriculum.map((subject, i) => (
                    <Badge key={i} variant="secondary" className="px-3 py-1 bg-secondary/50">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </section>

              <Separator />

              {/* Pros/Cons */}
              <section className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-green-600 uppercase tracking-wide">Best For</h4>
                  <ul className="space-y-2">
                    {template.idealFor.map((item, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <CheckCircle2 className="w-3 h-3 mt-1 text-green-600 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-orange-600 uppercase tracking-wide">Considerations</h4>
                  <ul className="space-y-2">
                    {template.notIdealFor.map((item, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />
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
        <div className="p-6 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Button 
            onClick={onSelect} 
            className="w-full h-12 text-lg" 
            variant={isSelected ? "secondary" : "default"}
            disabled={isSelected}
          >
            {isSelected ? (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2 text-green-600" />
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

function TemplateCard({ template, isSelected, onSelect, onViewDetails }: TemplateCardProps) {
  return (
    <Card 
      className={cn(
        "group relative flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer",
        isSelected 
          ? "border-primary ring-1 ring-primary bg-primary/5 shadow-md" 
          : "hover:border-primary/50"
      )}
      onClick={onSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="w-12 h-12 rounded-lg bg-background border shadow-sm flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
            {template.emoji}
          </div>
          {isSelected && (
            <span className="absolute top-4 right-4 flex items-center gap-1.5 text-xs font-medium text-primary bg-background px-2 py-1 rounded-full shadow-sm ring-1 ring-border">
              <CheckCircle2 className="w-3.5 h-3.5 fill-primary text-white" />
              Selected
            </span>
          )}
        </div>
        <div className="mt-4">
          <CardTitle className="text-base font-semibold leading-tight mb-1">
            {template.name}
          </CardTitle>
          <CardDescription className="flex items-center gap-2 text-xs">
            <span className="inline-block w-2 h-2 rounded-full bg-muted-foreground/30" />
            {template.country}
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 pb-3">
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {template.description}
        </p>
      </CardContent>
      
      <CardFooter className="pt-0 flex items-center gap-2 mt-auto">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex-1 justify-between text-muted-foreground group-hover:text-primary transition-colors pl-2"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails();
          }}
        >
          Details
          <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
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
  const [activeCategory, setActiveCategory] = useState<TemplateCategory | 'popular'>('popular');
  const [detailTemplate, setDetailTemplate] = useState<TemplateDefinition | null>(null);

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
      results = results.filter(t => t.country.toLowerCase().includes(regionFilter.toLowerCase()));
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
    <div className="space-y-6">
      {/* Top Bar: Wizard Toggle & Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-end md:items-center">
        <div className="flex-1 w-full flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search curriculum, country, or system..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-background"
            />
          </div>
          
          {/* Region Filter - Visual Aid:  is implied here by the globe icon */}
          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger className="w-[140px] md:w-[180px] h-10">
              <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="international">International</SelectItem>
              <SelectItem value="asia">Asia</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant={activeTab === 'wizard' ? 'secondary' : 'outline'}
          onClick={() => setActiveTab(activeTab === 'wizard' ? 'browse' : 'wizard')}
          className="shrink-0 h-10"
        >
          <Wand2 className="w-4 h-4 mr-2" />
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
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          
          {/* Category Tabs */}
          {!searchQuery && (
            <div className="relative">
              <ScrollArea className="w-full whitespace-nowrap pb-4">
                <div className="flex gap-2">
                  <Button
                    variant={activeCategory === 'popular' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveCategory('popular')}
                    className="rounded-full px-4"
                  >
                    Popular
                  </Button>
                  <Separator orientation="vertical" className="h-6 mx-1" />
                  {(Object.entries(TEMPLATE_CATEGORIES) as [TemplateCategory, typeof TEMPLATE_CATEGORIES[TemplateCategory]][]).map(([key, value]) => (
                    <Button
                      key={key}
                      variant={activeCategory === key ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() => setActiveCategory(key)}
                      className={cn(
                        "rounded-full px-4 transition-all",
                        activeCategory === key && "bg-secondary text-secondary-foreground font-medium shadow-sm"
                      )}
                    >
                      <span className="mr-2 opacity-70">{CATEGORY_ICONS[key]}</span>
                      {value.label}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="bg-muted/30 border rounded-lg p-3 text-sm text-muted-foreground flex items-center gap-3">
                 <InfoIcon category={activeCategory as TemplateCategory | 'popular'} />
                 {activeCategory === 'popular' 
                    ? "Showing the most frequently used templates across our global network."
                    : TEMPLATE_CATEGORIES[activeCategory as TemplateCategory].description
                 }
              </div>
            </div>
          )}

          {/* Grid Content */}
          {filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
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
            <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed rounded-xl bg-muted/5 text-center px-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h3 className="font-semibold text-lg">No matching templates</h3>
              <p className="text-muted-foreground max-w-sm mt-2 mb-6">
                We couldn't find any templates matching "{searchQuery}" in {regionFilter === 'all' ? 'any region' : regionFilter}.
              </p>
              <Button variant="outline" onClick={() => { setSearchQuery(''); setRegionFilter('all'); }}>
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
  if (category === 'popular') return <Target className="w-4 h-4 text-primary" />;
  return <Layout className="w-4 h-4 text-primary" />;
}