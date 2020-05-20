import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularFileUploaderComponent } from './angular-file-uploader.component';

describe('AngularFileUploaderComponent', () => {
  let component: AngularFileUploaderComponent;
  let fixture: ComponentFixture<AngularFileUploaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AngularFileUploaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AngularFileUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
