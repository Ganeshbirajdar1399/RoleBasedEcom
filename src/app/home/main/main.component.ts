import { Component, OnInit } from '@angular/core';
import { GetProductService } from '../../core/services/product/get-product.service';
import { CommonModule, ViewportScroller } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProductUtilsService } from '../../core/services/utils/product-utils.service';
import { CartService } from '../../core/services/cart/cart-service.service';
import { CompareService } from '../../core/services/compare/compare.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { GlobalService } from '../../core/services/global.service';
import { Webdata } from '../../core/services/product/webdata';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-main',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent implements OnInit {
  groupedProducts: { [brand: string]: any[] } = {};

  cartItems: any[] = [];
  compareItems: any[] = [];
  wishlistItems: any[] = [];

  webdatas: Webdata[] = [];

  constructor(
    private productService: GetProductService,
    private productUtils: ProductUtilsService,
    private scroller: ViewportScroller,
    // private cartService: CartService,
    // private compareService: CompareService,
    // private wishlistService: WishlistService,
    private globalService: GlobalService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.scroller.scrollToPosition([0, 0]);
    this.loadProducts();
    // console.log('All brands',this.productUtils.getBrands(this.groupedProducts));
    // console.log('group products',this.productUtils.getBrands(this.groupedProducts));
    this.fetchwebdata();
  }
  calculateDiscount(psp: number, pop: number): number {
    const discount = ((pop - psp) / pop) * 100;
    return Math.round(discount); // Round to the nearest whole number
  }
  getRandomProducts(products: any[], count: number = 6): any[] {
    if (!products || products.length <= count) {
      return products; // If there are fewer products, return them all
    }
    const shuffled = [...products].sort(() => 0.5 - Math.random()); // Shuffle the array
    return shuffled.slice(0, count); // Select the first `count` items
  }

  fetchwebdata(): void {
    this.productService.fetchWebData().subscribe((res) => {
      this.webdatas = res;
      // console.log('All data', res);
    });
  }

  getResponsiveSrcset(imageUrl: string): string {
    const baseUrl = imageUrl.substring(0, imageUrl.lastIndexOf('.'));
    const extension = imageUrl.substring(imageUrl.lastIndexOf('.'));
    return `${baseUrl}-small${extension} 480w, ${baseUrl}-medium${extension} 768w, ${baseUrl}-large${extension} 1200w`;
  }

  addToCart(product: any) {
    if (this.cartItems.some((item) => item.id === product.id)) {
      this.toastr.warning('This product is already in the list!', 'Warning');
      return;
    }

    this.globalService.addToCart(product).subscribe({
      next: () => {
        this.toastr.success(`${product?.pname} added to compare`, 'Success');
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
    //   this.toastr.warning('Compare section is full! You can only compare up to 4 products.', 'Warning');
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
    });
  }

  getBrands(): string[] {
    return this.productUtils.getBrands(this.groupedProducts);
  }
  navigateToBrand(brand: string): void {
    this.productUtils.navigateToBrand(brand);
  }
}
