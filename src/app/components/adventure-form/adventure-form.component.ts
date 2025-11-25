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
    <div class="card">
      <div class="header">
        <h1>{{ isEditMode ? 'Edit Adventure' : 'Create New Adventure' }}</h1>
      </div>

      <form [formGroup]="adventureForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="title">Adventure Title *</label>
          <input
            type="text"
            id="title"
            formControlName="title"
            placeholder="e.g., Watch sunset at the beach"
          />
          <div *ngIf="adventureForm.get('title')?.invalid && adventureForm.get('title')?.touched" 
               class="error-message">
            Title is required
          </div>
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea
            id="description"
            formControlName="description"
            placeholder="Tell us about this adventure..."
            rows="3"
          ></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="category">Category *</label>
            <select id="category" formControlName="category" (change)="onCategoryChange()">
              <option value="travel">✈️ Travel & Destinations</option>
              <option value="food">🍽️ Food & Dining</option>
              <option value="activity">🎯 Activities & Experiences</option>
              <option value="milestone">🎉 Milestones & Celebrations</option>
              <option value="date-night">💕 Date Nights</option>
              <option value="home">🏠 Home Projects</option>
              <option value="custom">✨ Custom</option>
            </select>
          </div>

          <div class="form-group" *ngIf="adventureForm.get('category')?.value === 'custom'">
            <label for="customCategory">Custom Category Name</label>
            <input
              type="text"
              id="customCategory"
              formControlName="customCategory"
              placeholder="Enter category name"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="assignedTo">Assigned To *</label>
            <select id="assignedTo" formControlName="assignedTo">
              <option value="both">💑 Both of Us</option>
              <option value="partner1">👤 Partner 1</option>
              <option value="partner2">👤 Partner 2</option>
            </select>
          </div>

          <div class="form-group">
            <label for="createdBy">Created By *</label>
            <select id="createdBy" formControlName="createdBy">
              <option value="both">💑 Both</option>
              <option value="partner1">👤 Partner 1</option>
              <option value="partner2">👤 Partner 2</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="status">Status *</label>
            <select id="status" formControlName="status">
              <option value="wishlist">💭 Wishlist</option>
              <option value="planned">📅 Planned</option>
              <option value="in-progress">🚀 In Progress</option>
              <option value="completed">✅ Completed</option>
            </select>
          </div>

          <div class="form-group" *ngIf="adventureForm.get('status')?.value === 'planned' || adventureForm.get('status')?.value === 'in-progress'">
            <label for="targetDate">Target Date</label>
            <input
              type="date"
              id="targetDate"
              formControlName="targetDate"
            />
          </div>
        </div>

        <div class="form-group" *ngIf="isEditMode && adventureForm.get('status')?.value === 'completed'">
          <label for="completedDate">Completed Date</label>
          <input
            type="date"
            id="completedDate"
            formControlName="completedDate"
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="location">Location</label>
            <input
              type="text"
              id="location"
              formControlName="location"
              placeholder="Where will this happen?"
            />
          </div>

          <div class="form-group">
            <label for="estimatedCost">Estimated Cost ($)</label>
            <input
              type="number"
              id="estimatedCost"
              formControlName="estimatedCost"
              placeholder="0"
              min="0"
            />
          </div>
        </div>

        <div class="form-group">
          <label>
            <input
              type="checkbox"
              formControlName="isSurprise"
            />
            🎁 Make this a surprise (hidden until completed)
          </label>
        </div>

        <div class="form-group" *ngIf="isEditMode && adventureForm.get('status')?.value === 'completed'">
          <label for="rating">Rating</label>
          <div class="rating-input">
            <button
              type="button"
              *ngFor="let star of [1,2,3,4,5]"
              class="star-btn"
              [class.active]="star <= (adventureForm.get('rating')?.value || 0)"
              (click)="setRating(star)"
            >
              ⭐
            </button>
            <span class="rating-text" *ngIf="adventureForm.get('rating')?.value">
              {{ adventureForm.get('rating')?.value }} star{{ adventureForm.get('rating')?.value !== 1 ? 's' : '' }}
            </span>
          </div>
        </div>

        <div class="form-group" *ngIf="isEditMode && adventureForm.get('status')?.value === 'completed'">
          <label for="review">Review / Notes</label>
          <textarea
            id="review"
            formControlName="review"
            placeholder="How was it? Share your memories..."
            rows="3"
          ></textarea>
        </div>

        <div class="form-group" *ngIf="isEditMode">
          <label>Photos</label>
          <div class="photo-upload">
            <input
              type="file"
              #photoInput
              accept="image/*"
              multiple
              (change)="onPhotoSelected($event)"
              style="display: none"
            />
            <button type="button" class="btn btn-secondary" (click)="photoInput.click()">
              📸 Add Photos
            </button>
            <div class="photo-preview" *ngIf="photoPreviews.length > 0">
              <div class="photo-item" *ngFor="let photo of photoPreviews; let i = index">
                <img [src]="photo" alt="Preview" />
                <button type="button" class="remove-photo" (click)="removePhoto(i)">×</button>
              </div>
            </div>
            <div class="existing-photos" *ngIf="existingPhotos.length > 0">
              <h4>Existing Photos:</h4>
              <div class="photo-preview">
                <div class="photo-item" *ngFor="let photo of existingPhotos; let i = index">
                  <img [src]="photo" alt="Adventure photo" />
                  <button type="button" class="remove-photo" (click)="removeExistingPhoto(i)">×</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="notes">Additional Notes</label>
          <textarea
            id="notes"
            formControlName="notes"
            placeholder="Any other details or reminders..."
            rows="2"
          ></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-success" [disabled]="adventureForm.invalid">
            {{ isEditMode ? 'Update Adventure' : 'Create Adventure' }}
          </button>
          <a [routerLink]="isEditMode ? ['/adventures', adventureId] : '/adventures'" class="btn btn-secondary">Cancel</a>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }

    .error-message {
      color: #ef4444;
      font-size: 12px;
      margin-top: 5px;
    }

    .rating-input {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .star-btn {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      padding: 0;
      opacity: 0.3;
      transition: all 0.2s;
    }

    .star-btn.active {
      opacity: 1;
      transform: scale(1.1);
    }

    .star-btn:hover {
      opacity: 0.7;
    }

    .rating-text {
      margin-left: 10px;
      color: #666;
      font-weight: 500;
    }

    .photo-upload {
      margin-top: 10px;
    }

    .photo-preview {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 10px;
      margin-top: 15px;
    }

    .photo-item {
      position: relative;
      aspect-ratio: 1;
      border-radius: 8px;
      overflow: hidden;
      border: 2px solid #e5e7eb;
    }

    .photo-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .remove-photo {
      position: absolute;
      top: 5px;
      right: 5px;
      background: rgba(239, 68, 68, 0.9);
      color: white;
      border: none;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }

    .remove-photo:hover {
      background: rgba(239, 68, 68, 1);
    }

    .existing-photos {
      margin-top: 20px;
    }

    .existing-photos h4 {
      margin-bottom: 10px;
      color: #666;
      font-size: 14px;
    }
  `]
})
export class AdventureFormComponent implements OnInit {
  adventureForm: FormGroup;
  isEditMode = false;
  adventureId: number | null = null;
  photoPreviews: string[] = [];
  existingPhotos: string[] = [];
  selectedPhotos: File[] = [];

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

    // Watch status changes to show/hide fields
    this.adventureForm.get('status')?.valueChanges.subscribe(() => {
      this.updateFormValidation();
    });
  }

  onCategoryChange(): void {
    const category = this.adventureForm.get('category')?.value;
    if (category !== 'custom') {
      this.adventureForm.patchValue({ customCategory: '' });
    }
  }

  updateFormValidation(): void {
    // Add any dynamic validation logic here if needed
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

  setRating(rating: number): void {
    const currentRating = this.adventureForm.get('rating')?.value;
    const newRating = currentRating === rating ? 0 : rating;
    this.adventureForm.patchValue({ rating: newRating });
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

      // Include photos in adventure data
      if (this.isEditMode && this.adventureId) {
        // Combine existing photos with new previews
        adventureData.photos = [...this.existingPhotos, ...this.photoPreviews];
        await this.adventureService.updateAdventure(this.adventureId, adventureData);
        this.router.navigate(['/adventures', this.adventureId]);
      } else {
        // Include new photos in creation
        adventureData.photos = [...this.photoPreviews];
        await this.adventureService.createAdventure(adventureData);
        this.router.navigate(['/adventures']);
      }
    }
  }
}
