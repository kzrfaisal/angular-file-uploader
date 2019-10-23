import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'angular-file-uploader',
  templateUrl: './angular-file-uploader.component.html',
  styleUrls: ['./angular-file-uploader.component.css'],
})
export class AngularFileUploaderComponent implements OnInit, OnChanges {
  @Input()
  config: any = {};
  @Input()
  resetUpload: boolean = this.config['resetUpload'];
  @Output()
  ApiResponse = new EventEmitter();

  @Output()
  everythingDone = new EventEmitter();

  theme: string;
  id: number;
  hideProgressBar: boolean;
  maxSize: number;
  uploadAPI: string;
  method: string;
  formatsAllowed: string;
  multiple: boolean;
  headers: any;
  hideResetBtn: boolean;
  hideSelectBtn: boolean;
  oneFilePerRequest: boolean;

  idDate: number = +new Date();
  reg: RegExp = /(?:\.([^.]+))?$/;
  selectedFiles: Array<any> = [];
  notAllowedList: Array<Object> = [];
  Caption: Array<string> = [];
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

  currentUploads = [];

  constructor() {
    //console.log("id: ",this.id);
    //console.log("idDate: ",this.idDate);
    //console.log(Math.random());
  }

  ngOnChanges(rst: SimpleChanges) {
    if (rst["config"]) {
      this.theme = this.config["theme"] || "";
      this.id =
        this.config["id"] ||
        parseInt((this.idDate / 10000).toString().split(".")[1]) +
          Math.floor(Math.random() * 20) * 10000;
      this.hideProgressBar = this.config["hideProgressBar"] || false;
      this.hideResetBtn = this.config["hideResetBtn"] || false;
      this.hideSelectBtn = this.config["hideSelectBtn"] || false;
      this.maxSize = this.config["maxSize"] || 20;
      this.uploadAPI = this.config["uploadAPI"]["url"];
      this.method = this.config["uploadAPI"]["method"] || "POST";
      this.formatsAllowed =
        this.config["formatsAllowed"] || ".jpg,.png,.pdf,.docx,.txt,.gif,.jpeg";
      this.multiple = this.config["multiple"] || false;
      this.headers = this.config["uploadAPI"]["headers"] || {};
      this.oneFilePerRequest = !!this.config['oneFilePerRequest'];
      let defaultReplaceTextsValues: ReplaceTexts =  {
        selectFileBtn: this.multiple ? 'Select Files' : 'Select File',
        resetBtn: 'Reset',
        uploadBtn: 'Upload',
        dragNDropBox: 'Drag N Drop',
        attachPinBtn: this.multiple ? 'Attach Files...' : 'Attach File...',
        afterUploadMsg_success: 'Successfully Uploaded !',
        afterUploadMsg_error: 'Upload Failed !'
      };
      this.replaceTexts = {...defaultReplaceTextsValues};
      if(this.config["replaceTexts"]) {
        this.replaceTexts = {
          ...defaultReplaceTextsValues,
          ...this.config['replaceTexts']
        }
      }

      //console.log("config: ", this.config);
      //console.log(this.config["maxSize"]);
      //console.log(this.headers);
      //console.log("rst: ", rst);
    }

    if (rst["resetUpload"]) {
      if (rst["resetUpload"].currentValue === true) {
        this.resetFileUpload();
      }
    }
  }

  ngOnInit() {
    //console.log("Id: ", this.id);
    this.resetUpload = false;
  }

  resetFileUpload() {
    this.selectedFiles = [];
    this.Caption = [];
    this.notAllowedList = [];
    this.uploadMsg = false;
    this.uploadBtn = false;
  }

