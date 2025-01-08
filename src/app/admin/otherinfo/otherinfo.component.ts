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
import { AuthService } from '../../core/services/auth/auth.service';
import { v4 as uuidv4 } from 'uuid';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Webdata } from '../../core/services/product/webdata';
@Component({
  selector: 'app-otherinfo',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './otherinfo.component.html',
  styleUrl: './otherinfo.component.css',
})
export class OtherinfoComponent {
  isAdded = false;
  isUpdated = false;

  webdatas: Webdata[] = [];
  myForm: FormGroup;

  imageUrl: string[] = []; // Declare the imageUrl property

  isSubmit = false;

  isEditing = false; // Flag for editing state
  editingWebdataId: string | null = null; // Store the ID of the product being edited

  carouselImages: string[] = []; // Store selected file URLs

  constructor(
    private getProducts: GetProductService,
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.myForm = this.fb.group({
      about: ['', [Validators.required]],
      location: ['', [Validators.required]],
      contactNo: ['', [Validators.required]],
      email: ['', [Validators.required]],
      wbrand: ['', [Validators.required]],
      facebook: ['', [Validators.required]],
      twitter: ['', [Validators.required]],
      instagram: ['', [Validators.required]],
      youtube: ['', [Validators.required]],
      cc: ['', [Validators.required]],
      image: [null, [this.imagesValidator]], // Custom validator
    });
  }
  imagesValidator(control: any): { [key: string]: boolean } | null {
    if (
      control.value &&
      Array.isArray(control.value) &&
      control.value.length > 0
    ) {
      return null; // Valid
    }
    return { required: true }; // Invalid
  }

  ngOnInit(): void {
    this.fetchwebdata();
  }

  updateCancel() {
    this.myForm.reset(); // Clears all inputs
    this.carouselImages = []; // Reset carousel images
    this.isEditing = false;
  }

  fetchwebdata(): void {
    this.getProducts.fetchWebData().subscribe((res) => {
      this.webdatas = res;
      console.log('All data', res);
    });
  }

  editProduct(webdata: any): void {
    this.isEditing = true;
    this.editingWebdataId = webdata.id;

    // Prefill the form with webdata details
    this.myForm.patchValue({
      about: webdata.about,
      location: webdata.location,
      contactNo: webdata.contactNo,
      email: webdata.email,
      wbrand: webdata.wbrand,
      facebook: webdata.facebook,
      twitter: webdata.twitter,
      instagram: webdata.instagram,
      youtube: webdata.youtube,
      cc: webdata.cc,
      image: webdata.image,
    });
    this.imageUrl = webdata.image; // Set the current image URL
  }

  updateWebdata(): void {
    if (this.myForm.valid && this.editingWebdataId) {
      const updatedWebdata = {
        id: this.editingWebdataId, // Use the existing product ID
        ...this.myForm.value,
        image: this.imageUrl, // Ensure the image URL is included
      };

      this.getProducts
        .updateWebData(this.editingWebdataId, updatedWebdata)
        .subscribe({
          next: (response) => {
            console.log('data updated successfully:', response);
            this.isUpdated = true;
            setTimeout(() => {
              this.isUpdated = false;
            }, 2000);
            this.isEditing = false;
            this.editingWebdataId = null;
            this.fetchwebdata(); // Refresh the product list
            this.myForm.reset();
            this.carouselImages = []; // Clear carousel images on update
          },
          error: (error) => console.error('Error updating webdata:', error),
        });
    } else {
      console.error('Form is invalid or editing ID is missing');
    }
  }

  onFileChange(event: any): void {
    const files: FileList | null = event.target?.files;
    if (!files || files.length === 0) {
      console.error('No files selected');
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach((file: File) => {
      formData.append('images', file);
    });

    this.http.post('https://uploadimages-yjt5.onrender.com/multiple-upload', formData).subscribe(
      (response: any) => {
        console.log('Files uploaded successfully:', response);
        if (response.filePaths) {
          this.carouselImages.push(...response.filePaths);
          this.myForm.patchValue({ image: this.carouselImages }); // Update form
        } else {
          console.error('Unexpected response:', response);
        }
      },
      (error) => {
        console.error('Error uploading files:', error);
      }
    );
  }

  onSubmit(): void {
    console.log('Form Validity:', this.myForm.valid);
    console.log('Form Errors:', this.myForm.get('image')?.errors);

    if (this.isEditing) {
      this.updateWebdata();
    } else {
      if (this.myForm.valid) {
        const webInfo = {
          id: uuidv4(),
          ...this.myForm.value,
        };

        this.getProducts.addWebData(webInfo).subscribe({
          next: (response) => {
            console.log('Data added successfully:', response);
            this.isAdded = true;
            setTimeout(() => {
              this.isAdded = false;
            }, 2000);
            this.fetchwebdata();
            this.myForm.reset();
            // this.carouselImages = [];
          },
          error: (error) => console.error('Error adding Data:', error),
        });
      } else {
        console.error('Form is invalid or images are missing');
      }
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
