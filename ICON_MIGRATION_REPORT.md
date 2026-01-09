# Icon Migration Report

**Date:** January 9, 2026  
**Project:** SIS Client (Next.js)

## Summary

This report documents all icon imports across the codebase. The project is transitioning from **lucide-react** to **Solar icons** (via `@iconify/react`). The centralized `Icons` component at `@/components/icons` provides unified Solar icon exports.

---

## 1. FILES USING LUCIDE-REACT (Need Migration)

These files import directly from `lucide-react` and should be migrated to use the `Icons` component or direct `@iconify/react` Solar icons.

### **Features - Superadmin** (4 files)

| File | Line | Icons Imported |
|------|------|----------------|
| [src/features/superadmin/schools-management.tsx](src/features/superadmin/schools-management.tsx#L43-56) | 43-56 | `Building`, `Search`, `Plus`, `MoreHorizontal`, `Eye`, `Edit`, `Trash2`, `Ban`, `CheckCircle`, `Mail`, `RefreshCw`, `Download`, `Filter` |
| [src/features/superadmin/support-tickets.tsx](src/features/superadmin/support-tickets.tsx#L44-58) | 44-58 | `HeadphonesIcon`, `Search`, `MoreHorizontal`, `Eye`, `MessageSquare`, `CheckCircle`, `XCircle`, `Clock`, `AlertCircle`, `Filter`, `RefreshCw`, `Send`, `Paperclip`, `User` |
| [src/features/superadmin/pricing-management.tsx](src/features/superadmin/pricing-management.tsx#L38-50) | 38-50 | `CreditCard`, `Check`, `X`, `Edit`, `Save`, `Package`, `DollarSign`, `Users`, `Zap`, `Crown`, `Building`, `Infinity` |
| [src/features/superadmin/superadmin-dashboard.tsx](src/features/superadmin/superadmin-dashboard.tsx#L17-30) | 17-30 | `Building`, `Users`, `TrendingUp`, `AlertTriangle`, `Activity`, `Settings`, `HeadphonesIcon`, `CreditCard`, `UserCog`, `BarChart3`, `Shield`, `FileText` |

### **Features - Dashboards** (7 files)

| File | Line | Icons Imported |
|------|------|----------------|
| [src/features/dashboards/admin-dashboard_new.tsx](src/features/dashboards/admin-dashboard_new.tsx#L6) | 6 | `Users`, `BookOpen`, `GraduationCap`, `TrendingUp`, `AlertTriangle`, `Plus` |
| [src/features/dashboards/teacher-dashboard.tsx](src/features/dashboards/teacher-dashboard.tsx#L10) | 10 | `Users`, `Clock`, `FileText`, `TrendingUp`, `AlertTriangle`, `Plus` |
| [src/features/dashboards/student-dashboard.tsx](src/features/dashboards/student-dashboard.tsx#L10) | 10 | `BookOpen`, `FileText`, `Target`, `TrendingUp`, `Clock`, `AlertTriangle` |
| [src/features/dashboards/parent-dashboard.tsx](src/features/dashboards/parent-dashboard.tsx#L10) | 10 | `Users`, `TrendingUp`, `AlertTriangle`, `MessageSquare`, `Calendar`, `DollarSign` |
| [src/features/dashboards/counselor-dashboard.tsx](src/features/dashboards/counselor-dashboard.tsx#L10) | 10 | `Users`, `AlertTriangle`, `Target`, `TrendingUp`, `Calendar`, `MessageSquare` |
| [src/features/dashboards/accountant-dashboard.tsx](src/features/dashboards/accountant-dashboard.tsx#L10) | 10 | `DollarSign`, `TrendingUp`, `AlertTriangle`, `FileText`, `CreditCard`, `BarChart3` |

### **Features - Onboarding** (7 files)

| File | Line | Icons Imported |
|------|------|----------------|
| [src/features/onboarding/OnboardingFlow.tsx](src/features/onboarding/OnboardingFlow.tsx#L13-28) | 13-28 | `Loader2`, `AlertCircle`, `ArrowLeft`, `ArrowRight`, `Check`, `Upload`, `School`, `Sparkles`, `GraduationCap`, `BookOpen`, `Building`, `Rocket`, `Image`, `X` |
| [src/features/onboarding/components/TemplateRecommendationWizard.tsx](src/features/onboarding/components/TemplateRecommendationWizard.tsx#L19-35) | 19-35 | `Wand2`, `ArrowRight`, `ArrowLeft`, `Check`, `School`, `Globe`, `BookOpen`, `GraduationCap`, `FileText`, `Users`, `Target`, `Sparkles`, `BarChart`, `RefreshCcw`, `CheckCircle2` |
| [src/features/onboarding/components/EnhancedTemplateSelector.tsx](src/features/onboarding/components/EnhancedTemplateSelector.tsx#L34-51) | 34-51 | `Wand2`, `ChevronRight`, `Globe`, `School`, `GraduationCap`, `BookOpen`, `Sparkles`, `Heart`, `Wrench`, `Church`, `BarChart3`, `Calendar`, `Target`, `Layout`, `Filter`, `X` |
| [src/features/onboarding/components/StepWelcome.tsx](src/features/onboarding/components/StepWelcome.tsx#L13-20) | 13-20 | `Zap`, `Globe`, `GraduationCap`, `ArrowRight`, `LayoutTemplate`, `CheckCircle2` |
| [src/features/onboarding/components/StepSuccess.tsx](src/features/onboarding/components/StepSuccess.tsx#L6) | 6 | `CheckCircle2`, `ArrowRight`, `Users`, `BookOpen`, `LayoutDashboard` |
| [src/features/onboarding/components/OnboardingProgress.tsx](src/features/onboarding/components/OnboardingProgress.tsx#L3) | 3 | `CheckCircle2` |
| [src/features/onboarding/components/CountrySelector.tsx](src/features/onboarding/components/CountrySelector.tsx#L5) | 5 | `CheckCircle2` |
| [src/features/onboarding/components/EducationLevelSelector.tsx](src/features/onboarding/components/EducationLevelSelector.tsx#L4) | 4 | `CheckCircle2` |

### **Features - Products** (1 file)

| File | Line | Icons Imported |
|------|------|----------------|
| [src/features/products/components/product-tables/columns.tsx](src/features/products/components/product-tables/columns.tsx#L6) | 6 | `CheckCircle2`, `Text`, `XCircle` |

### **Components - Lib** (1 file)

| File | Line | Icons Imported |
|------|------|----------------|
| [src/lib/toast.tsx](src/lib/toast.tsx#L4-17) | 4-17 | `CheckCircle2`, `XCircle`, `AlertTriangle`, `Info`, `Loader2`, `Upload`, `Download`, `Trash2`, `UserPlus`, `Settings`, `Bell`, `Sparkles` |

### **Components - UI** (18 files)

| File | Line | Icons Imported |
|------|------|----------------|
| [src/components/ui/breadcrumb.tsx](src/components/ui/breadcrumb.tsx#L3) | 3 | `ChevronRight`, `MoreHorizontal` |
| [src/components/ui/checkbox.tsx](src/components/ui/checkbox.tsx#L5) | 5 | `CheckIcon` |
| [src/components/ui/command.tsx](src/components/ui/command.tsx#L5) | 5 | `SearchIcon` |
| [src/components/ui/dialog.tsx](src/components/ui/dialog.tsx#L5) | 5 | `XIcon` |
| [src/components/ui/context-menu.tsx](src/components/ui/context-menu.tsx#L5) | 5 | `CheckIcon`, `ChevronRightIcon`, `CircleIcon` |
| [src/components/ui/dropdown-menu.tsx](src/components/ui/dropdown-menu.tsx#L5) | 5 | `CheckIcon`, `ChevronRightIcon`, `CircleIcon` |
| [src/components/ui/accordion.tsx](src/components/ui/accordion.tsx#L5) | 5 | `ChevronDownIcon` |
| [src/components/ui/input-otp.tsx](src/components/ui/input-otp.tsx#L5) | 5 | `MinusIcon` |
| [src/components/ui/menubar.tsx](src/components/ui/menubar.tsx#L5) | 5 | `CheckIcon`, `ChevronRightIcon`, `CircleIcon` |
| [src/components/ui/navigation-menu.tsx](src/components/ui/navigation-menu.tsx#L4) | 4 | `ChevronDownIcon` |
| [src/components/ui/pagination.tsx](src/components/ui/pagination.tsx#L3-6) | 3-6 | `ChevronLeft`, `ChevronRight`, `MoreHorizontal` |
| [src/components/ui/radio-group.tsx](src/components/ui/radio-group.tsx#L5) | 5 | `CircleIcon` |
| [src/components/ui/resizable.tsx](src/components/ui/resizable.tsx#L4) | 4 | `GripVerticalIcon` |
| [src/components/ui/select.tsx](src/components/ui/select.tsx#L5) | 5 | `CheckIcon`, `ChevronDownIcon`, `ChevronUpIcon` |
| [src/components/ui/sidebar.tsx](src/components/ui/sidebar.tsx#L6) | 6 | `PanelLeftIcon` |
| [src/components/ui/sheet.tsx](src/components/ui/sheet.tsx#L5) | 5 | `XIcon` |
| [src/components/ui/table/data-table-column-header.tsx](src/components/ui/table/data-table-column-header.tsx#L4) | 4 | `EyeOff` |
| [src/components/ui/table/data-table-faceted-filter.tsx](src/components/ui/table/data-table-faceted-filter.tsx#L5) | 5 | `PlusCircle`, `XCircle` |
| [src/components/ui/table/data-table-slider-filter.tsx](src/components/ui/table/data-table-slider-filter.tsx#L17) | 17 | `PlusCircle`, `XCircle` |
| [src/components/ui/table/data-table-view-options.tsx](src/components/ui/table/data-table-view-options.tsx#L4) | 4 | `Settings2` |
| [src/components/ui/table/data-table-pagination.tsx](src/components/ui/table/data-table-pagination.tsx#L2) | 2 | `ChevronsLeft`, `ChevronsRight` |
| [src/components/ui/table/data-table-date-filter.tsx](src/components/ui/table/data-table-date-filter.tsx#L4) | 4 | `CalendarIcon`, `XCircle` |

### **Components - General** (15 files)

| File | Line | Icons Imported |
|------|------|----------------|
| [src/components/students/ConfigDrivenStudentForm.tsx](src/components/students/ConfigDrivenStudentForm.tsx#L15) | 15 | `Loader2`, `AlertCircle` |
| [src/components/module-settings.tsx](src/components/module-settings.tsx#L15) | 15 | `Lock`, `CheckCircle2`, `AlertCircle` |
| [src/components/module-guard.tsx](src/components/module-guard.tsx#L7) | 7 | `Lock` |
| [src/components/dashboard/shared-components.tsx](src/components/dashboard/shared-components.tsx#L8) | 8 | `LucideIcon`, `ArrowRight`, `TrendingUp`, `TrendingDown`, `Minus` |
| [src/components/grading/ConfigDrivenGradingForm.tsx](src/components/grading/ConfigDrivenGradingForm.tsx#L14) | 14 | `Loader2`, `AlertCircle` |
| [src/components/google-drive-integration.tsx](src/components/google-drive-integration.tsx#L15) | 15 | `AlertCircle`, `CheckCircle2`, `Loader2`, `Share2`, `ExternalLink`, `FolderOpen`, `FolderPlus`, `BookOpen` |
| [src/components/google-drive-status-card.tsx](src/components/google-drive-status-card.tsx#L12-19) | 12-19 | `AlertCircle`, `CheckCircle2`, `Loader2`, `LogOut`, `RefreshCw`, `Link` (as LinkIcon) |
| [src/components/undo-redo-controls.tsx](src/components/undo-redo-controls.tsx#L4) | 4 | `Undo2`, `Redo2` |
| [src/components/sheets/student-details-sheet.tsx](src/components/sheets/student-details-sheet.tsx#L16-31) | 16-31 | `User`, `Mail`, `Phone`, `MapPin`, `GraduationCap`, `Calendar`, `Edit`, `BookOpen`, `ShieldAlert`, `Clock`, `History`, `FileText`, `ClipboardList`, `Receipt` |
| [src/components/sheets/teacher-details-sheet.tsx](src/components/sheets/teacher-details-sheet.tsx#L15-28) | 15-28 | `User`, `Mail`, `Phone`, `MapPin`, `BookOpen`, `Calendar`, `Edit`, `Award`, `Building`, `Clock`, `Users`, `Plus` |
| [src/components/forms/add-class-dialog.tsx](src/components/forms/add-class-dialog.tsx#L21) | 21 | `Trash2`, `Plus` |
| [src/components/forms/bulk-upload-dialog.tsx](src/components/forms/bulk-upload-dialog.tsx#L15) | 15 | `AlertCircle`, `CheckCircle2`, `Upload`, `FileText`, `Loader2` |
| [src/components/forms/edit-student-dialog.tsx](src/components/forms/edit-student-dialog.tsx#L20) | 20 | `Loader2` |
| [src/components/forms/invite-user-dialog.tsx](src/components/forms/invite-user-dialog.tsx#L25) | 25 | `Loader2` |
| [src/components/forms/edit-teacher-dialog.tsx](src/components/forms/edit-teacher-dialog.tsx#L20) | 20 | `Loader2` |
| [src/components/forms/form-date-picker.tsx](src/components/forms/form-date-picker.tsx#L5) | 5 | `CalendarIcon` |
| [src/components/common/data-table.tsx](src/components/common/data-table.tsx#L31) | 31 | `ChevronLeft`, `ChevronRight`, `ChevronsLeft`, `ChevronsRight`, `Settings` |
| [src/components/common/stats-card.tsx](src/components/common/stats-card.tsx#L7) | 7 | `TrendingUp`, `TrendingDown`, `Minus` |
| [src/components/common/search-and-filter.tsx](src/components/common/search-and-filter.tsx#L14) | 14 | `Search`, `X`, `Filter` |
| [src/components/common/action-dropdown.tsx](src/components/common/action-dropdown.tsx#L13) | 13 | `MoreHorizontal`, `Eye`, `Edit`, `Trash2`, `UserX`, `UserCheck` |
| [src/components/calendar/calendar-header.tsx](src/components/calendar/calendar-header.tsx#L13) | 13 | `ChevronLeft`, `ChevronRight`, `Filter`, `Plus`, `CheckCircle2` |
| [src/components/calendar/event-dialog.tsx](src/components/calendar/event-dialog.tsx#L32-39) | 32-39 | `Calendar` (as CalendarIcon), `MapPin`, `Bell`, `MoreHorizontal`, `Edit`, `Trash2` |

### **App Pages** (21 files)

| File | Line | Icons Imported |
|------|------|----------------|
| [app/onboarding/page.tsx](app/onboarding/page.tsx#L5) | 5 | `Loader2` |
| [app/dashboard/invoices/page.tsx](app/dashboard/invoices/page.tsx#L48-56) | 48-56 | `Plus`, `MoreHorizontal`, `Download`, `Send`, `FileText`, `DollarSign`, `Clock` |
| [app/dashboard/support/page.tsx](app/dashboard/support/page.tsx#L11) | 11 | `Plus`, `Search`, `MessageCircle`, `AlertCircle`, `CheckCircle`, `Clock` |
| [app/dashboard/views/page.tsx](app/dashboard/views/page.tsx#L29) | 29 | `Plus`, `Share2`, `Copy`, `Trash2`, `Filter`, `Eye`, `X`, `Settings` |
| [app/dashboard/reports/page.tsx](app/dashboard/reports/page.tsx#L10) | 10 | `Plus` |
| [app/dashboard/teachers/page.tsx](app/dashboard/teachers/page.tsx#L25-45) | 25-45 | `Plus`, `Search`, `MoreHorizontal`, `Edit`, `Trash2`, `Eye`, `GraduationCap`, `ChevronUp`, `ChevronDown`, `Loader2`, `Upload` (duplicated in src/app) |
| [app/dashboard/reports/cards/page.tsx](app/dashboard/reports/cards/page.tsx#L32-48) | 32-48 | Multiple icons |
| [app/dashboard/settings/academic/page.tsx](app/dashboard/settings/academic/page.tsx#L44-54) | 44-54 | `Plus`, `Edit`, `Trash2`, `Calendar`, `CheckCircle`, `Clock`, `AlertCircle`, `Loader2`, `CalendarDays` |
| [app/dashboard/settings/users/page.tsx](app/dashboard/settings/users/page.tsx#L27) | 27 | `Plus`, `MoreHorizontal`, `Edit2`, `Shield`, `Lock`, `Trash2` |
| [app/dashboard/settings/integrations/page.tsx](app/dashboard/settings/integrations/page.tsx#L20-36) | 20-36 | Multiple icons |
| [app/dashboard/payments/page.tsx](app/dashboard/payments/page.tsx#L45-51) | 45-51 | `Plus`, `MoreHorizontal`, `CheckCircle2`, `AlertCircle`, `Clock`, `Receipt` |
| [app/dashboard/students/enroll/page.tsx](app/dashboard/students/enroll/page.tsx#L14) | 14 | `UserPlus`, `CheckCircle2`, `AlertCircle` |
| [app/dashboard/messages/page.tsx](app/dashboard/messages/page.tsx#L34-54) | 34-54 | `Plus`, `Send`, `Paperclip`, `MoreVertical`, `Trash2`, `Archive`, `Pin`, `Star`, `Check`, `CheckCheck`, `Clock`, `Users`, `MessageSquare`, `Bell`, `BellOff`, `Loader2`, `Image`, `File`, `Smile` |
| [app/dashboard/parents/page.tsx](app/dashboard/parents/page.tsx#L12-20) | 12-20 | `User`, `Mail`, `UserPlus`, `Link2`, `Edit`, `Trash2`, `Loader2` |
| [app/dashboard/classes/page.tsx](app/dashboard/classes/page.tsx#L33-47) | 33-47 | `Plus`, `Search`, `MoreHorizontal`, `Edit`, `Trash2`, `Eye`, `Users`, `Calendar`, `Clock`, `ChevronUp`, `ChevronDown`, `Loader2`, `Upload` |
| [app/dashboard/classes/timetable/page.tsx](app/dashboard/classes/timetable/page.tsx#L54-62) | 54-62 | `Plus`, `Clock`, `Edit`, `Trash2`, `Loader2`, `Calendar`, `MapPin` |
| [app/dashboard/classes/enrollment/page.tsx](app/dashboard/classes/enrollment/page.tsx#L55-65) | 55-65 | `Users`, `Plus`, `Trash2`, `Search`, `Loader2`, `UserPlus`, `GraduationCap`, `Filter`, `ChevronRight` |
| [app/dashboard/assessments/configs/page.tsx](app/dashboard/assessments/configs/page.tsx#L10) | 10 | `Plus` |
| [app/dashboard/assessments/gradebook/page.tsx](app/dashboard/assessments/gradebook/page.tsx#L35-54) | 35-54 | Multiple icons |
| [app/dashboard/assessments/create/page.tsx](app/dashboard/assessments/create/page.tsx#L35-52) | 35-52 | Multiple icons |
| [app/dashboard/alerts/page.tsx](app/dashboard/alerts/page.tsx#L54) | 54 | `AlertCircle`, `Bell`, `Plus`, `Trash2`, `Check`, `Eye` |

### **src/app Pages** (1 file)

| File | Line | Icons Imported |
|------|------|----------------|
| [src/app/dashboard/teachers/page.tsx](src/app/dashboard/teachers/page.tsx#L33-45) | 33-45 | `Plus`, `Search`, `MoreHorizontal`, `Edit`, `Trash2`, `Eye`, `GraduationCap`, `ChevronUp`, `ChevronDown`, `Loader2`, `Upload` |

---

## 2. FILES USING @iconify/react (Correctly Using Solar Icons)

These files are correctly using `@iconify/react` directly with Solar icons.

### **src/components** (15 files)
- [src/components/icons.tsx](src/components/icons.tsx#L1) - **Central Icons component**
- [src/components/notification-bell.tsx](src/components/notification-bell.tsx#L3)
- [src/components/org-switcher.tsx](src/components/org-switcher.tsx#L3)
- [src/components/nav-projects.tsx](src/components/nav-projects.tsx#L26)
- [src/components/nav-main.tsx](src/components/nav-main.tsx#L21)
- [src/components/module-header.tsx](src/components/module-header.tsx#L3)
- [src/components/layout/header.tsx](src/components/layout/header.tsx#L9)
- [src/components/layout/user-nav.tsx](src/components/layout/user-nav.tsx#L16)
- [src/components/layout/app-sidebar.tsx](src/components/layout/app-sidebar.tsx#L37)
- [src/components/kbar/index.tsx](src/components/kbar/index.tsx#L17)
- [src/components/kbar/result-item.tsx](src/components/kbar/result-item.tsx#L1)
- [src/components/empty-state.tsx](src/components/empty-state.tsx#L6)
- [src/components/dashboard/upcoming-events.tsx](src/components/dashboard/upcoming-events.tsx#L6)
- [src/components/dashboard/stat-card.tsx](src/components/dashboard/stat-card.tsx#L5)
- [src/components/dashboard/recent-activity.tsx](src/components/dashboard/recent-activity.tsx#L5)
- [src/components/dashboard/quick-actions.tsx](src/components/dashboard/quick-actions.tsx#L5)
- [src/components/common/page-header.tsx](src/components/common/page-header.tsx#L7)

### **src/lib** (1 file)
- [src/lib/module-colors.tsx](src/lib/module-colors.tsx#L3)

### **src/features** (1 file)
- [src/features/dashboards/admin-dashboard.tsx](src/features/dashboards/admin-dashboard.tsx#L9)

### **app pages** (6 files)
- [app/page.tsx](app/page.tsx#L3)
- [app/dashboard/overview/page.tsx](app/dashboard/overview/page.tsx#L16)
- [app/dashboard/fees/page.tsx](app/dashboard/fees/page.tsx#L48)
- [app/dashboard/documents/page.tsx](app/dashboard/documents/page.tsx#L28)
- [app/dashboard/audit/page.tsx](app/dashboard/audit/page.tsx#L5)
- [app/dashboard/attendance/page.tsx](app/dashboard/attendance/page.tsx#L47)

---

## 3. FILES USING @/components/icons (Using Central Icons)

These files correctly import from the central `Icons` component.

### **src** (5 files)
- [src/types/index.ts](src/types/index.ts#L1)
- [src/features/auth/components/github-auth-button.tsx](src/features/auth/components/github-auth-button.tsx#L5)
- [src/components/notification-bell.tsx](src/components/notification-bell.tsx#L4)
- [src/components/empty-state.tsx](src/components/empty-state.tsx#L3)
- [src/components/common/page-header.tsx](src/components/common/page-header.tsx#L5)

### **app** (6 files)
- [app/dashboard/analytics/page.tsx](app/dashboard/analytics/page.tsx#L10)
- [app/dashboard/students/page.tsx](app/dashboard/students/page.tsx#L17)
- [app/dashboard/overview/page.tsx](app/dashboard/overview/page.tsx#L21)
- [app/dashboard/fees/page.tsx](app/dashboard/fees/page.tsx#L43)
- [app/dashboard/attendance/page.tsx](app/dashboard/attendance/page.tsx#L42)
- [app/dashboard/assessments/page.tsx](app/dashboard/assessments/page.tsx#L10)

---

## 4. ICONS COMPONENT ANALYSIS

### Current Exports in `@/components/icons`

The `Icons` component at [src/components/icons.tsx](src/components/icons.tsx) exports the following icons mapped to Solar equivalents:

**Core Navigation:**
- `dashboard` / `LayoutDashboard` → solar:widget-2-bold-duotone
- `logo` → solar:medal-star-bold-duotone
- `login` → solar:login-3-bold-duotone
- `close` → solar:close-circle-bold-duotone
- `product` → solar:bag-2-bold-duotone
- `spinner` → solar:refresh-bold-duotone (animated)
- `kanban` → solar:clapperboard-edit-bold-duotone
- `chevronLeft` → solar:alt-arrow-left-bold-duotone
- `chevronRight` → solar:alt-arrow-right-bold-duotone
- `trash` → solar:trash-bin-trash-bold-duotone
- `employee` → solar:user-cross-bold-duotone
- `post` → solar:document-text-bold-duotone
- `page` → solar:document-bold-duotone
- `userPen` → solar:user-hand-up-bold-duotone
- `user2` → solar:user-circle-bold-duotone
- `media` → solar:gallery-bold-duotone
- `settings` / `Settings` → solar:settings-minimalistic-bold-duotone
- `billing` → solar:card-2-bold-duotone
- `ellipsis` → solar:menu-dots-bold-duotone
- `add` → solar:add-circle-bold-duotone
- `warning` → solar:danger-triangle-bold-duotone
- `user` / `User` → solar:user-rounded-bold-duotone
- `arrowRight` → solar:arrow-right-bold-duotone
- `help` / `HelpCircle` → solar:help-bold-duotone
- `sun` → solar:sun-2-bold-duotone
- `moon` → solar:moon-sleep-bold-duotone
- `check` → solar:check-circle-bold-duotone

**Sidebar Icons:**
- `Users` → solar:users-group-rounded-bold-duotone
- `Building` → solar:buildings-2-bold-duotone
- `HeadphonesIcon` → solar:headphones-round-bold-duotone
- `CreditCard` → solar:card-2-bold-duotone
- `Activity` → solar:pulse-bold-duotone
- `Plug` → solar:plug-circle-bold-duotone
- `Bell` → solar:bell-bing-bold-duotone
- `FileText` → solar:document-text-bold-duotone
- `UserCheck` → solar:user-check-rounded-bold-duotone
- `GraduationCap` → solar:square-academic-cap-bold-duotone
- `BookOpen` → solar:book-2-bold-duotone
- `BarChart2` / `BarChart3` → solar:chart-square-bold-duotone
- `TrendingUp` → solar:graph-up-duotone
- `Calendar` → solar:calendar-date-duotone
- `Bookmark` → solar:bookmark-duotone
- `File` → solar:document-duotone
- `Receipt` → solar:receipt-duotone
- `DollarSign` → solar:card-2-duotone
- `chevronDown` → solar:alt-arrow-down-duotone

**Additional Common:**
- `Plus` → solar:add-circle-duotone
- `Share2` → solar:share-duotone
- `Copy` → solar:copy-duotone
- `Trash2` → solar:trash-bin-trash-duotone
- `Filter` → solar:filter-duotone
- `Eye` → solar:eye-duotone
- `X` → solar:close-circle-duotone
- `UserPlus` → solar:user-plus-duotone
- `CheckCircle2` → solar:check-circle-duotone
- `AlertCircle` → solar:danger-circle-duotone
- `MessageCircle` → solar:chat-line-duotone
- `Clock` → solar:clock-circle-duotone
- `Edit2` / `Edit` → solar:pen-2-duotone
- `Shield` → solar:shield-keyhole-duotone
- `Lock` → solar:lock-password-duotone
- `Search` → solar:magnifer-duotone
- `MoreHorizontal` → solar:menu-dots-bold-duotone
- `Upload` → solar:upload-duotone
- `ChevronUp` → solar:alt-arrow-up-duotone
- `ChevronDown` → solar:alt-arrow-down-duotone
- `ShieldAlert` → solar:shield-warning-duotone
- `logout` → solar:logout-2-bold-duotone
- `github` → solar:github-bold-duotone

---

## 5. MISSING ICON EXPORTS (Need to Add to Icons Component)

The following lucide-react icons are used across the codebase but **NOT exported** from the `Icons` component:

### High Priority (Frequently Used)
| Icon | Used In (count) | Solar Alternative |
|------|-----------------|-------------------|
| `Loader2` | 15+ files | `solar:spinner-duotone` (animated) |
| `AlertTriangle` | 8+ files | `solar:danger-triangle-duotone` (already as `warning`) |
| `ChevronLeft` | 5+ files | Already exists as `chevronLeft` |
| `ChevronRight` | 5+ files | Already exists as `chevronRight` |
| `MoreHorizontal` | 10+ files | Already exists |
| `Search` | 5+ files | Already exists |
| `Trash2` | 10+ files | Already exists |
| `Edit` | 10+ files | Already exists as `Edit2` |
| `Eye` | 8+ files | Already exists |
| `Plus` | 15+ files | Already exists |
| `Download` | 3+ files | `solar:download-duotone` |
| `Send` | 3+ files | `solar:plain-duotone` |
| `RefreshCw` / `RefreshCcw` | 3+ files | `solar:refresh-duotone` |
| `XCircle` | 4+ files | `solar:close-circle-duotone` |
| `CheckCircle` | 5+ files | Already as `CheckCircle2` |

### Medium Priority
| Icon | Solar Alternative |
|------|-------------------|
| `ArrowLeft` | `solar:arrow-left-duotone` |
| `ArrowRight` | Already exists as `arrowRight` |
| `Mail` | `solar:letter-duotone` |
| `Phone` | `solar:phone-duotone` |
| `MapPin` | `solar:map-point-duotone` |
| `School` | `solar:buildings-2-duotone` |
| `Sparkles` | `solar:stars-duotone` |
| `Rocket` | `solar:rocket-2-duotone` |
| `Globe` | `solar:global-duotone` |
| `Target` | `solar:target-duotone` |
| `MessageSquare` | `solar:chat-square-duotone` |
| `Paperclip` | `solar:paperclip-2-duotone` |
| `Image` | `solar:gallery-duotone` |
| `Archive` | `solar:archive-duotone` |
| `Pin` | `solar:pin-duotone` |
| `Star` | `solar:star-duotone` |
| `Ban` | `solar:forbidden-duotone` |
| `Info` | `solar:info-circle-duotone` |
| `LogOut` | Already as `logout` |
| `ExternalLink` | `solar:square-top-down-duotone` |
| `FolderOpen` | `solar:folder-open-duotone` |
| `FolderPlus` | `solar:add-folder-duotone` |
| `Award` | `solar:medal-ribbon-duotone` |
| `History` | `solar:history-duotone` |
| `ClipboardList` | `solar:clipboard-list-duotone` |
| `Wand2` | `solar:magic-stick-3-duotone` |
| `Layout` | `solar:widget-duotone` |
| `LayoutTemplate` | `solar:widget-add-duotone` |
| `LayoutDashboard` | Already exists |
| `Zap` | `solar:bolt-duotone` |
| `Crown` | `solar:crown-duotone` |
| `Heart` | `solar:heart-duotone` |
| `Wrench` | `solar:wrench-duotone` |
| `Church` | `solar:buildings-2-duotone` (alternative) |
| `Package` | `solar:box-duotone` |
| `Infinity` | `solar:infinity-duotone` |
| `Save` | `solar:diskette-duotone` |
| `UserCog` | `solar:user-id-duotone` |
| `Text` | `solar:text-duotone` |
| `Undo2` | `solar:undo-left-round-duotone` |
| `Redo2` | `solar:undo-right-round-duotone` |
| `Link2` | `solar:link-duotone` |
| `ChevronsLeft` | `solar:double-alt-arrow-left-duotone` |
| `ChevronsRight` | `solar:double-alt-arrow-right-duotone` |
| `CalendarDays` | `solar:calendar-duotone` |
| `Check` | `solar:check-read-duotone` |
| `CheckCheck` | `solar:check-read-duotone` |
| `MoreVertical` | `solar:menu-dots-bold` (vertical variant) |
| `File` | Already exists |
| `Smile` | `solar:smile-circle-duotone` |
| `BellOff` | `solar:bell-off-duotone` |
| `EyeOff` | `solar:eye-closed-duotone` |
| `PlusCircle` | Already as `Plus` |
| `Settings2` | Already as `Settings` |
| `GripVertical` | `solar:hamburger-menu-duotone` |
| `PanelLeft` | `solar:sidebar-minimalistic-duotone` |
| `Minus` | `solar:minus-duotone` |

### UI Component Specific (shadcn/ui)
| Icon | Component | Notes |
|------|-----------|-------|
| `CheckIcon` | checkbox, context-menu, dropdown-menu, menubar | Keep lucide for shadcn primitives |
| `ChevronRightIcon` | context-menu, dropdown-menu, menubar | Keep lucide for shadcn primitives |
| `ChevronDownIcon` | accordion, navigation-menu, select | Keep lucide for shadcn primitives |
| `ChevronUpIcon` | select | Keep lucide for shadcn primitives |
| `CircleIcon` | context-menu, dropdown-menu, menubar, radio-group | Keep lucide for shadcn primitives |
| `SearchIcon` | command | Keep lucide for shadcn primitives |
| `XIcon` | dialog, sheet | Keep lucide for shadcn primitives |
| `MinusIcon` | input-otp | Keep lucide for shadcn primitives |

---

## 6. RECOMMENDATIONS

### Immediate Actions

1. **Add Missing Icons to `Icons` Component**
   - Add `Loader2` (high usage) → Use `Icons.spinner` or create new `Icons.loader`
   - Add `Download` → `solar:download-duotone`
   - Add `Send` → `solar:plain-duotone`
   - Add `Mail`, `Phone`, `MapPin` for profile components
   - Add `RefreshCw` → `solar:refresh-duotone`

2. **Update Feature Files First**
   - Start with dashboards (7 files) - consistent pattern
   - Then onboarding (7 files) - self-contained feature
   - Then superadmin (4 files)

3. **Keep Lucide in UI Components**
   - The shadcn/ui components (`checkbox`, `dialog`, `select`, etc.) should keep using lucide-react for consistency with the shadcn ecosystem

4. **Create Migration Script**
   - Find and replace common patterns:
     - `import { X } from 'lucide-react'` → `import { Icons } from '@/components/icons'` + use `<Icons.X />`

### Files to Prioritize

**Highest Priority (Feature Files):**
1. Dashboard files (7 files)
2. Superadmin files (4 files)
3. Onboarding files (7 files)

**Medium Priority (App Pages):**
1. [app/dashboard/messages/page.tsx](app/dashboard/messages/page.tsx) (20 icons)
2. [app/dashboard/classes/page.tsx](app/dashboard/classes/page.tsx) (13 icons)
3. [app/dashboard/invoices/page.tsx](app/dashboard/invoices/page.tsx) (7 icons)

**Lower Priority (Keep as-is):**
- UI components in `src/components/ui/` - Keep using lucide-react

---

## 7. STATISTICS

| Category | Count |
|----------|-------|
| Files using lucide-react | **65+** |
| Files using @iconify/react | **25** |
| Files using @/components/icons | **11** |
| Unique lucide icons used | **80+** |
| Icons in Icons component | **~60** |
| Missing icon exports | **~40** |

---

## 8. INCONSISTENCIES FOUND

1. **Duplicate Teacher Pages:**
   - [app/dashboard/teachers/page.tsx](app/dashboard/teachers/page.tsx)
   - [src/app/dashboard/teachers/page.tsx](src/app/dashboard/teachers/page.tsx)
   Both have identical lucide imports

2. **Mixed Icon Systems:**
   - [src/components/notification-bell.tsx](src/components/notification-bell.tsx) imports BOTH `@iconify/react` AND `@/components/icons`
   - [src/components/common/page-header.tsx](src/components/common/page-header.tsx) imports BOTH `@iconify/react` AND `@/components/icons`

3. **Inconsistent Naming:**
   - `Check` vs `CheckCircle` vs `CheckCircle2` used interchangeably
   - `X` vs `XCircle` vs `XIcon` used interchangeably
   - `Edit` vs `Edit2` naming inconsistency

4. **Type Import:**
   - [src/components/dashboard/shared-components.tsx](src/components/dashboard/shared-components.tsx) imports `LucideIcon` type from lucide-react
