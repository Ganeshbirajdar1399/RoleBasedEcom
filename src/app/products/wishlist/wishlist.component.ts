import { CommonModule, ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';
import { CompareService } from '../../core/services/compare/compare.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { GlobalService } from '../../core/services/global.service';

@Component({
  selector: 'app-wishlist',
  imports: [CommonModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css',
})
export class WishlistComponent {
  wishlistItems: any[] = [];

  constructor(
    // private compareService: CompareService,
    private scroller: ViewportScroller,
    // private wishlistService: WishlistService,
    private globalService: GlobalService
  ) {}

  ngOnInit(): void {
    this.scroller.scrollToPosition([0, 0]);
    this.getWishlistItems(); // Fetch compare items when the component loads
  }

  // Get all products in the compare list
  getWishlistItems(): void {
    this.globalService.getWishlistItems().subscribe({
      next: (res) => {
        this.wishlistItems = res;
        console.log('Wishlist items:', res);
      },
      error: (err) => {
        console.error('Error fetching wishlist items:', err);
      },
    });
  }

  // Remove product from the compare list
  removeFromWishlist(id: string): void {
    if (
      confirm(
        'Are you sure you want to delete this product from the wish-list?'
      )
    ) {
      this.globalService.removeFromWishlist(id).subscribe({
        next: () => {
          this.getWishlistItems(); // Refresh compare list
          alert('Product removed from wishlist!');
        },
        error: (err) => {
          console.error('Error removing from wishlist:', err);
        },
      });
    } else {
      console.log('Product removal canceled');
    }
  }

  // Clear all comparison items (optional feature)
  clearComparison(): void {
    this.globalService.clearCompare();
    this.wishlistItems = []; // Optionally clear the local comparison list as well
  }
}
