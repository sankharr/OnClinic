import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarModeratorComponent } from './navbar-moderator.component';

describe('NavbarModeratorComponent', () => {
  let component: NavbarModeratorComponent;
  let fixture: ComponentFixture<NavbarModeratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarModeratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarModeratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
