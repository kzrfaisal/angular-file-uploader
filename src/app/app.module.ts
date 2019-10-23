import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFileUploaderModule } from "angular-file-uploader";
// To use angular-file-uploader from node-modules remove paths from tsconfig.json in root.
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
  bootstrap: [AppComponent]
})
export class AppModule { }
