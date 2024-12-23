import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: any[] = [];
  private cartSubject = new BehaviorSubject<any[]>([]);

  addToCart(product: any) {
    const existingItem = this.cart.find((item) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.push({ ...product, quantity: 1 });
    }
    this.cartSubject.next(this.cart); // Notify subscribers
  }

  getCartObservable() {
    return this.cartSubject.asObservable();
  }

  getCartItems() {
    return this.cart;
  }

  clearCart() {
    this.cart = [];
    this.cartSubject.next(this.cart); // Notify subscribers
  }
}
