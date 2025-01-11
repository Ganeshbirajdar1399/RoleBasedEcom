import { Component } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GetProductService } from '../../core/services/product/get-product.service';
import { HttpClient } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { SearchProductPipe } from '../../shared/pipes/search-product.pipe';
import { AuthService } from '../../core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    SearchProductPipe,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent {
  isAdded = false;
  isUpdated = false;

  products: any[] = [];
  myForm: FormGroup;
  imageUrl: string = ''; // Declare the imageUrl property
  isSubmit = false;

  searchText = '';
  page = 1;
  itemsPerPage = 5;

  isEditing = false; // Flag for editing state
  editingProductId: string | null = null; // Store the ID of the product being edited

  constructor(
    private getProducts: GetProductService,
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.myForm = this.fb.group({
      pname: ['', [Validators.required]],
      brand: ['', [Validators.required]],
      description: ['', [Validators.required]],
      color: ['', [Validators.required]],
      disksize: ['', [Validators.required]],
      ram: ['', [Validators.required]],
      psp: ['', [Validators.required]],
      pop: ['', [Validators.required]],
      image: ['', Validators.required], // Make sure image is required
    });
  }

  ngOnInit(): void {
    this.fetchProducts();
  }

  updateCancel() {
    this.myForm.reset();
  }

  fetchProducts(): void {
    this.getProducts.fetchData().subscribe((res) => {
      this.products = res;
      console.log('All Products', res);
    });
  }

  deleteProduct(id: string): void {
    this.toastr
      .info(
        'Are you sure you want to delete this product?',
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
          this.getProducts.deleteData(id).subscribe({
            next: () => {
              this.toastr.success('Product removed successfully!', 'Success');
              this.fetchProducts(); // Refresh the cart
            },
            error: (err) => {
              console.error('Error removing product:', err);
              this.toastr.error('Failed to remove product', 'Error');
            },
          });
        },
        error: () => {
          // Handle cancellation or interaction
          this.toastr.info('Product deletion canceled', 'Info');
        },
      });
  }

  // editProduct(product: any): void {
  //   this.isEditing = true;
  //   this.editingProductId = product.id;

  //   // Prefill the form with product details
  //   this.myForm.patchValue({
  //     pname: product.pname,
  //     brand: product.brand,
  //     description: product.description,
  //     color: product.color,
  //     disksize: product.disksize,
  //     ram: product.ram,
  //     psp: product.psp,
  //     pop: product.pop,
  //     image: product.image,
  //   });
  //   this.imageUrl = product.image; // Set the current image URL

  //   // Remove image validation in editing mode
  //   if (this.isEditing) {
  //     this.myForm.get('image')?.clearValidators();
  //   } else {
  //     this.myForm.get('image')?.setValidators(Validators.required);
  //   }
  //   this.myForm.get('image')?.updateValueAndValidity(); // Re-validate after change
  // }

  editProduct(product: any): void {
    this.isEditing = true;
    this.editingProductId = product.id;

    this.myForm.patchValue({
      pname: product.pname,
      brand: product.brand,
      description: product.description,
      color: product.color,
      disksize: product.disksize,
      ram: product.ram,
      psp: product.psp,
      pop: product.pop,
    });
    this.imageUrl = product.image || ''; // Ensure that imageUrl is set

    // If editing, don't require image upload
    if (this.isEditing) {
      this.myForm.get('image')?.clearValidators();
    } else {
      this.myForm.get('image')?.setValidators(Validators.required);
    }
    this.myForm.get('image')?.updateValueAndValidity(); // Re-validate after change
  }

  updateProduct(): void {
    if (this.myForm.valid && this.editingProductId) {
      const updatedProduct = {
        id: this.editingProductId, // Use the existing product ID
        ...this.myForm.value,
        image: this.imageUrl, // Ensure the image URL is included
      };

      this.getProducts
        .updateData(this.editingProductId, updatedProduct)
        .subscribe({
          next: (response) => {
            this.toastr.success('Product updated successfully!', 'Success');
            console.log('Product updated successfully:', response);
            this.isUpdated = true;
            setTimeout(() => {
              this.isUpdated = false;
            }, 2000);
            this.isEditing = false;
            this.editingProductId = null;
            this.fetchProducts(); // Refresh the product list
            this.myForm.reset();
          },
          error: (error) => console.error('Error updating product:', error),
        });
    } else {
      console.error('Form is invalid or editing ID is missing');
    }
  }

  // onFileChange(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const formData = new FormData();
  //     formData.append('image', file);

  //     // Upload to the backend
  //     this.http.post('http://localhost:5000/upload', formData).subscribe({
  //       next: (response: any) => {
  //         console.log('File uploaded successfully:', response);

  //         // Get the image URL from the backend response and update the form
  //         this.imageUrl = response.filePath; // This will be the full path to the uploaded image
  //         this.myForm.patchValue({ image: this.imageUrl }); // Update the form with image URL

  //         // Mark the image control as valid after uploading the file
  //         this.myForm.get('image')?.setErrors(null); // Remove errors if any
  //         this.myForm.get('image')?.updateValueAndValidity(); // Re-validate the image input
  //       },
  //       error: (err) => console.error('Error uploading file:', err),
  //     });
  //   }
  // }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      this.http.post('http://localhost:5000/upload', formData).subscribe({
        next: (response: any) => {
          console.log('File uploaded successfully:', response);
          this.imageUrl = response.imageUrl; // Ensure the correct path or URL is used
          this.myForm.patchValue({ image: this.imageUrl });
          this.myForm.get('image')?.setErrors(null); // Remove errors if any
          this.myForm.get('image')?.updateValueAndValidity();
        },
        error: (err) => {
          console.error('Error uploading file:', err);
        },
      });
    }
  }

  onSubmit(): void {
    if (this.isEditing) {
      this.updateProduct(); // Call update method if editing
    } else {
      if (this.myForm.valid && this.imageUrl) {
        const product = {
          id: uuidv4(), // Generate a unique UUID
          ...this.myForm.value,
          image: this.imageUrl, // Include the image URL
        };

        this.getProducts.addData(product).subscribe({
          next: (response) => {
            this.toastr.success('Product added successfully!', 'Success');
            console.log('Product added successfully:', response);
            this.isAdded = true;
            setTimeout(() => {
              this.isAdded = false;
            }, 2000);
            this.fetchProducts(); // Refresh the product list
            this.myForm.reset();
          },
          error: (error) => console.error('Error adding product:', error),
        });
      } else {
        console.error('Form is invalid or image is missing');
      }
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
