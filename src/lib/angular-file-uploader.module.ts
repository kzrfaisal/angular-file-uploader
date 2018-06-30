import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFileUploaderComponent } from './angular-file-uploader.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [AngularFileUploaderComponent],
  exports: [AngularFileUploaderComponent]
})
export class AngularFileUploaderModule { }
