import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialRespComponent } from './social-resp.component';

describe('SocialRespComponent', () => {
  let component: SocialRespComponent;
  let fixture: ComponentFixture<SocialRespComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialRespComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialRespComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
