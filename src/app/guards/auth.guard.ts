import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';

// Blocks routes that need an identity; bounces to /login, remembering where the
// user was trying to go so login can send them back.
export const authGuard: CanActivateFn = (route, state) => {
  const loginSvc = inject(LoginService);
  const router = inject(Router);

  // If logged in, allow route navigation
  if (loginSvc.isLoggedIn()) {
    return true;
  }
  // If not logged in, redirects to /login?returnUrl=... (Successful login directs user back to initial visit)
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
