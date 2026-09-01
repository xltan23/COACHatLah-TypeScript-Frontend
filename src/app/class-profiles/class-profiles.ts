import { Component, OnInit, signal } from '@angular/core';
import { MaterialImports } from '../material-imports';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../services/profile.service';
import { ProfileDto } from '../models';
import { LoginService } from '../services/login.service';
import { RouterLink } from "@angular/router";

@Component({
  imports: [MaterialImports, CommonModule, RouterLink],
  selector: 'app-class-profiles',
  styleUrl: './class-profiles.css',
  templateUrl: './class-profiles.html',
})
export class ClassProfiles implements OnInit {

  id!:string;
  profiles = signal<ProfileDto[]>([]);

  constructor(
    private loginSvc:LoginService,
    private profileSvc:ProfileService
  ) {}

  ngOnInit(): void {
    console.log("Initialising Class Profiles component...")
    this.id = this.loginSvc.userId()!
    this.profileSvc.getClassProfiles(this.id)
      .subscribe(result => {
        console.log("Profiles received:", result)
        this.profiles.set(result);
      })
  }
}
