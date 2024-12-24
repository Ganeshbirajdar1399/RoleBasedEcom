import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DummyService } from './dummy.service';

export const dummyAuthGuard: CanActivateFn = (route, state) => {
  const authDummyService = inject(DummyService);
  const router = inject(Router);

  if (authDummyService.isLoggedIn()) {
    const role = authDummyService.getRole();
    if (state.url === '/login') {
      // If already logged in and trying to access the login page, redirect to role page
      router.navigate([`/${role}`]);
      return false; // Prevent access to login page
    }
    return true; // Allow access to other routes
  } else {
    // If not logged in, allow access only to the login page
    if (state.url === '/login') {
      return true;
    }
    router.navigate(['/login']); // Redirect to login page
    return false;
  }
};
