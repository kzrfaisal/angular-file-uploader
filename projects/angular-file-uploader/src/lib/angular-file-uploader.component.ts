import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ReplaceTexts, AngularFileUploaderConfig, UploadInfo } from "./angular-file-uploader.types";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'angular-file-uploader',
  templateUrl: './angular-file-uploader.component.html',
  styleUrls: ['./angular-file-uploader.component.css'],
})
export class AngularFileUploaderComponent implements OnChanges {
  // Inputs
  @Input()
  config: AngularFileUploaderConfig;

  @Input()
  resetUpload = false;

  // Outputs
  @Output()
  ApiResponse = new EventEmitter();

  @Output()
  everythingDone: EventEmitter<UploadInfo[]> = new EventEmitter<UploadInfo[]>();

  // Properties
  theme: string;
  id: number;
  hideProgressBar: boolean;
  maxSize: number;
  uploadAPI: string;
  method: string;
  formatsAllowed: string;
  formatsAllowedList: string[] = null;
  multiple: boolean;
  headers: { [id: string]: string };
  hideResetBtn: boolean;
  hideSelectBtn: boolean;
  allowedFiles: File[] = [];
  notAllowedFiles: { fileName: string; fileSize: string; errorMsg: string; }[] = [];
  Caption: string[] = [];
  isAllowedFileSingle = true;
  progressBarShow = false;
  enableUploadBtn = false;
  uploadMsg = false;
  afterUpload = false;
  uploadStarted = false;
  uploadMsgText: string;
  uploadMsgClass: string;
  uploadPercent: number;
  replaceTexts: ReplaceTexts;
  currentUploads: UploadInfo[] = [];
  oneFilePerRequest: boolean;

  private idDate: number = +new Date();

  constructor(private http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges) {
    // Track changes in Configuration and see if user has even provided Configuration.
    if (changes.config && this.config) {

      // Assign User Configurations to Library Properties.
      this.theme = this.config.theme || '';
      this.id = this.config.id ||parseInt((this.idDate / 10000).toString().split('.')[1], 10) + Math.floor(Math.random() * 20) * 10000;
      this.hideProgressBar = this.config.hideProgressBar || false;
      this.hideResetBtn = this.config.hideResetBtn || false;
      this.hideSelectBtn = this.config.hideSelectBtn || false;
      this.maxSize = (this.config.maxSize || 20)  * 1024000; // mb to bytes.
      this.uploadAPI = this.config.uploadAPI.url;
      this.method = this.config.uploadAPI.method || 'POST';
      this.formatsAllowed = this.config.formatsAllowed || '.jpg,.png,.pdf,.docx,.txt,.gif,.jpeg';
      this.formatsAllowedList = this.formatsAllowed.split('.').map(x => x.split(',')[0].trim().toLowerCase()); // from '.jpg,.png ...   to ['jpg', 'png']'.
      this.multiple = this.config.multiple || false;
      this.headers = this.config.uploadAPI.headers || {};
      this.oneFilePerRequest = !!this.config.oneFilePerRequest;
      this.replaceTexts = {
        selectFileBtn: this.multiple ? 'Select Files' : 'Select File',
        resetBtn: 'Reset',
        uploadBtn: 'Upload',
        dragNDropBox: 'Drag N Drop',
        attachPinBtn: this.multiple ? 'Attach Files...' : 'Attach File...',
        afterUploadMsg_success: 'Successfully Uploaded !',
        afterUploadMsg_error: 'Upload Failed !',
      }; // default replaceText.
      if(this.config.replaceTexts) {
        // updated replaceText if user has provided any.
        this.replaceTexts = {
         ...this.replaceTexts,
         ...this.config.replaceTexts,
       };
      }

    }

    // Reset when resetUpload value changes from false to true.
    if (changes.resetUpload) {
      if (changes.resetUpload.currentValue === true) {
        this.resetFileUpload();
      }
    }
  }

  // Reset following properties.
  resetFileUpload() {
    this.allowedFiles = [];
    this.Caption = [];
    this.notAllowedFiles = [];
    this.uploadMsg = false;
    this.enableUploadBtn = false;
  }

  // When user selects files.
  onChange(event: any) {
    this.notAllowedFiles = [];
    const fileExtRegExp: RegExp = /(?:\.([^.]+))?$/;
    let fileList: FileList;

    if (this.afterUpload || !this.multiple) {
      this.allowedFiles = [];
      this.Caption = [];
      this.afterUpload = false;
    }

    if (event.type === 'drop') {
      fileList = event.dataTransfer.files;
    } else {
      fileList = event.target.files || event.srcElement.files;
    }

    for (let i = 0; i < fileList.length; i++) { // 'forEach' does not exist on 'filelist' that's why this good old 'for' is used.
      const currentFileExt = (fileExtRegExp.exec(fileList[i].name)[1]).toLowerCase(); // Get file extension.
      const isFormatValid = this.formatsAllowed.includes(currentFileExt);
      const isSizeValid = fileList[i].size <= this.maxSize;

      // Check whether current file format and size is correct as specified in the configurations.
      if (isFormatValid && isSizeValid) {
          this.allowedFiles.push(fileList[i]);
      } else {
        this.notAllowedFiles.push({
          fileName: fileList[i].name,
          fileSize: this.convertSize(fileList[i].size),
          errorMsg: !isFormatValid ? 'Invalid format' :  'Invalid size',
        });
      }
    }

    // If there's any allowedFiles.
    if (this.allowedFiles.length > 0) {
      this.enableUploadBtn = true;
      // Upload the files directly if theme is attach pin (as upload btn is not there for this theme).
      if (this.theme === 'attachPin') {
        this.uploadFiles();
      }
    } else {
      this.enableUploadBtn = false;
    }

    this.uploadMsg = false;
    this.uploadStarted = false;
    this.uploadPercent = 0;
    event.target.value = null;
  }


