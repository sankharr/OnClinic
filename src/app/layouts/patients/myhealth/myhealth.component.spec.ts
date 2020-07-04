import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyhealthComponent } from './myhealth.component';

describe('MyhealthComponent', () => {
  let component: MyhealthComponent;
  let fixture: ComponentFixture<MyhealthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyhealthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyhealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
