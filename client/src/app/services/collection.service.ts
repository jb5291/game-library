import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface Collection {
  _id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  coverImage?: string;
  games: any[];
  user: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  private apiUrl = '/api/collections';
  
  // State signals
  collectionsSignal = signal<Collection[]>([]);
  currentCollectionSignal = signal<Collection | null>(null);
  loadingSignal = signal<boolean>(false);
  errorSignal = signal<string | null>(null);
  
  constructor(private http: HttpClient) {}
  
  // Expose signals as readable properties
  get collections() { return this.collectionsSignal; }
  get currentCollection() { return this.currentCollectionSignal; }
  get loading() { return this.loadingSignal; }
  get error() { return this.errorSignal; }
  
  // Get all user collections
  async getUserCollections(): Promise<Collection[]> {
    try {
      this.loadingSignal.set(true);
      this.errorSignal.set(null);
      
      const collections = await firstValueFrom(
        this.http.get<Collection[]>(this.apiUrl)
      );
      
      this.collectionsSignal.set(collections);
      return collections;
    } catch (error: any) {
      console.error('Error fetching collections:', error);
      this.errorSignal.set(error.message || 'Failed to fetch collections');
      return [];
    } finally {
      this.loadingSignal.set(false);
    }
  }
  
  // Get collection by ID
  async getCollectionById(id: string): Promise<Collection | null> {
    try {
      this.loadingSignal.set(true);
      this.errorSignal.set(null);
      
      const collection = await firstValueFrom(
        this.http.get<Collection>(`${this.apiUrl}/${id}`)
      );
      
      this.currentCollectionSignal.set(collection);
      return collection;
    } catch (error: any) {
      console.error('Error fetching collection:', error);
      this.errorSignal.set(error.message || 'Failed to fetch collection');
      return null;
    } finally {
      this.loadingSignal.set(false);
    }
  }
  
  // Create new collection
  async createCollection(collectionData: {
    name: string;
    description?: string;
    isPublic?: boolean;
    coverImage?: string;
    games?: string[];
  }): Promise<Collection | null> {
    try {
      this.loadingSignal.set(true);
      this.errorSignal.set(null);
      
      const newCollection = await firstValueFrom(
        this.http.post<Collection>(this.apiUrl, collectionData)
      );
      
      // Update collections list
      this.collectionsSignal.update(collections => [...collections, newCollection]);
      
      return newCollection;
    } catch (error: any) {
      console.error('Error creating collection:', error);
      this.errorSignal.set(error.message || 'Failed to create collection');
      return null;
    } finally {
      this.loadingSignal.set(false);
    }
  }
  
  // Update collection
  async updateCollection(id: string, updateData: {
    name?: string;
    description?: string;
    isPublic?: boolean;
    coverImage?: string;
  }): Promise<Collection | null> {
    try {
      this.loadingSignal.set(true);
      this.errorSignal.set(null);
      
      const updatedCollection = await firstValueFrom(
        this.http.put<Collection>(`${this.apiUrl}/${id}`, updateData)
      );
      
      // Update collections list
      this.collectionsSignal.update(collections => 
        collections.map(c => c._id === id ? updatedCollection : c)
      );
      
      // Update current collection if it's the one being viewed
      if (this.currentCollectionSignal()?._id === id) {
        this.currentCollectionSignal.set(updatedCollection);
      }
      
      return updatedCollection;
    } catch (error: any) {
      console.error('Error updating collection:', error);
      this.errorSignal.set(error.message || 'Failed to update collection');
      return null;
    } finally {
      this.loadingSignal.set(false);
    }
  }
  
  // Delete collection
  async deleteCollection(id: string): Promise<boolean> {
    try {
      this.loadingSignal.set(true);
      this.errorSignal.set(null);
      
      await firstValueFrom(
        this.http.delete(`${this.apiUrl}/${id}`)
      );
      
      // Remove from collections list
      this.collectionsSignal.update(collections => 
        collections.filter(c => c._id !== id)
      );
      
      // Clear current collection if it's the one being deleted
      if (this.currentCollectionSignal()?._id === id) {
        this.currentCollectionSignal.set(null);
      }
      
      return true;
    } catch (error: any) {
      console.error('Error deleting collection:', error);
      this.errorSignal.set(error.message || 'Failed to delete collection');
      return false;
    } finally {
      this.loadingSignal.set(false);
    }
  }
  
  // Add games to collection
  async addGamesToCollection(collectionId: string, gameIds: string[]): Promise<Collection | null> {
    try {
      this.loadingSignal.set(true);
      this.errorSignal.set(null);
      
      const updatedCollection = await firstValueFrom(
        this.http.post<Collection>(`${this.apiUrl}/${collectionId}/games`, { gameIds })
      );
      
      // Update collections list
      this.collectionsSignal.update(collections => 
        collections.map(c => c._id === collectionId ? updatedCollection : c)
      );
      
      // Update current collection if it's the one being modified
      if (this.currentCollectionSignal()?._id === collectionId) {
        this.currentCollectionSignal.set(updatedCollection);
      }
      
      return updatedCollection;
    } catch (error: any) {
      console.error('Error adding games to collection:', error);
      this.errorSignal.set(error.message || 'Failed to add games to collection');
      return null;
    } finally {
      this.loadingSignal.set(false);
    }
  }
  
  // Remove game from collection
  async removeGameFromCollection(collectionId: string, gameId: string): Promise<Collection | null> {
    try {
      this.loadingSignal.set(true);
      this.errorSignal.set(null);
      
      const updatedCollection = await firstValueFrom(
        this.http.delete<Collection>(`${this.apiUrl}/${collectionId}/games/${gameId}`)
      );
      
      // Update collections list
      this.collectionsSignal.update(collections => 
        collections.map(c => c._id === collectionId ? updatedCollection : c)
      );
      
      // Update current collection if it's the one being modified
      if (this.currentCollectionSignal()?._id === collectionId) {
        this.currentCollectionSignal.set(updatedCollection);
      }
      
      return updatedCollection;
    } catch (error: any) {
      console.error('Error removing game from collection:', error);
      this.errorSignal.set(error.message || 'Failed to remove game from collection');
      return null;
    } finally {
      this.loadingSignal.set(false);
    }
  }
} 