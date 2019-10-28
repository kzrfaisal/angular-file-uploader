import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

export interface ReplaceTexts {
  selectFileBtn: string;
  resetBtn: string;
  uploadBtn: string;
  dragNDropBox: string;
  attachPinBtn: string;
  afterUploadMsg_success: string;
  afterUploadMsg_error: string;
}

export interface AngularFileUploaderConfig {
  uploadAPI: { url: string; method?: string; headers?: { [id: string]: string }; };

  theme?: string;
  id?: number;
  hideProgressBar?: boolean;
  hideResetBtn?: boolean;
  hideSelectBtn?: boolean;
  maxSize?: number;
  formatsAllowed?: string;
  multiple?: boolean;
  oneFilePerRequest?: boolean;
  replaceTexts?: ReplaceTexts;
}

export interface UploadInfo {
  xhr: XMLHttpRequest;
  formData: FormData;
  inxs: number[];
}

@Component({
  selector: 'angular-file-uploader',
  templateUrl: './angular-file-uploader.component.html',
  styleUrls: ['./angular-file-uploader.component.css'],
})
export class AngularFileUploaderComponent implements OnInit, OnChanges {
  @Input()
  config: AngularFileUploaderConfig;

  @Input()
  resetUpload = false;

  @Output()
  ApiResponse = new EventEmitter();

  @Output()
  everythingDone: EventEmitter<UploadInfo[]> = new EventEmitter<UploadInfo[]>();

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
  oneFilePerRequest: boolean;
  reg: RegExp = /(?:\.([^.]+))?$/;
  selectedFiles: File[] = [];
  notAllowedList: { fileName: string; fileSize: string; errorMsg: string; }[] = [];
  Caption: string[] = [];
  singleFile = true;
  progressBarShow = false;
  uploadBtn = false;
  uploadMsg = false;
  afterUpload = false;
  uploadClick = true;
  uploadMsgText: string;
  uploadMsgClass: string;
  percentComplete: number;
  replaceTexts;
  currentUploads: UploadInfo[] = [];