  onChange(event: any) {
    //console.log(this.maxSize + this.formatsAllowed + this.multiple);
    this.notAllowedList = [];
    //console.log("onchange hit");
    if (this.afterUpload || !this.multiple) {
      this.selectedFiles = [];
      this.Caption = [];
      this.afterUpload = false;
    }
    //FORMATS ALLOWED LIST
    //console.log("FORMATS ALLOWED LIST= "+this.formatsAllowed);
    //NO OF FORMATS ALLOWED
    let formatsCount: any;
    formatsCount = this.formatsAllowed.match(new RegExp("\\.", "g"));
    formatsCount = formatsCount.length;
    //console.log("NO OF FORMATS ALLOWED= "+formatsCount);
    //console.log("-------------------------------");

    //ITERATE SELECTED FILES
    let file: FileList;
    if (event.type == "drop") {
      file = event.dataTransfer.files;
      //console.log("type: drop");
    } else {
      file = event.target.files || event.srcElement.files;
      //console.log("type: change");
    }
    //console.log(file);
    let currentFileExt: any;
    let ext: any;
    let frmtAllowed: boolean;
    for (let i = 0; i < file.length; i++) {
      //CHECK FORMAT
      //CURRENT FILE EXTENSION
      currentFileExt = this.reg.exec(file[i].name);
      currentFileExt = currentFileExt[1];
      //console.log(file[i].name);
      frmtAllowed = false;
      //FORMAT ALLOWED LIST ITERATE
      for (let j = formatsCount; j > 0; j--) {
        ext = this.formatsAllowed.split(".")[j];
        //console.log("FORMAT LIST ("+j+")= "+ext.split(",")[0]);
        if (j == formatsCount) {
          ext = this.formatsAllowed.split(".")[j] + ",";
        } //check format
        if (currentFileExt.toLowerCase() == ext.split(",")[0]) {
          frmtAllowed = true;
        }
      }

      if (frmtAllowed) {
        //console.log("FORMAT ALLOWED");
        //CHECK SIZE
        if (file[i].size > this.maxSize * 1024000) {
          //console.log("SIZE NOT ALLOWED ("+file[i].size+")");
          this.notAllowedList.push({
            fileName: file[i].name,
            fileSize: this.convertSize(file[i].size),
            errorMsg: "Invalid size"
          });
          continue;
        } else {
          //format allowed and size allowed then add file to selectedFile array
          this.selectedFiles.push(file[i]);
        }
      } else {
        //console.log("FORMAT NOT ALLOWED");
        this.notAllowedList.push({
          fileName: file[i].name,
          fileSize: this.convertSize(file[i].size),
          errorMsg: "Invalid format"
        });
        continue;
      }
    }

    if (this.selectedFiles.length !== 0) {
      this.uploadBtn = true;
      if (this.theme == "attachPin") this.uploadFiles();
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

      this.currentUploads.push({xhr: xhr, formData: formData, inxs: this.selectedFiles.map((selectedFile, inx) => inx), response: null});
    }

    const totalUploads = this.currentUploads.length;

    this.currentUploads.forEach((upload, uploadInx) => {
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
    //console.log("remove file clicked " + i)
    if (sf_na == "sf") {
      this.selectedFiles.splice(i, 1);
      this.Caption.splice(i, 1);
    } else {
      this.notAllowedList.splice(i, 1);
    }

    if (this.selectedFiles.length == 0) {
      this.uploadBtn = false;
    }
  }

  convertSize(fileSize: number) {
    //console.log(fileSize + " - "+ str);
    return fileSize < 1024000
      ? (fileSize / 1024).toFixed(2) + ' KB'
      : (fileSize / 1024000).toFixed(2) + ' MB';
  }

  attachpinOnclick() {
    //console.log("ID: ", this.id);
    document.getElementById("sel" + this.id)!.click();
    //$("#"+"sel"+this.id).click();
  }

  drop(event: any) {
    event.stopPropagation();
    event.preventDefault();
    //console.log("drop: ", event);
    //console.log("drop: ", event.dataTransfer.files);
    this.onChange(event);
  }
  allowDrop(event: any) {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    //console.log("allowDrop: ",event)
  }
}

/* interface CONFIG {
  uploadAPI: string;
  multiple?: boolean;
  formatsAllowed?: string;
  maxSize?: number;
  id?: number;
  resetUpload?: boolean;
  theme?: string;
  hideProgressBar?: boolean;
 }
 */

 interface ReplaceTexts {
  selectFileBtn: string,
  resetBtn: string,
  uploadBtn: string,
  dragNDropBox: string,
  attachPinBtn: string,
  afterUploadMsg_success: string,
  afterUploadMsg_error: string,
};
