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

@Component({
  selector: 'app-brand',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './brand.component.html',
  styleUrl: './brand.component.css',
})
export class BrandComponent implements OnInit {
  brandName: string = '';
  products: any[] = []; // All products fetched from the service
  groupedProducts: { [brand: string]: any[] } = {}; // Products grouped by brand
  filteredProducts: any[] = []; // Products filtered by the selected brand

  constructor(
    private productService: GetProductService,
    private route: ActivatedRoute,
    private productUtils: ProductUtilsService,
    private scroller: ViewportScroller
  ) {}

  ngOnInit(): void {
    this.scroller.scrollToPosition([0, 0]);
    this.route.params.subscribe((params) => {
      this.brandName = params['brandName'];
      this.loadProducts();
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

  navigateToBrand(brand: string): void {
    this.productUtils.navigateToBrand(brand);
  }
}
