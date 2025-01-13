import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { GetProductService } from '../../services/product/get-product.service';
import { ProductUtilsService } from '../../services/utils/product-utils.service';
import { CartService } from '../../services/cart/cart-service.service';
import { Webdata } from '../../services/product/webdata';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent implements OnInit {
  cartCount: number = 0;

  webdatas: Webdata[] = [];
  groupedProducts: { [brand: string]: any[] } = {};

  constructor(
    private cartService: CartService,
    private router: Router,
    private productService: GetProductService,
    private productUtils: ProductUtilsService
  ) {
    // Subscribe to cart changes
    this.cartService.getCartObservable().subscribe((cart) => {
      this.cartCount = cart.reduce((count, item) => count + item.quantity, 0);
    });
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  ngOnInit(): void {
    this.fetchData();
    this.fetchWebData();
  }

  fetchWebData(): void {
    this.productService.fetchWebData().subscribe((res) => {
      this.webdatas = res; // Fallback to empty array if `res` is null/undefined
      // console.log('result', res);
    });
  }

  fetchData(): void {
    this.productService.fetchData().subscribe((products: any[]) => {
      this.groupedProducts = this.productUtils.groupByBrand(products);
      // console.log('Grouped Products:', this.groupedProducts);
    });
  }

  getBrands(): string[] {
    return this.productUtils.getBrands(this.groupedProducts);
  }
  navigateToBrand(brand: string): void {
    this.router.navigate(['/brand', brand]); // Navigate to the route with the brand name
  }
}
