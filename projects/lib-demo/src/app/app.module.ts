import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgxFileUploaderModule } from "ngx-file-uploader";
// To use ngx-file-uploader from node-modules remove paths from tsconfig.json in root.
/*
"paths": {
      "ngx-file-uploader": [
        "dist/ngx-file-uploader"
      ],
      "ngx-file-uploader/*": [
        "dist/ngx-file-uploader/*"
      ]
    }
*/
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    NgxFileUploaderModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
