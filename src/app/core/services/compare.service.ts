import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, throwError, tap, EMPTY } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompareService {
  private readonly compareUrl = 'http://localhost:3000/compare';
  private readonly wishlistUrl = 'http://localhost:3000/wishlist';
  private readonly MAX_ITEMS = 4; // Maximum allowed items in the list

  private compareList: any[] = [];
  private wishList: any[] = [];
  private compareSubject = new BehaviorSubject<any[]>(this.compareList);
  private compareCountSubject = new BehaviorSubject<number>(0);

  // private wishlistSubject = new BehaviorSubject<any[]>(this.wishList);
  private wishlistCountSubject = new BehaviorSubject<number>(0);

   private wishlistSubject = new BehaviorSubject<any[]>([]);
getWishlistObservable(): Observable<any[]> {
    return this.wishlistSubject.asObservable();
  }
  constructor(private http: HttpClient) {
    // Initialize compare list
    this.getCompareItems().subscribe({
      next: (items) => this.updateList(items, this.compareSubject, this.compareCountSubject),
      error: (err) => console.error('Error fetching compare items:', err),
    });

    // Initialize wishlist
    this.getWishlistItems().subscribe({
      next: (items) => this.updateList(items, this.wishlistSubject, this.wishlistCountSubject),
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

  // Add product to compare list
  addToCompare(product: any): Observable<any> {
    if (this.compareList.length >= this.MAX_ITEMS) {
      alert(`Compare list is full! You can only add up to ${this.MAX_ITEMS} items.`);
      return EMPTY;
    }

    if (this.compareList.some((item) => item.id === product.id)) {
      alert('Product is already in the compare list!');
      return EMPTY;
    }

    return this.http.post<any>(this.compareUrl, product).pipe(
      catchError((error) => {
        console.error('Failed to add to compare:', error);
        return throwError(() => new Error('Failed to add to compare'));
      }),
      tap((newProduct) => {
        this.compareList.push(newProduct);
        this.updateList(this.compareList, this.compareSubject, this.compareCountSubject);
      })
    );
  }

  // Add product to wishlist
  addToWishlist(product: any): Observable<any> {
    if (this.wishList.length >= this.MAX_ITEMS) {
      alert(`Wishlist is full! You can only add up to ${this.MAX_ITEMS} items.`);
      return EMPTY;
    }

    if (this.wishList.some((item) => item.id === product.id)) {
      alert('Product is already in the wishlist!');
      return EMPTY;
    }

    return this.http.post<any>(this.wishlistUrl, product).pipe(
      catchError((error) => {
        console.error('Failed to add to wishlist:', error);
        return throwError(() => new Error('Failed to add to wishlist'));
      }),
      tap((newProduct) => {
        this.wishList.push(newProduct);
        this.updateList(this.wishList, this.wishlistSubject, this.wishlistCountSubject);
      })
    );
  }

  // Remove product from compare list
  removeFromCompare(id: string): Observable<any> {
    return this.http.delete(`${this.compareUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Failed to remove from compare:', error);
        return throwError(() => new Error('Failed to remove from compare'));
      }),
      tap(() => {
        this.compareList = this.compareList.filter((item) => item.id !== id);
        this.updateList(this.compareList, this.compareSubject, this.compareCountSubject);
      })
    );
  }

  // Remove product from wishlist
  removeFromWishlist(id: string): Observable<any> {
    return this.http.delete(`${this.wishlistUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Failed to remove from wishlist:', error);
        return throwError(() => new Error('Failed to remove from wishlist'));
      }),
      tap(() => {
        this.wishList = this.wishList.filter((item) => item.id !== id);
        this.updateList(this.wishList, this.wishlistSubject, this.wishlistCountSubject);
      })
    );
  }

  // Fetch all compare items from the server
  getCompareItems(): Observable<any[]> {
    return this.http.get<any[]>(this.compareUrl).pipe(
      catchError((error) => {
        console.error('Failed to fetch compare items:', error);
        return throwError(() => new Error('Failed to fetch compare items'));
      })
    );
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

  // Observables for compare list and count
  getCompareObservable(): Observable<any[]> {
    return this.compareSubject.asObservable();
  }

  getCompareCountObservable(): Observable<number> {
    return this.compareCountSubject.asObservable();
  }

  // Observables for wishlist list and count
  // getWishlistObservable(): Observable<any[]> {
  //   return this.wishlistSubject.asObservable();
  // }

  getWishlistCountObservable(): Observable<number> {
    return this.wishlistCountSubject.asObservable();
  }

  // Clear the compare list
  clearCompare(): void {
    this.compareList = [];
    this.updateList(this.compareList, this.compareSubject, this.compareCountSubject);
  }
}
