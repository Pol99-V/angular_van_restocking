import { TestBed } from '@angular/core/testing';

import { TechsService } from './techs.service';

describe('TechsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TechsService = TestBed.get(TechsService);
    expect(service).toBeTruthy();
  });
});
