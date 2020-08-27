import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxFileUploaderComponent } from './ngx-file-uploader.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  declarations: [NgxFileUploaderComponent],
  exports: [NgxFileUploaderComponent]
})
export class NgxFileUploaderModule { }
