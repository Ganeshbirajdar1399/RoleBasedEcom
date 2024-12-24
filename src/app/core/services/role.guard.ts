import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DummyService } from './dummy.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const dummyService = inject(DummyService);
  const router = inject(Router);

  const expectedRoles: string[] = route.data?.['role']; // Array of roles
  const userRole = dummyService.getRole();

  // Check if the user's role is included in the expected roles
  if (!dummyService.isLoggedIn() || !expectedRoles.includes(userRole)) {
    console.warn(
      `Access denied: User role '${userRole}' does not match expected roles '${expectedRoles.join(
        ', '
      )}'`
    );
    router.navigate(['/login']);
    return false;
  }

  return true;
};
