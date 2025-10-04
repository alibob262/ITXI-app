import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;

  constructor(private authService: AuthService, private router: Router) {}

  signUp() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match!';
      return;
    }

    this.authService.signUp(this.email, this.password).then(() => {
      this.router.navigate(['/dashboard']);
    }).catch((error) => {
      this.errorMessage = error.message;
    });
  }
}