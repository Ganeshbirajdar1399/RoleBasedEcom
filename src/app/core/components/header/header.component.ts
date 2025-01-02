import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart/cart-service.service';
import { GetProductService } from '../../services/product/get-product.service';
import { ProductUtilsService } from '../../services/utils/product-utils.service';
import { AuthService } from '../../services/auth/auth.service';
import { DummyService } from '../../services/dummy.service';
import { CompareService } from '../../services/compare.service';

@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  sidebarOpen = false;
  compareCount: number = 0; // Store compare count
  cartCount: number = 0; // Store cart count
  groupedProducts: { [brand: string]: any[] } = {}; // Store grouped products
  loggedInUser: any = null;

  constructor(
    private cartService: CartService,
    private router: Router,
    private productService: GetProductService,
    private productUtils: ProductUtilsService,
    public authService: AuthService,
    private dummyService: DummyService,
    private cdr: ChangeDetectorRef,
    private compareService: CompareService
  ) {
    // Subscribe to cart changes
    this.cartService.getCartObservable().subscribe((cart) => {
      this.cartCount = cart.reduce((count, item) => count + item.quantity, 0);
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.sidebarOpen = false; // Close sidebar on route change
      }
    });
  }

  ngOnInit(): void {
    // Subscribe to the user observable to track the logged-in state
    this.authService.user$.subscribe((user) => {
      this.loggedInUser = user;
    });

    this.compareService.getCompareCountObservable().subscribe((count) => {
      console.log('Compare count updated:', count);
      this.compareCount = count;
      this.cdr.detectChanges();  // Manually trigger change detection
      console.log('compare count',this.compareCount)
    });
    

    this.fetchData();

  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn(); // Check if the user is logged in
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

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeNavbar() {
    const navbar = document.getElementById('navbarNav');
    if (navbar?.classList.contains('show')) {
      navbar.classList.remove('show'); // Close the navbar
    }
  }

  logout(): void {
    this.authService.logout(); // Clear session and redirect
  }
}
