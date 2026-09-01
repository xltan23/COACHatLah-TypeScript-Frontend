import { Injectable, computed, signal } from '@angular/core';

// Single source of truth for "who am I".
//
// PROTOTYPE: the id is chosen on a /login screen and persisted in localStorage.
// LATER (JWT): replace the body of loadUser() with a GET /api/me call - the server
// reads the auth cookie and returns the profile. Nothing else in the app changes,
// because everything depends on userId() / isLoggedIn(), not on how it was obtained.
@Injectable({ providedIn: 'root' })
export class LoginService {

  private static readonly STORAGE_KEY = 'coachatlah.userId';

  private readonly _userId = signal<string | null>(this.readStored());

  readonly userId = this._userId.asReadonly();
  readonly isLoggedIn = computed(() => this._userId() !== null);

  setUser(id: string): void {
    const clean = id.trim();
    this._userId.set(clean);
    localStorage.setItem(LoginService.STORAGE_KEY, clean);
  }

  clearUser(): void {
    this._userId.set(null);
    localStorage.removeItem(LoginService.STORAGE_KEY);
  }

  private readStored(): string | null {
    return localStorage.getItem(LoginService.STORAGE_KEY);
  }
}
