import { Component, OnInit } from '@angular/core';
import { DummyService } from '../../core/services/dummy.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';

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
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
    address: '',
    role: 'admin',
  };

  adminDetails = {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    address: '',
    role: '',
  };

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loggedInUser = this.authService.getUser(); // Fetch user data
    this.fetchUsers();

    // Initialize adminDetails with loggedInUser data
    if (this.loggedInUser) {
      this.adminDetails = {
        id: this.loggedInUser.id,
        firstName: this.loggedInUser.firstName,
        lastName: this.loggedInUser.lastName,
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

        // Close modal programmatically
        // const modalElement = document.getElementById('updateAdminModal');
        // if (modalElement) {
        //   const modalInstance = bootstrap.Modal.getInstance(modalElement);
        //   modalInstance?.hide();
        // }
      },
      (err) => {
        console.error('Error updating admin details', err);
        alert('Failed to update profile. Please try again.');
      }
    );
  }

  onSubmit() {
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
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      password: '',
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
