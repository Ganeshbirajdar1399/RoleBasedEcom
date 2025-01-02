import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, ViewportScroller } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4 for generating UUIDs

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  isRegister = false;
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

  usersData: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private scroller: ViewportScroller
  ) {}

  ngOnInit(): void {
    this.scroller.scrollToPosition([0, 0]);
  }

  onSubmit() {
// Generate UUID for the new user
this.users.id = uuidv4(); // Assign UUID to the user's id field

    this.authService.register(this.users).subscribe((res) => {
      console.log('User Register successfully', res);
      alert('Register successfully');
      this.isRegister = true;
      setTimeout(() => {
        this.isRegister = false;
      }, 2000);
      this.formEmpty();
      this.router.navigate(['/login']);
    });
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
      role: '',
    };
  }
}
