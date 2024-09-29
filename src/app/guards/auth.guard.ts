import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.services'; // Adjust path to your AuthService
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean | Observable<boolean> {
    // Check if the user is logged in and has the 'superadmin' role
    const user = this.authService.getLoggedInUser();

    if (user && user.userRole === 'superadmin') {
      // User is logged in and has the 'superadmin' role
      return true;
    } else {
      // User is either not logged in or doesn't have the correct role
      this.router.navigate(['/404']); // Redirect to 404 page
      return false;
    }
  }
}
