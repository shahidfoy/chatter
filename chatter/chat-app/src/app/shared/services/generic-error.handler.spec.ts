import { TestBed } from '@angular/core/testing';

import { GenericErrorHandler } from './generic-error.handler';

describe('GenericErrorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GenericErrorHandler = TestBed.get(GenericErrorHandler);
    expect(service).toBeTruthy();
  });
});
