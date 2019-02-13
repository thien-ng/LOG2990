import { TestBed } from '@angular/core/testing';

import { ThreejsViewService } from './threejs-view.service';

describe('ThreejsViewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ThreejsViewService = TestBed.get(ThreejsViewService);
    expect(service).toBeTruthy();
  });
});
