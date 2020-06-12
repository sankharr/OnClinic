import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileDoctorviewComponent } from './profile-doctorview.component';

describe('ProfileDoctorviewComponent', () => {
  let component: ProfileDoctorviewComponent;
  let fixture: ComponentFixture<ProfileDoctorviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileDoctorviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileDoctorviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
