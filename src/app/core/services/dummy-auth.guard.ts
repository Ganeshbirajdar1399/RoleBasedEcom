import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DummyService } from './dummy.service';

export const dummyAuthGuard: CanActivateFn = (route, state) => {
  const authDummyService = inject(DummyService);
  const router = inject(Router);

  const isLoggedIn = authDummyService.isLoggedIn();
  const userRole = authDummyService.getRole();
  const currentUrl = state.url;

  // Redirect logged-in users away from login and register pages
  if (isLoggedIn && (currentUrl === '/login' || currentUrl === '/register')) {
    router.navigate([`/${userRole}`]); // Redirect to role-based route
    return false;
  }

  // Allow non-logged-in users to access login and register pages
  if (!isLoggedIn && (currentUrl === '/login' || currentUrl === '/register')) {
    return true;
  }

  // Restrict non-logged-in users from accessing other routes
  if (!isLoggedIn) {
    router.navigate(['/login']);
    return false;
  }

  return true; // Allow logged-in users to access non-restricted routes
};
