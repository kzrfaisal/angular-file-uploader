import { Component, OnInit } from '@angular/core';
import { AngularFileUploaderConfig } from 'angular-file-uploader';

@Component({
  selector: 'ld-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  resetUpload11: boolean;
  resetUpload12: boolean;


  resetUpload1: boolean;
  resetUpload2: boolean;
  resetUpload3: boolean;


  token = 'lkdjlfjld';

  afuConfig11: AngularFileUploaderConfig = {
    multiple: true,
    uploadAPI: {
      url: 'https://slack.com/api/files.upload',
      method: 'post'
    },
  };

  afuConfig12: AngularFileUploaderConfig = {
    multiple: true,
    uploadAPI: {
      url: 'https://slack.com/api/files.upload',
    },
    oneFilePerRequest: true
  };

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

  docUpload(env) {
    console.log(env);
  }
}
