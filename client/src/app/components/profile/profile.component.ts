import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileService = inject(ProfileService);
  authService = inject(AuthService);
  
  // Access signals
  profile = this.profileService.profile;
  loading = this.profileService.loading;
  error = this.profileService.error;
  user = this.authService.user;
  
  // Edit mode state
  isEditMode = false;
  
  // Form model for editing
  editForm = {
    username: '',
    email: '',
    bio: '',
    avatarUrl: ''
  };
  
  ngOnInit(): void {
    this.loadProfile();
  }
  
  async loadProfile(): Promise<void> {
    await this.profileService.getUserProfile();
    
    // Initialize form with current values
    const currentProfile = this.profile();
    if (currentProfile) {
      this.editForm = {
        username: currentProfile.username,
        email: currentProfile.email,
        bio: currentProfile.bio || '',
        avatarUrl: currentProfile.avatarUrl || ''
      };
    }
  }
  
  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    
    // Reset form when entering edit mode
    if (this.isEditMode) {
      const currentProfile = this.profile();
      if (currentProfile) {
        this.editForm = {
          username: currentProfile.username,
          email: currentProfile.email,
          bio: currentProfile.bio || '',
          avatarUrl: currentProfile.avatarUrl || ''
        };
      }
    }
  }
  
  async saveProfile(): Promise<void> {
    await this.profileService.updateProfile(this.editForm);
    this.isEditMode = false;
  }
} 