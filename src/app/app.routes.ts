import { Routes } from '@angular/router';
import { ElectronicsComponent } from './components/electronics/electronics.component';
import { MainComponent } from './components/layout/main/main.component';
import { BrandComponent } from './components/products/brand/brand.component';
import { ProductDetailsComponent } from './components/products/product-details/product-details.component';
import { CartComponent } from './components/products/cart/cart.component';


export const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'categories/electronics', component: ElectronicsComponent },
  { path: 'product/:id', component: ProductDetailsComponent }, // Dynamic route for product details
  { path: 'cart', component: CartComponent },
  { path: 'brand/:brandName', component: BrandComponent }, 
  // { path: '', redirectTo: 'categories/electronics', pathMatch: 'full' },
  { path: '**', redirectTo: '' },
];
