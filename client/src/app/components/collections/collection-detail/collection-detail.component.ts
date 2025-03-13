import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CollectionService } from '../../../services/collection.service';
import { GameService } from '../../../services/game.service';

@Component({
  selector: 'app-collection-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './collection-detail.component.html',
  styleUrls: ['./collection-detail.component.scss']
})
export class CollectionDetailComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  collectionService = inject(CollectionService);
  gameService = inject(GameService);
  
  // Access signals
  collection = this.collectionService.currentCollection;
  loading = this.collectionService.loading;
  error = this.collectionService.error;
  
  collectionId = '';
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.collectionId = id;
      this.loadCollection(id);
    } else {
      this.router.navigate(['/collections']);
    }
  }
  
  async loadCollection(id: string): Promise<void> {
    await this.collectionService.getCollectionById(id);
  }
  
  async removeGame(gameId: string): Promise<void> {
    if (confirm('Are you sure you want to remove this game from the collection?')) {
      await this.collectionService.removeGameFromCollection(this.collectionId, gameId);
    }
  }
} 