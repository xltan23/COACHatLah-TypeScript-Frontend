import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { MaterialImports } from '../material-imports';
import { RouterLink } from '@angular/router';
import { EscalationDto } from '../models';
import { EscalationService } from '../services/escalation.service';

@Component({
  imports: [MaterialImports, CommonModule, RouterLink],
  selector: 'app-escalation',
  styleUrl: './escalation.css',
  templateUrl: './escalation.html',
})
export class Escalation implements OnInit {

  escalation = signal<EscalationDto[]>([]);

  constructor(private escalationSvc: EscalationService) {}

  ngOnInit(): void {
    console.log("Initialising Escalation component...")
    this.escalationSvc.getEscalationRecords()
      .subscribe(result => {
        console.log("Escalation records received:", result)
        this.escalation.set(result);
      })
  }
}
