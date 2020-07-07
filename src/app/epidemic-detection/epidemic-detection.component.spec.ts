import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpidemicDetectionComponent } from './epidemic-detection.component';

describe('EpidemicDetectionComponent', () => {
  let component: EpidemicDetectionComponent;
  let fixture: ComponentFixture<EpidemicDetectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpidemicDetectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpidemicDetectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
