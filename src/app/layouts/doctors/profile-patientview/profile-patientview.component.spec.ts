import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePatientviewComponent } from './profile-patientview.component';

describe('ProfilePatientviewComponent', () => {
  let component: ProfilePatientviewComponent;
  let fixture: ComponentFixture<ProfilePatientviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilePatientviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePatientviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
