import { Component, OnInit, signal } from '@angular/core';
import { MaterialImports } from '../material-imports';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EscalationService } from '../services/escalation.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EscalationDto, ReviewDto } from '../models';
import { LoginService } from '../services/login.service';

@Component({
  imports: [MaterialImports, CommonModule, RouterLink, ReactiveFormsModule],
  selector: 'app-review',
  styleUrl: './review.css',
  templateUrl: './review.html',
})
export class Review implements OnInit {

  id!: number;
  reviewForm!: FormGroup;
  record = signal<EscalationDto | null>(null);
  submitMessage = signal<string | null>(null);
  submitFailed = signal(false);

  constructor(
    private escalationSvc: EscalationService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private loginSvc: LoginService
  ) {}

  ngOnInit(): void {
    console.log("Initialising Review component...")
    this.activatedRoute.params.subscribe(params => {
      const id = Number(params['id']);
      this.id = id;
      console.log(`Review ID: ${id}`)
    })
    this.reviewForm = this.createReview();
    this.loadRecord();
  }

  // No single-record endpoint yet, so pick this record out of the full list
  private loadRecord(): void {
    this.escalationSvc.getEscalationRecords()
      .subscribe(result => this.record.set(result.find(e => e.id === this.id) ?? null));
  }

  private createReview():FormGroup {
    return this.fb.group({
      escalationId:this.fb.control(this.id, [Validators.required]),
      // Reviewer is the logged-in staff member (name, else id); readonly in the template
      reviewedBy:this.fb.control(this.loginSvc.userName() ?? this.loginSvc.userId(), [Validators.required]),
      reviewComments:this.fb.control('', [Validators.required]),
    })
  }

  processReview() {
    console.log("Submitting review form...")
    const review = this.reviewForm.value as ReviewDto
    this.escalationSvc.postEscalationReview(review)
      .then(result => {
        console.log(result)
        this.submitFailed.set(false);
        this.submitMessage.set(result.postMessage);
        this.loadRecord();
      })
      .catch(err => {
        console.error("Error submitting review", err)
        this.submitFailed.set(true);
        this.submitMessage.set("Couldn't submit the review. Try again.");
      })
  }
}
