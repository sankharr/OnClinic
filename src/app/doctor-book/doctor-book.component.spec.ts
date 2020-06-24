import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorBookComponent } from './doctor-book.component';

describe('DoctorBookComponent', () => {
  let component: DoctorBookComponent;
  let fixture: ComponentFixture<DoctorBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
