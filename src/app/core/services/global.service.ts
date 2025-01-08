// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { BehaviorSubject, EMPTY, forkJoin, Observable, throwError } from 'rxjs';
// import { catchError, tap } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root',
// })
// export class GlobalService {
//   private readonly apiUrl = 'http://localhost:3000';
//   private readonly MAX_ITEMS = 4;

//   // State subjects
//   private cartSubject = new BehaviorSubject<any[]>([]);
//   private compareSubject = new BehaviorSubject<any[]>([]);
//   private wishlistSubject = new BehaviorSubject<any[]>([]);

//   constructor(private http: HttpClient) {
//     this.initializeSubjects();
//   }

//   private initializeSubjects(): void {
//     this.loadListFromServer('cart', this.cartSubject);
//     this.loadListFromServer('compare', this.compareSubject);
//     this.loadListFromServer('wishlist', this.wishlistSubject);
//   }

//   // --- Cart Methods ---
//   getCartObservable(): Observable<any[]> {
//     return this.cartSubject.asObservable();
//   }

//   getCartItems(): Observable<any[]> {
//     return this.cartSubject.asObservable(); // Reintroduced method
//   }

//   addToCart(product: any): Observable<any> {
//     return this.addItem('cart', product, this.cartSubject);
//   }

//   removeFromCart(id: string): Observable<any> {
//     return this.removeItem('cart', id, this.cartSubject);
//   }

//   clearCart(): Observable<any> {
//     return this.clearItems('cart', this.cartSubject);
//   }

//   // --- Compare Methods ---
//   getCompareObservable(): Observable<any[]> {
//     return this.compareSubject.asObservable();
//   }

//   getCompareItems(): Observable<any[]> {
//     return this.compareSubject.asObservable(); // Reintroduced method
//   }

//   addToCompare(product: any): Observable<any> {
//     return this.addItem('compare', product, this.compareSubject);
//   }

//   removeFromCompare(id: string): Observable<any> {
//     return this.removeItem('compare', id, this.compareSubject);
//   }

//   clearCompare(): Observable<any> {
//     return this.clearItems('compare', this.compareSubject);
//   }

//   // --- Wishlist Methods ---
//   getWishlistObservable(): Observable<any[]> {
//     return this.wishlistSubject.asObservable();
//   }

//   getWishlistItems(): Observable<any[]> {
//     return this.wishlistSubject.asObservable(); // Reintroduced method
//   }

//   addToWishlist(product: any): Observable<any> {
//     return this.addItem('wishlist', product, this.wishlistSubject);
//   }

//   removeFromWishlist(id: string): Observable<any> {
//     return this.removeItem('wishlist', id, this.wishlistSubject);
//   }

//   clearWishlist(): Observable<any> {
//     return this.clearItems('wishlist', this.wishlistSubject);
//   }

//   // --- Generic Methods ---
//   private addItem(
//     endpoint: string,
//     product: any,
//     subject: BehaviorSubject<any[]>
//   ): Observable<any> {
//     const list = subject.getValue();
//     if (list.length >= this.MAX_ITEMS) {
//       alert(`You can only add up to ${this.MAX_ITEMS} items.`);
//       return EMPTY;
//     }

//     if (list.some((item) => item.id === product.id)) {
//       alert('Product is already in the list!');
//       return EMPTY;
//     }

//     const newProduct = { ...product, quantity: 1 };
//     return this.http.post<any>(`${this.apiUrl}/${endpoint}`, newProduct).pipe(
//       tap(() => subject.next([...list, newProduct])),
//       catchError((error) =>
//         this.handleError(error, `Failed to add item to ${endpoint}`)
//       )
//     );
//   }

//   private removeItem(
//     endpoint: string,
//     id: string,
//     subject: BehaviorSubject<any[]>
//   ): Observable<any> {
//     const updatedList = subject.getValue().filter((item) => item.id !== id);
//     subject.next(updatedList);

//     return this.http
//       .delete(`${this.apiUrl}/${endpoint}/${id}`)
//       .pipe(
//         catchError((error) =>
//           this.handleError(error, `Failed to remove item from ${endpoint}`)
//         )
//       );
//   }

//   private clearItems(
//     endpoint: string,
//     subject: BehaviorSubject<any[]>
//   ): Observable<any> {
//     const list = subject.getValue();
//     subject.next([]);
//     return forkJoin(
//       list.map((item) =>
//         this.http.delete(`${this.apiUrl}/${endpoint}/${item.id}`)
//       )
//     ).pipe(
//       catchError((error) =>
//         this.handleError(error, `Failed to clear items in ${endpoint}`)
//       )
//     );
//   }

//   private loadListFromServer(
//     endpoint: string,
//     subject: BehaviorSubject<any[]>
//   ): void {
//     this.http
//       .get<any[]>(`${this.apiUrl}/${endpoint}`)
//       .pipe(
//         tap((items) => subject.next(items)),
//         catchError((error) =>
//           this.handleError(error, `Failed to load ${endpoint} items`)
//         )
//       )
//       .subscribe();
//   }

//   private handleError(error: any, message: string): Observable<never> {
//     console.error(message, error);
//     return throwError(() => new Error(message));
//   }
// }



import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, forkJoin, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  private readonly apiUrl = 'https://json-server-9gwz.onrender.com';
  private readonly MAX_ITEMS = 4;

  private cartSubject = new BehaviorSubject<any[]>([]);
  private compareSubject = new BehaviorSubject<any[]>([]);
  private wishlistSubject = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient) {
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
      alert(`You can only add up to ${this.MAX_ITEMS} items.`);
      return EMPTY;
    }
    if (list.some((item) => item.id === product.id)) {
      alert('Product is already in the list!');
      return EMPTY;
    }

    return this.http.post<any>(`${this.apiUrl}/${endpoint}`, product).pipe(
      tap(() => subject.next([...list, product])),
      catchError((error) => this.handleError(error, `Failed to add item to ${endpoint}`))
    );
  }

  private removeItem(
    endpoint: string,
    id: string,
    subject: BehaviorSubject<any[]>
  ): Observable<any> {
    const updatedList = subject.getValue().filter((item) => item.id !== id);
    subject.next(updatedList);

    return this.http.delete(`${this.apiUrl}/${endpoint}/${id}`).pipe(
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

  private handleError(error: any, message: string): Observable<never> {
    console.error(message, error);
    return throwError(() => new Error(message));
  }
}

