export type AdventureCategory = 'travel' | 'food' | 'activity' | 'milestone' | 'date-night' | 'home' | 'custom';
export type AdventureStatus = 'wishlist' | 'planned' | 'in-progress' | 'completed';
export type Partner = 'partner1' | 'partner2' | 'both';

export interface Comment {
  id: string;
  text: string;
  author: Partner;
  createdAt: Date;
}

export interface Adventure {
  id: number;
  title: string;
  description: string;
  category: AdventureCategory;
  customCategory?: string;
  
  // Partner assignment
  assignedTo: Partner;
  createdBy: Partner;
  
  // Status & dates
  status: AdventureStatus;
  targetDate?: Date;
  completedDate?: Date;
  
  // Memories
  photos: string[]; // URLs or base64
  rating?: number; // 1-5 stars
  review?: string;
  
  // Planning
  location?: string;
  estimatedCost?: number;
  notes?: string;
  
  // Comments
  comments: Comment[];
  
  // Metadata
  isSurprise: boolean;
  revealed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  category: string;
}

export interface CoupleStats {
  totalAdventures: number;
  completedAdventures: number;
  byCategory: Record<string, number>;
  byPartner: { partner1: number; partner2: number; both: number };
  averageRating: number;
  currentStreak: number;
  longestStreak: number;
  totalPhotos: number;
}

// Legacy Task interface for backward compatibility during migration
export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}