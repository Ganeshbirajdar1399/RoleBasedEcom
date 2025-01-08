import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly apiUrl = 'https://json-server-9gwz.onrender.com/cart';
  private readonly apiUrlcart = 'https://json-server-9gwz.onrender.com';
  private cartSubject = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient) {
    this.loadCartFromServer();
  }

  private loadCartFromServer(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (cartItems) => this.cartSubject.next(cartItems),
      error: (error) => console.error('Failed to load cart:', error),
    });
  }

  getCartItem(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      tap((response) => this.cartSubject.next(response)),
      catchError((error) => {
        console.error('Error in getCartItem:', error);
        throw error;
      })
    );
  }

  addToCart(product: any): Observable<any> {
    const cart = this.cartSubject.getValue();
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
      return this.http
        .put<any>(`${this.apiUrl}/${existingItem.id}`, existingItem)
        .pipe(
          tap(() => this.cartSubject.next([...cart])),
          catchError((error) => {
            console.error('Failed to update cart:', error);
            throw error;
          })
        );
    } else {
      const newProduct = { ...product, quantity: 1 };
      return this.http.post<any>(this.apiUrl, newProduct).pipe(
        tap(() => this.cartSubject.next([...cart, newProduct])),
        catchError((error) => {
          console.error('Failed to add to cart:', error);
          throw error;
        })
      );
    }
  }

  removeItem(id: string): Observable<any> {
    const cart = this.cartSubject.getValue().filter((item) => item.id !== id);
    this.cartSubject.next(cart);

    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Failed to remove item:', error);
        throw error;
      })
    );
  }

  clearCart(): Observable<any> {
    return this.http
      .get<any[]>(`${this.apiUrlcart}/cart`)
      .pipe(
        switchMap((cartItems) =>
          forkJoin(
            cartItems.map((item) =>
              this.http.delete(`${this.apiUrlcart}/cart/${item.id}`)
            )
          )
        )
      );
  }

  getCartObservable(): Observable<any[]> {
    return this.cartSubject.asObservable();
  }
}
