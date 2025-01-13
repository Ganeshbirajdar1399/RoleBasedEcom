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
import { SearchOrderPipe } from '../../shared/pipes/search-order.pipe';
interface Order {
  id: string;
  userId: string;
  customer: {
    name: string;
    email: string;
    contactNo: string;
    address: string;
    billingAddress: string;
  };
  orderDate: string;
  totalAmount: number;
  items: {
    pname: string;
    ram: string;
    disksize: string;
    quantity: number;
    psp: number;
  }[];
}
@Component({
  selector: 'app-orders',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    SearchOrderPipe,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent {
  allOrders: Order[] = [];
  // rawOrders: Order[] = []; // Raw orders fetched from the server
  filteredOrders: any[] = [];
  isSubmit = false;

  searchText: string = '';
  page = 1;
  itemsPerPage = 10;
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

      // Filter orders by user ID
      if (this.loggedInUser?.id) {
        this.filteredOrders = this.allOrders.filter(
          (order) => order.userId === this.loggedInUser.id
        );
      } else {
        this.filteredOrders = this.allOrders;
      }
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

  get isAdmin(): boolean {
    return this.loggedInUser?.role === 'admin';
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn(); // Check if the user is logged in
  }
}
