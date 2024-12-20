import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../services/cart-service.service';
import { GetProductService } from '../../../services/get-product.service';
import { ProductUtilsService } from '../../../services/utils/product-utils.service';

@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  cartCount: number = 0;
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
  }

  fetchData(): void {
    this.productService.fetchData().subscribe((products: any[]) => {
      this.groupedProducts = this.productUtils.groupByBrand(products);
    });
  }

  getBrands(): string[] {
    return this.productUtils.getBrands(this.groupedProducts);
  }

  navigateToBrand(brand: string): void {
    this.productUtils.navigateToBrand(brand);
  }
}
