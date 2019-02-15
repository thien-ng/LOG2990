import { TestBed } from '@angular/core/testing';

import { FreeGameManagerService } from './free-game-manager.service';

describe('FreeGameManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FreeGameManagerService = TestBed.get(FreeGameManagerService);
    expect(service).toBeTruthy();
  });
});
