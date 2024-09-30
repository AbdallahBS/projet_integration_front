import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import { AuthService } from '../../../services/auth.services'; // Adjust the path as necessary
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [FormsModule, ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective]
})
export class RegisterComponent {

  registerData = {
    username: '',
    avatar: null,
    role: '',
    password: '',
    repeatPassword: '',
  };

  constructor(private authService: AuthService, private router: Router) { }

  onRegister() {
    if (this.registerData.password !== this.registerData.repeatPassword) {
      alert("Try repeating the password correctly!");
      return;
    }

    this.authService.register(this.registerData.username, this.registerData.role, this.registerData.password)
      .pipe(
        switchMap(() => this.authService.login(this.registerData.username, this.registerData.password))
      )
      .subscribe(
        response => {
          // Handle successful login response
          alert('Signup successful');
          // You can store the user information and redirect to home
          // localStorage.setItem('user', JSON.stringify(response.user));
          this.router.navigate(['/dashboard']);
        },
        error => {
          // Handle error response
          alert('Signup failed');
          // You can show an error message to the user
        }
      );
  }

}
