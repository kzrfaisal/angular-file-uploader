import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, Inject } from '@angular/core';
@Component({
  selector: "angular-file-uploader",
  template: `<div class="container" *ngIf="(theme !== 'attachPin')" id="default">
  <div *ngIf="theme == 'dragNDrop'" id="dragNDrop" [ngClass]="(hideSelectBtn && hideResetBtn) ? null : 'dragNDropBtmPad'">
    <div style="position:relative;">
      <div id="div1" (drop)="drop($event)" (dragover)="allowDrop($event)">
        <p>Drag N Drop</p>
      </div>
      <!-- <span class='label label-info' id="upload-file-info{{id}}">{{selectedFiles[0]?.name}}</span> -->
    </div>
  </div>
    <label for="sel{{id}}" class="btn btn-primary btn-sm" *ngIf="!hideSelectBtn">Select File<span *ngIf="multiple">s</span></label>
    <input type="file" id="sel{{id}}" style="display: none" *ngIf="!hideSelectBtn" (change)="onChange($event)" title="Select file" name="files[]" [accept]=formatsAllowed
        [attr.multiple]="multiple ? '' : null" />
    <button class="btn btn-info btn-sm" (click)="resetFileUpload()" *ngIf="!hideResetBtn">Reset</button>
    <br *ngIf="!hideSelectBtn">
    <p class="constraints-info">({{formatsAllowed}}) Size limit- {{(convertSize(maxSize *1024000))}}</p>
    <!--Selected file list-->
    <div class="row" *ngFor="let sf of selectedFiles;let i=index">
        <p class="col-xs-3 textOverflow">
            <span class="text-primary">{{sf.name}}</span>
        </p>
        <p class="col-xs-3 padMarg sizeC">
            <strong>({{convertSize(sf.size)}})</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
        <!--  <input class="col-xs-3 progress caption"  type="text"  placeholder="Caption.."  [(ngModel)]="Caption[i]"  *ngIf="uploadClick"/> -->
        <div class="progress col-xs-3 padMarg" *ngIf="singleFile && progressBarShow && !hideProgressBar">
            <span class="progress-bar progress-bar-success" role="progressbar" [ngStyle]="{'width':percentComplete+'%'}">{{percentComplete}}%</span>
        </div>
        <a class="col-xs-1" role="button" (click)="removeFile(i,'sf')" *ngIf="uploadClick"><i class="fa fa-times"></i></a>
    </div>
    <!--Invalid file list-->
    <div class="row text-danger" *ngFor="let na of notAllowedList;let j=index">
        <p class="col-xs-3 textOverflow">
            <span>{{na['fileName']}}</span>
        </p>
        <p class="col-xs-3 padMarg sizeC">
            <strong>({{na['fileSize']}})</strong>
        </p>
        <p class="col-xs-3 ">{{na['errorMsg']}}</p>
        <a class="col-xs-1 delFileIcon" role="button" (click)="removeFile(j,'na')" *ngIf="uploadClick">&nbsp;<i class="fa fa-times"></i></a>
    </div>

    <p *ngIf="uploadMsg" class="{{uploadMsgClass}}">{{uploadMsgText}}<p>
    <div *ngIf="!singleFile && progressBarShow && !hideProgressBar">
        <div class="progress col-xs-4 padMarg">
            <span class="progress-bar progress-bar-success" role="progressbar" [ngStyle]="{'width':percentComplete+'%'}">{{percentComplete}}%</span>
        </div>
        <br>
        <br>
    </div>
    <button class="btn btn-success" type="button" (click)="uploadFiles()" [disabled]=!uploadBtn>{{uploadBtnText}}</button>
    <br>
</div>

<!--/////////////////////////// ATTACH PIN THEME  //////////////////////////////////////////////////////////-->
<div *ngIf="theme == 'attachPin'" id="attachPin">
    <div style="position:relative;padding-left:6px">
        <a class='btn up_btn' (click)="attachpinOnclick()">
            Attach supporting documents..
            <i class="fa fa-paperclip" aria-hidden="true"></i>
            <!-- <p style="margin-top:10px">({{formatsAllowed}}) Size limit- {{(convertSize(maxSize * 1024000))}}</p> -->
            <input type="file" id="sel{{id}}" (change)="onChange($event)" style="display: none" title="Select file" name="files[]" [accept]=formatsAllowed
                [attr.multiple]="multiple ? '' : null" />
            <br>
        </a>
        &nbsp;
        <span class='label label-info' id="upload-file-info{{id}}">{{selectedFiles[0]?.name}}</span>
    </div>
</div>

<!--/////////////////////////// DRAG N DROP THEME  //////////////////////////////////////////////////////////-->
<!-- <div *ngIf="theme == 'dragNDrop'" id="dragNDrop">
  <div style="position:relative;padding-left:6px">
    <div id="div1" (drop)="drop($event)" (dragover)="allowDrop($event)">
      <p>Drag N Drop</p>
    </div>
    <span class='label label-info' id="upload-file-info{{id}}">{{selectedFiles[0]?.name}}</span>
  </div>
</div> -->
`,
  styles: [
    `.constraints-info{
    margin-top:10px;
    font-style: italic;
}
.padMarg{
    padding: 0px;
    margin-bottom:0px;
}
.caption{
    margin-right:5px;
}
.textOverflow{
    white-space: nowrap;
    padding-right: 0;
    overflow: hidden;
    text-overflow: ellipsis;
}
.up_btn{
    color: black;
    background-color: transparent;
    border: 2px solid rgb(92, 91, 91);
    border-radius: 22px;
}
.delFileIcon{
  text-decoration: none;
  color:#ce0909;
}
/*--------------------- DRAG N DROP ----------------------*/
#dragNDrop #div1{
  display: border-box;
  border: 2px dashed rgb(92, 91, 91);
  height: 6rem;
  width: 20rem;
}
#dragNDrop #div1>p{
  text-align: center;
  font-weight: bold;
  color: rgb(92, 91, 91);
  margin-top: 1.4em;
}

.dragNDropBtmPad {
  padding-bottom: 2rem;
}
/*--------------------- X-X-X-X ----------------------*/
@media screen and (max-width: 620px){
    .caption{
        padding: 0;
    }
}
@media screen and (max-width: 510px){
    .sizeC{
        width:25%;
    }
}
@media screen and (max-width: 260px){
    .sizeC{
        font-size:10px;
    }
    .caption{
        font-size:10px;
    }
}
`
  ]
})
export class FileUploadComponent implements OnInit, OnChanges {
  @Input() config: any = {};
  @Input() resetUpload: boolean = this.config["resetUpload"];
  @Output() ApiResponse = new EventEmitter();

