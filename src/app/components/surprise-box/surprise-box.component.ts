import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AdventureService } from '../../services/adventure.service';
import { Surprise, Partner, Comment } from '../../models/task.model';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-surprise-box',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LoaderComponent],
  template: `
    <app-loader *ngIf="isLoading"></app-loader>
    <div class="surprise-box-container">
      <div class="surprise-header">
        <a routerLink="/dashboard" class="back-link">← Back to Dashboard</a>
        <h1>🎁 Surprise Box</h1>
        <button class="btn-add-surprise" (click)="showAddSurprise = !showAddSurprise">
          + Add Surprise
        </button>
      </div>

      <!-- Add Surprise Form -->
      <div class="add-surprise-section" *ngIf="showAddSurprise">
        <div class="add-surprise-card">
          <h2>Create a Surprise</h2>
          <div class="photo-upload-area" (click)="photoInput.click()" [class.has-photo]="selectedSurprisePhoto">
            <input
              type="file"
              #photoInput
              accept="image/*"
              (change)="onSurprisePhotoSelected($event)"
              style="display: none"
            />
            <div *ngIf="!selectedSurprisePhoto" class="upload-placeholder">
              <div class="upload-icon">📸</div>
              <div class="upload-text">Click to upload a photo</div>
            </div>
            <div *ngIf="selectedSurprisePhoto" class="photo-preview">
              <img [src]="selectedSurprisePhoto" alt="Surprise preview" />
              <button type="button" class="remove-photo-btn" (click)="removeSurprisePhoto()" (click)="$event.stopPropagation()">×</button>
            </div>
          </div>
          <div class="surprise-form-fields" *ngIf="selectedSurprisePhoto">
            <div class="input-group">
              <label>From</label>
              <div class="partner-selector">
                <button
                  type="button"
                  *ngFor="let partner of partnerOptions"
                  class="partner-select-btn"
                  [class.active]="surpriseFrom === partner.value"
                  (click)="surpriseFrom = partner.value"
                >
                  {{ partner.icon }} {{ partner.label }}
                </button>
              </div>
            </div>
            <div class="input-group">
              <label>To</label>
              <div class="partner-selector">
                <button
                  type="button"
                  *ngFor="let partner of partnerOptions"
                  class="partner-select-btn"
                  [class.active]="surpriseTo === partner.value"
                  (click)="surpriseTo = partner.value"
                >
                  {{ partner.icon }} {{ partner.label }}
                </button>
              </div>
            </div>
            <div class="input-group">
              <label>Message (optional)</label>
              <textarea
                [(ngModel)]="surpriseMessage"
                placeholder="Add a sweet message..."
                class="surprise-message-input"
                rows="3"
              ></textarea>
            </div>
            <div class="form-actions">
              <button class="btn-cancel" (click)="cancelAddSurprise()">Cancel</button>
              <button class="btn-create-surprise" (click)="createSurprise()" [disabled]="!selectedSurprisePhoto || !surpriseFrom || !surpriseTo">
                🎁 Create Surprise
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Slideshow View -->
      <div class="slideshow-container" *ngIf="allSurprises.length > 0">
        <div class="slideshow-header">
          <div class="slideshow-nav">
            <button class="nav-btn" (click)="previousSlide()" [disabled]="currentIndex === 0">←</button>
            <span class="slide-counter">{{ currentIndex + 1 }} / {{ allSurprises.length }}</span>
            <button class="nav-btn" (click)="nextSlide()" [disabled]="currentIndex === allSurprises.length - 1">→</button>
          </div>
          <div class="thumbnail-strip">
            <div
              *ngFor="let surprise of allSurprises; let i = index"
              class="thumbnail"
              [class.active]="i === currentIndex"
              [class.latest]="i === 0"
              (click)="goToSlide(i)"
            >
              <img [src]="surprise.photo" [alt]="'Surprise ' + (i + 1)" />
              <div class="thumbnail-badge" *ngIf="i === 0">✨ Latest</div>
            </div>
          </div>
        </div>

        <div class="main-slide">
          <div class="slide-content">
            <div class="surprise-photo-container" [class.latest]="currentIndex === 0" *ngIf="currentSurprise">
              <img [src]="currentSurprise.photo" [alt]="'Surprise from ' + getPartnerLabel(currentSurprise.from)" />
              <div class="latest-badge" *ngIf="currentIndex === 0">✨ Latest Surprise</div>
            </div>
              <div class="surprise-info" *ngIf="currentSurprise">
              <div class="surprise-header-info">
                <div class="surprise-from-to">
                  <span class="from-badge">{{ getPartnerIcon(currentSurprise.from) }} {{ getPartnerLabel(currentSurprise.from) }}</span>
                  <span class="arrow">→</span>
                  <span class="to-badge">{{ getPartnerIcon(currentSurprise.to) }} {{ getPartnerLabel(currentSurprise.to) }}</span>
                </div>
                <div class="surprise-date">{{ currentSurprise.createdAt | date:'fullDate' }}</div>
                <div class="surprise-date" *ngIf="currentSurprise.revealedAt">
                  Revealed: {{ currentSurprise.revealedAt | date:'fullDate' }}
                </div>
              </div>
              <p class="surprise-message" *ngIf="currentSurprise.message">{{ currentSurprise.message }}</p>

              <!-- Comments Section -->
              <div class="comments-section" *ngIf="currentSurprise">
                <div class="comments-header">
                  <h3>💬 Comments</h3>
                  <span class="comment-count">{{ (currentSurprise.comments || []).length }}</span>
                </div>

                <div class="comments-list" *ngIf="currentSurprise.comments && currentSurprise.comments.length > 0">
                  <div *ngFor="let comment of currentSurprise.comments" class="comment-item" [class.partner1]="comment.author === 'partner1'" [class.partner2]="comment.author === 'partner2'">
                    <div class="comment-avatar">
                      {{ comment.author === 'partner1' ? '👨' : comment.author === 'partner2' ? '👩' : '💑' }}
                    </div>
                    <div class="comment-content">
                      <div class="comment-header">
                        <span class="comment-author">{{ getPartnerLabel(comment.author) }}</span>
                        <span class="comment-date">{{ comment.createdAt | date:'short' }}</span>
                      </div>
                      <p class="comment-text">{{ comment.text }}</p>
                    </div>
                    <button class="comment-delete" (click)="deleteComment(currentSurprise!.id, comment.id)" title="Delete">×</button>
                  </div>
                </div>

                <div class="comment-form">
                  <div class="comment-input-wrapper">
                    <textarea
                      [(ngModel)]="newCommentText"
                      placeholder="Add a comment..."
                      class="comment-input"
                      rows="2"
                      (keydown)="onCommentKeyDown($event)"
                    ></textarea>
                    <div class="comment-author-selector">
                      <button
                        type="button"
                        *ngFor="let partner of partnerOptions"
                        class="author-btn"
                        [class.active]="selectedCommentAuthor === partner.value"
                        (click)="selectedCommentAuthor = partner.value"
                      >
                        {{ partner.icon }} {{ partner.label }}
                      </button>
                    </div>
                  </div>
                  <button
                    class="comment-submit-btn"
                    (click)="addComment()"
                    [disabled]="!newCommentText?.trim()"
                  >
                    Post
                  </button>
                </div>
              </div>

              <div class="surprise-actions" *ngIf="currentSurprise">
                <button class="btn-reveal" *ngIf="!currentSurprise.revealed" (click)="revealSurprise(currentSurprise.id)">
                  🎉 Reveal Surprise
                </button>
                <button class="btn-delete-surprise" (click)="deleteSurprise(currentSurprise.id)" title="Delete">
                  🗑 Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="allSurprises.length === 0">
        <div class="empty-icon">🎁</div>
        <h2>No surprises yet</h2>
        <p>Create your first surprise to start the magic!</p>
        <button class="btn-add-surprise" (click)="showAddSurprise = true">+ Add Surprise</button>
      </div>
    </div>
  `,
  styles: [`
    .surprise-box-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .surprise-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      flex-wrap: wrap;
      gap: 15px;
    }

    .surprise-header h1 {
      margin: 0;
      font-size: 2.5rem;
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .back-link {
      color: #f5576c;
      text-decoration: none;
      font-weight: 500;
      font-size: 16px;
    }

    .back-link:hover {
      text-decoration: underline;
    }

    .btn-add-surprise {
      padding: 12px 24px;
      border: none;
      border-radius: 12px;
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      color: white;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-add-surprise:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(251, 191, 36, 0.4);
    }

    .add-surprise-section {
      margin-bottom: 40px;
    }

    .add-surprise-card {
      background: white;
      border-radius: 16px;
      padding: 30px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .add-surprise-card h2 {
      margin: 0 0 20px 0;
      color: #1f2937;
    }

    .photo-upload-area {
      width: 100%;
      min-height: 300px;
      border: 2px dashed #fbbf24;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      background: #fffbeb;
      position: relative;
      overflow: hidden;
    }

    .photo-upload-area:hover {
      border-color: #f59e0b;
      background: #fef3c7;
    }

    .photo-upload-area.has-photo {
      border: 2px solid #fbbf24;
      min-height: 400px;
    }

    .upload-placeholder {
      text-align: center;
      color: #92400e;
    }

    .upload-icon {
      font-size: 64px;
      margin-bottom: 16px;
    }

    .upload-text {
      font-size: 18px;
      font-weight: 500;
    }

    .photo-preview {
      width: 100%;
      height: 100%;
      position: relative;
    }

    .photo-preview img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: 8px;
    }

    .remove-photo-btn {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(239, 68, 68, 0.9);
      color: white;
      border: none;
      cursor: pointer;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }

    .remove-photo-btn:hover {
      background: rgba(239, 68, 68, 1);
    }

    .surprise-form-fields {
      margin-top: 24px;
    }

    .input-group {
      margin-bottom: 20px;
    }

    .input-group label {
      display: block;
      margin-bottom: 10px;
      font-weight: 600;
      color: #1f2937;
      font-size: 14px;
    }

    .partner-selector {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .partner-select-btn {
      padding: 10px 20px;
      border: 2px solid #fbbf24;
      background: white;
      border-radius: 10px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      color: #78350f;
      transition: all 0.2s;
    }

    .partner-select-btn:hover {
      background: #fef3c7;
    }

    .partner-select-btn.active {
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      color: white;
      border-color: transparent;
    }

    .surprise-message-input {
      width: 100%;
      padding: 12px;
      border: 2px solid #fbbf24;
      border-radius: 10px;
      font-size: 14px;
      font-family: inherit;
      resize: vertical;
      min-height: 100px;
    }

    .surprise-message-input:focus {
      outline: none;
      border-color: #f59e0b;
      box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.1);
    }

    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    .btn-cancel {
      padding: 12px 24px;
      border: 2px solid #e5e7eb;
      border-radius: 10px;
      background: white;
      color: #6b7280;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-cancel:hover {
      background: #f3f4f6;
    }

    .btn-create-surprise {
      padding: 12px 24px;
      border: none;
      border-radius: 10px;
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      color: white;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-create-surprise:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(251, 191, 36, 0.4);
    }

    .btn-create-surprise:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .slideshow-container {
      background: white;
      border-radius: 20px;
      padding: 30px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .slideshow-header {
      margin-bottom: 30px;
    }

    .slideshow-nav {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;
      margin-bottom: 20px;
    }

    .nav-btn {
      padding: 12px 20px;
      border: 2px solid #fbbf24;
      border-radius: 10px;
      background: white;
      color: #78350f;
      font-size: 18px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .nav-btn:hover:not(:disabled) {
      background: #fef3c7;
    }

    .nav-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .slide-counter {
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
    }

    .thumbnail-strip {
      display: flex;
      gap: 12px;
      overflow-x: auto;
      padding: 10px 0;
      scrollbar-width: thin;
    }

    .thumbnail {
      position: relative;
      width: 80px;
      height: 80px;
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      border: 3px solid transparent;
      transition: all 0.2s;
      flex-shrink: 0;
    }

    .thumbnail:hover {
      transform: scale(1.1);
    }

    .thumbnail.active {
      border-color: #fbbf24;
      box-shadow: 0 0 0 2px rgba(251, 191, 36, 0.3);
    }

    .thumbnail.latest {
      border-color: #f59e0b;
    }

    .thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .thumbnail-badge {
      position: absolute;
      top: 4px;
      right: 4px;
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      color: white;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 600;
    }

    .main-slide {
      position: relative;
    }

    .slide-content {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .surprise-photo-container {
      position: relative;
      width: 100%;
      aspect-ratio: 16/9;
      border-radius: 16px;
      overflow: hidden;
      background: #f3f4f6;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }

    .surprise-photo-container.latest {
      border: 3px solid #fbbf24;
      box-shadow: 0 8px 24px rgba(251, 191, 36, 0.3);
    }

    .surprise-photo-container img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .latest-badge {
      position: absolute;
      top: 16px;
      right: 16px;
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(251, 191, 36, 0.4);
    }

    .surprise-info {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .surprise-header-info {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .surprise-from-to {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .from-badge, .to-badge {
      padding: 8px 16px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      color: #78350f;
    }

    .arrow {
      color: #92400e;
      font-weight: 600;
      font-size: 18px;
    }

    .surprise-date {
      font-size: 14px;
      color: #6b7280;
    }

    .surprise-message {
      font-size: 16px;
      color: #4b5563;
      font-style: italic;
      line-height: 1.6;
      padding: 16px;
      background: #f9fafb;
      border-radius: 12px;
      border-left: 4px solid #fbbf24;
    }

    .comments-section {
      border-top: 2px solid #f3f4f6;
      padding-top: 24px;
    }

    .comments-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }

    .comments-header h3 {
      margin: 0;
      color: #1f2937;
    }

    .comment-count {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
    }

    .comments-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 24px;
    }

    .comment-item {
      display: flex;
      gap: 12px;
      padding: 16px;
      background: #f9fafb;
      border-radius: 16px;
      position: relative;
      transition: all 0.2s;
    }

    .comment-item:hover {
      background: #f3f4f6;
    }

    .comment-item.partner1 {
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      border-left: 4px solid #3b82f6;
    }

    .comment-item.partner2 {
      background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
      border-left: 4px solid #ec4899;
    }

    .comment-avatar {
      font-size: 32px;
      flex-shrink: 0;
    }

    .comment-content {
      flex: 1;
      min-width: 0;
    }

    .comment-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      gap: 12px;
    }

    .comment-author {
      font-weight: 600;
      color: #1f2937;
      font-size: 14px;
    }

    .comment-date {
      font-size: 12px;
      color: #9ca3af;
      white-space: nowrap;
    }

    .comment-text {
      color: #4b5563;
      line-height: 1.6;
      margin: 0;
      word-wrap: break-word;
    }

    .comment-delete {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 24px;
      height: 24px;
      border: none;
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      border-radius: 50%;
      cursor: pointer;
      font-size: 18px;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: all 0.2s;
    }

    .comment-item:hover .comment-delete {
      opacity: 1;
    }

    .comment-delete:hover {
      background: rgba(239, 68, 68, 0.2);
    }

    .comment-form {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .comment-input-wrapper {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .comment-input {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      font-size: 14px;
      font-family: inherit;
      resize: vertical;
      min-height: 60px;
      transition: all 0.2s;
    }

    .comment-input:focus {
      outline: none;
      border-color: #f5576c;
      box-shadow: 0 0 0 3px rgba(245, 87, 108, 0.1);
    }

    .comment-author-selector {
      display: flex;
      gap: 8px;
    }

    .author-btn {
      padding: 6px 12px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      background: white;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .author-btn:hover {
      border-color: #f5576c;
      background: #fef2f2;
    }

    .author-btn.active {
      border-color: #f5576c;
      background: linear-gradient(135deg, #fef2f2 0%, #fce7f3 100%);
      color: #f5576c;
    }

    .comment-submit-btn {
      align-self: flex-end;
      padding: 10px 24px;
      border: none;
      border-radius: 12px;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .comment-submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(245, 87, 108, 0.4);
    }

    .comment-submit-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .surprise-actions {
      display: flex;
      gap: 12px;
      padding-top: 20px;
      border-top: 2px solid #f3f4f6;
    }

    .btn-reveal {
      flex: 1;
      padding: 12px 24px;
      border: none;
      border-radius: 12px;
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      color: white;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-reveal:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(251, 191, 36, 0.4);
    }

    .btn-delete-surprise {
      padding: 12px 24px;
      border: 2px solid #ef4444;
      border-radius: 12px;
      background: white;
      color: #ef4444;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-delete-surprise:hover {
      background: #fee2e2;
    }

    .empty-state {
      text-align: center;
      padding: 80px 40px;
      background: white;
      border-radius: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .empty-icon {
      font-size: 80px;
      margin-bottom: 24px;
    }

    .empty-state h2 {
      margin: 0 0 12px 0;
      color: #1f2937;
      font-size: 1.75rem;
    }

    .empty-state p {
      color: #6b7280;
      margin-bottom: 28px;
      font-size: 16px;
    }

    @media (max-width: 768px) {
      .surprise-box-container {
        padding: 12px;
      }

      .surprise-header h1 {
        font-size: 1.75rem;
      }

      .add-surprise-card {
        padding: 20px;
      }

      .slideshow-container {
        padding: 20px;
      }

      .surprise-photo-container {
        aspect-ratio: 4/3;
      }

      .thumbnail {
        width: 60px;
        height: 60px;
      }
    }
  `]
})
export class SurpriseBoxComponent implements OnInit {
  allSurprises: Surprise[] = [];
  currentIndex = 0;
  isLoading = false;
  showAddSurprise = false;
  
