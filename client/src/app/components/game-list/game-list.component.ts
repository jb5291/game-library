import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-game-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './game-list.component.html',
  styleUrl: './game-list.component.scss'
})
export class GameListComponent implements OnInit {
  gameService = inject(GameService);

  // Access signals from game service
  games = this.gameService.filteredGames;
  loading = this.gameService.loading;
  error = this.gameService.error;
  gamesCount = this.gameService.gamesCount;
  searchTerm = this.gameService.searchTerm;
  filter = this.gameService.filter;

  ngOnInit(): void {
    // Refresh games when component initializes
    this.gameService.loadGames();
  }

  // Search games
  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.gameService.setSearchTerm(input.value);
  }

  // Filter games
  onFilterChange(filter: string): void {
    this.gameService.setFilter(filter);
  }

  async deleteGame(id: string): Promise<void> {
    if (confirm('Are you sure you want to delete this game?')) {
      await this.gameService.deleteGame(id);
    }
  }
}