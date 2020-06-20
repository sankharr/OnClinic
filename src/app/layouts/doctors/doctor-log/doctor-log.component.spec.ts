import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorLogComponent } from './doctor-log.component';

describe('DoctorLogComponent', () => {
  let component: DoctorLogComponent;
  let fixture: ComponentFixture<DoctorLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
