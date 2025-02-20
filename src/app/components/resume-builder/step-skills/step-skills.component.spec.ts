import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepSkillsComponent } from './step-skills.component';

describe('StepSkillsComponent', () => {
  let component: StepSkillsComponent;
  let fixture: ComponentFixture<StepSkillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepSkillsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
