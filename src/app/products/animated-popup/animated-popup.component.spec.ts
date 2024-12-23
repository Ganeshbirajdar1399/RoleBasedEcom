import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimatedPopupComponent } from './animated-popup.component';

describe('AnimatedPopupComponent', () => {
  let component: AnimatedPopupComponent;
  let fixture: ComponentFixture<AnimatedPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimatedPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimatedPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
