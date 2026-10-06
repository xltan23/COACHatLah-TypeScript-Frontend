import { Injectable, computed, signal } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { ProfileService } from './profile.service';
import { ProfileDto, Role } from '../models';

// Single source of truth for "who am I".
//
// PROTOTYPE: the id is chosen on a /login screen and persisted in localStorage.
// LATER (JWT): replace the body of loadUser() with a GET /api/me call - the server
// reads the auth cookie and returns the profile. Nothing else in the app changes,
// because everything depends on userId() / isLoggedIn(), not on how it was obtained.
@Injectable({ providedIn: 'root' })
export class LoginService {

  private static readonly STORAGE_KEY = 'coachatlah.userId';
  private static readonly NAME_KEY = 'coachatlah.userName';
  private static readonly ROLE_KEY = 'coachatlah.userRole';

  // Roles allowed to see and review escalations
  private static readonly REVIEWER_ROLES: Role[] = [
    Role.TEACHER, Role.COUNSELLOR, Role.DISCIPLINARY_COMMITTEE, Role.ADMIN,
  ];

  private readonly _userId = signal<string | null>(this.readStoredId());
  private readonly _userName = signal<string | null>(this.readStoredName());
  private readonly _userRole = signal<Role | null>(this.readStoredRole());

  readonly userId = this._userId.asReadonly();
  readonly userName = this._userName.asReadonly();
  readonly userRole = this._userRole.asReadonly();
  readonly isLoggedIn = computed(() => this._userId() !== null);
  readonly canReview = computed(() => {
    const role = this._userRole();
    return role !== null && LoginService.REVIEWER_ROLES.includes(role);
  });

  constructor(private profileSvc:ProfileService) {
    // Sessions saved before roles were stored: fetch the role once
    const id = this._userId();
    if (id && !this._userRole()) {
      this.ensureRole().subscribe();
    }
  }

  setUser(id: string): void {
    const clean = id.trim();
    this._userId.set(clean);
    localStorage.setItem(LoginService.STORAGE_KEY, clean);
    this.profileSvc.getSpecificProfile(id).subscribe(p => this.storeProfile(p))
  }

  clearUser(): void {
    this._userId.set(null);
    localStorage.removeItem(LoginService.STORAGE_KEY);
    this._userName.set(null);
    localStorage.removeItem(LoginService.NAME_KEY)
    this._userRole.set(null);
    localStorage.removeItem(LoginService.ROLE_KEY)
  }

  // Resolves the current role, fetching the profile if it isn't known yet (used by reviewerGuard)
  ensureRole(): Observable<Role | null> {
    const id = this._userId();
    if (!id || this._userRole()) {
      return of(this._userRole());
    }
    return this.profileSvc.getSpecificProfile(id).pipe(
      tap(p => this.storeProfile(p)),
      map(p => p.role),
      catchError(() => of(null))
    );
  }

  private storeProfile(p: ProfileDto): void {
    this._userName.set(p.name);
    localStorage.setItem(LoginService.NAME_KEY, p.name);
    this._userRole.set(p.role);
    localStorage.setItem(LoginService.ROLE_KEY, p.role);
  }

  private readStoredId(): string | null {
    return localStorage.getItem(LoginService.STORAGE_KEY);
  }

  private readStoredName(): string | null {
    return localStorage.getItem(LoginService.NAME_KEY);
  }

  private readStoredRole(): Role | null {
    return localStorage.getItem(LoginService.ROLE_KEY) as Role | null;
  }
}
