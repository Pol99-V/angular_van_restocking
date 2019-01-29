import { TestBed, async, inject } from '@angular/core/testing';

import { MemberGuard } from './member.guard';

describe('MemberGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MemberGuard]
    });
  });

  it('should ...', inject([MemberGuard], (guard: MemberGuard) => {
    expect(guard).toBeTruthy();
  }));
});
