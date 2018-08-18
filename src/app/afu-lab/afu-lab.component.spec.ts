import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AfuLabComponent } from './afu-lab.component';

describe('AfuLabComponent', () => {
  let component: AfuLabComponent;
  let fixture: ComponentFixture<AfuLabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AfuLabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AfuLabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
