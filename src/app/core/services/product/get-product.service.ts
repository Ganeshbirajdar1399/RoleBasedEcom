import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Product } from '../utils/product';
import { Webdata } from './webdata';

@Injectable({
  providedIn: 'root',
})
export class GetProductService {
  private readonly baseUrl = 'https://ecom-db-json.onrender.com'; // Fixed base URL
  private readonly productsUrl = `${this.baseUrl}/products`; // Products endpoint
  private readonly webDataUrl = `${this.baseUrl}/otherinfo`; // Web data endpoint

  constructor(private http: HttpClient) {}

  // Fetch all products
  fetchData(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl).pipe(
      catchError((error) => {
        console.error('Error fetching products:', error);
        return of([]); // Return an empty array in case of error
      })
    );
  }

  // Search products
  searchProducts(query: string): Observable<any[]> {
    return this.http
      .get<any[]>(this.productsUrl)
      .pipe(
        map((products) =>
          products.filter((product) =>
            product.pname.toLowerCase().includes(query.toLowerCase())
          )
        )
      );
  }

  // Add product
  addData(product: Product): Observable<Product> {
    return this.http.post<Product>(this.productsUrl, product).pipe(
      catchError((error) => {
        console.error('Error adding product:', error);
        return of(null as unknown as Product); // Return null in case of error
      })
    );
  }

  // Add web data
  addWebData(webdata: Webdata): Observable<Webdata> {
    return this.http.post<Webdata>(this.webDataUrl, webdata).pipe(
      catchError((error) => {
        console.error('Error adding web data:', error);
        return of(null as unknown as Webdata); // Return null in case of error
      })
    );
  }

  // Fetch all web data
  fetchWebData(): Observable<Webdata[]> {
    return this.http.get<Webdata[]>(this.webDataUrl).pipe(
      catchError((error) => {
        console.error('Error fetching web data:', error);
        return of([]); // Return an empty array in case of error
      })
    );
  }

  // Update web data
  updateWebData(id: string, webdata: any): Observable<any> {
    const url = `${this.webDataUrl}/${id}`;
    return this.http.put<any>(url, webdata).pipe(
      catchError((error) => {
        console.error('Error updating web data:', error);
        return throwError(() => new Error(error));
      })
    );
  }

  // Update product data
  updateData(id: string, product: any): Observable<any> {
    const url = `${this.productsUrl}/${id}`;
    return this.http.put<any>(url, product).pipe(
      catchError((error) => {
        console.error('Error updating product:', error);
        return throwError(() => new Error(error));
      })
    );
  }

  // Delete product
  deleteData(id: string): Observable<Product> {
    return this.http.delete<Product>(`${this.productsUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error in delete product:', error);
        return of(null as unknown as Product); // Return null in case of error
      })
    );
  }

  // Fetch and group products by brand
  fetchGroupedByBrand(): Observable<{ [brand: string]: Product[] }> {
    return this.fetchData().pipe(
      map((products: Product[]) =>
        products.reduce(
          (groups: { [brand: string]: Product[] }, product: Product) => {
            const brand = product.brand;
            (groups[brand] = groups[brand] || []).push(product);
            return groups;
          },
          {}
        )
      ),
      catchError((error) => {
        console.error('Error grouping products by brand:', error);
        return of({}); // Return an empty object in case of error
      })
    );
  }

  // Fetch filtered products by a specific brand
  fetchProductsByBrand(brand: string): Observable<Product[]> {
    return this.fetchGroupedByBrand().pipe(
      map(
        (groupedProducts: { [brand: string]: Product[] }) =>
          groupedProducts[brand] || []
      ),
      catchError((error) => {
        console.error('Error fetching products by brand:', error);
        return of([]); // Return an empty array in case of error
      })
    );
  }
}
