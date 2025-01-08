import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  catchError,
  throwError,
  tap,
  EMPTY,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompareService {
  private readonly compareUrl = 'http://localhost:3000/compare';
  private readonly MAX_ITEMS = 4; // Maximum allowed items in the list

  private compareList: any[] = [];

  private compareSubject = new BehaviorSubject<any[]>(this.compareList);
  private compareCountSubject = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) {
    // Initialize compare list
    this.getCompareItems().subscribe({
      next: (items) =>
        this.updateList(items, this.compareSubject, this.compareCountSubject),
      error: (err) => console.error('Error fetching compare items:', err),
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
    const compare = this.compareSubject.getValue();
    const existingItem = compare.find((item) => item.id === product.id);
    if (this.compareList.length >= this.MAX_ITEMS) {
      alert(
        `Compare list is full! You can only add up to ${this.MAX_ITEMS} items.`
      );
      return EMPTY;
    }

    if (this.compareList.some((item) => item.id === product.id)) {
      alert('Product is already in the compare list!');
      return EMPTY;
    }

    if (existingItem) {
      existingItem.quantity += 1;
      return this.http
        .put<any>(`${this.compareUrl}/${existingItem.id}`, existingItem)
        .pipe(
          tap(() => this.compareSubject.next([...compare])),
          catchError((error) => {
            console.error('Failed to compare:', error);
            throw error;
          })
        );
    } else {
      const newProduct = { ...product, quantity: 1 };
      return this.http.post<any>(this.compareUrl, newProduct).pipe(
        tap(() => this.compareSubject.next([...compare, newProduct])),
        catchError((error) => {
          console.error('Failed to add to cart:', error);
          throw error;
        })
      );
    }
  }

  getCompareObservable(): Observable<any[]> {
    return this.compareSubject.asObservable();
  }

  removeFromCompare(id: string): Observable<any> {
    const compare = this.compareSubject
      .getValue()
      .filter((item) => item.id !== id);
    this.compareSubject.next(compare);

    return this.http.delete(`${this.compareUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Failed to remove item:', error);
        throw error;
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

  getCompareCountObservable(): Observable<number> {
    return this.compareCountSubject.asObservable();
  }

  // Clear the compare list
  clearCompare(): void {
    this.compareList = [];
    this.updateList(
      this.compareList,
      this.compareSubject,
      this.compareCountSubject
    );
  }
}
