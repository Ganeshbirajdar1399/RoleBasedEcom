import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../services/cart-service.service';
import { GetProductService } from '../../../services/get-product.service';

@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  cartCount: number = 0;

  constructor(
    private cartService: CartService,
    private router: Router,
    private productService: GetProductService
  ) {
    // Subscribe to cart changes
    this.cartService.getCartObservable().subscribe((cart) => {
      this.cartCount = cart.reduce((count, item) => count + item.quantity, 0);
    });
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  groupedProducts: { [brand: string]: any[] } = {};


  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.productService.fetchData().subscribe((products: any[]) => {
      this.groupedProducts = this.groupByBrand(products);
    });
  }

  groupByBrand(products: any[]): { [brand: string]: any[] } {
    return products.reduce((groups, product) => {
      (groups[product.brand] = groups[product.brand] || []).push(product);
      return groups;
    }, {});
  }

  getBrands(): string[] {
    return Object.keys(this.groupedProducts || {});
  }

  navigateToBrand(brand: string): void {
    this.router.navigate(['/brand', brand]); // Navigate to the route with the brand name
  }
}
