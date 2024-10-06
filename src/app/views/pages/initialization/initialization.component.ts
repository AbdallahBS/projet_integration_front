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
  selector: 'app-initialization',
  standalone: true,
  imports: [CommonModule, AlertModule, FormsModule, TranslateModule, ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle],
  templateUrl: './initialization.component.html',
  styleUrl: './initialization.component.scss'
})
export class InitializationComponent {

  constructor(private authService: AuthService, private router: Router, private translate: TranslateService) {
    translate.setDefaultLang('ar');
    translate.use('ar');
  }

  initData = {
    username: '',
    password: '',
    verifypassword: '',
  };

  isInitSucceed: Boolean | null = null;
  passwordVerificationFailed: Boolean | null = null;

  onInitialize() {
    if (this.initData.password !== this.initData.verifypassword) {
      this.passwordVerificationFailed = true;
      setTimeout(() => {
        this.passwordVerificationFailed = null;
      }, 3000);
      return;
    };

    this.authService.initializeapp(this.initData.username, this.initData.password).subscribe(
      () => {
        // Initialization successful
        this.isInitSucceed = true;
        setTimeout(() => {
          this.isInitSucceed = null;
          this.router.navigate(['/login']);
        }, 3000);
      },
      error => {
        console.error('Initialization failed:', error);
        // Handle error (e.g., show error message)
      }
    );
  };
}
