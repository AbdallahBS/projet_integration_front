import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import { AuthService } from '../../../services/auth.services'; // Adjust the path as necessary
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router'; // Import Router
import { TranslateService, TranslateModule } from '@ngx-translate/core'; // Import TranslateModule and TranslateService

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [FormsModule,TranslateModule, ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle]
})
export class LoginComponent {
  loginData = {
    username: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router, private translate: TranslateService) {
    translate.setDefaultLang('ar');
    translate.use('ar');
  }
  ngOnInit() {
    const token = this.authService.getCookie('token');

    if (token && !this.authService.isTokenExpired(token)) {
      this.router.navigate(['/dashboard']);
    }
  }
  // Inject AuthService
  onLogin() {
    this.authService.login(this.loginData.username, this.loginData.password)
      .subscribe(
        response => {
          // Handle successful login response
          alert('Login successful:');
          // You can store the user information and redirect to home
          // localStorage.setItem('user', JSON.stringify(response.user));

          const user = this.authService.getLoggedInUser();
          if (user && user.userRole === 'superadmin') {
            this.router.navigate(['/dashboard']);
          } else {
            alert('You do not have access to the dashboard.');
          }
        },
        error => {
          // Handle error response
          alert('Login failed:');
          // You can show an error message to the user
        }
      );
  }

  swapToRegister() {
    this.router.navigate(['/register']);
  }
}
