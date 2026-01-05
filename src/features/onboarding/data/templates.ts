/**
 * Template category definitions for education systems worldwide
 * Organized by institution type rather than just country/level
 */

export type TemplateCategory = 
  | 'k12_standard'
  | 'k12_montessori'
  | 'k12_international'
  | 'k12_religious'
  | 'vocational'
  | 'higher_education'
  | 'special_education'
  | 'tutoring_center';

export interface TemplateDefinition {
  id: string;
  name: string;
  category: TemplateCategory;
  country: string;
  countryCode: string;
  educationLevel: string;
  description: string;
  detailedDescription: string;
  emoji: string;
  icon: string; // Lucide icon name
  features: string[];
  sampleCurriculum: string[];
  gradingSystem: {
    type: 'letter' | 'percentage' | 'gpa' | 'descriptive' | 'points';
    description: string;
  };
  academicCalendar: {
    type: 'semester' | 'trimester' | 'quarter' | 'term';
    description: string;
  };
  assessmentStyle: {
    type: 'exam_heavy' | 'continuous' | 'project_based' | 'mixed';
    description: string;
  };
  idealFor: string[];
  notIdealFor: string[];
  popularity: number; // 1-5 for sorting
  tags: string[];
}

export const TEMPLATE_CATEGORIES: Record<TemplateCategory, { label: string; description: string; icon: string }> = {
  k12_standard: {
    label: 'K-12 Standard',
    description: 'Traditional primary and secondary schools following national curricula',
    icon: 'School',
  },
  k12_montessori: {
    label: 'Montessori & Alternative',
    description: 'Child-centered education with self-directed learning approaches',
    icon: 'Sparkles',
  },
  k12_international: {
    label: 'International Schools',
    description: 'IB, Cambridge, and other international curricula',
    icon: 'Globe',
  },
  k12_religious: {
    label: 'Religious Schools',
    description: 'Faith-based education with integrated religious studies',
    icon: 'Church',
  },
  vocational: {
    label: 'Vocational & Technical',
    description: 'Trade schools and career-focused technical training',
    icon: 'Wrench',
  },
  higher_education: {
    label: 'Higher Education',
    description: 'Universities, colleges, and post-secondary institutions',
    icon: 'GraduationCap',
  },
  special_education: {
    label: 'Special Education',
    description: 'Schools supporting students with diverse learning needs',
    icon: 'Heart',
  },
  tutoring_center: {
    label: 'Tutoring & Test Prep',
    description: 'Supplementary education and examination preparation',
    icon: 'BookOpen',
  },
};

