import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepWorkExperienceComponent } from './step-work-experience.component';

describe('StepWorkExperienceComponent', () => {
  let component: StepWorkExperienceComponent;
  let fixture: ComponentFixture<StepWorkExperienceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepWorkExperienceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepWorkExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
