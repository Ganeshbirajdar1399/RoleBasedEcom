import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, ViewportScroller } from '@angular/common';
import { validate } from 'uuid';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth/auth.service';
import * as CryptoJS from 'crypto-js'; // Import CryptoJS for password hashing

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  myForm: FormGroup;
  error = '';
  hide = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private scroller: ViewportScroller
  ) {
    this.myForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email, // Validates the email format
          Validators.pattern(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
          ), // Ensures stricter email validation
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8), // Minimum length
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
          ), // Must contain uppercase, lowercase, number, special character
        ],
      ],
    });
  }

  //   Email Field:

  //     Uses Validators.email for standard email validation.
  //     Adds a custom Validators.pattern for stricter email formats.

  // Password Field:

  //     Minimum length of 8 characters.
  //     The regex ensures:
  //         At least one lowercase letter.
  //         At least one uppercase letter.
  //         At least one numeric digit.
  //         At least one special character from @$!%*?&.

  ngOnInit(): void {
    this.scroller.scrollToPosition([0, 0]);
  }

  onLogin(): void {
    if (this.myForm.valid) {
      // Ensure the form is valid before proceeding
      const { email, password } = this.myForm.value;

      this.authService.login(email, password).subscribe(
        (user) => {
          if (user) {
            // Navigate based on user role
            this.router.navigate([user.role]);
          }
        },
        (error) => {
          console.error('Login failed:', error); // Log the actual error for debugging
          this.error = 'Invalid email or password. Please try again.'; // Display error to user
        }
      );
    } else {
      this.error = 'Please fill out all fields correctly.'; // Handle invalid form case
    }
  }

  toggleHide() {
    this.hide = !this.hide; // Toggle password visibility
  }
}
