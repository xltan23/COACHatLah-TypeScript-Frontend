import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialImports } from '../material-imports';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  imports: [MaterialImports, FormsModule, ReactiveFormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login implements OnInit {

  userId = '';
  loginForm!:FormGroup;
  
  constructor(
    public loginSvc:LoginService,
    private fb:FormBuilder,
    private router:Router,
    private activatedRoute:ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loginForm = this.createLogin();
  }

  private createLogin():FormGroup {
    return this.fb.group({
      id:this.fb.control('', [Validators.required])
    });
  }

  enter(): void {
    this.userId = this.loginForm.value.id;
    this.loginSvc.setUser(this.userId);
    const returnUrl = this.activatedRoute.snapshot.queryParamMap.get('returnUrl') ?? '/';
    this.router.navigateByUrl(returnUrl);
  }

  switch(): void {
    this.loginSvc.clearUser();
    this.userId = '';
  }
}
