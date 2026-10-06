import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { LoginService } from './services/login.service';
import { MaterialImports } from './material-imports';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MaterialImports],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('frontend');

  // true on phone-sized screens: drawer slides over the page instead of sitting beside it
  protected readonly isPhone;

  constructor(public loginSvc:LoginService, private router:Router, breakpoints:BreakpointObserver) {
    this.isPhone = toSignal(
      breakpoints.observe('(max-width: 768px)').pipe(map(state => state.matches)),
      { initialValue: false }
    );
  }

  logout(): void {
    this.loginSvc.clearUser();
    this.router.navigate(['/login']);
  }
}