  theme: string;
  id: number;
  hideProgressBar: boolean;
  maxSize: number;
  uploadAPI: string;
  formatsAllowed: string;
  multiple: boolean;
  headers: any;
  hideResetBtn: boolean;
  hideSelectBtn: boolean;
  uploadBtnText: string;

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
      this.uploadBtnText = this.config["uploadBtnText"] || "Upload";
      this.maxSize = this.config["maxSize"] || 20;
      this.uploadAPI = this.config["uploadAPI"]["url"];
      this.formatsAllowed =
        this.config["formatsAllowed"] || ".jpg,.png,.pdf,.docx,.txt,.gif,.jpeg";
      this.multiple = this.config["multiple"] || false;
      this.headers = this.config["uploadAPI"]["headers"] || {};
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
    let file : FileList;
    if (event.type == "drop") {
      file = event.dataTransfer.files;
      // console.log("type: drop");
    } else {
      file = event.target.files || event.srcElement.files;
      // console.log("type: change");
    }
    // console.log(file);
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
    //console.log(this.selectedFiles);

    let i: any;
    this.progressBarShow = true;
    this.uploadClick = false;
    this.notAllowedList = [];
    let isError = false;

    let xhr = new XMLHttpRequest();
    let formData = new FormData();

    for (i = 0; i < this.selectedFiles.length; i++) {
      if (this.Caption[i] == undefined) this.Caption[i] = "file";
      //Add DATA TO BE SENT
      formData.append(
        this.Caption[i],
        this.selectedFiles[i] /*, this.selectedFiles[i].name*/
      );
      //console.log(this.selectedFiles[i]+"{"+this.Caption[i]+" (Caption)}");
    }

    if (i > 1) {
      this.singleFile = false;
    } else {
      this.singleFile = true;
    }

    xhr.onreadystatechange = evnt => {
      //console.log("onready");
      if (xhr.readyState === 4) {
        if (xhr.status !== 200) {
          isError = true;
          this.progressBarShow = false;
          this.uploadBtn = false;
          this.uploadMsg = true;
          this.afterUpload = true;
          this.uploadMsgText = "Upload Failed !";
          this.uploadMsgClass = "text-danger lead";
        }
          this.ApiResponse.emit(xhr);
      }
    };

    xhr.upload.onprogress = evnt => {
      this.uploadBtn = false; // button should be disabled by process uploading
      if (evnt.lengthComputable) {
        this.percentComplete = Math.round(evnt.loaded / evnt.total * 100);
      }
      //console.log("Progress..."/*+this.percentComplete+" %"*/);
    };

    xhr.onload = evnt => {
      //console.log("onload");
      //console.log(evnt);
      this.progressBarShow = false;
      this.uploadBtn = false;
      this.uploadMsg = true;
      this.afterUpload = true;
      if (!isError) {
        this.uploadMsgText = "Successfully Uploaded !";
        this.uploadMsgClass = "text-success lead";
        //console.log(this.uploadMsgText + " " + this.selectedFiles.length + " file");
      }
    };

    xhr.onerror = evnt => {
      //console.log("onerror");
      //console.log(evnt);
    };

    xhr.open("POST", this.uploadAPI, true);
    for (const key of Object.keys(this.headers)) {
      // Object.keys will give an Array of keys
      xhr.setRequestHeader(key, this.headers[key]);
    }
    //let token = sessionStorage.getItem("token");
    //xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
    //xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.send(formData);
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
      ? (fileSize / 1024).toFixed(2) + " KB"
      : (fileSize / 1024000).toFixed(2) + " MB";
  }

  attachpinOnclick() {
    //console.log("ID: ", this.id);
    document.getElementById("sel" + this.id)!.click();
    //$("#"+"sel"+this.id).click();
  }

  drop(event: any) {
    event.stopPropagation();
    event.preventDefault();
    // console.log("drop: ", event);
    // console.log("drop: ", event.dataTransfer.files);
    this.onChange(event);
  }
  allowDrop(event : any) {
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