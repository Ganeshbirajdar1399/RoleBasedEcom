import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { GetProductService } from '../../core/services/product/get-product.service';
import { FormsModule } from '@angular/forms';
import { ProductUtilsService } from '../../core/services/utils/product-utils.service';
import { CompareService } from '../../core/services/compare/compare.service';
import { LimitWordsPipe } from '../../shared/pipes/limit-words.pipe';
import { CartService } from '../../core/services/cart/cart-service.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { GlobalService } from '../../core/services/global.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-brand',
  imports: [CommonModule, RouterModule, FormsModule, LimitWordsPipe],
  templateUrl: './brand.component.html',
  styleUrl: './brand.component.css',
})
export class BrandComponent implements OnInit {
  brandName: string = '';
  // products: any[] = []; // All products fetched from the service
  groupedProducts: { [brand: string]: any[] } = {}; // Products grouped by brand
  filteredProducts: any[] = []; // Products filtered by the selected brand

  cartItems: any[] = [];
  compareItems: any[] = [];
  wishlistItems: any[] = [];

  constructor(
    private productService: GetProductService,
    private route: ActivatedRoute,
    private productUtils: ProductUtilsService,
    private scroller: ViewportScroller,
    private router: Router,
    // private cartService: CartService,
    // private compareService: CompareService,
    // private wishlistService: WishlistService,
    private globalService: GlobalService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.scroller.scrollToPosition([0, 0]);
    this.route.params.subscribe((params) => {
      this.brandName = params['brandName'];
      this.loadProducts();
    });
  }
  calculateDiscount(psp: number, pop: number): number {
    const discount = ((pop - psp) / pop) * 100;
    return Math.round(discount); // Round to the nearest whole number
  }

  // addToCart(product: any) {
  //   this.globalService.addToCart(product).subscribe({
  //     next: (response) => {
  //       console.log('Product added successfully:', response);
  //     },
  //     error: (error) => {
  //       console.error('Error adding product to cart:', error);
  //     },
  //   });
  // }

  addToCart(product: any) {
    if (this.cartItems.some((item) => item.id === product.id)) {
      this.toastr.warning('This product is already in the list!', 'Warning');
      return;
    }

    this.globalService.addToCart(product).subscribe({
      next: () => {
        this.toastr.success(`${product?.pname} added to cart`, 'Success');
        this.getCartItems(); // Refresh compare list
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
      },
    });
  }
  // Get all products in the cart list
  getCartItems() {
    this.globalService.getCartItems().subscribe({
      next: (res) => {
        this.cartItems = res;
      },
      error: (err) => {
        console.error('Error fetching cart items:', err);
      },
    });
  }

  // Add product to compare list
  addToCompare(product: any) {
    if (this.compareItems.some((item) => item.id === product.id)) {
      this.toastr.warning('This product is already in the list!', 'Warning');
      return;
    }

    // if (this.compareItems.length >= 4) {
    //   alert('Compare section is full! You can only compare up to 4 products.');
    //   return;
    // }

    this.globalService.addToCompare(product).subscribe({
      next: () => {
        this.toastr.success(`${product?.pname} added to compare`, 'Success');
        this.getCompareItems(); // Refresh compare list
      },
      error: (err) => {
        console.error('Error adding to compare:', err);
      },
    });
  }
  // Get all products in the compare list
  getCompareItems() {
    this.globalService.getCompareItems().subscribe({
      next: (res) => {
        this.compareItems = res;
      },
      error: (err) => {
        console.error('Error fetching compare items:', err);
      },
    });
  }

  addToWishlist(product: any) {
    if (this.wishlistItems.some((item) => item.id === product.id)) {
      this.toastr.warning('This product is already in the list!', 'Warning');
      return;
    }

    // if (this.wishlistItems.length >= 4) {
    //   alert(
    //     'Compare section is full! You can only Wish-list up to 4 products.'
    //   );
    //   return;
    // }

    this.globalService.addToWishlist(product).subscribe({
      next: () => {
        this.toastr.success(`${product?.pname} added to wishlist`, 'Success');
        this.getWishlistItems(); // Refresh Wish-list list
      },
      error: (err) => {
        console.error('Error adding to Wish-list:', err);
      },
    });
  }

  // Get all products in the compare list
  getWishlistItems() {
    this.globalService.getWishlistItems().subscribe({
      next: (res) => {
        this.wishlistItems = res;
      },
      error: (err) => {
        console.error('Error fetching compare items:', err);
      },
    });
  }

  loadProducts(): void {
    this.productService.fetchGroupedByBrand().subscribe((grouped) => {
      this.groupedProducts = grouped;

      if (this.brandName) {
        this.filteredProducts = this.groupedProducts[this.brandName] || [];
      }
    });
  }

  getBrands(): string[] {
    return this.productUtils.getBrands(this.groupedProducts);
  }
  goToCart() {
    this.router.navigate(['/cart']);
  }

  navigateToBrand(brand: string): void {
    this.productUtils.navigateToBrand(brand);
  }
}
