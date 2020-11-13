import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AngularFileUploaderModule } from "angular-file-uploader";
// To use angular-file-uploader from node-modules remove paths from tsconfig.base.json in root.
/*
"paths": {
      "angular-file-uploader": [
        "dist/angular-file-uploader"
      ],
      "angular-file-uploader/*": [
        "dist/angular-file-uploader/*"
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
    AngularFileUploaderModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
