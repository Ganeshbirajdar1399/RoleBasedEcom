import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, ViewportScroller } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-updateprofile',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './updateprofile.component.html',
  styleUrl: './updateprofile.component.css',
})
export class UpdateprofileComponent {
  loggedInUser: any = null;
  usersData: any[] = [];
  isRegister = false;
  hide = true;
  constructor(
    private authService: AuthService,
    private router: Router,
    private scroller: ViewportScroller,
    private toastr: ToastrService
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
      // Fetch user details from the database to retrieve the password
      this.authService.getUserById(this.loggedInUser.id).subscribe(
        (userFromDb) => {
          this.adminDetails = {
            id: userFromDb.id,
            firstName: userFromDb.firstName,
            lastName: userFromDb.lastName,
            password: userFromDb.password, // Assign the password from the database
            email: userFromDb.email,
            mobile: userFromDb.mobile,
            address: userFromDb.address || '',
            role: userFromDb.role,
          };
        },
        (error) => {
          console.error('Error fetching user details:', error);
        }
      );
    }
  }
  toggleHide() {
    this.hide = !this.hide; // Toggle password visibility
  }

  updateUserDetails() {
    if (!this.adminDetails.id) {
      this.toastr.warning('User ID is missing. Please try again.', 'Warning');
      return;
    }

    this.authService.updateUser(this.adminDetails).subscribe(
      (res) => {
        // console.log('Admin details updated successfully', res);
        this.toastr.success('Profile updated successfully!', 'Success');
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
      // this.usersData = res;
    });
  }
}
