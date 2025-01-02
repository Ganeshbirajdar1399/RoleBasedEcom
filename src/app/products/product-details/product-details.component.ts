import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { GetProductService } from '../../core/services/product/get-product.service';
import { CartService } from '../../core/services/cart/cart-service.service';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule],
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
    private scroller: ViewportScroller
  ) {}

  ngOnInit(): void {
    this.scroller.scrollToPosition([0, 0]);
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
    this.cartService.addToCart(product).subscribe({
      next: (response) => {
        console.log('Product added successfully:', response);
      },
      error: (error) => {
        console.error('Error adding product to cart:', error);
      },
    });
  }
}
