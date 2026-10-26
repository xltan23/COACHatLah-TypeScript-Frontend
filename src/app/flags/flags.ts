import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MaterialImports } from '../material-imports';
import { FlagDto } from '../models';
import { FlagService } from '../services/flag.service';

export interface ScoreRow {
  key: string;
  label: string;
  value: number;      // raw probability, 0-1
  threshold: number;  // current flag threshold, 0-1
}

const CATEGORY_LABELS: Record<string, string> = {
  TOXIC: 'Toxicity',
  INAPPROPRIATE: 'Inappropriate content',
  CYBERBULLYING: 'Cyberbullying',
};

// Display copy of the backend thresholds in MessageService.flaggedCategories().
// Keep in sync when those change (there is no API exposing them).
export const FLAG_THRESHOLDS: Record<string, number> = {
  TOXIC: 0.62,
  INAPPROPRIATE: 0.55,
  CYBERBULLYING: 0.85,
};

@Component({
  imports: [MaterialImports, CommonModule],
  selector: 'app-flags',
  styleUrl: './flags.css',
  templateUrl: './flags.html',
})
export class Flags implements OnInit {

  studentId!: string;
  flags = signal<FlagDto[]>([]);
  loaded = signal(false);

  // Newest first
  sortedFlags = computed(() =>
    [...this.flags()].sort((a, b) => b.flaggedAt.localeCompare(a.flaggedAt))
  );

  // How many flagged messages fall into each category (a message can count towards several)
  categoryCounts = computed(() =>
    Object.keys(CATEGORY_LABELS).map(key => ({
      key,
      label: CATEGORY_LABELS[key],
      count: this.flags().filter(f => this.categories(f).includes(key)).length,
    }))
  );

  constructor(
    private flagSvc: FlagService,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    console.log("Initialising Flags component...")
    this.activatedRoute.params.subscribe(params => {
      this.studentId = params['id'];
      this.flagSvc.getFlagRecords(this.studentId)
        .subscribe(result => {
          console.log("Flag records received:", result)
          this.flags.set(result);
          this.loaded.set(true);
        })
    })
  }

  categories(f: FlagDto): string[] {
    return f.flagCategories ? f.flagCategories.split(',').map(c => c.trim()) : [];
  }

  categoryLabel(key: string): string {
    return CATEGORY_LABELS[key] ?? key;
  }

  // Parses {"toxic":0.91,...}; older records without scores return []
  scores(f: FlagDto): ScoreRow[] {
    if (!f.confidenceScores) return [];
    try {
      const parsed = JSON.parse(f.confidenceScores) as Record<string, number>;
      const order = Object.keys(CATEGORY_LABELS);
      return Object.entries(parsed)
        .map(([key, value]) => ({
          key: key.toUpperCase(),
          label: this.categoryLabel(key.toUpperCase()),
          value: Number(value),
          threshold: FLAG_THRESHOLDS[key.toUpperCase()] ?? 1,
        }))
        // Same order as the category chips
        .sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key));
    } catch {
      return [];
    }
  }

  // A category recorded as flagged whose score is not above today's threshold
  flaggedUnderEarlierThreshold(f: FlagDto): boolean {
    const recorded = this.categories(f);
    return this.scores(f).some(s => recorded.includes(s.key) && s.value <= s.threshold);
  }

  // For the legend under the summary
  thresholdList = Object.keys(CATEGORY_LABELS).map(key => ({
    label: CATEGORY_LABELS[key],
    threshold: FLAG_THRESHOLDS[key],
  }));

  goBack(): void {
    this.location.back();
  }
}
