import { Component, OnInit } from '@angular/core';
import { AngularFileUploaderConfig } from 'angular-file-uploader';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  resetUpload1: boolean;
  resetUpload2: boolean;
  resetUpload3: boolean;

  afuConfig1: AngularFileUploaderConfig = {
    id: 112233,
    multiple: true,
    formatsAllowed: ['image/*'],
    autoUpload: true,
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
    },
    formatsAllowed: ['.jpg', '.png'],
    multiple: true,
  };

  afuConfig3: AngularFileUploaderConfig = {
    theme: 'dragNDrop',
    // hideProgressBar: true,
    hideResetBtn: true,
    // hideSelectBtn: true,
    // autoUpload: true,
    maxSize: 20,
    uploadAPI: {
      url: 'https://slack.com/api/files.upload',
    },
    formatsAllowed: ['.jpg', '.jpeg', '.png'],
    multiple: true,
  };

  constructor() {}

  docUpload(event) {
    console.log('ApiResponse -> docUpload -> Event: ', event);
  }
}
