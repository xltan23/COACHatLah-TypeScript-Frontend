import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Profile } from '../models';

@Component({
  imports: [],
  selector: 'app-cca-profiles',
  styleUrl: './cca-profiles.css',
  templateUrl: './cca-profiles.html',
})
export class CcaProfiles implements OnInit, OnDestroy {

  id!:string;
  profiles = signal<Profile[]>([])
  params$!:Subscription;

  constructor(private profileSvc:ProfileService, private activatedRoute:ActivatedRoute) {}

  ngOnInit(): void {
    console.log("Initialising CCA Profiles component...")
    this.params$ = this.activatedRoute.params.subscribe(
      (params) => {
        this.id = params["id"];
        console.log("Submitting request for profiles in the CCA of ", this.id)
        this.profileSvc.getCCAProfiles(this.id)
          .subscribe(result => {
            console.log("Profiles received:", result)
            this.profiles.set(result);
          })
      }
    )
  }

  ngOnDestroy(): void {
    this.params$.unsubscribe();
  }
}
