import { Component, OnInit, signal } from '@angular/core';
import { MaterialImports } from '../material-imports';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProfileDto } from '../models';
import { ProfileService } from '../services/profile.service';

@Component({
  imports: [MaterialImports, CommonModule, RouterLink],
  selector: 'app-support',
  styleUrl: './support.css',
  templateUrl: './support.html',
})
export class Support implements OnInit {

  id!:string;
  profiles = signal<ProfileDto[]>([]);

  constructor(private profileSvc:ProfileService) {}

  ngOnInit(): void {
    console.log("Initialising Support component...")
    this.profileSvc.getSupportProfiles()
      .subscribe(result => {
        console.log("Support Profiles received:", result)
        this.profiles.set(result);
      })
  }

  // Avatar letter: skip honorifics so "MR ANDERSON TAN" shows "A", not "M"
  initial(name: string): string {
    const titles = ['MR', 'MS', 'MRS', 'MDM', 'MISS', 'DR'];
    const words = name.trim().split(/\s+/);
    const first = words[0].replace('.', '').toUpperCase();
    return (titles.includes(first) && words.length > 1 ? words[1] : words[0]).charAt(0).toUpperCase();
  }
}
