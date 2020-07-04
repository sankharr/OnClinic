import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientRegistration2Component } from './patient-registration2.component';

describe('PatientRegistration2Component', () => {
  let component: PatientRegistration2Component;
  let fixture: ComponentFixture<PatientRegistration2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientRegistration2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientRegistration2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
