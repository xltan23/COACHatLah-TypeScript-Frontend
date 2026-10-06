import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { LoginService } from '../services/login.service';

// Staff-only pages (escalations, reviews). Use after authGuard; students are sent back to /class.
// Frontend-only check: the /api/escalations endpoints themselves are not protected yet.
export const reviewerGuard: CanActivateFn = () => {
  const loginSvc = inject(LoginService);
  const router = inject(Router);

  // Resolve current role, then check if it's a reviewer role. If not, redirect to /class
  return loginSvc.ensureRole().pipe(
    map(() => loginSvc.canReview() ? true : router.createUrlTree(['/class']))
  );
};
