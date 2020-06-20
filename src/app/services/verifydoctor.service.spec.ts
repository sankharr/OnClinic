import { TestBed } from '@angular/core/testing';

import { VerifydoctorService } from './verifydoctor.service';

describe('VerifydoctorService', () => {
  let service: VerifydoctorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerifydoctorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
