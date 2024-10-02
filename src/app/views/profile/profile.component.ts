import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.services'; // Adjust the path as necessary
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { AvatarModule } from '@coreui/angular'; // Import the module containing CAavatar
import { CommonModule } from '@angular/common'; // Import CommonModule for ngIf
import { TranslateService, TranslateModule } from '@ngx-translate/core'; // Import TranslateModule and TranslateService

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule,CommonModule,AvatarModule,TranslateModule] ,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  userProfile: any = {
    username: '',
    password: '',
    userId: ''
  };
  showPassword: boolean = false; // New property
  getTogglePasswordText(): string {
    return this.showPassword ? this.translate.instant('PROFILE.hide') : this.translate.instant('PROFILE.show');
  }

  constructor(private authService: AuthService, private router: Router, private translate: TranslateService) {
    translate.setDefaultLang('ar');
    translate.use('ar');
  }
  ngOnInit() {
    
    
    this.loadUserProfile();
  }

  loadUserProfile() {
    const userData = this.authService.getLoggedInUser(); // Implement this method to get user data from the cookie
    if (userData) {
      console.log("userdata",userData.userName);
      
      this.userProfile.username = userData.userName;
      this.userProfile.password = userData.password;
      this.userProfile.userId = userData.userId;
      // Don't load password for security reasons; you'll get it from input when updating
    } else {
      this.router.navigate(['/login']); // Redirect if not logged in
    }
  }

  updateProfile() {
    this.authService.updateUserProfile(this.userProfile).subscribe(
      (response) => {
        alert('Profile updated successfully!');
      },
      (error) => {
        alert('Error updating profile.');
      }
    );
  }
}