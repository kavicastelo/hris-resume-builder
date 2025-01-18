import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpResumeBuilderComponent } from './emp-resume-builder.component';

describe('EmpResumeBuilderComponent', () => {
  let component: EmpResumeBuilderComponent;
  let fixture: ComponentFixture<EmpResumeBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmpResumeBuilderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpResumeBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
