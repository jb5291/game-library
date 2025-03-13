import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GameService } from '../../services/game.service';
import { Game, PLATFORMS, GENRES } from '../../models/game';

@Component({
  selector: 'app-game-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './game-form.component.html',
  styleUrl: './game-form.component.scss'
})
export class GameFormComponent implements OnInit {
  // Game model
  game: Game = {
    title: '',
    description: '',
    platform: '',
    genre: '',
    releaseYear: new Date().getFullYear(),
    developer: '',
    publisher: '',
    rating: 0,
    imageUrl: '',
    completed: false,
    notes: ''
  };

  // Form state
  isEditMode = false;
  formSubmitted = false;
  validationErrors: { [key: string]: string } = {};
  
  // Constants for dropdown options
  platforms = PLATFORMS;
  genres = GENRES;
  
  // Years for dropdown (from 1970 to current year)
  years: number[] = [];
  
  // Ratings (1-10)
  ratings: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  
  // Access signals from game service
  loading;
  error;

  constructor(
    private gameService: GameService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.loading = this.gameService.loading;
    this.error = this.gameService.error;

    // Generate years array
    const currentYear = new Date().getFullYear();
    for (let year = 1970; year <= currentYear; year++) {
      this.years.push(year);
    }
  }

  async ngOnInit(): Promise<void> {
    // Check if we're in edit mode
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.isEditMode = true;
      await this.loadGame(id);
    }
  }

  async loadGame(id: string): Promise<void> {
    const game = await this.gameService.getGame(id);
    
    if (game) {
      this.game = game;
    } else {
      // Handle game not found
      this.router.navigate(['/games']);
    }
  }

  validateForm(): boolean {
    this.validationErrors = {};
    let isValid = true;
    
    // Validate title
    if (!this.game.title) {
      this.validationErrors['title'] = 'Title is required';
      isValid = false;
    } else if (this.game.title.length < 2) {
      this.validationErrors['title'] = 'Title must be at least 2 characters';
      isValid = false;
    }
    
    // Validate description
    if (!this.game.description) {
      this.validationErrors['description'] = 'Description is required';
      isValid = false;
    }
    
    // Validate platform
    if (!this.game.platform) {
      this.validationErrors['platform'] = 'Platform is required';
      isValid = false;
    }
    
    // Validate genre
    if (!this.game.genre) {
      this.validationErrors['genre'] = 'Genre is required';
      isValid = false;
    }
    
    // Validate developer
    if (!this.game.developer) {
      this.validationErrors['developer'] = 'Developer is required';
      isValid = false;
    }
    
    // Validate publisher
    if (!this.game.publisher) {
      this.validationErrors['publisher'] = 'Publisher is required';
      isValid = false;
    }
    
    // Validate release year
    if (!this.game.releaseYear) {
      this.validationErrors['releaseYear'] = 'Release year is required';
      isValid = false;
    }
    
    // Validate rating
    if (this.game.rating < 1 || this.game.rating > 10) {
      this.validationErrors['rating'] = 'Rating must be between 1 and 10';
      isValid = false;
    }
    
    // Validate image URL if provided
    if (this.game.imageUrl && !this.isValidUrl(this.game.imageUrl)) {
      this.validationErrors['imageUrl'] = 'Please enter a valid URL';
      isValid = false;
    }
    
    return isValid;
  }
  
  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  async onSubmit(): Promise<void> {
    this.formSubmitted = true;
    
    // Validate form
    if (!this.validateForm()) {
      return;
    }
    
    try {
      let result: Game | null;
      
      if (this.isEditMode && this.game._id) {
        // Update existing game
        result = await this.gameService.updateGame(this.game._id, this.game);
      } else {
        // Create new game
        result = await this.gameService.createGame(this.game);
      }
      
      if (result) {
        // Navigate to game details page
        this.router.navigate(['/games', result._id]);
      }
    } catch (error: any) {
      console.error('Error submitting game:', error);
    }
  }

  // Helper method to get validation error messages
  getValidationErrorMessages(): string[] {
    const messages: string[] = [];
    
    for (const key in this.validationErrors) {
      if (this.validationErrors[key]) {
        messages.push(this.validationErrors[key]);
      }
    }
    
    return messages;
  }
  
  // Helper method to check if there are validation errors
  hasValidationErrors(): boolean {
    return Object.keys(this.validationErrors).length > 0;
  }
  
  // Cancel form submission
  cancel(): void {
    if (this.isEditMode && this.game._id) {
      this.router.navigate(['/games', this.game._id]);
    } else {
      this.router.navigate(['/games']);
    }
  }
}