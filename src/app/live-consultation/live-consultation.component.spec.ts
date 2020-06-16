import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveConsultationComponent } from './live-consultation.component';

describe('LiveConsultationComponent', () => {
  let component: LiveConsultationComponent;
  let fixture: ComponentFixture<LiveConsultationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveConsultationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveConsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
