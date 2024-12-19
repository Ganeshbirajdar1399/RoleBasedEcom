import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GetProductService } from '../../../services/get-product.service';
import { FormsModule } from '@angular/forms';

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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.brandName = params['brandName'];
      this.fetchData();
    });
  }

  fetchData(): void {
    // Fetch all products from the service
    this.productService.fetchData().subscribe((products: any[]) => {
      // Group products by brand
      this.groupedProducts = this.groupByBrand(products);

      // Filter products for the selected brand
      if (this.brandName) {
        this.filteredProducts = this.groupedProducts[this.brandName] || [];
      }
    });
  }

  groupByBrand(products: any[]): { [brand: string]: any[] } {
    return products.reduce((groups, product) => {
      const brand = product.brand;
      if (!groups[brand]) {
        groups[brand] = [];
      }
      groups[brand].push(product);
      return groups;
    }, {});
  }

  getBrands(): string[] {
    return Object.keys(this.groupedProducts);
  }

  navigateToBrand(brand: string): void {
    this.router.navigate(['/brand', brand]); // Navigate to a different brand route
  }



}
