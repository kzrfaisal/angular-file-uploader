import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFileUploaderComponent } from './angular-file-uploader.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  declarations: [AngularFileUploaderComponent],
  exports: [AngularFileUploaderComponent]
})
export class AngularFileUploaderModule { }
