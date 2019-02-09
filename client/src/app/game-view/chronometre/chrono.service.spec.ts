import { TestBed } from '@angular/core/testing';

import { ChronoService } from './chrono.service';

describe('ChronoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChronoService = TestBed.get(ChronoService);
    expect(service).toBeTruthy();
  });
});
