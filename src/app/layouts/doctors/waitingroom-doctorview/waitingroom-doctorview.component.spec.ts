import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingroomDoctorviewComponent } from './waitingroom-doctorview.component';

describe('WaitingroomDoctorviewComponent', () => {
  let component: WaitingroomDoctorviewComponent;
  let fixture: ComponentFixture<WaitingroomDoctorviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaitingroomDoctorviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingroomDoctorviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
