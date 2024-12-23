import { Component, OnInit } from '@angular/core';
import { GetProductService } from '../../core/services/product/get-product.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProductUtilsService } from '../../core/services/utils/product-utils.service';

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
    private productUtils: ProductUtilsService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    // console.log('All brands',this.productUtils.getBrands(this.groupedProducts));
    // console.log('group products',this.productUtils.getBrands(this.groupedProducts));
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
