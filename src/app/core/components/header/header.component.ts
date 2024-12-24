import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart/cart-service.service';
import { GetProductService } from '../../services/product/get-product.service';
import { ProductUtilsService } from '../../services/utils/product-utils.service';
import { AuthService } from '../../services/auth/auth.service';
import { DummyService } from '../../services/dummy.service';

@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  cartCount: number = 0;
  groupedProducts: { [brand: string]: any[] } = {};

  loggedInUser: any = null;
  constructor(
    private cartService: CartService,
    private router: Router,
    private productService: GetProductService,
    private productUtils: ProductUtilsService,
    public authService: AuthService,
    private dummyService: DummyService
  ) {
    // Subscribe to cart changes
    this.cartService.getCartObservable().subscribe((cart) => {
      this.cartCount = cart.reduce((count, item) => count + item.quantity, 0);
    });
  }

  ngOnInit(): void {
    this.loggedInUser = this.dummyService.getUser(); // Fetch user data
    this.fetchData();
  }
  isLoggedIn(): boolean {
    return this.dummyService.isLoggedIn(); // Check if the user is logged in
  }

  goToCart() {
    this.router.navigate(['/cart']);
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
  closeNavbar() {
    const navbar = document.getElementById('navbarNav');
    if (navbar?.classList.contains('show')) {
      navbar.classList.remove('show'); // Close the navbar
    }
  }

  logout(): void {
    this.dummyService.logout(); // Clear session and redirect
  }
}
