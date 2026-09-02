import { Injectable, computed, signal } from '@angular/core';
import { ProfileService } from './profile.service';

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

  private readonly _userId = signal<string | null>(this.readStoredId());
  private readonly _userName = signal<string | null>(this.readStoredName());

  readonly userId = this._userId.asReadonly();
  readonly userName = this._userName.asReadonly();
  readonly isLoggedIn = computed(() => this._userId() !== null);

  constructor(private profileSvc:ProfileService) {}

  setUser(id: string): void {
    const clean = id.trim();
    this._userId.set(clean);
    localStorage.setItem(LoginService.STORAGE_KEY, clean);
    this.profileSvc.getSpecificProfile(id).subscribe(p => {
      this._userName.set(p.name);
      localStorage.setItem(LoginService.NAME_KEY, p.name);
    })
  }

  clearUser(): void {
    this._userId.set(null);
    localStorage.removeItem(LoginService.STORAGE_KEY);
    this._userName.set(null);
    localStorage.removeItem(LoginService.NAME_KEY)
  }

  private readStoredId(): string | null {
    return localStorage.getItem(LoginService.STORAGE_KEY);
  }

  private readStoredName(): string | null {
    return localStorage.getItem(LoginService.NAME_KEY);
  }
}
