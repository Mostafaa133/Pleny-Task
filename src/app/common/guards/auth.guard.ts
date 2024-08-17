import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const currentUser = JSON.parse(localStorage.getItem('currentUser')!);

  if (currentUser) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }

};
