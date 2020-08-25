import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveConsultationDoctorComponent } from './live-consultation-doctor.component';

describe('LiveConsultationDoctorComponent', () => {
  let component: LiveConsultationDoctorComponent;
  let fixture: ComponentFixture<LiveConsultationDoctorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveConsultationDoctorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveConsultationDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
