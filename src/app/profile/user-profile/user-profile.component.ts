import { Component, OnInit } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4 for generating UUIDs

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit {
  loggedInUser: any = null;
  usersData: any[] = [];
  isRegister = false;

  users = {
    id: '', // Add id field to store UUID
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
    address: '',
    role: 'admin',
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private scroller: ViewportScroller
  ) {}

  ngOnInit(): void {
    this.scroller.scrollToPosition([0, 0]);
    this.loggedInUser = this.authService.getUser(); // Fetch user data
    this.fetchUsers();
    // console.log('loggedin user',this.loggedInUser);
  }

  onSubmit() {
    this.users.id = uuidv4(); // Assign UUID to the user's id field
    this.authService.register(this.users).subscribe((res) => {
      console.log('admin added successfully', res);
      this.isRegister = true;
      setTimeout(() => {
        this.isRegister = false;
      }, 2000);
      this.formEmpty();
      // this.router.navigate(['/login']);
    });
  }

  deleteUser(id: string) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.authService.DeletetData(id).subscribe((res) => {
        console.log('users deleted successfully');
        this.fetchUsers();
      });
    }
  }

  fetchUsers() {
    this.authService.fetchUsers().subscribe((res) => {
      this.usersData = res;
    });
  }

  formEmpty() {
    this.users = {
      id: '', // Add id field to store UUID
      firstName: '',
      lastName: '',
      password: '',
      email: '',
      mobile: '',
      address: '',
      role: '',
    };
  }

  get isAdmin(): boolean {
    return this.loggedInUser?.role === 'admin';
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn(); // Check if the user is logged in
  }
}
