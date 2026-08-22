import { Component, OnInit } from '@angular/core';
import { MaterialImports } from '../material-imports';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Profile } from '../models';
import { ProfileService } from '../services/profile.service';

@Component({
  imports: [MaterialImports, FormsModule, ReactiveFormsModule],
  selector: 'app-add-profile',
  styleUrl: './add-profile.css',
  templateUrl: './add-profile.html',
})
export class AddProfile implements OnInit {

  profileForm!:FormGroup

  constructor(private fb:FormBuilder, private profileSvc:ProfileService, private snackBar:MatSnackBar) {}

  ngOnInit(): void {
    this.profileForm = this.createProfile()
  }

  private createProfile():FormGroup {
    return this.fb.group({
      name:this.fb.control('', [Validators.required]),
      gender:this.fb.control('', [Validators.required]),
      role:this.fb.control('', [Validators.required]),
      school:this.fb.control('', [Validators.required]),
      classCohort:this.fb.control('', [Validators.required]),
      cca:this.fb.control('', [Validators.required]),
    })
  }

  processProfile() {
    console.log("Submitting profile form...")
    const profile = this.profileForm.value as Profile
    this.profileSvc.postProfile(profile)
      .then(result => {
        console.log(result)
      })
      .catch(err => {
        console.error("Error inserting profile", err)
      })
  }
}
