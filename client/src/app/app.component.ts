import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Game Library';
  
  // Access auth state
  isAuthenticated;
  user;
  
  constructor(private authService: AuthService) {
    this.isAuthenticated = this.authService.isAuthenticated;
    this.user = this.authService.user;
  }
  
  logout(): void {
    this.authService.logout();
  }
}