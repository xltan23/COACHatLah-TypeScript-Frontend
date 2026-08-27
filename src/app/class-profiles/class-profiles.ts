import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { MaterialImports } from '../material-imports';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../services/profile.service';
import { Subscription } from 'rxjs';
import { Profile } from '../models';
import { ActivatedRoute } from '@angular/router';

@Component({
  imports: [MaterialImports, CommonModule],
  selector: 'app-class-profiles',
  styleUrl: './class-profiles.css',
  templateUrl: './class-profiles.html',
})
export class ClassProfiles implements OnInit, OnDestroy {

  id!:string;
  profiles = signal<Profile[]>([]);
  params$!:Subscription;

  constructor(private profileSvc:ProfileService, private activatedRoute:ActivatedRoute) {}

  ngOnInit(): void {
    console.log("Initialising Class Profiles component...")
    this.params$ = this.activatedRoute.params.subscribe(
      (params) => {
        this.id = params["id"];
        console.log("Submitting request for profiles in the class of ", this.id)
        this.profileSvc.getClassProfiles(this.id)
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
