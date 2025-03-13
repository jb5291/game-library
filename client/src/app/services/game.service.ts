import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Game } from '../models/game';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = '/api/games';
  
  // Create signals
  private gamesSignal = signal<Game[]>([]);
  private filteredGamesSignal = signal<Game[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);
  private searchTermSignal = signal<string>('');
  private filterSignal = signal<string>('all'); // 'all', 'completed', 'in-progress'
  
  // Expose read-only signals
  readonly games = this.gamesSignal.asReadonly();
  readonly filteredGames = this.filteredGamesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly searchTerm = this.searchTermSignal.asReadonly();
  readonly filter = this.filterSignal.asReadonly();
  
  // Computed signal for games count
  readonly gamesCount = computed(() => this.filteredGamesSignal().length);

  constructor(private http: HttpClient) {
    // Load games when service is initialized
    this.loadGames();
  }

  // Load all games
  async loadGames(): Promise<void> {
    try {
      this.loadingSignal.set(true);
      this.errorSignal.set(null);
      
      // Convert Observable to Promise
      const games = await firstValueFrom(this.http.get<Game[]>(this.apiUrl));
      this.gamesSignal.set(games);
      this.applyFilters(); // Apply any existing filters
    } catch (error: any) {
      console.error('Error fetching games:', error);
      this.errorSignal.set(error.message || 'Failed to load games');
    } finally {
      this.loadingSignal.set(false);
    }
  }

  // Set search term
  setSearchTerm(term: string): void {
    this.searchTermSignal.set(term);
    this.applyFilters();
  }

  // Set filter
  setFilter(filter: string): void {
    this.filterSignal.set(filter);
    this.applyFilters();
  }

  // Apply search and filters
  private applyFilters(): void {
    const searchTerm = this.searchTermSignal().toLowerCase().trim();
    const filter = this.filterSignal();
    let result = this.gamesSignal();
    
    // Apply search term filter
    if (searchTerm) {
      result = result.filter(game => 
        game.title.toLowerCase().includes(searchTerm) ||
        game.developer?.toLowerCase().includes(searchTerm) ||
        game.genre?.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply completion status filter
    if (filter === 'completed') {
      result = result.filter(game => game.completed === true);
    } else if (filter === 'in-progress') {
      result = result.filter(game => game.completed === false);
    }
    
    this.filteredGamesSignal.set(result);
  }

  // Get a single game
  async getGame(id: string): Promise<Game | null> {
    try {
      this.loadingSignal.set(true);
      this.errorSignal.set(null);
      
      return await firstValueFrom(this.http.get<Game>(`${this.apiUrl}/${id}`));
    } catch (error: any) {
      console.error('Error fetching game:', error);
      this.errorSignal.set(error.message || 'Failed to load game');
      return null;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  // Create a new game
  async createGame(game: Game): Promise<Game | null> {
    try {
      this.loadingSignal.set(true);
      this.errorSignal.set(null);
      
      const newGame = await firstValueFrom(this.http.post<Game>(this.apiUrl, game));
      
      // Update the games signal with the new game
      this.gamesSignal.update(games => [...games, newGame]);
      return newGame;
    } catch (error: any) {
      console.error('Error creating game:', error);
      this.errorSignal.set(error.message || 'Failed to create game');
      return null;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  // Update a game
  async updateGame(id: string, game: Game): Promise<Game | null> {
    try {
      this.loadingSignal.set(true);
      this.errorSignal.set(null);
      
      console.log(`Updating game ${id} with data:`, game);
      
      // Make sure we're sending the correct data to the API
      const gameData = {
        title: game.title,
        description: game.description,
        platform: game.platform,
        genre: game.genre,
        releaseYear: game.releaseYear,
        developer: game.developer,
        publisher: game.publisher,
        rating: game.rating,
        imageUrl: game.imageUrl,
        completed: game.completed,
        notes: game.notes
      };
      
      const response = await firstValueFrom(
        this.http.put<Game>(`${this.apiUrl}/${id}`, gameData)
      );
      
      console.log('Update response:', response);
      return response;
    } catch (error: any) {
      console.error('Error updating game:', error);
      this.handleError(error, 'Error updating game');
      return null;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  // Delete a game
  async deleteGame(id: string): Promise<boolean> {
    try {
      this.loadingSignal.set(true);
      this.errorSignal.set(null);
      
      await firstValueFrom(this.http.delete<void>(`${this.apiUrl}/${id}`));
      
      // Update the games signal by removing the deleted game
      this.gamesSignal.update(games => games.filter(game => game._id !== id));
      return true;
    } catch (error: any) {
      console.error('Error deleting game:', error);
      this.errorSignal.set(error.message || 'Failed to delete game');
      return false;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  private handleError(error: any, defaultMessage: string): void {
    console.error(error);
    this.errorSignal.set(error.message || defaultMessage);
  }
}