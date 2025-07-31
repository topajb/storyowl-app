export interface StoryPage {
  pageNumber: number;
  text: string;
  imageUrl?: string;
}

export interface Story {
  id: string;
  title: string;
  pages: StoryPage[];
  coverImage?: string;
  coverImageUrl?: string;
  heroAvatarUrl?: string;
  childName: string;
  age: number;
  theme: string;
  createdAt: Date;
  readingProgress?: number;
}

export interface Testimonial {
  text: string;
  author: string;
  role?: string;
  avatarUrl?: string;
}

export interface CreditSystem {
  balance: number;
  used: number;
  limit: number;
  resetDate?: Date;
}

export type Phase = 'storybook' | 'audiobook' | 'movie';

export interface AppFeatures {
  currentPhase: Phase;
  comingSoon: Phase[];
}