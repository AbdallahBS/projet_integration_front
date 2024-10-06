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
import { AlertModule } from '@coreui/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, AlertModule, FormsModule, TranslateModule, ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle]
})
export class LoginComponent {
  loginData = {
    username: '',
    password: ''
  };
  isLoginSucceed: Boolean | null = null;

  constructor(private authService: AuthService, private router: Router, private translate: TranslateService) {
    translate.setDefaultLang('ar');
    translate.use('ar');
  }

  ngOnInit() {
    const token = this.authService.getCookie('token');

    if (token && !this.authService.isTokenExpired(token)) {
      this.router.navigate(['/dashboard']);
    } else {
      this.authService.checkInitialization().subscribe(
        response => {
          if (!response.isInitialized) {
            this.router.navigate(['/initialization']);
          }
        },
        error => {
          console.error('Error checking initialization:', error);
          // Handle error (e.g., show error message)
        }
      )
    }
  }
  // Inject AuthService
  onLogin() {
    this.authService.login(this.loginData.username, this.loginData.password)
      .subscribe(
        response => {
          const user = this.authService.getLoggedInUser();
          if (user && user.userRole === 'superadmin') {
            this.isLoginSucceed = true;
            setTimeout(() => {
              this.isLoginSucceed = null;
              this.router.navigate(['/dashboard']);
            }, 3000);
          } /**else {
            this.isLoginSucceed = false;
            setTimeout(() => {
              this.isLoginSucceed = null;
            }, 3000);
            alert('You do not have access to the dashboard.');
          }**/
        },
        error => {
          // Handle error response
          this.isLoginSucceed = false;
          setTimeout(() => {
            this.isLoginSucceed = null;
          }, 3000);
          // You can show an error message to the user
        }
      );
  }

  swapToRegister() {
    this.router.navigate(['/register']);
  }


}
