import { Routes } from '@angular/router';
import { MainComponent } from './home/main/main.component';
import { BrandComponent } from './products/brand/brand.component';
import { ProductDetailsComponent } from './products/product-details/product-details.component';
import { CartComponent } from './cart/cart/cart.component';
import { NotFoundComponentComponent } from './core/components/not-found-component/not-found-component.component';
import { LoginComponent } from './auth/login/login/login.component';
import { RegisterComponent } from './auth/signup/register/register.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { roleGuard } from './core/services/role.guard';
import { UserProfileComponent } from './profile/user-profile/user-profile.component';
import { UpdateprofileComponent } from './profile/updateprofile/updateprofile.component';
import { CompareComponent } from './products/compare/compare.component';
import { WishlistComponent } from './products/wishlist/wishlist.component';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'product/:id', component: ProductDetailsComponent }, // Dynamic route for product details
  { path: 'cart', component: CartComponent },
  { path: 'login', component: LoginComponent, canActivate: [authGuard] }, // Fixed duplicate path
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [authGuard],
  },
  {
    path: 'updateuserprofile',
    component: UpdateprofileComponent,
    canActivate: [authGuard],
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
  { path: 'compare', component: CompareComponent },
  { path: 'wishlist', component: WishlistComponent },
  {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [roleGuard],
    data: { role: ['user', 'admin'] },
  },

  { path: '**', component: NotFoundComponentComponent },
];
