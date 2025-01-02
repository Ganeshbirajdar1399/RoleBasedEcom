import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, ViewportScroller } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-updateprofile',
  imports: [CommonModule, FormsModule, ReactiveFormsModule,RouterModule],
  templateUrl: './updateprofile.component.html',
  styleUrl: './updateprofile.component.css',
})
export class UpdateprofileComponent {
  loggedInUser: any = null;
  usersData: any[] = [];
  isRegister = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private scroller: ViewportScroller
  ) {}
  adminDetails = {
    id: 0,
    firstName: '',
    lastName: '',
    password: '',
    email: '',
    mobile: '',
    address: '',
    role: '',
  };

  ngOnInit(): void {
    this.scroller.scrollToPosition([0, 0]);
    this.loggedInUser = this.authService.getUser(); // Fetch user data
    this.fetchUsers();

    // Initialize adminDetails with loggedInUser data
    if (this.loggedInUser) {
      this.adminDetails = {
        id: this.loggedInUser.id,
        firstName: this.loggedInUser.firstName,
        lastName: this.loggedInUser.lastName,
        password: this.loggedInUser.password,
        email: this.loggedInUser.email,
        mobile: this.loggedInUser.mobile,
        address: this.loggedInUser.address || '',
        role: this.loggedInUser.role,
      };
    }
  }

  updateAdminDetails() {
    if (!this.adminDetails.id) {
      alert('User ID is missing. Please try again.');
      return;
    }

    this.authService.updateUser(this.adminDetails).subscribe(
      (res) => {
        console.log('Admin details updated successfully', res);

        // Update session storage and local user
        this.authService.setUser(this.adminDetails);
        this.loggedInUser = { ...this.adminDetails };

        alert('Profile updated successfully!');
        this.router.navigate(['/profile']);
      },
      (err) => {
        console.error('Error updating admin details', err);
        alert('Failed to update profile. Please try again.');
      }
    );
  }

  fetchUsers() {
    this.authService.fetchUsers().subscribe((res) => {
      this.usersData = res;
    });
  }
}