  private idDate: number = +new Date();

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.config && this.config) {
      this.theme = this.config.theme || '';
      this.id =
        this.config.id ||
        parseInt((this.idDate / 10000).toString().split('.')[1], 10) +
        Math.floor(Math.random() * 20) * 10000;
      this.hideProgressBar = this.config.hideProgressBar || false;
      this.hideResetBtn = this.config.hideResetBtn || false;
      this.hideSelectBtn = this.config.hideSelectBtn || false;
      this.maxSize = this.config.maxSize || 20;
      this.uploadAPI = this.config.uploadAPI.url;
      this.method = this.config.uploadAPI.method || 'POST';
      this.formatsAllowed =
        this.config.formatsAllowed || '.jpg,.png,.pdf,.docx,.txt,.gif,.jpeg';
      this.formatsAllowedList = null;
      this.multiple = this.config.multiple || false;
      this.headers = this.config.uploadAPI.headers || {};
      this.oneFilePerRequest = !!this.config.oneFilePerRequest;
      const defaultReplaceTextsValues: ReplaceTexts = {
        selectFileBtn: this.multiple ? 'Select Files' : 'Select File',
        resetBtn: 'Reset',
        uploadBtn: 'Upload',
        dragNDropBox: 'Drag N Drop',
        attachPinBtn: this.multiple ? 'Attach Files...' : 'Attach File...',
        afterUploadMsg_success: 'Successfully Uploaded !',
        afterUploadMsg_error: 'Upload Failed !',
      };
      if (this.config.replaceTexts) {
        this.replaceTexts = {
          ...defaultReplaceTextsValues,
          ...this.config.replaceTexts,
        };
      } else {
        this.replaceTexts = {...defaultReplaceTextsValues};
      }
    }

    if (changes.resetUpload) {
      if (changes.resetUpload.currentValue === true) {
        this.resetFileUpload();
      }
    }
  }

  ngOnInit() {

  }

  resetFileUpload() {
    this.selectedFiles = [];
    this.Caption = [];
    this.notAllowedList = [];
    this.uploadMsg = false;
    this.uploadBtn = false;
  }

  onChange(event: any) {
    this.notAllowedList = [];
    if (this.afterUpload || !this.multiple) {
      this.selectedFiles = [];
      this.Caption = [];
      this.afterUpload = false;
    }

    if (this.formatsAllowedList === null) {
      this.formatsAllowedList = this.formatsAllowed.split('.').map(x => x.split(',')[0].trim().toLowerCase());
    }

    let fileList: FileList;
    if (event.type === 'drop') {
      fileList = event.dataTransfer.files;
    } else {
      fileList = event.target.files || event.srcElement.files;
    }
    for (let i = 0; i < fileList.length; i++) {
      const currentFileExt = this.reg.exec(fileList[i].name)[1];
      const currentFileExtLower = currentFileExt.toLowerCase();
      const frmtAllowed = this.formatsAllowedList.some(x => x === currentFileExtLower);

      if (frmtAllowed) {
        if (fileList[i].size > this.maxSize * 1024000) {
          this.notAllowedList.push({
            fileName: fileList[i].name,
            fileSize: this.convertSize(fileList[i].size),
            errorMsg: 'Invalid size',
          });
        } else {
          this.selectedFiles.push(fileList[i]);
        }
      } else {
        this.notAllowedList.push({
          fileName: fileList[i].name,
          fileSize: this.convertSize(fileList[i].size),
          errorMsg: 'Invalid format',
        });
      }
    }

    if (this.selectedFiles.length !== 0) {
      this.uploadBtn = true;
      if (this.theme === 'attachPin') {
        this.uploadFiles();
      }
    } else {
      this.uploadBtn = false;
    }
    this.uploadMsg = false;
    this.uploadClick = true;
    this.percentComplete = 0;
    event.target.value = null;
  }

  uploadFiles() {
    this.progressBarShow = true;
    this.uploadClick = false;
    this.notAllowedList = [];
    let isError = false;

    this.singleFile = this.selectedFiles.length <= 1;

    this.currentUploads = [];

    if (this.oneFilePerRequest && !this.singleFile) {
      this.selectedFiles.forEach((selectedFile, inx) => {
        const xhr = new XMLHttpRequest();
        const formData = new FormData();

        // Add data to be sent in this request
        formData.append(
          this.Caption[inx] || 'file' + inx,
          this.selectedFiles[inx],
        );

        this.currentUploads.push({xhr: xhr, formData: formData, inxs: [inx]});
      });
    } else {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();

      // Add data to be sent in this request
      this.selectedFiles.forEach((selectedFile, inx) => {
        formData.append(
          this.Caption[inx] || 'file' + inx,
          this.selectedFiles[inx],
        );
      });

      this.currentUploads.push({xhr: xhr, formData: formData, inxs: this.selectedFiles.map((selectedFile, inx) => inx)});
    }

    const totalUploads = this.currentUploads.length;

    this.currentUploads.forEach((upload: UploadInfo, uploadInx) => {
      const xhr = upload.xhr;

      xhr.onreadystatechange = evnt => {
        if (xhr.readyState === 4) {
          if (xhr.status !== 200 && xhr.status !== 201) {
            isError = true;
            this.progressBarShow = false;
            this.uploadBtn = false;
            this.uploadMsg = true;
            this.afterUpload = true;
            this.uploadMsgText = this.replaceTexts.afterUploadMsg_error;
            this.uploadMsgClass = 'text-danger lead';
          }
          this.ApiResponse.emit(xhr);
          if (uploadInx + 1 === totalUploads) {
            this.everythingDone.emit(this.currentUploads);
          }
        }
      };

      xhr.upload.onprogress = evnt => {
        this.uploadBtn = false; // button should be disabled by process uploading
        if (evnt.lengthComputable) {
          const currentDone = (evnt.loaded / evnt.total);
          this.percentComplete = Math.round((uploadInx + currentDone) * 100 / totalUploads);
        }
      };

      xhr.onload = evnt => {
        this.progressBarShow = false;
        this.uploadBtn = false;
        this.uploadMsg = true;
        this.afterUpload = true;
        if (!isError) {
          if (uploadInx + 1 === totalUploads) {
            this.uploadMsgText = this.replaceTexts.afterUploadMsg_success;
            this.uploadMsgClass = 'text-success lead';
          } else {
            const nextUpload = this.currentUploads[uploadInx + 1];
            nextUpload.xhr.send(nextUpload.formData);
          }
          this.percentComplete = Math.round((uploadInx + 1) * 100 / totalUploads);
        }
      };

      xhr.open(this.method, this.uploadAPI, true);
      for (const key of Object.keys(this.headers)) {
        // Object.keys will give an Array of keys
        xhr.setRequestHeader(key, this.headers[key]);
      }
    });


    const firstUpload = this.currentUploads[0];
    firstUpload.xhr.send(firstUpload.formData);
  }

  removeFile(i: any, sf_na: any) {
    if (sf_na === 'sf') {
      this.selectedFiles.splice(i, 1);
      this.Caption.splice(i, 1);
    } else {
      this.notAllowedList.splice(i, 1);
    }

    if (this.selectedFiles.length === 0) {
      this.uploadBtn = false;
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
