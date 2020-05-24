import { TestBed } from '@angular/core/testing';

import { AngularFileUploaderService } from './angular-file-uploader.service';

describe('AngularFileUploaderService', () => {
  let service: AngularFileUploaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AngularFileUploaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
