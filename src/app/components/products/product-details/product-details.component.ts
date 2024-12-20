import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetProductService } from '../../../services/get-product.service';
import { CartService } from '../../../services/cart-service.service';
import { AnimatedPopupComponent } from "../animated-popup/animated-popup.component";

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
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id'); // Get product ID from route
    this.loadProduct(productId!);
  }

  loadProduct(productId: string): void {
    this.productService.fetchData().subscribe((products: any[]) => {
      this.product = products.find((p) => p.id === productId); // Find product by ID
    });
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
    // alert(`${product.name} has been added to your cart.`);
    this.showPopup = true;  // Show the popup after adding to cart
    setTimeout(() => {
      this.showPopup = !this.showPopup;
    }, 2000);
  }
}
