import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from "./file-upload.component";
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    FileUploadComponent],
  exports: [FileUploadComponent]
})
export class FileUploadModule { }
