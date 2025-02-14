import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, EMPTY, forkJoin, Observable, throwError } from 'rxjs';
import { catchError, tap, throwIfEmpty } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  private readonly apiUrl = 'https://ecom-db-json.onrender.com';
  // private readonly apiUrl = 'http://localhost:3000';
  private readonly apiOrders = `${this.apiUrl}/orders`; // merged the API URL

  private readonly MAX_ITEMS = 4;

  private cartSubject = new BehaviorSubject<any[]>([]);
  private compareSubject = new BehaviorSubject<any[]>([]);
  private wishlistSubject = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient, private toastr: ToastrService) {
    this.loadList('cart', this.cartSubject);
    this.loadList('compare', this.compareSubject);
    this.loadList('wishlist', this.wishlistSubject);
  }

  // Get Observable Methods
  getCartObservable(): Observable<any[]> {
    return this.cartSubject.asObservable();
  }

  getCompareObservable(): Observable<any[]> {
    return this.compareSubject.asObservable();
  }

  getWishlistObservable(): Observable<any[]> {
    return this.wishlistSubject.asObservable();
  }

  // Alias Methods (Optional)
  getCartItems(): Observable<any[]> {
    return this.getCartObservable();
  }

  getCompareItems(): Observable<any[]> {
    return this.getCompareObservable();
  }

  getWishlistItems(): Observable<any[]> {
    return this.getWishlistObservable();
  }

  // Add Item
  addToCart(product: any): Observable<any> {
    return this.addItem('cart', product, this.cartSubject);
  }

  addToCompare(product: any): Observable<any> {
    return this.addItem('compare', product, this.compareSubject);
  }

  addToWishlist(product: any): Observable<any> {
    return this.addItem('wishlist', product, this.wishlistSubject);
  }

  // Remove Item
  removeFromCart(id: string): Observable<any> {
    return this.removeItem('cart', id, this.cartSubject);
  }

  removeFromCompare(id: string): Observable<any> {
    return this.removeItem('compare', id, this.compareSubject);
  }

  removeFromWishlist(id: string): Observable<any> {
    return this.removeItem('wishlist', id, this.wishlistSubject);
  }

  // Clear Items
  clearCart(): Observable<any> {
    return this.clearItems('cart', this.cartSubject);
  }

  clearCompare(): Observable<any> {
    return this.clearItems('compare', this.compareSubject);
  }

  clearWishlist(): Observable<any> {
    return this.clearItems('wishlist', this.wishlistSubject);
  }

  // Generic Methods
  private addItem(
    endpoint: string,
    product: any,
    subject: BehaviorSubject<any[]>
  ): Observable<any> {
    const list = subject.getValue();
    if (list.length >= this.MAX_ITEMS) {
      this.toastr.error(
        `You can only add up to ${this.MAX_ITEMS} items.`,
        'Limit Reached'
      );
      return EMPTY;
    }
    if (list.some((item) => item.id === product.id)) {
      this.toastr.warning(
        'Product is already in the list!',
        'Duplicate Product'
      );
      return EMPTY;
    }

    return this.http.post<any>(`${this.apiUrl}/${endpoint}`, product).pipe(
      tap(() => subject.next([...list, product])),
      catchError((error) =>
        this.handleError(error, `Failed to add item to ${endpoint}`)
      )
    );
  }

  private removeItem(
    endpoint: string,
    id: string,
    subject: BehaviorSubject<any[]>
  ): Observable<any> {
    const updatedList = subject.getValue().filter((item) => item.id !== id);
    subject.next(updatedList);

    return this.http
      .delete(`${this.apiUrl}/${endpoint}/${id}`)
      .pipe(
        catchError((error) =>
          this.handleError(error, `Failed to remove item from ${endpoint}`)
        )
      );
  }

  private clearItems(
    endpoint: string,
    subject: BehaviorSubject<any[]>
  ): Observable<any> {
    const list = subject.getValue();
    subject.next([]);

    return forkJoin(
      list.map((item) =>
        this.http.delete(`${this.apiUrl}/${endpoint}/${item.id}`)
      )
    ).pipe(
      catchError((error) =>
        this.handleError(error, `Failed to clear items in ${endpoint}`)
      )
    );
  }

  private loadList(endpoint: string, subject: BehaviorSubject<any[]>): void {
    if (subject.getValue().length === 0) {
      this.http
        .get<any[]>(`${this.apiUrl}/${endpoint}`)
        .pipe(
          tap((items) => subject.next(items)),
          catchError((error) =>
            this.handleError(error, `Failed to load ${endpoint} items`)
          )
        )
        .subscribe();
    }
  }

  // Add this method to your GlobalService
  placeOrder(orderData: any): Observable<any> {
    return this.http
      .post<any>(this.apiOrders, orderData)
      .pipe(
        catchError((error) => this.handleError(error, 'Failed to place order'))
      );
  }

  getTotal(): number {
    return this.cartSubject.getValue().reduce((total, item) => {
      const price = typeof item.psp === 'number' ? item.psp : 0;
      const quantity = item.quantity || 1;
      return total + price * quantity;
    }, 0);
  }

  fetchOrders(): Observable<any> {
    return this.http.get(this.apiOrders);
  }

  deleteOrder(id: string): Observable<any> {
    return this.http.delete(`${this.apiOrders}/${id}`);
  }

  postSubscribe(data: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/subscribers`, data);
  }
  getSubscribe(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/subscribers`);
  }
  deleteSubscriber(id: string) {
    return this.http.delete(`${this.apiUrl}/subscribers/${id}`);
  }

  private handleError(error: any, message: string): Observable<never> {
    this.toastr.error(message, 'Error');
    return EMPTY;
  }
}
