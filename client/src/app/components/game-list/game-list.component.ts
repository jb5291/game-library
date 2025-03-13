import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-game-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './game-list.component.html',
  styleUrl: './game-list.component.scss'
})
export class GameListComponent implements OnInit {
  gameService = inject(GameService);

  games = this.gameService.games;
  loading = this.gameService.loading;
  error = this.gameService.error;
  gamesCount = this.gameService.gamesCount;

  ngOnInit(): void {
    // Refresh games when component initializes
    this.gameService.loadGames();
  }

  async deleteGame(id: string): Promise<void> {
    if (confirm('Are you sure you want to delete this game?')) {
      await this.gameService.deleteGame(id);
    }
  }
}