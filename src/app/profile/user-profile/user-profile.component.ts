import { Component, OnInit } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4 for generating UUIDs
import { ToastrService } from 'ngx-toastr';
import { switchMap, take } from 'rxjs';

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
    private scroller: ViewportScroller,
    private toastr: ToastrService
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
      this.toastr.success('admin added successfully', 'Success');
      // console.log('admin added successfully', res);
      this.isRegister = true;
      setTimeout(() => {
        this.isRegister = false;
      }, 2000);
      this.formEmpty();
      // this.router.navigate(['/login']);
    });
  }

  deleteUser(id: string): void {
    this.toastr
      .info('Click to confirm deletion', 'Confirm Delete', {
        closeButton: true,
        progressBar: true,
        tapToDismiss: true,
        positionClass: 'toast-top-center',
        timeOut: 0, // Persistent toast
        extendedTimeOut: 0,
      })
      .onTap.pipe(take(1))
      .subscribe({
        next: () => {
          this.authService.deleteUserData(id).subscribe({
            next: () => {
              this.toastr.success('Admin deleted successfully', 'Success');
              this.fetchUsers(); // Refresh user list
            },
            error: () => {
              this.toastr.error('Failed to delete user', 'Error');
            },
          });
        },
      });
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
