// Onboarding Feature Module
// =========================

// Main Flow Components
export { OnboardingFlow } from './OnboardingFlow';

// Components
export { EnhancedTemplateSelector } from './components/EnhancedTemplateSelector';
export { TemplateRecommendationWizard } from './components/TemplateRecommendationWizard';
export { CountrySelector } from './components/CountrySelector';
export { EducationLevelSelector } from './components/EducationLevelSelector';

// Hooks
export { useOnboarding } from './hooks/useOnboarding';

// Data & Types
export type { TemplateDefinition, TemplateCategory } from './data/templates';

export {
  TEMPLATE_CATEGORIES,
  EDUCATION_TEMPLATES,
  getTemplatesByCategory,
  getTemplatesByCountry,
  getTemplatesByLevel,
  searchTemplates,
  getPopularTemplates,
  getTemplateById
} from './data/templates';
