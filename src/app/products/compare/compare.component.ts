import { Component, OnInit } from '@angular/core';
import { CompareService } from '../../core/services/compare.service';
import { CommonModule, ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-compare',
  imports: [CommonModule],
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css'],
})
export class CompareComponent implements OnInit {
  compareItems: any[] = [];

  constructor(
    private compareService: CompareService,
    private scroller: ViewportScroller
  ) {}

  ngOnInit(): void {
    this.scroller.scrollToPosition([0, 0]);
    this.getCompareItems(); // Fetch compare items when the component loads
  }

  // Get all products in the compare list
  getCompareItems(): void {
    this.compareService.getCompareItems().subscribe({
      next: (res) => {
        this.compareItems = res;
        console.log('Compare items:', res);
      },
      error: (err) => {
        console.error('Error fetching compare items:', err);
      },
    });
  }

  // Remove product from the compare list
  removeFromCompare(id: string): void {
    if (
      confirm(
        'Are you sure you want to delete this product from the compare list?'
      )
    ) {
      this.compareService.removeFromCompare(id).subscribe({
        next: () => {
          this.getCompareItems(); // Refresh compare list
          alert('Product removed from compare!');
        },
        error: (err) => {
          console.error('Error removing from compare:', err);
        },
      });
    } else {
      console.log('Product removal canceled');
    }
  }

  // Clear all comparison items (optional feature)
  clearComparison(): void {
    this.compareService.clearCompare();
    this.compareItems = []; // Optionally clear the local comparison list as well
  }
}
