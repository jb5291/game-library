import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GameService } from '../../services/game.service';
import { Game } from '../../models/game';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-game-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './game-detail.component.html',
  styleUrl: './game-detail.component.scss'
})
export class GameDetailComponent implements OnInit {
  game: Game | null = null;
  
  // Access signals from services
  loading;
  error;
  isAuthenticated;
  
  // Delete confirmation
  showDeleteConfirm = false;

  constructor(
    private gameService: GameService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.loading = this.gameService.loading;
    this.error = this.gameService.error;
    this.isAuthenticated = this.authService.isAuthenticated;
  }

  async ngOnInit(): Promise<void> {
    // Get the game ID from the route
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      await this.loadGame(id);
    } else {
      this.router.navigate(['/games']);
    }
  }

  async loadGame(id: string): Promise<void> {
    try {
      this.game = await this.gameService.getGame(id);
      
      if (!this.game) {
        // Game not found, redirect to games list
        this.router.navigate(['/games']);
      }
    } catch (error) {
      console.error('Error loading game:', error);
    }
  }

  // Format date for display
  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Show delete confirmation dialog
  confirmDelete(): void {
    this.showDeleteConfirm = true;
  }

  // Cancel delete
  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }

  // Delete the game
  async deleteGame(): Promise<void> {
    if (!this.game?._id) return;
    
    try {
      const success = await this.gameService.deleteGame(this.game._id);
      
      if (success) {
        // Redirect to games list after successful deletion
        this.router.navigate(['/games']);
      }
    } catch (error) {
      console.error('Error deleting game:', error);
    }
  }

  // Navigate to edit page
  editGame(): void {
    if (!this.game?._id) return;
    
    this.router.navigate(['/games/edit', this.game._id]);
  }

  // Toggle completed status
  async toggleCompleted(): Promise<void> {
    if (!this.game?._id) return;
    
    try {
      // Create a copy of the game with the completed status toggled
      const gameId = this.game._id;
      const updatedGame = { 
        ...this.game, 
        completed: !this.game.completed 
      };
      
      console.log('Toggling completion status:', {
        gameId,
        currentStatus: this.game.completed,
        newStatus: updatedGame.completed
      });
      
      // Send the update to the server
      const result = await this.gameService.updateGame(gameId, updatedGame);
      
      if (result) {
        console.log('Game updated successfully:', result);
        this.game = result;
      } else {
        console.error('Failed to update game: result was null');
      }
    } catch (error) {
      console.error('Error updating game completion status:', error);
    }
  }
}