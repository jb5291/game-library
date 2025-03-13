import { Component, OnInit, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CollectionService, Collection } from '../../../services/collection.service';

@Component({
  selector: 'app-add-to-collection',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="add-to-collection">
      <button (click)="showDialog = true" class="btn btn-secondary">Add to Collection</button>
      
      @if (showDialog) {
        <div class="collection-dialog">
          <div class="dialog-content">
            <h3>Add to Collection</h3>
            
            @if (loading()) {
              <div class="loading">Loading collections...</div>
            } @else if (collections().length === 0) {
              <p>You don't have any collections yet.</p>
              <a routerLink="/collections/new" class="btn btn-primary">Create Collection</a>
            } @else {
              <div class="collections-list">
                @for (collection of collections(); track collection._id) {
                  <div class="collection-item">
                    <label>
                      <input 
                        type="checkbox" 
                        [checked]="isGameInCollection(collection)"
                        (change)="toggleCollection(collection)"
                      >
                      {{ collection.name }}
                    </label>
                  </div>
                }
              </div>
              <div class="dialog-actions">
                <button (click)="saveChanges()" class="btn btn-primary">Save</button>
                <button (click)="showDialog = false" class="btn btn-secondary">Cancel</button>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .add-to-collection {
      position: relative;
    }
    
    .collection-dialog {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    
    .dialog-content {
      background-color: white;
      border-radius: 8px;
      padding: 20px;
      width: 400px;
      max-width: 90%;
      max-height: 80vh;
      overflow-y: auto;
    }
    
    .collections-list {
      margin: 15px 0;
    }
    
    .collection-item {
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }
    
    .dialog-actions {
      margin-top: 20px;
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }
    
    .btn {
      display: inline-block;
      font-weight: 400;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      user-select: none;
      border: 1px solid transparent;
      padding: 0.375rem 0.75rem;
      font-size: 1rem;
      line-height: 1.5;
      border-radius: 0.25rem;
      cursor: pointer;
    }
    
    .btn-primary {
      color: #fff;
      background-color: #007bff;
      border-color: #007bff;
    }
    
    .btn-secondary {
      color: #fff;
      background-color: #6c757d;
      border-color: #6c757d;
    }
  `]
})
export class AddToCollectionComponent implements OnInit {
  @Input() gameId!: string;
  
  collectionService = inject(CollectionService);
  
  collections = this.collectionService.collections;
  loading = this.collectionService.loading;
  
  showDialog = false;
  selectedCollections: Set<string> = new Set();
  originalCollections: Set<string> = new Set();
  
  ngOnInit(): void {
    this.loadCollections();
  }
  
  async loadCollections(): Promise<void> {
    await this.collectionService.getUserCollections();
    
    // Initialize selected collections based on which collections already contain the game
    this.collections().forEach(collection => {
      const gameIds = collection.games.map(g => typeof g === 'string' ? g : g._id);
      if (gameIds.includes(this.gameId)) {
        this.selectedCollections.add(collection._id);
        this.originalCollections.add(collection._id);
      }
    });
  }
  
  isGameInCollection(collection: Collection): boolean {
    return this.selectedCollections.has(collection._id);
  }
  
  toggleCollection(collection: Collection): void {
    if (this.selectedCollections.has(collection._id)) {
      this.selectedCollections.delete(collection._id);
    } else {
      this.selectedCollections.add(collection._id);
    }
  }
  
  async saveChanges(): Promise<void> {
    // Collections to add the game to
    const collectionsToAdd = Array.from(this.selectedCollections)
      .filter(id => !this.originalCollections.has(id));
    
    // Collections to remove the game from
    const collectionsToRemove = Array.from(this.originalCollections)
      .filter(id => !this.selectedCollections.has(id));
    
    // Add game to collections
    for (const collectionId of collectionsToAdd) {
      await this.collectionService.addGamesToCollection(collectionId, [this.gameId]);
    }
    
    // Remove game from collections
    for (const collectionId of collectionsToRemove) {
      await this.collectionService.removeGameFromCollection(collectionId, this.gameId);
    }
    
    this.showDialog = false;
  }
} 