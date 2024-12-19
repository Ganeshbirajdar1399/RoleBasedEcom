import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../layout/sidebar/sidebar.component';

@Component({
  selector: 'app-electronics',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SidebarComponent,
  ],
  templateUrl: './electronics.component.html',
  styleUrl: './electronics.component.css',
})
export class ElectronicsComponent {
  products = [
    {
      id: 1,
      name: 'Smartphone',
      description: 'A high-end smartphone with a sleek design.',
      price: 499.99,
      imageUrl: 'https://via.placeholder.com/200',
      rating: 4,
    },
    {
      id: 2,
      name: 'Laptop',
      description: 'A powerful laptop for professionals.',
      price: 899.99,
      imageUrl: 'https://via.placeholder.com/200',
      rating: 5,
    },
    {
      id: 3,
      name: 'Smartwatch',
      description: 'A stylish smartwatch with health tracking.',
      price: 199.99,
      imageUrl: 'https://via.placeholder.com/200',
      rating: 3,
    },
  ];

  filteredProducts = [...this.products];

  onFilterChange(filter: any) {
    this.filteredProducts = this.products
      .filter((product) => product.price <= filter.priceRange)
      .filter(
        (product) =>
          filter.selectedBrand === 'all' ||
          product.name.includes(filter.selectedBrand)
      );

    if (filter.sortBy === 'priceLowToHigh') {
      this.filteredProducts.sort((a, b) => a.price - b.price);
    } else if (filter.sortBy === 'priceHighToLow') {
      this.filteredProducts.sort((a, b) => b.price - a.price);
    } else if (filter.sortBy === 'rating') {
      this.filteredProducts.sort((a, b) => b.rating - a.rating);
    }
  }
}
