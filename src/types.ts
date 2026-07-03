export interface PersonalInfo {
  name: string;
  role: string;
  bio: string;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
  facebook?: string;
  avatarUrl?: string;
  phone?: string;
  location?: string;
  tagline?: string;
  stats?: StatItem[];
  competencies?: CompetencyItem[];
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
}

export interface CompetencyItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface ProjectMedia {
  type: 'image' | 'video';
  url: string;
  title?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  githubLink?: string;
  liveLink?: string;
  imageUrl?: string;
  media?: ProjectMedia[];
  videoUrl?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  achievements: string[];
}

export interface Academic {
  id: string;
  degree: string;
  institution: string;
  duration: string;
  description: string;
  certificateUrl?: string;
  images?: string[];
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  credentialId?: string;
  date: string;
  url?: string;
}

export interface Passion {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl?: string;
  images?: string[];
}

export interface SkillCategory {
  id: string;
  category: string;
  list: string[];
  percentages?: Record<string, number>; // optional to keep percentage values
}

export interface BlogAttachment {
  fileName: string;
  fileType: string;
  fileSize: string;
  dataUrl: string; // Base64 representation of the file
}

export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  tags: string[];
  imageUrl?: string;
  attachment?: BlogAttachment;
}

export interface Article {
  id: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  fileName: string;
  fileType: string;
  fileSize: string;
  dataUrl: string; // Base64 representation of the uploaded article file (PDF, DOC, MD, etc.)
}

export type AccentColor = 'emerald' | 'violet' | 'amber' | 'sky' | 'rose' | 'indigo';

export interface Customization {
  accentColor: AccentColor;
  layout: 'grid' | 'minimal';
}

export interface PortfolioData {
  personal: PersonalInfo;
  projects: Project[];
  experience: Experience[];
  skills: SkillCategory[];
  academics?: Academic[];
  passions?: Passion[];
  certifications?: Certification[];
  blogs?: Blog[];
  articles?: Article[];
  customization: Customization;
}

