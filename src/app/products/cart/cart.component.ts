import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart/cart-service.service';
import { CommonModule, ViewportScroller } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormsModule, RouterLink, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  emptyCart = '';
  totalAmount: number = 0;

  constructor(
    // public cartService: CartService,
    private viewportScroller: ViewportScroller,
    private globalService: GlobalService,
    private router: Router,
    private cartService: CartService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
    this.getCartItem();
  }

  getCartItem(): void {
    this.globalService.getCartItems().subscribe({
      next: (res) => {
        this.cartItems = res.map((item) => ({
          ...item,
          quantity: item.quantity ?? 1,
        }));
        this.recalculateTotal(); // Calculate total after loading items
      },
      error: (err) => console.error('Error fetching cart items:', err),
    });
  }

  // removeItem(id: string): void {
  //   if (confirm('Are you sure you want to delete this product?')) {
  //     this.globalService.removeFromCart(id).subscribe(() => this.getCartItem());
  //   }
  // }
  // Remove a single item from the cart
  removeItem(id: string): void {
    this.toastr
      .info(
        'Are you sure you want to delete this product?',
        'Confirm Deletion',
        {
          closeButton: true,
          progressBar: true,
          tapToDismiss: true,
          positionClass: 'toast-top-center',
          timeOut: 0, // Make the toast persistent until the user interacts with it
          extendedTimeOut: 0, // Keep the toast open until action
        }
      )
      .onTap.pipe
      // Handle confirmation
      ()
      .subscribe({
        next: () => {
          // Proceed with deletion
          this.globalService.removeFromCart(id).subscribe({
            next: () => {
              this.toastr.success('Product removed from cart!', 'Success');
              this.getCartItem(); // Refresh the cart
            },
            error: (err) => {
              console.error('Error removing product:', err);
              this.toastr.error('Failed to remove product from cart', 'Error');
            },
          });
        },
        error: () => {
          // Handle cancellation or interaction
          this.toastr.info('Product deletion canceled', 'Info');
        },
      });
  }
  // clearCart() {
  //   if (confirm('Are you sure you want to delete this product?')) {
  //     this.globalService.clearCart().subscribe({
  //       next: () => this.getCartItem(), // Refresh cart items
  //       error: (err) => console.error('Failed to clear cart:', err), // Log any errors
  //     });
  //   }
  // }

  // Clear the entire cart
  clearCart() {
    this.toastr
      .info(
        'Are you sure you want to clear the entire cart?',
        'Confirm Clear Cart',
        {
          closeButton: true,
          progressBar: true,
          tapToDismiss: true,
          positionClass: 'toast-top-center',
          timeOut: 0,
          extendedTimeOut: 0,
        }
      )
      .onTap.pipe
      // Handle confirmation
      ()
      .subscribe({
        next: () => {
          // Proceed with clearing the cart
          this.globalService.clearCart().subscribe({
            next: () => {
              this.toastr.success('Cart has been cleared!', 'Success');
              this.getCartItem(); // Refresh the cart
            },
            error: (err) => {
              console.error('Error clearing cart:', err);
              this.toastr.error('Failed to clear the cart', 'Error');
            },
          });
        },
        error: () => {
          // Handle cancellation or interaction
          this.toastr.info('Cart clearing canceled', 'Info');
        },
      });
  }

  getTotal(): number {
    return this.globalService.getTotal(); // Get total from GlobalService
  }
  onQuantityChange(item: any): void {
    if (item.quantity < 1) {
      item.quantity = 1; // Ensure the quantity does not go below 1
    }
    this.recalculateTotal(); // Manually update the total
  }

  recalculateTotal(): void {
    this.totalAmount = this.cartItems.reduce(
      (total, item) => total + item.psp * item.quantity,
      0
    );
  }
  goToCheckout(): void {
    this.cartService.setCartItems(this.cartItems, this.totalAmount); // Store cart data in CartService
    this.router.navigate(['/checkout']); // Navigate to checkout page
  }
}
