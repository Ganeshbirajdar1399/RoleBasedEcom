import { Component } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrService } from 'ngx-toastr';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth/auth.service';
import { CommonModule, ViewportScroller } from '@angular/common';
import { SearchProductPipe } from '../../shared/pipes/search-product.pipe';
import { RouterModule } from '@angular/router';
import { take } from 'rxjs';
@Component({
  selector: 'app-customers',
  imports: [
    CommonModule,
    NgxPaginationModule,
    SearchProductPipe,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css',
})
export class CustomersComponent {
  isAdded = false;
  isUpdated = false;

  users: any[] = [];
  loggedInUser: any = null;

  imageUrl: string = ''; // Declare the imageUrl property

  searchText = '';
  page = 1;
  itemsPerPage = 5;

  isEditing = false; // Flag for editing state
  editingProductId: string | null = null; // Store the ID of the product being edited

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private scroller: ViewportScroller
  ) {}

  ngOnInit(): void {
    this.scroller.scrollToPosition([0, 0]);
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.authService.fetchUsers().subscribe((res) => {
      this.users = res;
      console.log('All Products', res);
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
              this.toastr.success('User deleted successfully', 'Success');
              this.fetchUsers(); // Refresh user list
            },
            error: () => {
              this.toastr.error('Failed to delete user', 'Error');
            },
          });
        },
      });
  }

  logout(): void {
    this.authService.logout();
  }
}
