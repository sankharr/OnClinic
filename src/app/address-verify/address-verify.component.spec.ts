import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressVerifyComponent } from './address-verify.component';

describe('AddressVerifyComponent', () => {
  let component: AddressVerifyComponent;
  let fixture: ComponentFixture<AddressVerifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressVerifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
