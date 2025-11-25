import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AdventureService } from '../../services/adventure.service';
import { Adventure, AdventureCategory, Partner } from '../../models/task.model';

@Component({
  selector: 'app-adventure-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="slide-form-container">
      <div class="slide-header">
        <a routerLink="/adventures" class="close-btn">×</a>
        <div class="progress-bar">
          <div class="progress-fill" [style.width.%]="(currentSlide / totalSlides) * 100"></div>
        </div>
        <div class="slide-indicator">
          Step {{ currentSlide }} of {{ totalSlides }}
        </div>
      </div>

      <form [formGroup]="adventureForm" (ngSubmit)="onSubmit()" class="slides-wrapper">
        <div class="slides-container" [style.transform]="'translateX(-' + (currentSlide - 1) * 100 + '%)'">
          
          <!-- Slide 1: Title & Description -->
          <div class="slide">
            <div class="slide-content">
              <div class="slide-icon">✨</div>
              <h2>What's your adventure?</h2>
              <p class="slide-subtitle">Give it a memorable name</p>
              
              <div class="input-group">
                <input
                  type="text"
                  formControlName="title"
                  placeholder="e.g., Watch sunset at the beach"
                  class="slide-input"
                  (keyup.enter)="nextSlide()"
                />
                <div *ngIf="adventureForm.get('title')?.invalid && adventureForm.get('title')?.touched" 
                     class="error-message">
                  Title is required
                </div>
              </div>

              <div class="input-group">
                <textarea
                  formControlName="description"
                  placeholder="Tell us about this adventure... (optional)"
                  class="slide-textarea"
                  rows="4"
                ></textarea>
              </div>

              <div class="slide-actions">
                <button type="button" class="btn-next" (click)="nextSlide()" [disabled]="!adventureForm.get('title')?.valid">
                  Continue →
                </button>
              </div>
            </div>
          </div>

          <!-- Slide 2: Category -->
          <div class="slide">
            <div class="slide-content">
              <div class="slide-icon">🎯</div>
              <h2>Choose a category</h2>
              <p class="slide-subtitle">What type of adventure is this?</p>
              
              <div class="category-grid">
                <button
                  type="button"
                  *ngFor="let cat of categories"
                  class="category-card"
                  [class.active]="adventureForm.get('category')?.value === cat.value"
                  (click)="selectCategory(cat.value)"
                >
                  <div class="category-icon">{{ cat.icon }}</div>
                  <div class="category-name">{{ cat.label }}</div>
                </button>
              </div>

              <div class="input-group" *ngIf="adventureForm.get('category')?.value === 'custom'">
                <input
                  type="text"
                  formControlName="customCategory"
                  placeholder="Enter custom category name"
                  class="slide-input"
                />
              </div>

              <div class="slide-actions">
                <button type="button" class="btn-back" (click)="prevSlide()">← Back</button>
                <button type="button" class="btn-next" (click)="nextSlide()">Continue →</button>
              </div>
            </div>
          </div>

          <!-- Slide 3: Partners -->
          <div class="slide">
            <div class="slide-content">
              <div class="slide-icon">💑</div>
              <h2>Who's involved?</h2>
              <p class="slide-subtitle">Assign this adventure</p>
              
              <div class="partner-section">
                <div class="input-group">
                  <label>Assigned To</label>
                  <div class="partner-options">
                    <button
                      type="button"
                      *ngFor="let partner of partnerOptions"
                      class="partner-card"
                      [class.active]="adventureForm.get('assignedTo')?.value === partner.value"
                      (click)="adventureForm.patchValue({ assignedTo: partner.value })"
                    >
                      <div class="partner-icon">{{ partner.icon }}</div>
                      <div class="partner-label">{{ partner.label }}</div>
                    </button>
                  </div>
                </div>

                <div class="input-group">
                  <label>Created By</label>
                  <div class="partner-options">
                    <button
                      type="button"
                      *ngFor="let partner of partnerOptions"
                      class="partner-card"
                      [class.active]="adventureForm.get('createdBy')?.value === partner.value"
                      (click)="adventureForm.patchValue({ createdBy: partner.value })"
                    >
                      <div class="partner-icon">{{ partner.icon }}</div>
                      <div class="partner-label">{{ partner.label }}</div>
                    </button>
                  </div>
                </div>
              </div>

              <div class="slide-actions">
                <button type="button" class="btn-back" (click)="prevSlide()">← Back</button>
                <button type="button" class="btn-next" (click)="nextSlide()">Continue →</button>
              </div>
            </div>
          </div>

          <!-- Slide 4: Status & Dates -->
          <div class="slide">
            <div class="slide-content">
              <div class="slide-icon">📅</div>
              <h2>Status & Planning</h2>
              <p class="slide-subtitle">Where are you with this adventure?</p>
              
              <div class="input-group">
                <label>Status</label>
                <div class="status-options">
                  <button
                    type="button"
                    *ngFor="let status of statusOptions"
                    class="status-card"
                    [class.active]="adventureForm.get('status')?.value === status.value"
                    (click)="selectStatus(status.value)"
                  >
                    <div class="status-icon">{{ status.icon }}</div>
                    <div class="status-label">{{ status.label }}</div>
                  </button>
                </div>
              </div>

              <div class="input-group" *ngIf="adventureForm.get('status')?.value === 'planned' || adventureForm.get('status')?.value === 'in-progress'">
                <label>Target Date</label>
                <input
                  type="date"
                  formControlName="targetDate"
                  class="slide-input"
                />
              </div>

              <div class="input-group" *ngIf="isEditMode && adventureForm.get('status')?.value === 'completed'">
                <label>Completed Date</label>
                <input
                  type="date"
                  formControlName="completedDate"
                  class="slide-input"
                />
              </div>

              <div class="slide-actions">
                <button type="button" class="btn-back" (click)="prevSlide()">← Back</button>
                <button type="button" class="btn-next" (click)="nextSlide()">Continue →</button>
              </div>
            </div>
          </div>

          <!-- Slide 5: Location & Cost -->
          <div class="slide">
            <div class="slide-content">
              <div class="slide-icon">📍</div>
              <h2>Details</h2>
              <p class="slide-subtitle">Add location and budget (optional)</p>
              
              <div class="input-group">
                <input
                  type="text"
                  formControlName="location"
                  placeholder="Where will this happen?"
                  class="slide-input"
                />
              </div>

              <div class="input-group">
                <input
                  type="number"
                  formControlName="estimatedCost"
                  placeholder="Estimated cost ($)"
                  class="slide-input"
                  min="0"
                />
              </div>

              <div class="input-group">
                <label class="checkbox-label">
                  <input
                    type="checkbox"
                    formControlName="isSurprise"
                  />
                  <span>🎁 Make this a surprise (hidden until completed)</span>
                </label>
              </div>

              <div class="slide-actions">
                <button type="button" class="btn-back" (click)="prevSlide()">← Back</button>
                <button type="button" class="btn-next" (click)="nextSlide()">Continue →</button>
              </div>
            </div>
          </div>

          <!-- Slide 6: Photos -->
          <div class="slide">
            <div class="slide-content">
              <div class="slide-icon">📸</div>
              <h2>Add Memories</h2>
              <p class="slide-subtitle">Upload photos (optional)</p>
              
              <div class="photo-upload-section">
                <input
                  type="file"
                  #photoInput
                  accept="image/*"
                  multiple
                  (change)="onPhotoSelected($event)"
                  style="display: none"
                />
                <button type="button" class="photo-upload-btn" (click)="photoInput.click()">
                  📸 Add Photos
                </button>
                
                <div class="photo-preview-grid" *ngIf="photoPreviews.length > 0 || existingPhotos.length > 0">
                  <div class="photo-preview-item" *ngFor="let photo of photoPreviews; let i = index">
                    <img [src]="photo" alt="Preview" />
                    <button type="button" class="remove-photo" (click)="removePhoto(i)">×</button>
                  </div>
                  <div class="photo-preview-item" *ngFor="let photo of existingPhotos; let i = index">
                    <img [src]="photo" alt="Adventure photo" />
                    <button type="button" class="remove-photo" (click)="removeExistingPhoto(i)">×</button>
                  </div>
                </div>
              </div>

              <div class="slide-actions">
                <button type="button" class="btn-back" (click)="prevSlide()">← Back</button>
                <button type="button" class="btn-next" (click)="nextSlide()">Continue →</button>
              </div>
            </div>
          </div>

          <!-- Slide 7: Rating & Review (if completed) -->
          <ng-container *ngIf="isEditMode && adventureForm.get('status')?.value === 'completed'">
            <div class="slide">
              <div class="slide-content">
                <div class="slide-icon">⭐</div>
                <h2>Rate Your Experience</h2>
                <p class="slide-subtitle">How was this adventure?</p>
                
                <div class="rating-section">
                  <div class="rating-stars">
                    <button
                      type="button"
                      *ngFor="let star of [1,2,3,4,5]"
                      class="star-btn"
                      [class.active]="star <= (adventureForm.get('rating')?.value || 0)"
                      (click)="setRating(star)"
                    >
                      ⭐
                    </button>
                  </div>
                  <div class="rating-text" *ngIf="adventureForm.get('rating')?.value">
                    {{ adventureForm.get('rating')?.value }} star{{ adventureForm.get('rating')?.value !== 1 ? 's' : '' }}
                  </div>
                </div>

                <div class="input-group">
                  <textarea
                    formControlName="review"
                    placeholder="Share your memories and thoughts..."
                    class="slide-textarea"
                    rows="5"
                  ></textarea>
                </div>

                <div class="slide-actions">
                  <button type="button" class="btn-back" (click)="prevSlide()">← Back</button>
                  <button type="button" class="btn-next" (click)="nextSlide()">Continue →</button>
                </div>
              </div>
            </div>
          </ng-container>

          <!-- Slide 8: Notes & Submit -->
          <div class="slide">
            <div class="slide-content">
              <div class="slide-icon">📝</div>
              <h2>Final Details</h2>
              <p class="slide-subtitle">Any additional notes?</p>
              
              <div class="input-group">
                <textarea
                  formControlName="notes"
                  placeholder="Additional notes or reminders... (optional)"
                  class="slide-textarea"
                  rows="4"
                ></textarea>
              </div>

              <div class="slide-actions">
                <button type="button" class="btn-back" (click)="prevSlide()">← Back</button>
                <button type="submit" class="btn-submit" [disabled]="adventureForm.invalid">
                  {{ isEditMode ? 'Update Adventure' : 'Create Adventure' }} ✨
                </button>
              </div>
            </div>
          </div>

        </div>
      </form>
    </div>
  `,
  styles: [`
    .slide-form-container {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%);
      z-index: 1000;
      overflow: hidden;
    }

    .slide-header {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      padding: 20px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      z-index: 10;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .close-btn {
      position: absolute;
      top: 20px;
      right: 20px;
      font-size: 32px;
      color: #6b7280;
      text-decoration: none;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.2s;
      z-index: 11;
    }

    .close-btn:hover {
      background: #f3f4f6;
      color: #f5576c;
    }

    .progress-bar {
      width: 100%;
      height: 4px;
      background: #e5e7eb;
      border-radius: 2px;
      overflow: hidden;
      margin-top: 40px;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #f093fb 0%, #f5576c 100%);
      transition: width 0.3s ease;
      border-radius: 2px;
    }

    .slide-indicator {
      text-align: center;
      margin-top: 10px;
      font-size: 14px;
      color: #6b7280;
      font-weight: 500;
    }

    .slides-wrapper {
      position: absolute;
      top: 120px;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
    }

    .slides-container {
      display: flex;
      height: 100%;
      transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .slide {
      min-width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      overflow-y: auto;
    }

    .slide-content {
      max-width: 600px;
      width: 100%;
      background: white;
      border-radius: 24px;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
      animation: slideIn 0.5s ease;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .slide-icon {
      font-size: 64px;
      text-align: center;
      margin-bottom: 20px;
    }

    .slide-content h2 {
      text-align: center;
      font-size: 2rem;
      margin: 0 0 10px 0;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .slide-subtitle {
      text-align: center;
      color: #6b7280;
      margin: 0 0 30px 0;
      font-size: 16px;
    }

    .input-group {
      margin-bottom: 24px;
    }

    .input-group label {
      display: block;
      margin-bottom: 12px;
      font-weight: 600;
      color: #374151;
      font-size: 14px;
    }

    .slide-input, .slide-textarea {
      width: 100%;
      padding: 16px;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      font-size: 16px;
      transition: all 0.2s;
      font-family: inherit;
    }

    .slide-input:focus, .slide-textarea:focus {
      outline: none;
      border-color: #f5576c;
      box-shadow: 0 0 0 3px rgba(245, 87, 108, 0.1);
    }

    .slide-textarea {
      resize: vertical;
      min-height: 120px;
    }

    .error-message {
      color: #ef4444;
      font-size: 14px;
      margin-top: 8px;
    }

    .category-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 20px;
    }

    .category-card {
      padding: 20px;
      border: 2px solid #e5e7eb;
      border-radius: 16px;
      background: white;
      cursor: pointer;
      transition: all 0.2s;
      text-align: center;
    }

    .category-card:hover {
      border-color: #f5576c;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(245, 87, 108, 0.2);
    }

    .category-card.active {
      border-color: #f5576c;
      background: linear-gradient(135deg, #fef2f2 0%, #fce7f3 100%);
      box-shadow: 0 4px 12px rgba(245, 87, 108, 0.3);
    }

    .category-icon {
      font-size: 32px;
      margin-bottom: 8px;
    }

    .category-name {
      font-size: 14px;
      font-weight: 600;
      color: #1f2937;
    }

    .partner-section {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .partner-options {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }

    .partner-card {
      padding: 20px;
      border: 2px solid #e5e7eb;
      border-radius: 16px;
      background: white;
      cursor: pointer;
      transition: all 0.2s;
      text-align: center;
    }

    .partner-card:hover {
      border-color: #f5576c;
      transform: translateY(-2px);
    }

    .partner-card.active {
      border-color: #f5576c;
      background: linear-gradient(135deg, #fef2f2 0%, #fce7f3 100%);
    }

    .partner-icon {
      font-size: 32px;
      margin-bottom: 8px;
    }

    .partner-label {
      font-size: 14px;
      font-weight: 600;
      color: #1f2937;
    }

    .status-options {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .status-card {
      padding: 20px;
      border: 2px solid #e5e7eb;
      border-radius: 16px;
      background: white;
      cursor: pointer;
      transition: all 0.2s;
      text-align: center;
    }

    .status-card:hover {
      border-color: #f5576c;
      transform: translateY(-2px);
    }

    .status-card.active {
      border-color: #f5576c;
      background: linear-gradient(135deg, #fef2f2 0%, #fce7f3 100%);
    }

    .status-icon {
      font-size: 32px;
      margin-bottom: 8px;
    }

    .status-label {
      font-size: 14px;
      font-weight: 600;
      color: #1f2937;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      padding: 16px;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      transition: all 0.2s;
    }

    .checkbox-label:hover {
      border-color: #f5576c;
      background: #fef2f2;
    }

    .checkbox-label input[type="checkbox"] {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }

    .photo-upload-section {
      margin-bottom: 24px;
    }

    .photo-upload-btn {
      width: 100%;
      padding: 16px;
      border: 2px dashed #e5e7eb;
      border-radius: 12px;
      background: #f9fafb;
      cursor: pointer;
      font-size: 16px;
      font-weight: 600;
      color: #6b7280;
      transition: all 0.2s;
    }

    .photo-upload-btn:hover {
      border-color: #f5576c;
      background: #fef2f2;
      color: #f5576c;
    }

    .photo-preview-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 12px;
      margin-top: 16px;
    }

    .photo-preview-item {
      position: relative;
      aspect-ratio: 1;
      border-radius: 12px;
      overflow: hidden;
      border: 2px solid #e5e7eb;
    }

    .photo-preview-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .remove-photo {
      position: absolute;
      top: 4px;
      right: 4px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: rgba(239, 68, 68, 0.9);
      color: white;
      border: none;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }

    .rating-section {
      text-align: center;
      margin-bottom: 30px;
    }

    .rating-stars {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-bottom: 12px;
    }

    .star-btn {
      background: none;
      border: none;
      font-size: 40px;
      cursor: pointer;
      padding: 0;
      opacity: 0.3;
      transition: all 0.2s;
      filter: grayscale(100%);
    }

    .star-btn.active {
      opacity: 1;
      filter: grayscale(0%);
      transform: scale(1.1);
    }

    .star-btn:hover {
      opacity: 0.7;
      filter: grayscale(50%);
    }

    .rating-text {
      font-size: 16px;
      font-weight: 600;
      color: #6b7280;
    }

    .slide-actions {
      display: flex;
      gap: 12px;
      margin-top: 30px;
      justify-content: space-between;
    }

    .btn-back, .btn-next, .btn-submit {
      padding: 16px 32px;
      border: none;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-back {
      background: #f3f4f6;
      color: #6b7280;
    }

    .btn-back:hover {
      background: #e5e7eb;
    }

    .btn-next, .btn-submit {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
      flex: 1;
    }

    .btn-next:hover:not(:disabled), .btn-submit:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(245, 87, 108, 0.4);
    }

    .btn-next:disabled, .btn-submit:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .slide-content {
        padding: 30px 20px;
      }

      .category-grid, .partner-options {
        grid-template-columns: repeat(2, 1fr);
      }

      .status-options {
        grid-template-columns: 1fr;
      }

      .slide-content h2 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class AdventureFormComponent implements OnInit {
  adventureForm: FormGroup;
  isEditMode = false;
  adventureId: number | null = null;
  currentSlide = 1;
  totalSlides = 7;
  photoPreviews: string[] = [];
  existingPhotos: string[] = [];
  selectedPhotos: File[] = [];

  categories = [
    { value: 'travel' as AdventureCategory, label: 'Travel', icon: '✈️' },
    { value: 'food' as AdventureCategory, label: 'Food', icon: '🍽️' },
    { value: 'activity' as AdventureCategory, label: 'Activity', icon: '🎯' },
    { value: 'milestone' as AdventureCategory, label: 'Milestone', icon: '🎉' },
    { value: 'date-night' as AdventureCategory, label: 'Date Night', icon: '💕' },
    { value: 'home' as AdventureCategory, label: 'Home', icon: '🏠' },
    { value: 'custom' as AdventureCategory, label: 'Custom', icon: '✨' }
  ];

  partnerOptions = [
    { value: 'both' as Partner, label: 'Both of Us', icon: '💑' },
    { value: 'partner1' as Partner, label: 'Partner 1', icon: '👤' },
    { value: 'partner2' as Partner, label: 'Partner 2', icon: '👤' }
  ];

  statusOptions = [
    { value: 'wishlist' as Adventure['status'], label: 'Wishlist', icon: '💭' },
    { value: 'planned' as Adventure['status'], label: 'Planned', icon: '📅' },
    { value: 'in-progress' as Adventure['status'], label: 'In Progress', icon: '🚀' },
    { value: 'completed' as Adventure['status'], label: 'Completed', icon: '✅' }
  ];

  constructor(
    private fb: FormBuilder,
    private adventureService: AdventureService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.adventureForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      category: ['activity', Validators.required],
      customCategory: [''],
      assignedTo: ['both', Validators.required],
      createdBy: ['both', Validators.required],
      status: ['wishlist', Validators.required],
      targetDate: [''],
      completedDate: [''],
      location: [''],
      estimatedCost: [''],
      isSurprise: [false],
      rating: [''],
      review: [''],
      notes: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.adventureId = +id;
      this.loadAdventure(this.adventureId);
    }

    // Adjust total slides based on edit mode and status
    this.adventureForm.get('status')?.valueChanges.subscribe(() => {
      this.updateTotalSlides();
    });

    this.updateTotalSlides();
  }

  updateTotalSlides(): void {
    const status = this.adventureForm.get('status')?.value;
    this.totalSlides = 7;
    if (this.isEditMode && status === 'completed') {
      this.totalSlides = 8; // Include rating slide
    }
  }

  nextSlide(): void {
    if (this.currentSlide < this.totalSlides) {
      this.currentSlide++;
    }
  }

  prevSlide(): void {
    if (this.currentSlide > 1) {
      this.currentSlide--;
    }
  }

  selectCategory(category: AdventureCategory): void {
    this.adventureForm.patchValue({ category });
    if (category !== 'custom') {
      this.adventureForm.patchValue({ customCategory: '' });
    }
  }

  selectStatus(status: Adventure['status']): void {
    this.adventureForm.patchValue({ status });
    this.updateTotalSlides();
  }

  setRating(rating: number): void {
    const currentRating = this.adventureForm.get('rating')?.value;
    const newRating = currentRating === rating ? 0 : rating;
    this.adventureForm.patchValue({ rating: newRating });
  }

  loadAdventure(id: number): void {
    const adventure = this.adventureService.getAdventureById(id);
    if (adventure) {
      this.existingPhotos = [...adventure.photos];
      this.adventureForm.patchValue({
        title: adventure.title,
        description: adventure.description,
        category: adventure.category,
        customCategory: adventure.customCategory || '',
        assignedTo: adventure.assignedTo,
        createdBy: adventure.createdBy,
        status: adventure.status,
        targetDate: adventure.targetDate ? this.formatDateForInput(adventure.targetDate) : '',
        completedDate: adventure.completedDate ? this.formatDateForInput(adventure.completedDate) : '',
        location: adventure.location || '',
        estimatedCost: adventure.estimatedCost || '',
        isSurprise: adventure.isSurprise,
        rating: adventure.rating || '',
        review: adventure.review || '',
        notes: adventure.notes || ''
      });
      this.updateTotalSlides();
    } else {
      this.router.navigate(['/adventures']);
    }
  }

  formatDateForInput(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      Array.from(input.files).forEach(file => {
        if (file.type.startsWith('image/')) {
          this.selectedPhotos.push(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            if (result) {
              this.photoPreviews.push(result);
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  removePhoto(index: number): void {
    this.photoPreviews.splice(index, 1);
    this.selectedPhotos.splice(index, 1);
  }

  async removeExistingPhoto(index: number): Promise<void> {
    if (this.adventureId) {
      await this.adventureService.removePhotoFromAdventure(this.adventureId, index);
      this.existingPhotos.splice(index, 1);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.adventureForm.valid) {
      const formValue = this.adventureForm.value;
      
      const adventureData: any = {
        title: formValue.title,
        description: formValue.description || '',
        category: formValue.category,
        customCategory: formValue.category === 'custom' ? formValue.customCategory : undefined,
        assignedTo: formValue.assignedTo,
        createdBy: formValue.createdBy,
        status: formValue.status,
        location: formValue.location || undefined,
        estimatedCost: formValue.estimatedCost ? parseFloat(formValue.estimatedCost) : undefined,
        isSurprise: formValue.isSurprise || false,
        notes: formValue.notes || undefined
      };

      if (formValue.targetDate) {
        adventureData.targetDate = new Date(formValue.targetDate);
      }

      if (formValue.completedDate) {
        adventureData.completedDate = new Date(formValue.completedDate);
      }

      if (formValue.rating) {
        adventureData.rating = parseInt(formValue.rating);
      }

      if (formValue.review) {
        adventureData.review = formValue.review;
      }

      if (this.isEditMode && this.adventureId) {
        adventureData.photos = [...this.existingPhotos, ...this.photoPreviews];
        await this.adventureService.updateAdventure(this.adventureId, adventureData);
        this.router.navigate(['/adventures', this.adventureId]);
      } else {
        adventureData.photos = [...this.photoPreviews];
        await this.adventureService.createAdventure(adventureData);
        this.router.navigate(['/adventures']);
      }
    }
  }
}