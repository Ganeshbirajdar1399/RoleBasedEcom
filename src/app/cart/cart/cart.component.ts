import { Component } from '@angular/core';
import { CartService } from '../../core/services/cart/cart-service.service';
import { CommonModule, ViewportScroller } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  cartItems: any[] = [];

  constructor(private cartService: CartService,private viewportScroller: ViewportScroller) {
    this.cartItems = this.cartService.getCartItems();
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  getTotal() {
    return this.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }
  increaseQuantity(item: any): void {
    item.quantity += 1;
  }
  decreaseQuantity(item: any): void{
    item.quantity -= 1;
  }
}
