import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientverificationComponent } from './patientverification.component';

describe('PatientverificationComponent', () => {
  let component: PatientverificationComponent;
  let fixture: ComponentFixture<PatientverificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientverificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientverificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
