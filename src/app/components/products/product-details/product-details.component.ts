import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetProductService } from '../../../services/get-product.service';
import { CartService } from '../../../services/cart-service.service';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {
  // product: any;

  productId: string = '';
  product: any = null;

  constructor(
    private route: ActivatedRoute,
    private productService: GetProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Get product ID from route
    this.route.params.subscribe((params) => {
      this.productId = params['id'];
      this.fetchProductDetails();
    });
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
    // alert(`${product.name} has been added to your cart.`);
  }
  fetchProductDetails(): void {
    this.productService.fetchData().subscribe((products: any[]) => {
      this.product = products.find((p) => p.id === this.productId);
      console.log(this.product); // Log the fetched product to verify data
    });
  }
}
