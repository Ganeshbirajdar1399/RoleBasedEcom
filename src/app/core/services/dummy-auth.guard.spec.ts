import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { dummyAuthGuard } from './dummy-auth.guard';

describe('dummyAuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => dummyAuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
