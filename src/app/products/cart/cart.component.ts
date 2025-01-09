import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart/cart-service.service';
import { CommonModule, ViewportScroller } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';

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
    private cartService: CartService
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

  removeItem(id: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.globalService.removeFromCart(id).subscribe(() => this.getCartItem());
    }
  }
  clearCart() {
    if (confirm('Are you sure you want to delete this product?')) {
      this.globalService.clearCart().subscribe({
        next: () => this.getCartItem(), // Refresh cart items
        error: (err) => console.error('Failed to clear cart:', err), // Log any errors
      });
    }
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