export const EDUCATION_TEMPLATES: TemplateDefinition[] = [
  // ============================================
  // GHANA TEMPLATES
  // ============================================
  {
    id: 'gh_primary',
    name: 'Ghana Primary School',
    category: 'k12_standard',
    country: 'Ghana',
    countryCode: 'GH',
    educationLevel: 'primary',
    emoji: '🇬🇭',
    icon: 'School',
    description: 'GES curriculum for primary education (Basic 1-6)',
    detailedDescription: 'Complete Ghana Education Service primary curriculum covering Basic 1 through Basic 6. Includes standardized subjects, BECE preparation foundations, and the national grading system.',
    features: [
      'GES-Approved Curriculum',
      'BECE Foundation',
      'Ghanaian Languages',
      'Term-Based Calendar',
      '10-Point Grading Scale',
    ],
    sampleCurriculum: [
      'English Language',
      'Mathematics',
      'Integrated Science',
      'Social Studies',
      'Ghanaian Language',
      'ICT',
      'Religious & Moral Education',
      'Creative Arts',
      'Physical Education',
    ],
    gradingSystem: {
      type: 'points',
      description: '1-10 scale (1 = Excellent, 10 = Fail)',
    },
    academicCalendar: {
      type: 'term',
      description: '3 terms per year (Sept-Dec, Jan-Apr, May-Jul)',
    },
    assessmentStyle: {
      type: 'mixed',
      description: '30% Continuous Assessment, 70% End-of-Term Exams',
    },
    idealFor: [
      'Government primary schools',
      'Private primaries following GES',
      'Schools preparing for BECE',
    ],
    notIdealFor: [
      'International curriculum schools',
      'Montessori schools',
    ],
    popularity: 5,
    tags: ['ghana', 'primary', 'ges', 'bece', 'west-africa'],
  },
  {
    id: 'gh_jhs',
    name: 'Ghana Junior High School',
    category: 'k12_standard',
    country: 'Ghana',
    countryCode: 'GH',
    educationLevel: 'jhs',
    emoji: '🇬🇭',
    icon: 'School',
    description: 'GES curriculum for JHS (Basic 7-9) with BECE preparation',
    detailedDescription: 'Comprehensive Junior High School curriculum aligned with Ghana Education Service standards. Includes intensive BECE examination preparation and career guidance components.',
    features: [
      'BECE Preparation Track',
      'Career Guidance',
      'Elective Subjects',
      'Mock Examinations',
      'GES Grading System',
    ],
    sampleCurriculum: [
      'English Language',
      'Mathematics',
      'Integrated Science',
      'Social Studies',
      'Ghanaian Language',
      'ICT',
      'RME',
      'French (Elective)',
      'Pre-Technical Skills',
      'Basic Design & Technology',
    ],
    gradingSystem: {
      type: 'points',
      description: '1-10 scale with BECE aggregate scoring',
    },
    academicCalendar: {
      type: 'term',
      description: '3 terms with BECE in June',
    },
    assessmentStyle: {
      type: 'exam_heavy',
      description: 'Focus on BECE exam preparation with continuous assessment',
    },
    idealFor: [
      'Government JHS schools',
      'Private JHS following GES',
      'BECE preparation focus',
    ],
    notIdealFor: [
      'International schools',
      'Alternative education approaches',
    ],
    popularity: 5,
    tags: ['ghana', 'jhs', 'ges', 'bece', 'examination'],
  },
  {
    id: 'gh_shs',
    name: 'Ghana Senior High School',
    category: 'k12_standard',
    country: 'Ghana',
    countryCode: 'GH',
    educationLevel: 'shs',
    emoji: '🇬🇭',
    icon: 'GraduationCap',
    description: 'GES curriculum for SHS with WASSCE preparation',
    detailedDescription: 'Full Senior High School curriculum with program tracks (General Arts, Science, Business, etc.). Includes WASSCE examination preparation and university placement guidance.',
    features: [
      'WASSCE Preparation',
      'Program Tracks (Science, Arts, Business)',
      'Elective Combinations',
      'University Placement',
      'GES Grading + WASSCE Grades',
    ],
    sampleCurriculum: [
      'Core English',
      'Core Mathematics',
      'Integrated Science',
      'Social Studies',
      'Elective 1',
      'Elective 2',
      'Elective 3',
      'Elective 4',
    ],
    gradingSystem: {
      type: 'letter',
      description: 'A1-F9 WASSCE grading scale',
    },
    academicCalendar: {
      type: 'term',
      description: '3 terms with WASSCE in April-June',
    },
    assessmentStyle: {
      type: 'exam_heavy',
      description: 'Heavy focus on WASSCE with continuous assessment',
    },
    idealFor: [
      'Government SHS',
      'Private SHS following GES',
      'WASSCE preparation',
    ],
    notIdealFor: [
      'International baccalaureate schools',
      'A-Level focused schools',
    ],
    popularity: 5,
    tags: ['ghana', 'shs', 'ges', 'wassce', 'university-prep'],
  },

  // ============================================
  // NIGERIA TEMPLATES
  // ============================================
  {
    id: 'ng_primary',
    name: 'Nigeria Primary School',
    category: 'k12_standard',
    country: 'Nigeria',
    countryCode: 'NG',
    educationLevel: 'primary',
    emoji: '🇳🇬',
    icon: 'School',
    description: 'Nigerian 6-year primary education curriculum',
    detailedDescription: 'Complete Nigerian primary curriculum from Primary 1-6. Aligned with NERDC standards and Common Entrance Examination preparation.',
    features: [
      'NERDC Curriculum',
      'Common Entrance Prep',
      'Nigerian Languages',
      'Term System',
      'Percentage Grading',
    ],
    sampleCurriculum: [
      'English Language',
      'Mathematics',
      'Basic Science',
      'Social Studies',
      'Civic Education',
      'Nigerian Language',
      'Computer Studies',
      'Christian/Islamic Religious Studies',
      'Creative & Cultural Arts',
    ],
    gradingSystem: {
      type: 'percentage',
      description: 'A (70-100), B (60-69), C (50-59), D (40-49), F (<40)',
    },
    academicCalendar: {
      type: 'term',
      description: '3 terms (Sept-Dec, Jan-Apr, May-Jul)',
    },
    assessmentStyle: {
      type: 'mixed',
      description: '40% CA, 60% Exam typical split',
    },
    idealFor: [
      'Nigerian public schools',
      'Private schools following NERDC',
      'Common entrance preparation',
    ],
    notIdealFor: [
      'British curriculum schools',
      'American curriculum schools',
    ],
    popularity: 4,
    tags: ['nigeria', 'primary', 'nerdc', 'west-africa'],
  },
  {
    id: 'ng_secondary',
    name: 'Nigeria Secondary School',
    category: 'k12_standard',
    country: 'Nigeria',
    countryCode: 'NG',
    educationLevel: 'secondary',
    emoji: '🇳🇬',
    icon: 'GraduationCap',
    description: 'Nigerian JSS/SSS curriculum with WAEC/NECO preparation',
    detailedDescription: 'Complete 6-year secondary education covering JSS 1-3 and SSS 1-3. Includes WAEC and NECO examination preparation, JAMB guidance.',
    features: [
      'WAEC/NECO Preparation',
      'JAMB Readiness',
      'Science/Arts/Commercial Tracks',
      'SSCE Grading',
      'Practical Assessments',
    ],
    sampleCurriculum: [
      'English Language',
      'Mathematics',
      'Physics',
      'Chemistry',
      'Biology',
      'Economics',
      'Government',
      'Literature',
      'Technical Drawing',
      'Computer Studies',
    ],
    gradingSystem: {
      type: 'letter',
      description: 'A1-F9 WAEC grading scale',
    },
    academicCalendar: {
      type: 'term',
      description: '3 terms with WAEC in May-July',
    },
    assessmentStyle: {
      type: 'exam_heavy',
      description: 'Focus on WAEC/NECO with continuous assessment',
    },
    idealFor: [
      'Unity schools',
      'State/Federal secondary schools',
      'Private secondary schools',
    ],
    notIdealFor: [
      'Cambridge curriculum schools',
      'IB schools',
    ],
    popularity: 4,
    tags: ['nigeria', 'secondary', 'waec', 'neco', 'jamb'],
  },

  // ============================================
  // INTERNATIONAL TEMPLATES
  // ============================================
  {
    id: 'int_cambridge_igcse',
    name: 'Cambridge IGCSE',
    category: 'k12_international',
    country: 'International',
    countryCode: 'INT',
    educationLevel: 'secondary',
    emoji: '🌍',
    icon: 'Globe',
    description: 'Cambridge International IGCSE curriculum',
    detailedDescription: 'World-renowned Cambridge IGCSE program for ages 14-16. Internationally recognized qualifications with flexible subject choices and rigorous academic standards.',
    features: [
      'Cambridge Accreditation',
      'International Recognition',
      'Flexible Subject Choice',
      'External Examinations',
      'Pathway to A-Levels',
    ],
    sampleCurriculum: [
      'English Language',
      'Mathematics',
      'Sciences (Physics, Chemistry, Biology)',
      'Foreign Languages',
      'Humanities',
      'Arts',
      'Business Studies',
      'Computer Science',
    ],
    gradingSystem: {
      type: 'letter',
      description: 'A*-G grading with 9-1 numeric option',
    },
    academicCalendar: {
      type: 'semester',
      description: '2 semesters with May/June and Oct/Nov exam sessions',
    },
    assessmentStyle: {
      type: 'exam_heavy',
      description: 'External Cambridge examinations with coursework components',
    },
    idealFor: [
      'International schools',
      'British curriculum schools abroad',
      'Students seeking international recognition',
    ],
    notIdealFor: [
      'Schools following national curricula strictly',
      'Budget-constrained schools',
    ],
    popularity: 5,
    tags: ['cambridge', 'igcse', 'international', 'british', 'examination'],
  },
  {
    id: 'int_ib_myp',
    name: 'IB Middle Years Programme',
    category: 'k12_international',
    country: 'International',
    countryCode: 'INT',
    educationLevel: 'middle',
    emoji: '🌐',
    icon: 'Compass',
    description: 'International Baccalaureate MYP (ages 11-16)',
    detailedDescription: 'IB Middle Years Programme developing intellectual, social, emotional, and physical skills. Emphasizes global contexts, interdisciplinary learning, and service.',
    features: [
      'IB Authorization',
      'Global Contexts',
      'Interdisciplinary Learning',
      'Service Learning',
      'Personal Project',
    ],
    sampleCurriculum: [
      'Language & Literature',
      'Language Acquisition',
      'Individuals & Societies',
      'Sciences',
      'Mathematics',
      'Arts',
      'Physical & Health Education',
      'Design',
    ],
    gradingSystem: {
      type: 'points',
      description: '1-7 scale per subject',
    },
    academicCalendar: {
      type: 'semester',
      description: '2 semesters with eAssessment options',
    },
    assessmentStyle: {
      type: 'project_based',
      description: 'Criterion-based assessment with personal project',
    },
    idealFor: [
      'IB World Schools',
      'Internationally mobile families',
      'Inquiry-based learning advocates',
    ],
    notIdealFor: [
      'Exam-focused schools',
      'Schools requiring strict national curriculum',
    ],
    popularity: 4,
    tags: ['ib', 'myp', 'international', 'inquiry', 'holistic'],
  },
  {
    id: 'int_ib_dp',
    name: 'IB Diploma Programme',
    category: 'k12_international',
    country: 'International',
    countryCode: 'INT',
    educationLevel: 'senior',
    emoji: '🌐',
    icon: 'Award',
    description: 'International Baccalaureate Diploma (ages 16-19)',
    detailedDescription: 'Rigorous 2-year IB Diploma Programme with six subject groups, Theory of Knowledge, Extended Essay, and CAS requirements. Globally recognized for university admission.',
    features: [
      'IB Diploma Certification',
      'Six Subject Groups',
      'Theory of Knowledge',
      'Extended Essay',
      'Creativity, Activity, Service',
    ],
    sampleCurriculum: [
      'Studies in Language & Literature (HL/SL)',
      'Language Acquisition (HL/SL)',
      'Individuals & Societies (HL/SL)',
      'Sciences (HL/SL)',
      'Mathematics (HL/SL)',
      'The Arts (HL/SL)',
    ],
    gradingSystem: {
      type: 'points',
      description: '1-7 per subject, max 45 points with bonus',
    },
    academicCalendar: {
      type: 'semester',
      description: '2 years with May/November exam sessions',
    },
    assessmentStyle: {
      type: 'mixed',
      description: 'External exams + Internal Assessments + EE + TOK',
    },
    idealFor: [
      'University-bound students',
      'IB World Schools',
      'Students seeking broad education',
    ],
    notIdealFor: [
      'Students preferring specialization',
      'Schools without IB authorization',
    ],
    popularity: 5,
    tags: ['ib', 'diploma', 'international', 'university-prep', 'holistic'],
  },

  // ============================================
  // US TEMPLATES
  // ============================================
  {
    id: 'us_k8',
    name: 'US Elementary & Middle School',
    category: 'k12_standard',
    country: 'United States',
    countryCode: 'US',
    educationLevel: 'elementary',
    emoji: '🇺🇸',
    icon: 'School',
    description: 'American K-8 curriculum with Common Core standards',
    detailedDescription: 'Standards-based American education for Kindergarten through 8th grade. Aligned with Common Core State Standards and state-specific requirements.',
    features: [
      'Common Core Alignment',
      'Standards-Based Grading',
      'Differentiated Instruction',
      'State Testing Prep',
      'GPA System',
    ],
    sampleCurriculum: [
      'English Language Arts',
      'Mathematics',
      'Science',
      'Social Studies',
      'Physical Education',
      'Art',
      'Music',
      'Technology',
    ],
    gradingSystem: {
      type: 'letter',
      description: 'A-F letter grades with GPA calculation',
    },
    academicCalendar: {
      type: 'semester',
      description: '2 semesters (Aug-Dec, Jan-May/Jun)',
    },
    assessmentStyle: {
      type: 'continuous',
      description: 'Ongoing assessments, projects, and standardized tests',
    },
    idealFor: [
      'American curriculum schools',
      'International schools in Americas',
      'Homeschool programs',
    ],
    notIdealFor: [
      'Schools following British system',
      'Exam-centric education models',
    ],
    popularity: 4,
    tags: ['usa', 'american', 'common-core', 'elementary', 'middle-school'],
  },
  {
    id: 'us_high_school',
    name: 'US High School',
    category: 'k12_standard',
    country: 'United States',
    countryCode: 'US',
    educationLevel: 'high',
    emoji: '🇺🇸',
    icon: 'GraduationCap',
    description: 'American high school with AP and college prep tracks',
    detailedDescription: 'Comprehensive 4-year American high school program with Advanced Placement options, college counseling, and SAT/ACT preparation.',
    features: [
      'AP Course Options',
      'College Counseling',
      'SAT/ACT Prep',
      'Credit System',
      'GPA & Class Rank',
    ],
    sampleCurriculum: [
      'English (4 years)',
      'Mathematics (4 years)',
      'Science (3-4 years)',
      'Social Studies (3-4 years)',
      'Foreign Language (2-3 years)',
      'AP Courses (Optional)',
      'Electives',
    ],
    gradingSystem: {
      type: 'gpa',
      description: '4.0 scale with weighted GPA for honors/AP',
    },
    academicCalendar: {
      type: 'semester',
      description: '2 semesters with credits per course',
    },
    assessmentStyle: {
      type: 'mixed',
      description: 'Tests, projects, participation, AP exams',
    },
    idealFor: [
      'American schools',
      'Students applying to US universities',
      'Schools offering AP program',
    ],
    notIdealFor: [
      'A-Level focused schools',
      'IB schools',
    ],
    popularity: 4,
    tags: ['usa', 'high-school', 'ap', 'college-prep', 'sat', 'act'],
  },

  // ============================================
  // UK TEMPLATES
  // ============================================
  {
    id: 'uk_primary',
    name: 'UK Primary School',
    category: 'k12_standard',
    country: 'United Kingdom',
    countryCode: 'GB',
    educationLevel: 'primary',
    emoji: '🇬🇧',
    icon: 'School',
    description: 'English National Curriculum Key Stages 1-2',
    detailedDescription: 'British primary education covering Reception through Year 6. Aligned with the English National Curriculum including SATs preparation.',
    features: [
      'National Curriculum',
      'Key Stage Assessments',
      'SATs Preparation',
      'Phonics Program',
      'Progress Tracking',
    ],
    sampleCurriculum: [
      'English',
      'Mathematics',
      'Science',
      'Computing',
      'History',
      'Geography',
      'Art & Design',
      'Physical Education',
      'Music',
      'PSHE',
    ],
    gradingSystem: {
      type: 'descriptive',
      description: 'Working Towards, Expected, Greater Depth',
    },
    academicCalendar: {
      type: 'term',
      description: '3 terms with half-term breaks',
    },
    assessmentStyle: {
      type: 'continuous',
      description: 'Ongoing assessment with end of Key Stage SATs',
    },
    idealFor: [
      'British schools',
      'International British schools',
      'Schools following English curriculum',
    ],
    notIdealFor: [
      'American curriculum schools',
      'IB PYP schools',
    ],
    popularity: 4,
    tags: ['uk', 'british', 'primary', 'national-curriculum', 'sats'],
  },
  {
    id: 'uk_gcse',
    name: 'UK GCSE',
    category: 'k12_standard',
    country: 'United Kingdom',
    countryCode: 'GB',
    educationLevel: 'secondary',
    emoji: '🇬🇧',
    icon: 'FileText',
    description: 'General Certificate of Secondary Education (Years 10-11)',
    detailedDescription: 'Two-year GCSE program for ages 14-16. Nationally recognized qualifications with options across academic and vocational subjects.',
    features: [
      'GCSE Qualifications',
      'Subject Flexibility',
      'Exam Boards (AQA, Edexcel, OCR)',
      '9-1 Grading',
      'Pathway to A-Levels',
    ],
    sampleCurriculum: [
      'English Language',
      'English Literature',
      'Mathematics',
      'Combined Science / Triple Science',
      'Modern Foreign Language',
      'Humanities',
      'Options (Arts, Tech, etc.)',
    ],
    gradingSystem: {
      type: 'points',
      description: '9-1 scale (9 highest)',
    },
    academicCalendar: {
      type: 'term',
      description: '3 terms with summer exams',
    },
    assessmentStyle: {
      type: 'exam_heavy',
      description: 'External exams with some coursework',
    },
    idealFor: [
      'UK secondary schools',
      'British international schools',
      'GCSE exam preparation',
    ],
    notIdealFor: [
      'Schools not offering UK qualifications',
      'IGCSE-focused schools',
    ],
    popularity: 4,
    tags: ['uk', 'gcse', 'secondary', 'examinations', 'british'],
  },
  {
    id: 'uk_alevels',
    name: 'UK A-Levels',
    category: 'k12_standard',
    country: 'United Kingdom',
    countryCode: 'GB',
    educationLevel: 'senior',
    emoji: '🇬🇧',
    icon: 'Award',
    description: 'Advanced Level qualifications (Years 12-13)',
    detailedDescription: 'Two-year A-Level program for ages 16-18. Specialized study in 3-4 subjects providing pathway to university education.',
    features: [
      'A-Level Qualifications',
      'Subject Specialization',
      'UCAS Points',
      'University Preparation',
      'Linear Assessment',
    ],
    sampleCurriculum: [
      '3-4 A-Level subjects chosen from:',
      'Mathematics',
      'Further Mathematics',
      'Physics',
      'Chemistry',
      'Biology',
      'English Literature',
      'History',
      'Economics',
      'Psychology',
    ],
    gradingSystem: {
      type: 'letter',
      description: 'A*-E grades with UCAS points',
    },
    academicCalendar: {
      type: 'term',
      description: '3 terms per year, exams in May-June',
    },
    assessmentStyle: {
      type: 'exam_heavy',
      description: 'Terminal examinations at end of 2 years',
    },
    idealFor: [
      'UK sixth forms',
      'British international schools',
      'University preparation',
    ],
    notIdealFor: [
      'Students preferring broader education',
      'IB schools',
    ],
    popularity: 4,
    tags: ['uk', 'a-levels', 'sixth-form', 'university-prep', 'ucas'],
  },

  // ============================================
  // SPECIAL CATEGORIES
  // ============================================
  {
    id: 'montessori_primary',
    name: 'Montessori Primary',
    category: 'k12_montessori',
    country: 'International',
    countryCode: 'INT',
    educationLevel: 'primary',
    emoji: '🌱',
    icon: 'Sparkles',
    description: 'Montessori Method for ages 3-12',
    detailedDescription: 'Child-centered Montessori education with multi-age classrooms, self-directed learning, and hands-on materials. Covers Casa (3-6) and Elementary (6-12) programs.',
    features: [
      'Multi-Age Classrooms',
      'Self-Directed Learning',
      'Hands-On Materials',
      'Individual Progress Tracking',
      'Narrative Assessments',
    ],
    sampleCurriculum: [
      'Practical Life',
      'Sensorial',
      'Mathematics',
      'Language',
      'Cultural Studies',
      'Science',
      'Geography',
      'Art & Music',
    ],
    gradingSystem: {
      type: 'descriptive',
      description: 'Narrative reports and progress portfolios',
    },
    academicCalendar: {
      type: 'semester',
      description: 'Flexible timing based on child readiness',
    },
    assessmentStyle: {
      type: 'continuous',
      description: 'Observation-based with no traditional grading',
    },
    idealFor: [
      'Montessori schools',
      'Alternative education seekers',
      'Child-centered learning advocates',
    ],
    notIdealFor: [
      'Schools requiring standardized testing',
      'Traditional grading requirements',
    ],
    popularity: 3,
    tags: ['montessori', 'alternative', 'child-centered', 'self-directed'],
  },
  {
    id: 'vocational_technical',
    name: 'Vocational & Technical',
    category: 'vocational',
    country: 'International',
    countryCode: 'INT',
    educationLevel: 'secondary',
    emoji: '🔧',
    icon: 'Wrench',
    description: 'Career-focused technical and trade education',
    detailedDescription: 'Skills-based vocational education preparing students for trades and technical careers. Combines theory with practical workshop experience.',
    features: [
      'Industry Certifications',
      'Practical Workshops',
      'Apprenticeship Prep',
      'Competency-Based',
      'Industry Partnerships',
    ],
    sampleCurriculum: [
      'Technical Mathematics',
      'Technical English',
      'Computer Applications',
      'Trade Theory',
      'Workshop Practice',
      'Health & Safety',
      'Entrepreneurship',
    ],
    gradingSystem: {
      type: 'descriptive',
      description: 'Competent/Not Yet Competent with skill levels',
    },
    academicCalendar: {
      type: 'semester',
      description: 'Module-based with industry placement periods',
    },
    assessmentStyle: {
      type: 'continuous',
      description: 'Practical assessments and portfolio evidence',
    },
    idealFor: [
      'Technical schools',
      'Trade training centers',
      'Apprenticeship programs',
    ],
    notIdealFor: [
      'Academic-focused schools',
      'University preparation focus',
    ],
    popularity: 3,
    tags: ['vocational', 'technical', 'trade', 'skills-based', 'apprenticeship'],
  },
  {
    id: 'tutoring_exam_prep',
    name: 'Tutoring & Exam Prep Center',
    category: 'tutoring_center',
    country: 'International',
    countryCode: 'INT',
    educationLevel: 'all',
    emoji: '📚',
    icon: 'BookOpen',
    description: 'Supplementary education and examination preparation',
    detailedDescription: 'Flexible template for tutoring centers, exam prep schools, and supplementary education providers. Track student progress across subjects and exam preparation.',
    features: [
      'Flexible Scheduling',
      'Progress Tracking',
      'Parent Communication',
      'Multiple Subjects',
      'Custom Assessments',
    ],
    sampleCurriculum: [
      'Subject Tutoring',
      'Exam Preparation',
      'Study Skills',
      'Test Practice',
      'Homework Support',
    ],
    gradingSystem: {
      type: 'percentage',
      description: 'Progress tracking with target scores',
    },
    academicCalendar: {
      type: 'semester',
      description: 'Rolling enrollment with flexible terms',
    },
    assessmentStyle: {
      type: 'continuous',
      description: 'Regular practice tests and progress checks',
    },
    idealFor: [
      'Tutoring centers',
      'Exam prep schools',
      'Learning centers',
    ],
    notIdealFor: [
      'Full-time schools',
      'Accredited institutions',
    ],
    popularity: 3,
    tags: ['tutoring', 'exam-prep', 'supplementary', 'flexible'],
  },
];

