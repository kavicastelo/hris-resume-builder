import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepEducationComponent } from './step-education.component';

describe('StepEducationComponent', () => {
  let component: StepEducationComponent;
  let fixture: ComponentFixture<StepEducationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepEducationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepEducationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
