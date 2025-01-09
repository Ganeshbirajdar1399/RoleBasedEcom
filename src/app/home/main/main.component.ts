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
    private globalService: GlobalService
  ) {}

  ngOnInit(): void {
    this.scroller.scrollToPosition([0, 0]);
    this.loadProducts();
    // console.log('All brands',this.productUtils.getBrands(this.groupedProducts));
    // console.log('group products',this.productUtils.getBrands(this.groupedProducts));
    this.fetchwebdata();
  }

  fetchwebdata(): void {
    this.productService.fetchWebData().subscribe((res) => {
      this.webdatas = res;
      console.log('All data', res);
    });
  }

  getResponsiveSrcset(imageUrl: string): string {
    const baseUrl = imageUrl.substring(0, imageUrl.lastIndexOf('.'));
    const extension = imageUrl.substring(imageUrl.lastIndexOf('.'));
    return `${baseUrl}-small${extension} 480w, ${baseUrl}-medium${extension} 768w, ${baseUrl}-large${extension} 1200w`;
  }

  addToCart(product: any) {
    if (this.cartItems.some((item) => item.id === product.id)) {
      alert('This product is already in the cart list!');
      return;
    }

    this.globalService.addToCart(product).subscribe({
      next: () => {
        alert('Product added to Cart!');
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
      alert('This product is already in the compare list!');
      return;
    }

    if (this.compareItems.length >= 4) {
      alert('Compare section is full! You can only compare up to 4 products.');
      return;
    }

    this.globalService.addToCompare(product).subscribe({
      next: () => {
        alert('Product added to compare!');
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
      alert('This product is already in the Wish-list!');
      return;
    }

    if (this.wishlistItems.length >= 4) {
      alert(
        'Compare section is full! You can only Wish-list up to 4 products.'
      );
      return;
    }

    this.globalService.addToWishlist(product).subscribe({
      next: () => {
        alert('Product added to Wish-list!');
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
