// User types
export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  authProvider: 'local' | 'google' | 'facebook' | 'linkedin' | 'apple';
  providerId?: string;
  createdAt: string;
  updatedAt: string;
}

// Profile types
export interface Profile {
  id: string;
  userId: string;
  username?: string;
  uniqueId: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  jobTitle?: string;
  company?: string;
  bio?: string;
  phone?: string;
  phones?: { label: string; number: string }[];
  emailPublic?: string;
  website?: string;
  socialLinks: SocialLinks;
  themeSettings: ThemeSettings;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SocialLinks {
  twitter?: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  tiktok?: string;
  [key: string]: string | undefined;
}

export interface ThemeSettings {
  primaryColor?: string;
  backgroundColor?: string;
  backgroundType?: 'solid' | 'gradient' | 'image';
  backgroundImage?: string;
  fontFamily?: string;
  layout?: 'minimal' | 'card' | 'full';
  [key: string]: any;
}

// Analytics types
export interface ProfileView {
  id: string;
  profileId: string;
  viewedAt: string;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  country?: string;
  deviceType: 'mobile' | 'desktop' | 'tablet';
}

export interface AnalyticsSummary {
  totalViews: number;
  uniqueVisitors: number;
  viewsByDate: { date: string; count: number }[];
  viewsByDevice: { device: string; count: number }[];
  viewsByCountry: { country: string; count: number }[];
  recentViews: ProfileView[];
}

// Form types
export interface RegisterFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  username?: string;
  jobTitle?: string;
  company?: string;
  bio?: string;
  phone?: string;
  emailPublic?: string;
  website?: string;
  socialLinks: SocialLinks;
  themeSettings: ThemeSettings;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
