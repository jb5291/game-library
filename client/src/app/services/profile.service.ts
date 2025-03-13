import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface UserProfile {
  _id: string;
  username: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Game {
  _id: string;
  title: string;
  platform: string;
  genre: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  // Other game properties
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = '/api/profile';
  
  // Create signals
  private profileSignal = signal<UserProfile | null>(null);
  private userGamesSignal = signal<Game[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);
  
  // Expose read-only signals
  readonly profile = this.profileSignal.asReadonly();
  readonly userGames = this.userGamesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  constructor(private http: HttpClient) {}

  // Get current user's profile
  async getUserProfile(): Promise<UserProfile | null> {
    try {
      this.loadingSignal.set(true);
      this.errorSignal.set(null);
      
      const profile = await firstValueFrom(
        this.http.get<UserProfile>(this.apiUrl)
      );
      
      this.profileSignal.set(profile);
      return profile;
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      this.errorSignal.set(error.message || 'Failed to load profile');
      return null;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  // Get user's games
  async getUserGames(): Promise<Game[]> {
    try {
      this.loadingSignal.set(true);
      this.errorSignal.set(null);
      
      const games = await firstValueFrom(
        this.http.get<Game[]>(`${this.apiUrl}/games`)
      );
      
      this.userGamesSignal.set(games);
      return games;
    } catch (error: any) {
      console.error('Error fetching user games:', error);
      this.errorSignal.set(error.message || 'Failed to load games');
      return [];
    } finally {
      this.loadingSignal.set(false);
    }
  }

  // Update user profile
  async updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      this.loadingSignal.set(true);
      this.errorSignal.set(null);
      
      const updatedProfile = await firstValueFrom(
        this.http.put<UserProfile>(this.apiUrl, profileData)
      );
      
      this.profileSignal.set(updatedProfile);
      return updatedProfile;
    } catch (error: any) {
      console.error('Error updating profile:', error);
      this.errorSignal.set(error.message || 'Failed to update profile');
      return null;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  // Update game progress
  async updateGameProgress(gameId: string, progressData: { completed?: boolean, progress?: number, notes?: string }): Promise<Game | null> {
    try {
      this.loadingSignal.set(true);
      this.errorSignal.set(null);
      
      const updatedGame = await firstValueFrom(
        this.http.put<Game>(`${this.apiUrl}/games/${gameId}`, progressData)
      );
      
      // Update the game in the games list
      this.userGamesSignal.update(games => 
        games.map(game => game._id === gameId ? updatedGame : game)
      );
      
      return updatedGame;
    } catch (error: any) {
      console.error('Error updating game progress:', error);
      this.errorSignal.set(error.message || 'Failed to update game progress');
      return null;
    } finally {
      this.loadingSignal.set(false);
    }
  }
} 