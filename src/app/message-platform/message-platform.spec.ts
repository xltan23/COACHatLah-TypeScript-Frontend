import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessagePlatform } from './message-platform';

describe('MessagePlatform', () => {
  let component: MessagePlatform;
  let fixture: ComponentFixture<MessagePlatform>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessagePlatform],
    }).compileComponents();

    fixture = TestBed.createComponent(MessagePlatform);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
