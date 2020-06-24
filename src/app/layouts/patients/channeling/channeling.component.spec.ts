import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelingComponent } from './channeling.component';

describe('ChannelingComponent', () => {
  let component: ChannelingComponent;
  let fixture: ComponentFixture<ChannelingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
