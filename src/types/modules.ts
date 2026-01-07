export type ModuleName =
  | 'students'
  | 'teachers'
  | 'parents'
  | 'classes'
  | 'attendance'
  | 'grades'
  | 'assessments'
  | 'fees'
  | 'payments'
  | 'documents'
  | 'reports'
  | 'analytics'
  | 'support'
  | 'announcements'
  | 'events'
  | 'library'
  | 'transportation'
  | 'cafeteria';

export type PackageTier = 'basic' | 'standard' | 'premium' | 'enterprise';

export interface ModuleConfig {
  name: ModuleName;
  displayName: string;
  description: string;
  icon: string;
  enabled: boolean;
  tier: PackageTier[];
  dependencies?: ModuleName[];
  route?: string;
}

export interface SchoolPackage {
  tier: PackageTier;
  displayName: string;
  includedModules: ModuleName[];
  maxStudents: number;
  maxTeachers: number;
  maxAdmins: number;
  features: string[];
  price: number;
}

export interface ModulePermissions {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  export: boolean;
}

export interface ModuleAccess {
  module: ModuleName;
  permissions: ModulePermissions;
  restrictedFields?: string[];
}
