import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CollectionService } from '../../../services/collection.service';

@Component({
  selector: 'app-collections-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './collections-list.component.html',
  styleUrls: ['./collections-list.component.scss']
})
export class CollectionsListComponent implements OnInit {
  collectionService = inject(CollectionService);
  
  // Access signals
  collections = this.collectionService.collections;
  loading = this.collectionService.loading;
  error = this.collectionService.error;
  
  ngOnInit(): void {
    this.loadCollections();
  }
  
  async loadCollections(): Promise<void> {
    await this.collectionService.getUserCollections();
  }
  
  async deleteCollection(id: string, event: Event): Promise<void> {
    event.preventDefault();
    event.stopPropagation();
    
    if (confirm('Are you sure you want to delete this collection?')) {
      await this.collectionService.deleteCollection(id);
    }
  }
} 