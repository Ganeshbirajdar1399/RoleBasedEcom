import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { NgxPaginationModule } from 'ngx-pagination';
import { SearchProductPipe } from '../../shared/pipes/search-product.pipe';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GetProductService } from '../../core/services/product/get-product.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth/auth.service';
import { GlobalService } from '../../core/services/global.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-orders',
  imports: [
    CommonModule,
    FormsModule,
    SearchProductPipe,
    ReactiveFormsModule,
    NgxPaginationModule,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent {
  allOrders: any[] = [];

  isSubmit = false;

  searchText = '';
  page = 1;
  itemsPerPage = 5;
  loggedInUser: any = null;

  constructor(
    private globalService: GlobalService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchOrders();
    this.loggedInUser = this.authService.getUser(); // Fetch user data
    // console.log('loggedin user',this.loggedInUser);
  }

  fetchOrders(): void {
    this.globalService.fetchOrders().subscribe((res) => {
      this.allOrders = res;
      console.log('All Products', res);
    });
  }

  deleteOrders(id: string): void {
    this.toastr
      .info('Are you sure you want to delete this order?', 'Confirm Deletion', {
        closeButton: true,
        progressBar: true,
        tapToDismiss: true,
        positionClass: 'toast-top-center',
        timeOut: 0, // Make the toast persistent until the user interacts with it
        extendedTimeOut: 0, // Keep the toast open until action
      })
      .onTap.pipe
      // Handle confirmation
      ()
      .subscribe({
        next: () => {
          // Proceed with deletion
          this.globalService.deleteOrder(id).subscribe({
            next: () => {
              this.toastr.success('Order Deleted successfully!', 'Success');
              this.fetchOrders(); // Refresh the cart
            },
            error: (err) => {
              console.error('Error in delete order:', err);
              this.toastr.error('Failed to delete order', 'Error');
            },
          });
        },
        error: () => {
          // Handle cancellation or interaction
          this.toastr.info('Order deletion canceled', 'Info');
        },
      });
  }

  // deleteOrders(id: string): void {
  //   if (confirm('Are you sure you want to delete this Order?')) {
  //     this.globalService.deleteOrder(id).subscribe((res) => {
  //       console.log('Product Deleted Successfully');
  //       this.fetchOrders();
  //     });
  //   }
  // }

  get isAdmin(): boolean {
    return this.loggedInUser?.role === 'admin';
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn(); // Check if the user is logged in
  }
}
