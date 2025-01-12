import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, ViewportScroller } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4 for generating UUIDs
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  isRegister = false;
  error = ''; // To store any error messages

  users = {
    id: '', // Add id field to store UUID
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
    address: '',
    role: 'user',
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private scroller: ViewportScroller,
    private tostr: ToastrService
  ) {}

  ngOnInit(): void {
    this.scroller.scrollToPosition([0, 0]);
  }

  onSubmit() {
    // Generate UUID for the new user
    this.users.id = uuidv4(); // Assign UUID to the user's id field

    // Register the user with the backend (password will be hashed there)
    this.authService.register(this.users).subscribe(
      (res) => {
        this.tostr.success('User registered successfully', 'Success');
        console.log('User registered successfully', res);
        this.isRegister = true;
        setTimeout(() => {
          this.isRegister = false;
        }, 2000);
        this.formEmpty();
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Error registering user', error);
        this.tostr.error('Registration failed. Please try again.'); // Show error message
      }
    );
  }

  formEmpty() {
    this.users = {
      id: '', // Reset the id field
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      password: '',
      address: '',
      role: '', // Reset role if needed
    };
  }
}