  selectedSurprisePhoto: string | null = null;
  surpriseFrom: Partner | null = null;
  surpriseTo: Partner | null = null;
  surpriseMessage: string = '';
  
  newCommentText: string = '';
  selectedCommentAuthor: Partner = 'both';

  partnerOptions = [
    { value: 'partner1' as Partner, label: 'Doree', icon: '👨' },
    { value: 'partner2' as Partner, label: 'Nobuu', icon: '👩' },
    { value: 'both' as Partner, label: 'Both', icon: '💑' }
  ];

  constructor(
    private adventureService: AdventureService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSurprises();
    this.adventureService.surprises$.subscribe(() => {
      this.loadSurprises();
    });
    this.adventureService.loading$.subscribe(loading => {
      this.isLoading = loading;
    });
  }

  get currentSurprise(): Surprise | null {
    if (this.allSurprises.length === 0) return null;
    const surprise = this.allSurprises[this.currentIndex];
    if (!surprise.comments) {
      surprise.comments = [];
    }
    return surprise;
  }

  loadSurprises(): void {
    const all = this.adventureService.getAllSurprises();
    // Sort by creation date, newest first, and ensure latest is at index 0
    this.allSurprises = all.sort((a, b) => {
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
    // If we had a current surprise, try to maintain position
    if (this.allSurprises.length > 0 && this.currentIndex >= this.allSurprises.length) {
      this.currentIndex = 0;
    }
  }

  nextSlide(): void {
    if (this.currentIndex < this.allSurprises.length - 1) {
      this.currentIndex++;
    }
  }

  previousSlide(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
  }

  onSurprisePhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          if (result) {
            this.selectedSurprisePhoto = result;
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeSurprisePhoto(): void {
    this.selectedSurprisePhoto = null;
  }

  cancelAddSurprise(): void {
    this.showAddSurprise = false;
    this.selectedSurprisePhoto = null;
    this.surpriseFrom = null;
    this.surpriseTo = null;
    this.surpriseMessage = '';
  }

  async createSurprise(): Promise<void> {
    if (this.selectedSurprisePhoto && this.surpriseFrom && this.surpriseTo) {
      await this.adventureService.createSurprise(
        this.selectedSurprisePhoto,
        this.surpriseFrom,
        this.surpriseTo,
        this.surpriseMessage || undefined
      );
      this.cancelAddSurprise();
      this.currentIndex = 0; // Show the latest (newly created) surprise
    }
  }

  async revealSurprise(id: string): Promise<void> {
    await this.adventureService.revealSurprise(id);
  }

  async deleteSurprise(id: string): Promise<void> {
    if (confirm('Are you sure you want to delete this surprise?')) {
      await this.adventureService.deleteSurprise(id);
      if (this.currentIndex >= this.allSurprises.length) {
        this.currentIndex = Math.max(0, this.allSurprises.length - 1);
      }
    }
  }

  async addComment(): Promise<void> {
    if (this.newCommentText?.trim() && this.currentSurprise) {
      await this.adventureService.addCommentToSurprise(
        this.currentSurprise.id,
        this.newCommentText.trim(),
        this.selectedCommentAuthor
      );
      this.newCommentText = '';
      // Reload to get updated comments
      this.loadSurprises();
    }
  }

  onCommentKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      this.addComment();
    }
  }

  async deleteComment(surpriseId: string, commentId: string): Promise<void> {
    await this.adventureService.deleteCommentFromSurprise(surpriseId, commentId);
  }

  getPartnerLabel(partner: Partner): string {
    const partnerOption = this.partnerOptions.find(p => p.value === partner);
    return partnerOption?.label || partner;
  }

  getPartnerIcon(partner: Partner): string {
    const partnerOption = this.partnerOptions.find(p => p.value === partner);
    return partnerOption?.icon || '💑';
  }
}

