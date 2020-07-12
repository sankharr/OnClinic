import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDoctorprofileComponent } from './edit-doctorprofile.component';

describe('EditDoctorprofileComponent', () => {
  let component: EditDoctorprofileComponent;
  let fixture: ComponentFixture<EditDoctorprofileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDoctorprofileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDoctorprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
