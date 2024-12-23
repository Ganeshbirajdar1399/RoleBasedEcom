import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  priceRange: number = 1000; // Default price filter
  sortBy: string = 'priceLowToHigh';
  selectedBrand: string = 'all';

  @Output() filterChange = new EventEmitter<any>();

  onSortChange() {
    this.emitFilterChanges();
  }

  onBrandChange() {
    this.emitFilterChanges();
  }

  private emitFilterChanges() {
    this.filterChange.emit({
      priceRange: this.priceRange,
      sortBy: this.sortBy,
      selectedBrand: this.selectedBrand,
    });
  }
}
