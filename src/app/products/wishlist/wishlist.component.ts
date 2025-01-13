import { CommonModule, ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';
import { CompareService } from '../../core/services/compare/compare.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { GlobalService } from '../../core/services/global.service';
import { ToastrService } from 'ngx-toastr';

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
    private globalService: GlobalService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.scroller.scrollToPosition([0, 0]);
    this.getWishlistItems(); // Fetch compare items when the component loads
  }

  // Get all products in the Wishlist list
  getWishlistItems(): void {
    this.globalService.getWishlistItems().subscribe({
      next: (res) => {
        this.wishlistItems = res;
        // console.log('Wishlist items:', res);
      },
      error: (err) => {
        console.error('Error fetching wishlist items:', err);
      },
    });
  }

  //remove single prodict in wishlist
  removeFromWishlist(id: string): void {
    this.toastr
      .info(
        'Are you sure you want to delete this product into wishlist?',
        'Confirm Deletion',
        {
          closeButton: true,
          progressBar: true,
          tapToDismiss: true,
          positionClass: 'toast-top-center',
          timeOut: 0, // Make the toast persistent until the user interacts with it
          extendedTimeOut: 0, // Keep the toast open until action
        }
      )
      .onTap.pipe
      // Handle confirmation
      ()
      .subscribe({
        next: () => {
          // Proceed with deletion
          this.globalService.removeFromWishlist(id).subscribe({
            next: () => {
              this.toastr.success('Product removed from wishlist!', 'Success');
              this.getWishlistItems(); // Refresh the cart
            },
            error: (err) => {
              console.error('Error removing product:', err);
              this.toastr.error(
                'Failed to remove product from wishlist',
                'Error'
              );
            },
          });
        },
        error: () => {
          // Handle cancellation or interaction
          this.toastr.info('Product deletion canceled', 'Info');
        },
      });
  }

  //clear wishlist
  clearwishlist() {
    this.toastr
      .info(
        'Are you sure you want to clear the entire wishlist section?',
        'Confirm Clear wishlist',
        {
          closeButton: true,
          progressBar: true,
          tapToDismiss: true,
          positionClass: 'toast-top-center',
          timeOut: 0,
          extendedTimeOut: 0,
        }
      )
      .onTap.pipe
      // Handle confirmation
      ()
      .subscribe({
        next: () => {
          // Proceed with clearing the cart
          this.globalService.clearWishlist().subscribe({
            next: () => {
              this.toastr.success('Wishlist has been cleared!', 'Success');
              this.getWishlistItems(); // Refresh the cart
            },
            error: (err) => {
              console.error('Error clearing wishlist:', err);
              this.toastr.error('Failed to clear the wishlist', 'Error');
            },
          });
        },
        error: () => {
          // Handle cancellation or interaction
          this.toastr.info('Compare clearing canceled', 'Info');
        },
      });
  }
}
