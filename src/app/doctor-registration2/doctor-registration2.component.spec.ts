import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorRegistration2Component } from './doctor-registration2.component';

describe('DoctorRegistration2Component', () => {
  let component: DoctorRegistration2Component;
  let fixture: ComponentFixture<DoctorRegistration2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorRegistration2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorRegistration2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
