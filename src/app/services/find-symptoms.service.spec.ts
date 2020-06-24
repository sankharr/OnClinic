import { TestBed } from '@angular/core/testing';

import { FindSymptomsService } from './find-symptoms.service';

describe('FindSymptomsService', () => {
  let service: FindSymptomsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FindSymptomsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
