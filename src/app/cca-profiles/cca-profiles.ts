import { Component, OnInit, signal } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { ProfileDto } from '../models';
import { LoginService } from '../services/login.service';
import { MaterialImports } from '../material-imports';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  imports: [MaterialImports, CommonModule, RouterLink],
  selector: 'app-cca-profiles',
  styleUrl: './cca-profiles.css',
  templateUrl: './cca-profiles.html',
})
export class CcaProfiles implements OnInit {

  id!:string;
  profiles = signal<ProfileDto[]>([])

  constructor(
    private loginSvc:LoginService,
    private profileSvc:ProfileService) {}

  ngOnInit(): void {
    console.log("Initialising CCA Profiles component...")
    this.id = this.loginSvc.userId()!
    this.profileSvc.getCCAProfiles(this.id)
      .subscribe(result => {
        console.log("Profiles received:", result)
        this.profiles.set(result);
      })
  }
}
