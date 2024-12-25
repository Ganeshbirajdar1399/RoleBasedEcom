import { Routes } from '@angular/router';
import { MainComponent } from './home/main/main.component';
import { BrandComponent } from './products/brand/brand.component';
import { ProductDetailsComponent } from './products/product-details/product-details.component';
import { CartComponent } from './cart/cart/cart.component';
import { authGuard } from './guard/auth.guard';
import { NotFoundComponentComponent } from './core/components/not-found-component/not-found-component.component';
import { LoginComponent } from './auth/login/login/login.component';
import { RegisterComponent } from './auth/signup/register/register.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { roleGuard } from './core/services/role.guard';
import { dummyAuthGuard } from './core/services/dummy-auth.guard';
import { UserProfileComponent } from './profile/user-profile/user-profile.component';

export const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'product/:id', component: ProductDetailsComponent }, // Dynamic route for product details
  { path: 'cart', component: CartComponent },
  { path: 'login', component: LoginComponent, canActivate: [dummyAuthGuard] }, // Fixed duplicate path
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [dummyAuthGuard],
  },
  {
    path: 'crudproducts',
    component: AdminDashboardComponent,
    canActivate: [roleGuard],
    data: { role: 'admin' },
  },
  { path: 'brand/:brandName', component: BrandComponent },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [roleGuard],
    data: { role: 'admin' },
  },
  {
    path: 'user',
    component: MainComponent,
    canActivate: [roleGuard],
    data: { role: 'user' },
  },
  {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [roleGuard],
    data: { role: ['user', 'admin'] },
  },

  { path: '**', component: NotFoundComponentComponent },
];
