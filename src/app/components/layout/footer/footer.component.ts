import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../../services/cart-service.service';
import { GetProductService } from '../../../services/get-product.service';

@Component({
  selector: 'app-footer',
  imports: [RouterModule, CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
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
    // Navigate to the cart page
    // Use Angular Router here if necessary
    this.router.navigate(['/cart']);
  }

  groupedProducts: { [brand: string]: any[] } = {};
  limitedProducts: any[] = []; // Array to hold only 4 products

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.productService.fetchData().subscribe((products: any[]) => {
      this.groupedProducts = this.groupByBrand(products);
      console.log('Grouped Products:', this.groupedProducts);
    });
  }

  groupByBrand(products: any[]): { [brand: string]: any[] } {
    return products.reduce((groups, product) => {
      const brand = product.brand;
      if (!groups[brand]) {
        groups[brand] = [];
      }
      groups[brand].push(product);
      return groups;
    }, {});
  }
  getBrands(): string[] {
    return Object.keys(this.groupedProducts);
  }
  navigateToBrand(brand: string): void {
    this.router.navigate(['/brand', brand]); // Navigate to the route with the brand name
  }
}
