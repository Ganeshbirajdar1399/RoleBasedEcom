import { Routes } from '@angular/router';
import { MainComponent } from './home/main/main.component';
import { BrandComponent } from './products/brand/brand.component';
import { ProductDetailsComponent } from './products/product-details/product-details.component';
import { CartComponent } from './cart/cart/cart.component';
import { AddProductsComponent } from './admin/add-products/add-products.component';
import { authGuard } from './guard/auth.guard';
import { ViewProductsComponent } from './admin/view-products/view-products.component';
import { NotFoundComponentComponent } from './core/components/not-found-component/not-found-component.component';
import { LoginComponent } from './auth/login/login/login.component';
import { RegisterComponent } from './auth/signup/register/register.component';



export const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'product/:id', component: ProductDetailsComponent }, // Dynamic route for product details
  { path: 'cart', component: CartComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'add-products', component: AddProductsComponent },
  { path: 'view-products', component: ViewProductsComponent },
  { path: 'brand/:brandName', component: BrandComponent }, 
  { path: '**', component: NotFoundComponentComponent },
];
