import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GetProductService } from '../../core/services/product/get-product.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';
import { NgxPaginationModule } from 'ngx-pagination';
import { SearchProductPipe } from '../../shared/pipes/search-product.pipe';

@Component({
  selector: 'app-view-products',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    SearchProductPipe,
  ],
  templateUrl: './view-products.component.html',
  styleUrl: './view-products.component.css',
})
export class ViewProductsComponent {
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
    private http: HttpClient
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
      image: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.getProducts.fetchData().subscribe((res) => {
      this.products = res;
      console.log('All Products', res);
    });
  }

  deleteProduct(id: string): void {
    this.getProducts.deleteData(id).subscribe((res) => {
      console.log('Product Deleted Successfully');
      this.fetchProducts();
    });
  }

  editProduct(product: any): void {
    this.isEditing = true;
    this.editingProductId = product.id;

    // Prefill the form with product details
    this.myForm.patchValue({
      pname: product.pname,
      brand: product.brand,
      description: product.description,
      color: product.color,
      disksize: product.disksize,
      ram: product.ram,
      psp: product.psp,
      pop: product.pop,
      image: product.image,
    });
    this.imageUrl = product.image; // Set the current image URL
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

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      // Upload to the backend
      this.http.post('http://localhost:3001/upload', formData).subscribe({
        next: (response: any) => {
          console.log('File uploaded successfully:', response);

          // Get the image URL from the backend response and update the form
          this.imageUrl = response.filePath; // This will be the full path to the uploaded image
          this.myForm.patchValue({ image: this.imageUrl }); // Update the form with image URL
        },
        error: (err) => console.error('Error uploading file:', err),
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
}
