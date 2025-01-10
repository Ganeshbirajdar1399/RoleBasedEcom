import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';
import { CartService } from '../../core/services/cart/cart-service.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Required for Toastr
import { ToastrService } from 'ngx-toastr';
interface Product {
  id: string;
  pname: string;
  brand: string;
  description: string;
  color: string;
  image: string;
  disksize: string;
  ram: string;
  psp: number;
  pop: number;
  quantity?: number; // Add quantity field for the cart
}

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  cartItems: any[] = [];
  totalAmount: number = 0;
  customer: any = {
    name: '',
    contactNo: '',
    email: '',
    address: '',
    billingAddress: '',
  };

  constructor(
    private globalService: GlobalService,
    private cartService: CartService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
    this.totalAmount = this.cartService.getTotalAmount();
    // console.log('Cart Items in Checkout:', this.cartItems);
    // console.log('Total Amount in Checkout:', this.totalAmount);
  }

  placeOrder(): void {
    // Prepare order data with customer information and relevant product details
    const orderData = {
      customer: this.customer,
      items: this.cartItems.map((item: Product) => ({
        pname: item.pname,
        psp: item.psp,
        quantity: item.quantity,
        ram: item.ram,
        disksize: item.disksize,
      })),
      totalAmount: this.totalAmount,
      orderDate: new Date(),
    };

    // Send order data to GlobalService to place the order
    this.globalService.placeOrder(orderData).subscribe(
      (response) => {
        this.toastr.success('Your order was placed successfully!', 'Success');
        console.log('Order placed successfully:', response);
        this.clearForm();

        // Clear the cart after placing the order
        this.globalService.clearCart().subscribe(() => {
          this.cartItems = [];
        });
      },
      (error) => {
        console.error('Error placing order:', error);
      }
    );
  }
  clearForm() {
    this.customer = {
      name: '',
      contactNo: '',
      email: '',
      address: '',
      billingAddress: '',
    };
  }
}
