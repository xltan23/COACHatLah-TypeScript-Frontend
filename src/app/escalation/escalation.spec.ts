import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Escalation } from './escalation';

describe('Escalation', () => {
  let component: Escalation;
  let fixture: ComponentFixture<Escalation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Escalation],
    }).compileComponents();

    fixture = TestBed.createComponent(Escalation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
