import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  
  // Declare signal properties without initialization
  loading;
  error;
  
  // Local validation errors
  validationErrors: { [key: string]: string } = {};

  constructor(private authService: AuthService) {
    this.loading = this.authService.loading;
    this.error = this.authService.error;
  }

  // Check if there are any validation errors
  hasValidationErrors(): boolean {
    return Object.keys(this.validationErrors).length > 0;
  }

  validateForm(): boolean {
    // Reset validation errors
    this.validationErrors = {};
    let isValid = true;
    
    // Validate username
    if (!this.username) {
      this.validationErrors['username'] = 'Username is required';
      isValid = false;
    } else if (this.username.length < 3) {
      this.validationErrors['username'] = 'Username must be at least 3 characters';
      isValid = false;
    }
    
    // Validate email
    if (!this.email) {
      this.validationErrors['email'] = 'Email is required';
      isValid = false;
    } else if (!this.isValidEmail(this.email)) {
      this.validationErrors['email'] = 'Please enter a valid email address';
      isValid = false;
    }
    
    // Validate password
    if (!this.password) {
      this.validationErrors['password'] = 'Password is required';
      isValid = false;
    } else if (this.password.length < 6) {
      this.validationErrors['password'] = 'Password must be at least 6 characters';
      isValid = false;
    }
    
    // Validate password confirmation
    if (this.password !== this.confirmPassword) {
      this.validationErrors['confirmPassword'] = 'Passwords do not match';
      isValid = false;
    }
    
    return isValid;
  }
  
  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  async onSubmit(): Promise<void> {
    // Validate form
    if (!this.validateForm()) {
      return;
    }
    
    try {
      // Submit registration
      const success = await this.authService.register(this.username, this.email, this.password);
      
      if (!success) {
        const errorMsg = this.authService.error();
        console.log('Error from auth service:', errorMsg);
        
        // Check for specific error messages
        if (errorMsg) {
          if (errorMsg.includes('username')) {
            this.validationErrors['username'] = 'Username already exists or is invalid';
          }
          if (errorMsg.includes('email')) {
            this.validationErrors['email'] = 'Email already exists or is invalid';
          }
          if (errorMsg.includes('password')) {
            this.validationErrors['password'] = 'Password is invalid';
          }
        }
      }
    } catch (error: any) {
      console.error('Registration submission error:', error);
    }
  }

  // Get all validation error messages as an array of strings
  getValidationErrorMessages(): string[] {
    const messages: string[] = [];
    
    for (const key in this.validationErrors) {
      if (this.validationErrors[key]) {
        messages.push(this.validationErrors[key]);
      }
    }
    
    return messages;
  }
}