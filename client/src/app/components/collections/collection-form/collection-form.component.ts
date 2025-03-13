import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CollectionService } from '../../../services/collection.service';

@Component({
  selector: 'app-collection-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './collection-form.component.html',
  styleUrls: ['./collection-form.component.scss']
})
export class CollectionFormComponent implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  collectionService = inject(CollectionService);
  
  // Access signals
  loading = this.collectionService.loading;
  error = this.collectionService.error;
  
  isEditMode = false;
  collectionId = '';
  
  // Form model
  collectionForm = {
    name: '',
    description: '',
    isPublic: false,
    coverImage: ''
  };
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.collectionId = id;
      this.loadCollection(id);
    }
  }
  
  async loadCollection(id: string): Promise<void> {
    const collection = await this.collectionService.getCollectionById(id);
    if (collection) {
      this.collectionForm = {
        name: collection.name,
        description: collection.description || '',
        isPublic: collection.isPublic,
        coverImage: collection.coverImage || ''
      };
    }
  }
  
  async saveCollection(): Promise<void> {
    if (this.isEditMode) {
      const updated = await this.collectionService.updateCollection(
        this.collectionId, 
        this.collectionForm
      );
      
      if (updated) {
        this.router.navigate(['/collections']);
      }
    } else {
      const created = await this.collectionService.createCollection(this.collectionForm);
      
      if (created) {
        this.router.navigate(['/collections']);
      }
    }
  }
} 