  uploadFiles() {
    console.log('upload files');

    this.progressBarShow = true;
    this.uploadStarted = true;
    this.notAllowedFiles = [];
    let isError = false;

    this.isAllowedFileSingle = this.allowedFiles.length <= 1;

    this.currentUploads = [];

    if (this.oneFilePerRequest) {
      console.log('One per request');

      this.allowedFiles.forEach((file, i) => {
        const xhr = new XMLHttpRequest();
        const formData = new FormData();

        // Add data to be sent in this request
        formData.append(
          this.Caption[i] || 'file' + i,
          this.allowedFiles[i],
        );

        this.currentUploads.push({ xhr: xhr, formData: formData, indexes: [i] });
      });
    } else { // All Files under one formdata.
      console.log('All in one');


      const xhr = new XMLHttpRequest();
      const formData = new FormData();

      // Add data to be sent in this request
      this.allowedFiles.forEach((file, i) => {
        formData.append(
          this.Caption[i] || 'file' + i,
          this.allowedFiles[i],
        );
      });

      this.currentUploads.push({ xhr: xhr, formData: formData, indexes: this.allowedFiles.map((file, i) => i) });
    }

    const totalUploads = this.currentUploads.length;

    this.currentUploads.forEach((upload: UploadInfo, i) => {
      console.log('current uploads loop: ', upload);

      const xhr = upload.xhr;

      // Upload state, triggered multiple times until onload.
      xhr.onreadystatechange = evnt => {
        console.log('xhr onreadystatechange: ', xhr.readyState, xhr.status);

        if (xhr.readyState === 4) {
          if (xhr.status !== 200 && xhr.status !== 201) {
            isError = true;
            this.progressBarShow = false;
            this.enableUploadBtn = false;
            this.uploadMsg = true;
            this.afterUpload = true;
            this.uploadMsgText = this.replaceTexts.afterUploadMsg_error;
            this.uploadMsgClass = 'text-danger lead';
          }
          this.ApiResponse.emit(xhr);
          if (i + 1 === totalUploads) {
            this.everythingDone.emit(this.currentUploads);
          }
        }
      };

      // Upload In Progress
      xhr.upload.onprogress = evnt => {
        console.log('xhr upload.onprogress');

        this.enableUploadBtn = false; // button should be disabled if process uploading
        if (evnt.lengthComputable) {
          const currentDone = (evnt.loaded / evnt.total);
          this.uploadPercent = Math.round((i + currentDone) * 100 / totalUploads);
        }
      };

      // Upload Completed
      xhr.onload = evnt => {
        console.log('xhr onload');

        this.progressBarShow = false;
        this.enableUploadBtn = false;
        this.uploadMsg = true;
        this.afterUpload = true;
        if (!isError) {
          if (i + 1 === totalUploads) {
            console.log('upload completed');

            this.uploadMsgText = this.replaceTexts.afterUploadMsg_success;
            this.uploadMsgClass = 'text-success lead';
          } else {

            const nextUpload = this.currentUploads[i + 1];
            console.log('upload next xhr send: ', nextUpload.formData);
            nextUpload.xhr.send(nextUpload.formData);
          }
          this.uploadPercent = Math.round((i + 1) * 100 / totalUploads);
        }
      };

      console.log('xhr open');

      xhr.open(this.method, this.uploadAPI, true);
      for (const key of Object.keys(this.headers)) {
        // Object.keys will give an Array of keys
        xhr.setRequestHeader(key, this.headers[key]);
      }
    });



    const firstUpload = this.currentUploads[0];
    console.log('First Upload xhr send: ', firstUpload.formData);
    firstUpload.xhr.send(firstUpload.formData);
  }

  removeFile(i: any, sf_na: any) {
    if (sf_na === 'sf') {
      this.allowedFiles.splice(i, 1);
      this.Caption.splice(i, 1);
    } else {
      this.notAllowedFiles.splice(i, 1);
    }

    if (this.allowedFiles.length === 0) {
      this.enableUploadBtn = false;
    }
  }

  convertSize(fileSize: number): string {
    return fileSize < 1024000
      ? (fileSize / 1024).toFixed(2) + ' KB'
      : (fileSize / 1024000).toFixed(2) + ' MB';
  }

  attachpinOnclick() {
    const element = document.getElementById('sel' + this.id);
    if (element !== null) {
      element.click();
    }
  }

  drop(event: any) {
    event.stopPropagation();
    event.preventDefault();
    this.onChange(event);
  }

  allowDrop(event: any) {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }
}
