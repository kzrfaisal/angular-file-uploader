import { Component, OnInit } from '@angular/core';
import { AngularFileUploaderConfig } from 'angular-file-uploader';

@Component({
  selector: 'ld-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  resetUpload1: boolean;
  resetUpload2: boolean;
  resetUpload3: boolean;

  token = 'lkdjlfjld';

  afuConfig1: AngularFileUploaderConfig = {
    multiple: true,
    uploadAPI: {
      url: 'https://slack.com/api/files.upload',
    },
  };

  afuConfig2: AngularFileUploaderConfig = {
    theme: 'attachPin',
    hideProgressBar: true,
    hideResetBtn: true,
    maxSize: 1,
    uploadAPI: {
      url: 'https://slack.com/api/files.upload',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
    formatsAllowed: '.jpg,.png',
    multiple: true,
  };
  afuConfig3: AngularFileUploaderConfig = {
    theme: 'dragNDrop',
    hideProgressBar: true,
    hideResetBtn: true,
    hideSelectBtn: true,
    maxSize: 1,
    uploadAPI: {
      url: 'https://slack.com/api/files.upload',
    },
    formatsAllowed: '.jpg,.png',
    multiple: true,
  };

  constructor() {
  }

  ngOnInit() {

  }

  DocUpload(env) {
    console.log(env);
  }

  resetfu(id) {
    this[`afuref${id}`].resetFileUpload();
  }
}
