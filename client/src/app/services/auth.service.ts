import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth';
  
  // Create signals
  private userSignal = signal<User | null>(null);
  private tokenSignal = signal<string | null>(null);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);
  
  // Expose read-only signals
  readonly user = this.userSignal.asReadonly();
  readonly token = this.tokenSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  
  // Computed signal for authentication state
  readonly isAuthenticated = computed(() => !!this.tokenSignal());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  // Load user from localStorage on service initialization
  private loadUserFromStorage(): void {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      this.tokenSignal.set(token);
      this.userSignal.set(JSON.parse(user));
    }
  }

  // Save auth data to localStorage
  private saveAuthData(token: string, user: User): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    this.tokenSignal.set(token);
    this.userSignal.set(user);
  }

  // Clear auth data from localStorage
  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    this.tokenSignal.set(null);
    this.userSignal.set(null);
  }

  // Extract error message from HttpErrorResponse
  private getErrorMessage(error: any): string {
    console.log('Raw error:', error);
    
    if (!error) {
      return 'Unknown error occurred';
    }
    
    // If it's an HttpErrorResponse
    if (error instanceof HttpErrorResponse) {
      console.log('HttpErrorResponse error.error:', error.error);
      
      // If the error has a message property
      if (error.error && typeof error.error === 'object' && 'message' in error.error) {
        return error.error.message as string;
      }
      
      // If the error itself is a string
      if (typeof error.error === 'string') {
        return error.error;
      }
      
      // Use the status text if available
      if (error.statusText) {
        return `${error.status}: ${error.statusText}`;
      }
    }
    
    // If the error has a message property
    if (error.message && typeof error.message === 'string') {
      return error.message;
    }
    
    // If the error is a string
    if (typeof error === 'string') {
      return error;
    }
    
    // Last resort: stringify the error
    try {
      return JSON.stringify(error);
    } catch {
      return 'An error occurred';
    }
  }

  // Register a new user
  async register(username: string, email: string, password: string): Promise<boolean> {
    try {
      this.loadingSignal.set(true);
      this.errorSignal.set(null);
      
      console.log('Sending registration request with:', { username, email, password: '***' });
      
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(`${this.apiUrl}/register`, {
          username,
          email,
          password
        })
      );
      
      this.saveAuthData(response.token, response.user);
      this.router.navigate(['/games']);
      return true;
    } catch (error: any) {
      
      // Set a properly formatted error message
      const errorMessage = this.getErrorMessage(error);
      console.log('Formatted error message:', errorMessage);
      
      this.errorSignal.set(errorMessage);
      return false;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  // Login user
  async login(username: string, password: string): Promise<boolean> {
    try {
      this.loadingSignal.set(true);
      this.errorSignal.set(null);
      
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(`${this.apiUrl}/login`, {
          username,
          password
        })
      );
      
      this.saveAuthData(response.token, response.user);
      this.router.navigate(['/games']);
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Set a properly formatted error message
      this.errorSignal.set(this.getErrorMessage(error));
      return false;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  // Logout user
  logout(): void {
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  // Get current user profile
  async getCurrentUser(): Promise<User | null> {
    if (!this.tokenSignal()) return null;
    
    try {
      this.loadingSignal.set(true);
      
      const user = await firstValueFrom(
        this.http.get<User>(`${this.apiUrl}/me`)
      );
      
      this.userSignal.set(user);
      return user;
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      
      // If unauthorized, logout
      if (error instanceof HttpErrorResponse && error.status === 401) {
        this.logout();
      }
      
      return null;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  // Get auth token for HTTP requests
  getAuthToken(): string | null {
    return this.tokenSignal();
  }
}