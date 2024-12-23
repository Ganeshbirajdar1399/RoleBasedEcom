import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GetProductService } from '../../core/services/product/get-product.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-products',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './add-products.component.html',
  styleUrl: './add-products.component.css',
})
export class AddProductsComponent {
  myForm: FormGroup;
  imageUrl: string = ''; // Declare the imageUrl property
  isSubmit = false;

  constructor(
    private fb: FormBuilder,
    private getProducts: GetProductService,
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

  onSubmit() {
    if (this.myForm.valid && this.imageUrl) {
      const product = {
        id: uuidv4(), // Generates a unique UUID
        name: this.myForm.value.name,
        image: this.imageUrl, // Include the Base64-encoded image
        pname: this.myForm.value.pname,
        brand: this.myForm.value.brand,
        description: this.myForm.value.description,
        color: this.myForm.value.color,
        disksize: this.myForm.value.disksize,
        ram: this.myForm.value.ram,
        psp: this.myForm.value.psp,
        pop: this.myForm.value.pop,
      };

      this.getProducts.addData(product).subscribe({
        next: (response) =>
          console.log('Product added successfully:', response),
        
        
        error: (error) => console.error('Error adding product:', error),
      });
      this.isSubmit = true
      setTimeout(() => {
        this.isSubmit = false;
      }, 2000);
      this.myForm.reset();
    } else {
      console.error('Form is invalid or image is missing');
    }
  }
}
