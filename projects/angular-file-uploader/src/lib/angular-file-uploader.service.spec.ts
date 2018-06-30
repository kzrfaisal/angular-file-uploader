import { TestBed, inject } from '@angular/core/testing';

import { AngularFileUploaderService } from './angular-file-uploader.service';

describe('AngularFileUploaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AngularFileUploaderService]
    });
  });

  it('should be created', inject([AngularFileUploaderService], (service: AngularFileUploaderService) => {
    expect(service).toBeTruthy();
  }));
});
