import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClassProfiles } from './class-profiles';

describe('ClassProfiles', () => {
  let component: ClassProfiles;
  let fixture: ComponentFixture<ClassProfiles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassProfiles],
    }).compileComponents();

    fixture = TestBed.createComponent(ClassProfiles);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
