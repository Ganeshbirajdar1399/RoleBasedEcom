import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  Observable,
  tap,
  throwError,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private readonly wishlistUrl = 'http://localhost:3000/wishlist';
  private readonly MAX_ITEMS = 4; // Maximum allowed items in the list

  private wishList: any[] = [];

  private wishlistCountSubject = new BehaviorSubject<number>(0);
  private wishlistSubject = new BehaviorSubject<any[]>(this.wishList);

  constructor(private http: HttpClient) {
    // Initialize wishlist
    this.getWishlistItems().subscribe({
      next: (items) =>
        this.updateList(items, this.wishlistSubject, this.wishlistCountSubject),
      error: (err) => console.error('Error fetching wishlist items:', err),
    });
  }

  // Generic method to update list and its count
  private updateList(
    items: any[],
    subject: BehaviorSubject<any[]>,
    countSubject: BehaviorSubject<number>
  ): void {
    subject.next(items);
    countSubject.next(items.length);
  }

  // Add product to wishlist
  addToWishlist(product: any): Observable<any> {
    const wishlist = this.wishlistSubject.getValue();
    const existingItem = wishlist.find((item) => item.id === product.id);

    if (this.wishList.length >= this.MAX_ITEMS) {
      alert(
        `Wishlist is full! You can only add up to ${this.MAX_ITEMS} items.`
      );
      return EMPTY;
    }

    if (this.wishList.some((item) => item.id === product.id)) {
      alert('Product is already in the wishlist!');
      return EMPTY;
    }

    if (existingItem) {
      existingItem.quantity += 1;
      return this.http
        .put<any>(`${this.wishlistUrl}/${existingItem.id}`, existingItem)
        .pipe(
          tap(() => this.wishlistSubject.next([...wishlist])),
          catchError((error) => {
            console.error('Failed to compare:', error);
            throw error;
          })
        );
    } else {
      const newProduct = { ...product, quantity: 1 };
      return this.http.post<any>(this.wishlistUrl, newProduct).pipe(
        tap(() => this.wishlistSubject.next([...wishlist, newProduct])),
        catchError((error) => {
          console.error('Failed to add to wishlist:', error);
          throw error;
        })
      );
    }
  }

  removeFromWishlist(id: string): Observable<any> {
    const wishlist = this.wishlistSubject
      .getValue()
      .filter((item) => item.id !== id);
    this.wishlistSubject.next(wishlist);

    return this.http.delete(`${this.wishlistUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Failed to remove item:', error);
        throw error;
      })
    );
  }

  getWishlistObservable(): Observable<any[]> {
    return this.wishlistSubject.asObservable();
  }

  // Fetch all wishlist items from the server
  getWishlistItems(): Observable<any[]> {
    return this.http.get<any[]>(this.wishlistUrl).pipe(
      catchError((error) => {
        console.error('Failed to fetch wishlist items:', error);
        return throwError(() => new Error('Failed to fetch wishlist items'));
      })
    );
  }

  getWishlistCountObservable(): Observable<number> {
    return this.wishlistCountSubject.asObservable();
  }

  // Clear the compare list
  clearWishlist(): void {
    this.wishList = [];
    this.updateList(
      this.wishList,
      this.wishlistSubject,
      this.wishlistCountSubject
    );
  }
}
