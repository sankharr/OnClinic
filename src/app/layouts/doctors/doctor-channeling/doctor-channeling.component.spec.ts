import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorChannelingComponent } from './doctor-channeling.component';

describe('DoctorChannelingComponent', () => {
  let component: DoctorChannelingComponent;
  let fixture: ComponentFixture<DoctorChannelingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorChannelingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorChannelingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
