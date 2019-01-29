import { TestBed } from '@angular/core/testing';

import { VansService } from './vans.service';

describe('VansService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VansService = TestBed.get(VansService);
    expect(service).toBeTruthy();
  });
});
