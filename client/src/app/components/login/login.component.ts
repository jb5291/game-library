import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  returnUrl: string = '';
  
  // Declare signal properties without initialization
  loading;
  error;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    // Get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    
    // Initialize signals after authService is available
    this.loading = this.authService.loading;
    this.error = this.authService.error;
  }

  async onSubmit(): Promise<void> {
    if (!this.username || !this.password) return;
    
    await this.authService.login(this.username, this.password);
  }
}