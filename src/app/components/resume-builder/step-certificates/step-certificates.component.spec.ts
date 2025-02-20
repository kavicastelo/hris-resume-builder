import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepCertificatesComponent } from './step-certificates.component';

describe('StepCertificatesComponent', () => {
  let component: StepCertificatesComponent;
  let fixture: ComponentFixture<StepCertificatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepCertificatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepCertificatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
