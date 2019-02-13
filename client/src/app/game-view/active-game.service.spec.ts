import { TestBed } from '@angular/core/testing';

import { ActiveGameService } from './active-game.service';

describe('ActiveGameService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ActiveGameService = TestBed.get(ActiveGameService);
    expect(service).toBeTruthy();
  });
});
