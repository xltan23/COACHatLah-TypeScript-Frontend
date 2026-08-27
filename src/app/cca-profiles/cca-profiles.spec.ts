import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CcaProfiles } from './cca-profiles';

describe('CcaProfiles', () => {
  let component: CcaProfiles;
  let fixture: ComponentFixture<CcaProfiles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CcaProfiles],
    }).compileComponents();

    fixture = TestBed.createComponent(CcaProfiles);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
