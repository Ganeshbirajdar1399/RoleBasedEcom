import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from './utils/product';
@Injectable({
  providedIn: 'root',
})
export class GetProductService {
  apiUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) {}

  // Fetch all products
  fetchData(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
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
      )
    );
  }

  // Fetch filtered products by a specific brand
  fetchProductsByBrand(brand: string): Observable<Product[]> {
    return this.fetchGroupedByBrand().pipe(
      map(
        (groupedProducts: { [brand: string]: Product[] }) =>
          groupedProducts[brand] || []
      )
    );
  }
}
