import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { GetProductService } from '../../core/services/product/get-product.service';
import { CartService } from '../../core/services/cart/cart-service.service';
import { AnimatedPopupComponent } from '../animated-popup/animated-popup.component';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule, AnimatedPopupComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {
  product: any; // Assuming this is fetched from your product service
  showPopup: boolean = false; // Control the popup visibility

  constructor(
    private route: ActivatedRoute,
    private productService: GetProductService,
    private cartService: CartService,
    private viewportScroller: ViewportScroller
  ) {}

  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
    const productId = this.route.snapshot.paramMap.get('id'); // Get product ID from route
    this.loadProduct(productId!);
    console.log('Product ID from route:', productId);
  }

  loadProduct(productId: string): void {
    this.productService.fetchData().subscribe((products: any[]) => {
      console.log('Fetched Products:', products);

      // Ensure correct type comparison
      this.product = products.find((p) => p.id === productId); //Number

      if (!this.product) {
        console.error(`Product with ID ${productId} not found.`);
      } else {
        console.log('Selected Product:', this.product);
      }
    });
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
    // alert(`${product.name} has been added to your cart.`);
    this.showPopup = true; // Show the popup after adding to cart
    setTimeout(() => {
      this.showPopup = !this.showPopup;
    }, 2000);
  }
}
