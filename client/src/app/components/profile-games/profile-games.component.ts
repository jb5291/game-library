import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile-games',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile-games.component.html',
  styleUrls: ['./profile-games.component.scss']
})
export class ProfileGamesComponent implements OnInit {
  profileService = inject(ProfileService);
  
  // Access signals
  games = this.profileService.userGames;
  loading = this.profileService.loading;
  error = this.profileService.error;
  
  // Computed values for stats
  completedGamesCount = computed(() => 
    this.games().filter(g => g.completed).length
  );
  
  inProgressGamesCount = computed(() => 
    this.games().filter(g => !g.completed).length
  );
  
  ngOnInit(): void {
    this.loadGames();
  }
  
  async loadGames(): Promise<void> {
    await this.profileService.getUserGames();
  }
  
  async toggleGameCompletion(gameId: string, currentStatus: boolean): Promise<void> {
    await this.profileService.updateGameProgress(gameId, { 
      completed: !currentStatus 
    });
  }
} 