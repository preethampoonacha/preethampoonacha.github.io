import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Adventure, Achievement, CoupleStats, AdventureCategory, Partner } from '../models/task.model';
import { 
  collection, 
  doc, 
  setDoc,
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase.config';

@Injectable({
  providedIn: 'root'
})
export class AdventureService {
  private readonly STORAGE_KEY = 'adventure-tracker-adventures';
  private readonly NEXT_ID_KEY = 'adventure-tracker-next-id';
  private readonly ACHIEVEMENTS_KEY = 'adventure-tracker-achievements';
  private readonly COLLECTION_NAME = 'adventures';
  private readonly ACHIEVEMENTS_COLLECTION = 'achievements';
  
  private adventures: Adventure[] = [];
  private adventuresSubject = new BehaviorSubject<Adventure[]>(this.adventures);
  public adventures$: Observable<Adventure[]> = this.adventuresSubject.asObservable();

  private achievements: Achievement[] = [];
  private achievementsSubject = new BehaviorSubject<Achievement[]>(this.achievements);
  public achievements$: Observable<Achievement[]> = this.achievementsSubject.asObservable();

  private nextId = 1;
  private useFirestore = false;
  private unsubscribeSnapshot: (() => void) | null = null;
  
  // Firebase connection status
  private firebaseStatusSubject = new BehaviorSubject<{ connected: boolean; message: string }>({ 
    connected: false, 
    message: 'Checking connection...' 
  });
  public firebaseStatus$: Observable<{ connected: boolean; message: string }> = this.firebaseStatusSubject.asObservable();

  // Default achievements
  private readonly DEFAULT_ACHIEVEMENTS: Achievement[] = [
    { id: 'first-adventure', name: 'First Adventure', description: 'Created your first adventure together', icon: '🌟', category: 'milestone' },
    { id: 'five-adventures', name: 'Getting Started', description: 'Completed 5 adventures', icon: '⭐', category: 'milestone' },
    { id: 'ten-adventures', name: 'Adventure Duo', description: 'Completed 10 adventures', icon: '✨', category: 'milestone' },
    { id: 'twenty-adventures', name: 'Power Couple', description: 'Completed 20 adventures', icon: '💫', category: 'milestone' },
    { id: 'fifty-adventures', name: 'Adventure Masters', description: 'Completed 50 adventures', icon: '🏆', category: 'milestone' },
    { id: 'first-travel', name: 'Wanderlust', description: 'Completed your first travel adventure', icon: '✈️', category: 'travel' },
    { id: 'first-food', name: 'Foodies', description: 'Completed your first food adventure', icon: '🍽️', category: 'food' },
    { id: 'first-activity', name: 'Active Together', description: 'Completed your first activity adventure', icon: '🎯', category: 'activity' },
    { id: 'first-milestone', name: 'Milestone Makers', description: 'Completed your first milestone', icon: '🎉', category: 'milestone' },
    { id: 'perfect-rating', name: 'Perfect Memories', description: 'Rated an adventure 5 stars', icon: '💖', category: 'rating' },
    { id: 'photo-master', name: 'Memory Keepers', description: 'Added photos to 10 adventures', icon: '📸', category: 'photos' },
    { id: 'surprise-master', name: 'Surprise Experts', description: 'Created 5 surprise adventures', icon: '🎁', category: 'surprise' }
  ];

  constructor() {
    this.initializeAchievements();
    this.checkFirebaseConfig();
  }

  private initializeAchievements(): void {
    const stored = localStorage.getItem(this.ACHIEVEMENTS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      this.achievements = parsed.map((a: any) => ({
        ...a,
        unlockedAt: a.unlockedAt ? new Date(a.unlockedAt) : undefined
      }));
    } else {
      this.achievements = this.DEFAULT_ACHIEVEMENTS.map(a => ({ ...a }));
    }
    this.achievementsSubject.next([...this.achievements]);
  }

  private checkFirebaseConfig(): void {
    try {
      if (isFirebaseConfigured() && db) {
        this.useFirestore = true;
        this.firebaseStatusSubject.next({ connected: true, message: 'Synced with Firebase' });
        this.setupFirestoreListener();
      } else {
        console.info('Firebase not configured, using localStorage for adventure storage');
        this.firebaseStatusSubject.next({ connected: false, message: 'Using Local Storage (browser only)' });
        this.loadAdventuresFromStorage();
      }
    } catch (error) {
      console.warn('Firebase not configured, using localStorage:', error);
      this.firebaseStatusSubject.next({ connected: false, message: 'Using Local Storage (browser only)' });
      this.loadAdventuresFromStorage();
    }
  }

  private setupFirestoreListener(): void {
    try {
      if (!db) {
        throw new Error('Firestore database not initialized');
      }
      const adventuresRef = collection(db, this.COLLECTION_NAME);
      
      let q;
      try {
        q = query(adventuresRef, orderBy('createdAt', 'desc'));
      } catch (orderError) {
        console.warn('Could not use orderBy, trying without:', orderError);
        q = query(adventuresRef);
      }

      this.unsubscribeSnapshot = onSnapshot(
        q,
        (snapshot) => {
          this.adventures = snapshot.docs.map(doc => {
            const data = doc.data();
            return this.mapFirestoreDataToAdventure(data);
          });
          
          if (this.adventures.length > 0) {
            this.adventures.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
            this.nextId = Math.max(...this.adventures.map(a => a.id), 0) + 1;
          }
          
          this.adventuresSubject.next([...this.adventures]);
          this.checkAchievements();
          this.firebaseStatusSubject.next({ connected: true, message: 'Synced with Firebase' });
        },
        (error: any) => {
          console.error('Error listening to Firestore:', error);
          let errorMessage = 'Firebase error - using Local Storage';
          if (error?.code === 'permission-denied') {
            errorMessage = 'Firebase: Permission denied - check Firestore rules';
          } else if (error?.code === 'failed-precondition') {
            errorMessage = 'Firebase: Index required - check console for link';
          } else if (error?.message) {
            errorMessage = `Firebase: ${error.message}`;
          }
          
          this.useFirestore = false;
          this.firebaseStatusSubject.next({ connected: false, message: errorMessage });
          this.loadAdventuresFromStorage();
        }
      );
    } catch (error: any) {
      console.error('Error setting up Firestore listener:', error);
      this.useFirestore = false;
      const errorMessage = error?.message || 'Firebase setup error - using Local Storage';
      this.firebaseStatusSubject.next({ connected: false, message: errorMessage });
      this.loadAdventuresFromStorage();
    }
  }

  private mapFirestoreDataToAdventure(data: any): Adventure {
    const comments = data['comments'] || [];
    return {
      id: data['id'] || 0,
      title: data['title'],
      description: data['description'] || '',
      category: data['category'] || 'activity',
      customCategory: data['customCategory'],
      assignedTo: data['assignedTo'] || 'both',
      createdBy: data['createdBy'] || 'both',
      status: data['status'] || 'wishlist',
      targetDate: data['targetDate']?.toDate ? data['targetDate'].toDate() : (data['targetDate'] ? new Date(data['targetDate']) : undefined),
      completedDate: data['completedDate']?.toDate ? data['completedDate'].toDate() : (data['completedDate'] ? new Date(data['completedDate']) : undefined),
      photos: data['photos'] || [],
      rating: data['rating'],
      review: data['review'],
      location: data['location'],
      estimatedCost: data['estimatedCost'],
      notes: data['notes'],
      comments: comments.map((c: any) => ({
        id: c.id,
        text: c.text,
        author: c.author,
        createdAt: c.createdAt?.toDate ? c.createdAt.toDate() : new Date(c.createdAt)
      })),
      isSurprise: data['isSurprise'] || false,
      revealed: data['revealed'] || false,
      createdAt: data['createdAt']?.toDate ? data['createdAt'].toDate() : new Date(data['createdAt']),
      updatedAt: data['updatedAt']?.toDate ? data['updatedAt'].toDate() : new Date(data['updatedAt'])
    } as Adventure;
  }

  private loadAdventuresFromStorage(): void {
    try {
      const storedAdventures = localStorage.getItem(this.STORAGE_KEY);
      const storedNextId = localStorage.getItem(this.NEXT_ID_KEY);

      if (storedAdventures) {
        const parsedAdventures = JSON.parse(storedAdventures);
        this.adventures = parsedAdventures.map((adventure: any) => ({
          ...adventure,
          createdAt: new Date(adventure.createdAt),
          updatedAt: new Date(adventure.updatedAt),
          targetDate: adventure.targetDate ? new Date(adventure.targetDate) : undefined,
          completedDate: adventure.completedDate ? new Date(adventure.completedDate) : undefined,
          comments: (adventure.comments || []).map((c: any) => ({
            ...c,
            createdAt: new Date(c.createdAt)
          }))
        }));
      } else {
        // Initialize with sample couple bucket list items
        this.adventures = [
          {
            id: 1,
            title: 'Watch a sunset together',
            description: 'Find a beautiful spot and watch the sunset hand in hand',
            category: 'activity',
            assignedTo: 'both',
            createdBy: 'both',
            status: 'wishlist',
            photos: [],
            comments: [],
            isSurprise: false,
            revealed: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 2,
            title: 'Try a new restaurant',
            description: 'Explore a cuisine we\'ve never tried before',
            category: 'food',
            assignedTo: 'both',
            createdBy: 'both',
            status: 'wishlist',
            photos: [],
            comments: [],
            isSurprise: false,
            revealed: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];
        this.nextId = 3;
        this.saveAdventuresToStorage();
      }

      if (storedNextId) {
        this.nextId = parseInt(storedNextId, 10);
      } else if (this.adventures.length > 0) {
        this.nextId = Math.max(...this.adventures.map(a => a.id)) + 1;
      }

      this.adventuresSubject.next([...this.adventures]);
      this.checkAchievements();
    } catch (error) {
      console.error('Error loading adventures from storage:', error);
      this.adventures = [];
      this.nextId = 1;
      this.adventuresSubject.next([...this.adventures]);
    }
  }

  private saveAdventuresToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.adventures));
      localStorage.setItem(this.NEXT_ID_KEY, this.nextId.toString());
      localStorage.setItem(this.ACHIEVEMENTS_KEY, JSON.stringify(this.achievements));
    } catch (error) {
      console.error('Error saving adventures to storage:', error);
    }
  }

  getAllAdventures(): Adventure[] {
    return [...this.adventures];
  }

  getAdventureById(id: number): Adventure | undefined {
    return this.adventures.find(adventure => adventure.id === id);
  }

  getAdventuresByStatus(status: Adventure['status']): Adventure[] {
    return this.adventures.filter(a => a.status === status);
  }

  getAdventuresByCategory(category: AdventureCategory): Adventure[] {
    return this.adventures.filter(a => a.category === category);
  }

  getCompletedAdventures(): Adventure[] {
    return this.adventures.filter(a => a.status === 'completed').sort((a, b) => {
      const dateA = a.completedDate?.getTime() || 0;
      const dateB = b.completedDate?.getTime() || 0;
      return dateB - dateA;
    });
  }

  getUpcomingAdventures(): Adventure[] {
    const now = new Date();
    return this.adventures
      .filter(a => a.status === 'planned' && a.targetDate && a.targetDate >= now)
      .sort((a, b) => {
        const dateA = a.targetDate?.getTime() || 0;
        const dateB = b.targetDate?.getTime() || 0;
        return dateA - dateB;
      });
  }

  getStats(): CoupleStats {
    const completed = this.getCompletedAdventures();
    const byCategory: Record<string, number> = {};
    const byPartner = { partner1: 0, partner2: 0, both: 0 };
    let totalRating = 0;
    let ratedCount = 0;
    let totalPhotos = 0;

    completed.forEach(adventure => {
      // Category stats
      const cat = adventure.category;
      byCategory[cat] = (byCategory[cat] || 0) + 1;

      // Partner stats
      byPartner[adventure.assignedTo]++;

      // Rating stats
      if (adventure.rating) {
        totalRating += adventure.rating;
        ratedCount++;
      }

      // Photo stats
      totalPhotos += adventure.photos.length;
    });

    // Calculate streaks
    const sortedCompleted = [...completed].sort((a, b) => {
      const dateA = a.completedDate?.getTime() || 0;
      const dateB = b.completedDate?.getTime() || 0;
      return dateB - dateA;
    });

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate: Date | null = null;

    sortedCompleted.forEach(adventure => {
      if (!adventure.completedDate) return;
      
      const completedDate = new Date(adventure.completedDate);
      completedDate.setHours(0, 0, 0, 0);
      
      if (!lastDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const diffDays = Math.floor((today.getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
          currentStreak = 1;
          tempStreak = 1;
        } else if (diffDays === 1) {
          currentStreak = 1;
          tempStreak = 1;
        }
        lastDate = completedDate;
      } else {
        const diffDays = Math.floor((lastDate.getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          tempStreak++;
          if (currentStreak === 0 || lastDate.getTime() === new Date().setHours(0, 0, 0, 0)) {
            currentStreak = tempStreak;
          }
        } else if (diffDays > 1) {
          if (tempStreak > longestStreak) {
            longestStreak = tempStreak;
          }
          tempStreak = 1;
        }
        lastDate = completedDate;
      }
      
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    });

    return {
      totalAdventures: this.adventures.length,
      completedAdventures: completed.length,
      byCategory,
      byPartner,
      averageRating: ratedCount > 0 ? totalRating / ratedCount : 0,
      currentStreak,
      longestStreak,
      totalPhotos
    };
  }

  async createAdventure(adventure: Omit<Adventure, 'id' | 'createdAt' | 'updatedAt'>): Promise<Adventure> {
    const newAdventure: Adventure = {
      ...adventure,
      id: this.nextId++,
      createdAt: new Date(),
      updatedAt: new Date(),
      photos: adventure.photos || [],
      comments: adventure.comments || [],
      isSurprise: adventure.isSurprise || false,
      revealed: adventure.isSurprise ? false : true
    };

    if (this.useFirestore && db) {
      try {
        const adventuresRef = collection(db, this.COLLECTION_NAME);
        const adventureDoc = doc(adventuresRef, newAdventure.id.toString());
        const adventureData = this.mapAdventureToFirestoreData(newAdventure);
        await setDoc(adventureDoc, adventureData);
        return newAdventure;
      } catch (error) {
        console.error('Error creating adventure in Firestore:', error);
        this.useFirestore = false;
        this.adventures.push(newAdventure);
        this.adventuresSubject.next([...this.adventures]);
        this.saveAdventuresToStorage();
        this.checkAchievements();
        return newAdventure;
      }
    } else {
      this.adventures.push(newAdventure);
      this.adventuresSubject.next([...this.adventures]);
      this.saveAdventuresToStorage();
      this.checkAchievements();
      return newAdventure;
    }
  }

  async updateAdventure(id: number, updates: Partial<Omit<Adventure, 'id' | 'createdAt'>>): Promise<Adventure | null> {
    const index = this.adventures.findIndex(adventure => adventure.id === id);
    if (index === -1) {
      return null;
    }

    const updatedAdventure: Adventure = {
      ...this.adventures[index],
      ...updates,
      updatedAt: new Date()
    };

    // Preserve comments if not provided in updates
    if (!updates.comments && this.adventures[index].comments) {
      updatedAdventure.comments = this.adventures[index].comments;
    } else if (!updatedAdventure.comments) {
      updatedAdventure.comments = [];
    }

    // If marking as completed, set completedDate if not already set
    if (updates.status === 'completed' && !updatedAdventure.completedDate) {
      updatedAdventure.completedDate = new Date();
    }

    // Reveal surprise when completed
    if (updates.status === 'completed' && updatedAdventure.isSurprise && !updatedAdventure.revealed) {
      updatedAdventure.revealed = true;
    }

    if (this.useFirestore && db) {
      try {
        const adventuresRef = collection(db, this.COLLECTION_NAME);
        const adventureDoc = doc(adventuresRef, id.toString());
        const updateData = this.mapAdventureToFirestoreData(updatedAdventure, true);
        await updateDoc(adventureDoc, updateData);
        this.checkAchievements();
        return updatedAdventure;
      } catch (error) {
        console.error('Error updating adventure in Firestore:', error);
        this.useFirestore = false;
        this.adventures[index] = updatedAdventure;
        this.adventuresSubject.next([...this.adventures]);
        this.saveAdventuresToStorage();
        this.checkAchievements();
        return updatedAdventure;
      }
    } else {
      this.adventures[index] = updatedAdventure;
      this.adventuresSubject.next([...this.adventures]);
      this.saveAdventuresToStorage();
      this.checkAchievements();
      return updatedAdventure;
    }
  }

  async addPhotoToAdventure(id: number, photo: string): Promise<boolean> {
    const adventure = this.getAdventureById(id);
    if (!adventure) return false;

    const updatedPhotos = [...adventure.photos, photo];
    await this.updateAdventure(id, { photos: updatedPhotos });
    return true;
  }

  async removePhotoFromAdventure(id: number, photoIndex: number): Promise<boolean> {
    const adventure = this.getAdventureById(id);
    if (!adventure) return false;

    const updatedPhotos = adventure.photos.filter((_, index) => index !== photoIndex);
    await this.updateAdventure(id, { photos: updatedPhotos });
    return true;
  }

  async addCommentToAdventure(id: number, text: string, author: Partner): Promise<boolean> {
    const adventure = this.getAdventureById(id);
    if (!adventure || !text.trim()) return false;

    const newComment = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      text: text.trim(),
      author: author,
      createdAt: new Date()
    };

    const updatedComments = [...(adventure.comments || []), newComment];
    await this.updateAdventure(id, { comments: updatedComments });
    return true;
  }

  async deleteCommentFromAdventure(id: number, commentId: string): Promise<boolean> {
    const adventure = this.getAdventureById(id);
    if (!adventure) return false;

    const updatedComments = (adventure.comments || []).filter(c => c.id !== commentId);
    await this.updateAdventure(id, { comments: updatedComments });
    return true;
  }

  async deleteAdventure(id: number): Promise<boolean> {
    const index = this.adventures.findIndex(adventure => adventure.id === id);
    if (index === -1) {
      return false;
    }

    if (this.useFirestore && db) {
      try {
        const adventuresRef = collection(db, this.COLLECTION_NAME);
        const adventureDoc = doc(adventuresRef, id.toString());
        await deleteDoc(adventureDoc);
        this.checkAchievements();
        return true;
      } catch (error) {
        console.error('Error deleting adventure in Firestore:', error);
        this.useFirestore = false;
        this.adventures.splice(index, 1);
        this.adventuresSubject.next([...this.adventures]);
        this.saveAdventuresToStorage();
        this.checkAchievements();
        return true;
      }
    } else {
      this.adventures.splice(index, 1);
      this.adventuresSubject.next([...this.adventures]);
      this.saveAdventuresToStorage();
      this.checkAchievements();
      return true;
    }
  }

  private mapAdventureToFirestoreData(adventure: Adventure, isUpdate = false): any {
    const data: any = {
      id: adventure.id,
      title: adventure.title,
      description: adventure.description,
      category: adventure.category,
      assignedTo: adventure.assignedTo,
      createdBy: adventure.createdBy,
      status: adventure.status,
      photos: adventure.photos,
      isSurprise: adventure.isSurprise,
      revealed: adventure.revealed,
      updatedAt: Timestamp.fromDate(adventure.updatedAt)
    };

    if (!isUpdate) {
      data.createdAt = Timestamp.fromDate(adventure.createdAt);
    }

    if (adventure.customCategory) data.customCategory = adventure.customCategory;
    if (adventure.targetDate) data.targetDate = Timestamp.fromDate(adventure.targetDate);
    if (adventure.completedDate) data.completedDate = Timestamp.fromDate(adventure.completedDate);
    if (adventure.rating) data.rating = adventure.rating;
    if (adventure.review) data.review = adventure.review;
    if (adventure.location) data.location = adventure.location;
    if (adventure.estimatedCost) data.estimatedCost = adventure.estimatedCost;
    if (adventure.notes) data.notes = adventure.notes;
    if (adventure.comments && adventure.comments.length > 0) {
      data.comments = adventure.comments.map(c => ({
        id: c.id,
        text: c.text,
        author: c.author,
        createdAt: Timestamp.fromDate(c.createdAt)
      }));
    }

    return data;
  }

  private checkAchievements(): void {
    const stats = this.getStats();
    const completed = this.getCompletedAdventures();
    let hasNewAchievement = false;

    // Check milestone achievements
    if (stats.completedAdventures >= 1 && !this.isAchievementUnlocked('first-adventure')) {
      this.unlockAchievement('first-adventure');
      hasNewAchievement = true;
    }
    if (stats.completedAdventures >= 5 && !this.isAchievementUnlocked('five-adventures')) {
      this.unlockAchievement('five-adventures');
      hasNewAchievement = true;
    }
    if (stats.completedAdventures >= 10 && !this.isAchievementUnlocked('ten-adventures')) {
      this.unlockAchievement('ten-adventures');
      hasNewAchievement = true;
    }
    if (stats.completedAdventures >= 20 && !this.isAchievementUnlocked('twenty-adventures')) {
      this.unlockAchievement('twenty-adventures');
      hasNewAchievement = true;
    }
    if (stats.completedAdventures >= 50 && !this.isAchievementUnlocked('fifty-adventures')) {
      this.unlockAchievement('fifty-adventures');
      hasNewAchievement = true;
    }

    // Check category achievements
    const hasTravel = completed.some(a => a.category === 'travel');
    const hasFood = completed.some(a => a.category === 'food');
    const hasActivity = completed.some(a => a.category === 'activity');
    const hasMilestone = completed.some(a => a.category === 'milestone');

    if (hasTravel && !this.isAchievementUnlocked('first-travel')) {
      this.unlockAchievement('first-travel');
      hasNewAchievement = true;
    }
    if (hasFood && !this.isAchievementUnlocked('first-food')) {
      this.unlockAchievement('first-food');
      hasNewAchievement = true;
    }
    if (hasActivity && !this.isAchievementUnlocked('first-activity')) {
      this.unlockAchievement('first-activity');
      hasNewAchievement = true;
    }
    if (hasMilestone && !this.isAchievementUnlocked('first-milestone')) {
      this.unlockAchievement('first-milestone');
      hasNewAchievement = true;
    }

    // Check rating achievements
    const hasPerfectRating = completed.some(a => a.rating === 5);
    if (hasPerfectRating && !this.isAchievementUnlocked('perfect-rating')) {
      this.unlockAchievement('perfect-rating');
      hasNewAchievement = true;
    }

    // Check photo achievements
    if (stats.totalPhotos >= 10 && !this.isAchievementUnlocked('photo-master')) {
      this.unlockAchievement('photo-master');
      hasNewAchievement = true;
    }

    // Check surprise achievements
    const surpriseCount = this.adventures.filter(a => a.isSurprise).length;
    if (surpriseCount >= 5 && !this.isAchievementUnlocked('surprise-master')) {
      this.unlockAchievement('surprise-master');
      hasNewAchievement = true;
    }

    if (hasNewAchievement) {
      this.saveAdventuresToStorage();
    }
  }

  private isAchievementUnlocked(id: string): boolean {
    const achievement = this.achievements.find(a => a.id === id);
    return achievement?.unlockedAt !== undefined;
  }

  private unlockAchievement(id: string): void {
    const achievement = this.achievements.find(a => a.id === id);
    if (achievement && !achievement.unlockedAt) {
      achievement.unlockedAt = new Date();
      this.achievementsSubject.next([...this.achievements]);
    }
  }

  getUnlockedAchievements(): Achievement[] {
    return this.achievements.filter(a => a.unlockedAt !== undefined);
  }

  getAllAchievements(): Achievement[] {
    return [...this.achievements];
  }

  ngOnDestroy(): void {
    if (this.unsubscribeSnapshot) {
      this.unsubscribeSnapshot();
    }
  }
}