// ============================================
// Helper Functions
// ============================================

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: TemplateCategory): TemplateDefinition[] {
  return EDUCATION_TEMPLATES.filter(t => t.category === category);
}

/**
 * Get templates by country code
 */
export function getTemplatesByCountry(countryCode: string): TemplateDefinition[] {
  return EDUCATION_TEMPLATES.filter(t => t.countryCode === countryCode || t.countryCode === 'INT');
}

/**
 * Get templates by education level
 */
export function getTemplatesByLevel(level: string): TemplateDefinition[] {
  return EDUCATION_TEMPLATES.filter(t => 
    t.educationLevel === level || 
    t.educationLevel === 'all'
  );
}

/**
 * Search templates by query
 */
export function searchTemplates(query: string): TemplateDefinition[] {
  const lowerQuery = query.toLowerCase();
  return EDUCATION_TEMPLATES.filter(t => 
    t.name.toLowerCase().includes(lowerQuery) ||
    t.description.toLowerCase().includes(lowerQuery) ||
    t.tags.some(tag => tag.includes(lowerQuery)) ||
    t.country.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get popular templates
 */
export function getPopularTemplates(limit = 6): TemplateDefinition[] {
  return [...EDUCATION_TEMPLATES]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
}

/**
 * Get template by ID
 */
export function getTemplateById(id: string): TemplateDefinition | undefined {
  return EDUCATION_TEMPLATES.find(t => t.id === id);
}
