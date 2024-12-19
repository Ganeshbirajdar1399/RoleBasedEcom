import { Component, OnInit } from '@angular/core';
import { GetProductService } from '../../../services/get-product.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent implements OnInit {
  groupedProducts: { [brand: string]: any[] } = {};


  constructor(
    private productService: GetProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.productService.fetchData().subscribe((products: any[]) => {
      this.groupedProducts = this.groupByBrand(products);
      console.log('Grouped Products:', this.groupedProducts);
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
    this.router.navigate(['/brand', brand]); // Navigate to the route with the brand name
  }
}
