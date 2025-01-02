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
import { CompareService } from '../../core/services/compare.service';
import { LimitWordsPipe } from '../../shared/pipes/limit-words.pipe';
import { CartService } from '../../core/services/cart/cart-service.service';

@Component({
  selector: 'app-brand',
  imports: [CommonModule, RouterModule, FormsModule, LimitWordsPipe],
  templateUrl: './brand.component.html',
  styleUrl: './brand.component.css',
})
export class BrandComponent implements OnInit {
  brandName: string = '';
  products: any[] = []; // All products fetched from the service
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
    private compareService: CompareService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.scroller.scrollToPosition([0, 0]);
    this.route.params.subscribe((params) => {
      this.brandName = params['brandName'];
      this.loadProducts();
    });
  }

 // Add product to compare list
 addToCompare(product: any) {
  if (this.compareItems.some(item => item.id === product.id)) {
    alert('This product is already in the compare list!');
    return;
  }

  if (this.compareItems.length >= 4) {
    alert('Compare section is full! You can only compare up to 4 products.');
    return;
  }

  this.compareService.addToCompare(product).subscribe({
    next: () => {
      alert('Product added to compare!');
      this.getCompareItems(); // Refresh compare list
    },
    error: (err) => {
      console.error('Error adding to compare:', err);
    },
  });
}

addToWishlist(product:any){
  if (this.wishlistItems.some(item => item.id === product.id)) {
    alert('This product is already in the Wish-list!');
    return;
  }

  if (this.wishlistItems.length >= 4) {
    alert('Compare section is full! You can only Wish-list up to 4 products.');
    return;
  }

  this.compareService.addToWishlist(product).subscribe({
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
  getCompareItems() {
    this.compareService.getCompareItems().subscribe({
      next: (res) => {
        this.compareItems = res;
      },
      error: (err) => {
        console.error('Error fetching compare items:', err);
      },
    });
  }

   // Get all products in the compare list
   getWishlistItems() {
    this.compareService.getWishlistItems().subscribe({
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

  addToCart(product: any) {
    this.cartService.addToCart(product).subscribe({
      next: (response) => {
        console.log('Product added successfully:', response);
      },
      error: (error) => {
        console.error('Error adding product to cart:', error);
      },
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
