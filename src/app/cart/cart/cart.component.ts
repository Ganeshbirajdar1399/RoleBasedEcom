import { Component, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart/cart-service.service';
import { CommonModule, ViewportScroller } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  emptyCart = '';

  constructor(
    public cartService: CartService,
    private viewportScroller: ViewportScroller
  ) {}

  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
    this.getCartItem();
  }

  getCartItem(): void {
    this.cartService.getCartItem().subscribe({
      next: (res) => {
        this.cartItems = res.map((item) => ({
          ...item,
          quantity: item.quantity ?? 1,
        }));
      },
      error: (err) => console.error('Error fetching cart items:', err),
    });
  }

  removeItem(id: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.cartService.removeItem(id).subscribe(() => this.getCartItem());
    }
  }
  clearCart() {
    if (confirm('Are you sure you want to delete this product?')) {
      this.cartService.clearCart().subscribe({
        next: () => this.getCartItem(), // Refresh cart items
        error: (err) => console.error('Failed to clear cart:', err), // Log any errors
      });
    }
  }

  getTotal(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  increaseQuantity(item: any): void {
    item.quantity++;
  }

  decreaseQuantity(item: any): void {
    if (item.quantity > 1) {
      item.quantity--;
    }
  }
}
