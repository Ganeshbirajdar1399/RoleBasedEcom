import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { GetProductService } from '../../core/services/product/get-product.service';
import { CartService } from '../../core/services/cart/cart-service.service';
import { GlobalService } from '../../core/services/global.service';
import { MagnifierComponent } from '../magnifier/magnifier.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {
  product: any; // Assuming this is fetched from your product service
  showPopup: boolean = false; // Control the popup visibility
  cartItems: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: GetProductService,
    // private cartService: CartService,
    private scroller: ViewportScroller,
    private globalService: GlobalService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.scroller.scrollToPosition([0, 0]);
    const productId = this.route.snapshot.paramMap.get('id'); // Get product ID from route
    this.loadProduct(productId!);
    // console.log('Product ID from route:', productId);
  }

  calculateDiscount(psp: number, pop: number): number {
    const discount = ((pop - psp) / pop) * 100;
    return Math.round(discount); // Round to the nearest whole number
  }

  loadProduct(productId: string): void {
    this.productService.fetchData().subscribe((products: any[]) => {
      // console.log('Fetched Products:', products);

      // Ensure correct type comparison
      this.product = products.find((p) => p.id === productId); //Number

      if (!this.product) {
        console.error(`Product with ID ${productId} not found.`);
      } else {
        // console.log('Selected Product:', this.product);
      }
    });
  }

  addToCart(product: any) {
    if (this.cartItems.some((item) => item.id === product.id)) {
      this.toastr.warning(
        'This product is already in the cart list!',
        'Warning'
      );
      return;
    }

    this.globalService.addToCart(product).subscribe({
      next: () => {
        // Show toast notification
        this.toastr.success(`${product?.pname} added to cart`, 'Success');
        this.getCartItems(); // Refresh compare list
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
      },
    });
  }
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
}
