/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';
export class AngularFileUploaderComponent {
    constructor() {
        //console.log("id: ",this.id);
        //console.log("idDate: ",this.idDate);
        //console.log(Math.random());
        this.config = {};
        this.resetUpload = this.config["resetUpload"];
        this.ApiResponse = new EventEmitter();
        this.idDate = +new Date();
        this.reg = /(?:\.([^.]+))?$/;
        this.selectedFiles = [];
        this.notAllowedList = [];
        this.Caption = [];
        this.singleFile = true;
        this.progressBarShow = false;
        this.uploadBtn = false;
        this.uploadMsg = false;
        this.afterUpload = false;
        this.uploadClick = true;
    }
    /**
     * @param {?} rst
     * @return {?}
     */
    ngOnChanges(rst) {
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
            this.attachPinText =
                this.config["attachPinText"] || "Attach supporting documents..";
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
    /**
     * @return {?}
     */
    ngOnInit() {
        //console.log("Id: ", this.id);
        this.resetUpload = false;
    }
    /**
     * @return {?}
     */
    resetFileUpload() {
        this.selectedFiles = [];
        this.Caption = [];
        this.notAllowedList = [];
        this.uploadMsg = false;
        this.uploadBtn = false;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onChange(event) {
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
        let /** @type {?} */ formatsCount;
        formatsCount = this.formatsAllowed.match(new RegExp("\\.", "g"));
        formatsCount = formatsCount.length;
        //console.log("NO OF FORMATS ALLOWED= "+formatsCount);
        //console.log("-------------------------------");
        //ITERATE SELECTED FILES
        let /** @type {?} */ file;
        if (event.type == "drop") {
            file = event.dataTransfer.files;
            //console.log("type: drop");
        }
        else {
            file = event.target.files || event.srcElement.files;
            //console.log("type: change");
        }
        //console.log(file);
        let /** @type {?} */ currentFileExt;
        let /** @type {?} */ ext;
        let /** @type {?} */ frmtAllowed;
        for (let /** @type {?} */ i = 0; i < file.length; i++) {
            //CHECK FORMAT
            //CURRENT FILE EXTENSION
            currentFileExt = this.reg.exec(file[i].name);
            currentFileExt = currentFileExt[1];
            //console.log(file[i].name);
            frmtAllowed = false;
            //FORMAT ALLOWED LIST ITERATE
            for (let /** @type {?} */ j = formatsCount; j > 0; j--) {
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
                }
                else {
                    //format allowed and size allowed then add file to selectedFile array
                    this.selectedFiles.push(file[i]);
                }
            }
            else {
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
            if (this.theme == "attachPin")
                this.uploadFiles();
        }
        else {
            this.uploadBtn = false;
        }
        this.uploadMsg = false;
        this.uploadClick = true;
        this.percentComplete = 0;
        event.target.value = null;
    }
    /**
     * @return {?}
     */
    uploadFiles() {
        //console.log(this.selectedFiles);
        let /** @type {?} */ i;
        this.progressBarShow = true;
        this.uploadClick = false;
        this.notAllowedList = [];
        let /** @type {?} */ isError = false;
        let /** @type {?} */ xhr = new XMLHttpRequest();
        let /** @type {?} */ formData = new FormData();
        for (i = 0; i < this.selectedFiles.length; i++) {
            if (this.Caption[i] == undefined)
                this.Caption[i] = "file";
            //Add DATA TO BE SENT
            formData.append(this.Caption[i], this.selectedFiles[i] /*, this.selectedFiles[i].name*/);
            //console.log(this.selectedFiles[i]+"{"+this.Caption[i]+" (Caption)}");
        }
        if (i > 1) {
            this.singleFile = false;
        }
        else {
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
                    //console.log(this.uploadMsgText);
                    //console.log(evnt);
                }
                this.ApiResponse.emit(xhr);
            }
        };
        xhr.upload.onprogress = evnt => {
            this.uploadBtn = false; // button should be disabled by process uploading
            if (evnt.lengthComputable) {
                this.percentComplete = Math.round((evnt.loaded / evnt.total) * 100);
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
        for (const /** @type {?} */ key of Object.keys(this.headers)) {
            // Object.keys will give an Array of keys
            xhr.setRequestHeader(key, this.headers[key]);
        }
        //let token = sessionStorage.getItem("token");
        //xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
        //xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.send(formData);
    }
    /**
     * @param {?} i
     * @param {?} sf_na
     * @return {?}
     */
    removeFile(i, sf_na) {
        //console.log("remove file clicked " + i)
        if (sf_na == "sf") {
            this.selectedFiles.splice(i, 1);
            this.Caption.splice(i, 1);
        }
        else {
            this.notAllowedList.splice(i, 1);
        }
        if (this.selectedFiles.length == 0) {
            this.uploadBtn = false;
        }
    }
    /**
     * @param {?} fileSize
     * @return {?}
     */
    convertSize(fileSize) {
        //console.log(fileSize + " - "+ str);
        return fileSize < 1024000
            ? (fileSize / 1024).toFixed(2) + " KB"
            : (fileSize / 1024000).toFixed(2) + " MB";
    }
    /**
     * @return {?}
     */
    attachpinOnclick() {
        /** @type {?} */ ((
        //console.log("ID: ", this.id);
        document.getElementById("sel" + this.id))).click();
        //$("#"+"sel"+this.id).click();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    drop(event) {
        event.stopPropagation();
        event.preventDefault();
        //console.log("drop: ", event);
        //console.log("drop: ", event.dataTransfer.files);
        this.onChange(event);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    allowDrop(event) {
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
        //console.log("allowDrop: ",event)
    }
}
AngularFileUploaderComponent.decorators = [
    { type: Component, args: [{
                selector: "angular-file-uploader",
                template: `<div class="container" *ngIf="(theme !== 'attachPin')" id="default">

    <!-- Drag n Drop theme Starts -->
    <div *ngIf="theme == 'dragNDrop'" id="dragNDrop" [ngClass]="(hideSelectBtn && hideResetBtn) ? null : 'dragNDropBtmPad'" class="dragNDrop">
        <div style="position:relative;">
            <div id="div1" class="div1 afu-dragndrop-box" (drop)="drop($event)" (dragover)="allowDrop($event)">
                <p class="afu-dragndrop-text">Drag N Drop</p>
            </div>
            <!-- <span class='label label-info' id="upload-file-info{{id}}">{{selectedFiles[0]?.name}}</span> -->
        </div>
    </div>
    <!-- Drag n Drop theme Ends -->

    <label for="sel{{id}}" class="btn btn-primary btn-sm afu-select-btn" *ngIf="!hideSelectBtn">Select File<span *ngIf="multiple">s</span></label>
    <input type="file" id="sel{{id}}" style="display: none" *ngIf="!hideSelectBtn" (change)="onChange($event)" title="Select file"
        name="files[]" [accept]=formatsAllowed [attr.multiple]="multiple ? '' : null" />
    <button class="btn btn-info btn-sm resetBtn afu-reset-btn" (click)="resetFileUpload()" *ngIf="!hideResetBtn">Reset</button>
    <br *ngIf="!hideSelectBtn">
    <p class="constraints-info afu-constraints-info">({{formatsAllowed}}) Size limit- {{(convertSize(maxSize *1024000))}}</p>
    <!--Selected file list-->
    <div class="row afu-valid-file" *ngFor="let sf of selectedFiles;let i=index" >
        <p class="col-xs-3 textOverflow"><span class="text-primary">{{sf.name}}</span></p>
        <p class="col-xs-3 padMarg sizeC"><strong>({{convertSize(sf.size)}})</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
        <!--  <input class="col-xs-3 progress caption"  type="text"  placeholder="Caption.."  [(ngModel)]="Caption[i]"  *ngIf="uploadClick"/> -->
        <div class="progress col-xs-3 padMarg afu-progress-bar" *ngIf="singleFile && progressBarShow && !hideProgressBar">
            <span class="progress-bar progress-bar-success" role="progressbar" [ngStyle]="{'width':percentComplete+'%'}">{{percentComplete}}%</span>
        </div>
        <a class="col-xs-1" role="button" (click)="removeFile(i,'sf')" *ngIf="uploadClick"><i class="fa fa-times"></i></a>
    </div>
    <!--Invalid file list-->
    <div class="row text-danger afu-invalid-file" *ngFor="let na of notAllowedList;let j=index">
        <p class="col-xs-3 textOverflow"><span>{{na['fileName']}}</span></p>
        <p class="col-xs-3 padMarg sizeC"><strong>({{na['fileSize']}})</strong></p>
        <p class="col-xs-3 ">{{na['errorMsg']}}</p>
        <a class="col-xs-1 delFileIcon" role="button" (click)="removeFile(j,'na')" *ngIf="uploadClick">&nbsp;<i class="fa fa-times"></i></a>
    </div>

    <p *ngIf="uploadMsg" class="{{uploadMsgClass}} + afu-upload-status">{{uploadMsgText}}<p>
    <div *ngIf="!singleFile && progressBarShow && !hideProgressBar">
        <div class="progress col-xs-4 padMarg afu-progress-bar">
            <span class="progress-bar progress-bar-success" role="progressbar" [ngStyle]="{'width':percentComplete+'%'}">{{percentComplete}}%</span>
        </div>
        <br>
        <br>
    </div>
    <button class="btn btn-success afu-upload-btn" type="button" (click)="uploadFiles()" [disabled]=!uploadBtn>{{uploadBtnText}}</button>
    <br>
</div>

<!--/////////////////////////// ATTACH PIN THEME  //////////////////////////////////////////////////////////-->
<div *ngIf="theme == 'attachPin'" id="attachPin">
    <div style="position:relative;padding-left:6px">
        <a class='btn up_btn afu-attach-pin' (click)="attachpinOnclick()">
            {{attachPinText}}
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
</div> -->`,
                styles: [`.constraints-info{margin-top:10px;font-style:italic}.padMarg{padding:0;margin-bottom:0}.caption{margin-right:5px}.textOverflow{white-space:nowrap;padding-right:0;overflow:hidden;text-overflow:ellipsis}.up_btn{color:#000;background-color:transparent;border:2px solid #5c5b5b;border-radius:22px}.delFileIcon{text-decoration:none;color:#ce0909}.dragNDrop .div1{display:border-box;border:2px dashed #5c5b5b;height:6rem;width:20rem}.dragNDrop .div1>p{text-align:center;font-weight:700;color:#5c5b5b;margin-top:1.4em}.dragNDropBtmPad{padding-bottom:2rem}@media screen and (max-width:620px){.caption{padding:0}}@media screen and (max-width:510px){.sizeC{width:25%}}@media screen and (max-width:260px){.caption,.sizeC{font-size:10px}}.resetBtn{margin-left:3px}`]
            },] },
];
/** @nocollapse */
AngularFileUploaderComponent.ctorParameters = () => [];
AngularFileUploaderComponent.propDecorators = {
    config: [{ type: Input }],
    resetUpload: [{ type: Input }],
    ApiResponse: [{ type: Output }]
};
function AngularFileUploaderComponent_tsickle_Closure_declarations() {
    /** @type {?} */
    AngularFileUploaderComponent.prototype.config;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.resetUpload;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.ApiResponse;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.theme;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.id;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.hideProgressBar;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.maxSize;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.uploadAPI;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.formatsAllowed;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.multiple;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.headers;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.hideResetBtn;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.hideSelectBtn;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.attachPinText;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.uploadBtnText;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.idDate;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.reg;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.selectedFiles;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.notAllowedList;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.Caption;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.singleFile;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.progressBarShow;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.uploadBtn;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.uploadMsg;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.afterUpload;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.uploadClick;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.uploadMsgText;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.uploadMsgClass;
    /** @type {?} */
    AngularFileUploaderComponent.prototype.percentComplete;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1maWxlLXVwbG9hZGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItZmlsZS11cGxvYWRlci8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWZpbGUtdXBsb2FkZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFVLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUF1RCxNQUFNLGVBQWUsQ0FBQztBQStFcEksTUFBTTtJQW9DSjs7OztzQkFsQ2MsRUFBRTsyQkFFTyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQzsyQkFFbkMsSUFBSSxZQUFZLEVBQUU7c0JBZWYsQ0FBQyxJQUFJLElBQUksRUFBRTttQkFDZCxpQkFBaUI7NkJBQ0gsRUFBRTs4QkFDRSxFQUFFO3VCQUNULEVBQUU7MEJBQ2QsSUFBSTsrQkFDQyxLQUFLO3lCQUNYLEtBQUs7eUJBQ0wsS0FBSzsyQkFDSCxLQUFLOzJCQUNMLElBQUk7S0FTakI7Ozs7O0lBRUQsV0FBVyxDQUFDLEdBQWtCO1FBQzVCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUN4QyxJQUFJLENBQUMsRUFBRTtnQkFDTCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztvQkFDakIsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3RELElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUMzQyxJQUFJLENBQUMs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O0lBRUQsV0FBVyxDQUFDLFFBQWdCOztRQUUxQixNQUFNLENBQUMsUUFBUSxHQUFHLE9BQU87WUFDdkIsQ0FBQyxDQUFDLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLO1lBQ3RDLENBQUMsQ0FBQyxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO0tBQzdDOzs7O0lBRUQsZ0JBQWdCOzs7UUFFZCxRQUFRLENBQUMsY0FBYyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUUsS0FBSzs7S0FFaEQ7Ozs7O0lBRUQsSUFBSSxDQUFDLEtBQVU7UUFDYixLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDeEIsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDOzs7UUFHdkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUN0Qjs7Ozs7SUFDRCxTQUFTLENBQUMsS0FBVTtRQUNsQixLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDeEIsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3ZCLEtBQUssQ0FBQyxZQUFZLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQzs7S0FFeEM7OztZQXhYRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHVCQUF1QjtnQkFDakMsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1dBeUVEO2dCQUNULE1BQU0sRUFBRSxDQUFDLGt2QkFBa3ZCLENBQUM7YUFDN3ZCOzs7OztxQkFFRSxLQUFLOzBCQUVMLEtBQUs7MEJBRUwsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIE9uQ2hhbmdlcywgU2ltcGxlQ2hhbmdlcywgSW5qZWN0LCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiBcImFuZ3VsYXItZmlsZS11cGxvYWRlclwiLFxuICB0ZW1wbGF0ZTogYDxkaXYgY2xhc3M9XCJjb250YWluZXJcIiAqbmdJZj1cIih0aGVtZSAhPT0gJ2F0dGFjaFBpbicpXCIgaWQ9XCJkZWZhdWx0XCI+XHJcblxyXG4gICAgPCEtLSBEcmFnIG4gRHJvcCB0aGVtZSBTdGFydHMgLS0+XHJcbiAgICA8ZGl2ICpuZ0lmPVwidGhlbWUgPT0gJ2RyYWdORHJvcCdcIiBpZD1cImRyYWdORHJvcFwiIFtuZ0NsYXNzXT1cIihoaWRlU2VsZWN0QnRuICYmIGhpZGVSZXNldEJ0bikgPyBudWxsIDogJ2RyYWdORHJvcEJ0bVBhZCdcIiBjbGFzcz1cImRyYWdORHJvcFwiPlxyXG4gICAgICAgIDxkaXYgc3R5bGU9XCJwb3NpdGlvbjpyZWxhdGl2ZTtcIj5cclxuICAgICAgICAgICAgPGRpdiBpZD1cImRpdjFcIiBjbGFzcz1cImRpdjEgYWZ1LWRyYWduZHJvcC1ib3hcIiAoZHJvcCk9XCJkcm9wKCRldmVudClcIiAoZHJhZ292ZXIpPVwiYWxsb3dEcm9wKCRldmVudClcIj5cclxuICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwiYWZ1LWRyYWduZHJvcC10ZXh0XCI+RHJhZyBOIERyb3A8L3A+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8IS0tIDxzcGFuIGNsYXNzPSdsYWJlbCBsYWJlbC1pbmZvJyBpZD1cInVwbG9hZC1maWxlLWluZm97e2lkfX1cIj57e3NlbGVjdGVkRmlsZXNbMF0/Lm5hbWV9fTwvc3Bhbj4gLS0+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICAgIDwhLS0gRHJhZyBuIERyb3AgdGhlbWUgRW5kcyAtLT5cclxuXHJcbiAgICA8bGFiZWwgZm9yPVwic2Vse3tpZH19XCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnkgYnRuLXNtIGFmdS1zZWxlY3QtYnRuXCIgKm5nSWY9XCIhaGlkZVNlbGVjdEJ0blwiPlNlbGVjdCBGaWxlPHNwYW4gKm5nSWY9XCJtdWx0aXBsZVwiPnM8L3NwYW4+PC9sYWJlbD5cclxuICAgIDxpbnB1dCB0eXBlPVwiZmlsZVwiIGlkPVwic2Vse3tpZH19XCIgc3R5bGU9XCJkaXNwbGF5OiBub25lXCIgKm5nSWY9XCIhaGlkZVNlbGVjdEJ0blwiIChjaGFuZ2UpPVwib25DaGFuZ2UoJGV2ZW50KVwiIHRpdGxlPVwiU2VsZWN0IGZpbGVcIlxyXG4gICAgICAgIG5hbWU9XCJmaWxlc1tdXCIgW2FjY2VwdF09Zm9ybWF0c0FsbG93ZWQgW2F0dHIubXVsdGlwbGVdPVwibXVsdGlwbGUgPyAnJyA6IG51bGxcIiAvPlxyXG4gICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4taW5mbyBidG4tc20gcmVzZXRCdG4gYWZ1LXJlc2V0LWJ0blwiIChjbGljayk9XCJyZXNldEZpbGVVcGxvYWQoKVwiICpuZ0lmPVwiIWhpZGVSZXNldEJ0blwiPlJlc2V0PC9idXR0b24+XHJcbiAgICA8YnIgKm5nSWY9XCIhaGlkZVNlbGVjdEJ0blwiPlxyXG4gICAgPHAgY2xhc3M9XCJjb25zdHJhaW50cy1pbmZvIGFmdS1jb25zdHJhaW50cy1pbmZvXCI+KHt7Zm9ybWF0c0FsbG93ZWR9fSkgU2l6ZSBsaW1pdC0ge3soY29udmVydFNpemUobWF4U2l6ZSAqMTAyNDAwMCkpfX08L3A+XHJcbiAgICA8IS0tU2VsZWN0ZWQgZmlsZSBsaXN0LS0+XHJcbiAgICA8ZGl2IGNsYXNzPVwicm93IGFmdS12YWxpZC1maWxlXCIgKm5nRm9yPVwibGV0IHNmIG9mIHNlbGVjdGVkRmlsZXM7bGV0IGk9aW5kZXhcIiA+XHJcbiAgICAgICAgPHAgY2xhc3M9XCJjb2wteHMtMyB0ZXh0T3ZlcmZsb3dcIj48c3BhbiBjbGFzcz1cInRleHQtcHJpbWFyeVwiPnt7c2YubmFtZX19PC9zcGFuPjwvcD5cclxuICAgICAgICA8cCBjbGFzcz1cImNvbC14cy0zIHBhZE1hcmcgc2l6ZUNcIj48c3Ryb25nPih7e2NvbnZlcnRTaXplKHNmLnNpemUpfX0pPC9zdHJvbmc+Jm5ic3A7Jm5ic3A7Jm5ic3A7Jm5ic3A7Jm5ic3A7PC9wPlxyXG4gICAgICAgIDwhLS0gIDxpbnB1dCBjbGFzcz1cImNvbC14cy0zIHByb2dyZXNzIGNhcHRpb25cIiAgdHlwZT1cInRleHRcIiAgcGxhY2Vob2xkZXI9XCJDYXB0aW9uLi5cIiAgWyhuZ01vZGVsKV09XCJDYXB0aW9uW2ldXCIgICpuZ0lmPVwidXBsb2FkQ2xpY2tcIi8+IC0tPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzcyBjb2wteHMtMyBwYWRNYXJnIGFmdS1wcm9ncmVzcy1iYXJcIiAqbmdJZj1cInNpbmdsZUZpbGUgJiYgcHJvZ3Jlc3NCYXJTaG93ICYmICFoaWRlUHJvZ3Jlc3NCYXJcIj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwcm9ncmVzcy1iYXIgcHJvZ3Jlc3MtYmFyLXN1Y2Nlc3NcIiByb2xlPVwicHJvZ3Jlc3NiYXJcIiBbbmdTdHlsZV09XCJ7J3dpZHRoJzpwZXJjZW50Q29tcGxldGUrJyUnfVwiPnt7cGVyY2VudENvbXBsZXRlfX0lPC9zcGFuPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxhIGNsYXNzPVwiY29sLXhzLTFcIiByb2xlPVwiYnV0dG9uXCIgKGNsaWNrKT1cInJlbW92ZUZpbGUoaSwnc2YnKVwiICpuZ0lmPVwidXBsb2FkQ2xpY2tcIj48aSBjbGFzcz1cImZhIGZhLXRpbWVzXCI+PC9pPjwvYT5cclxuICAgIDwvZGl2PlxyXG4gICAgPCEtLUludmFsaWQgZmlsZSBsaXN0LS0+XHJcbiAgICA8ZGl2IGNsYXNzPVwicm93IHRleHQtZGFuZ2VyIGFmdS1pbnZhbGlkLWZpbGVcIiAqbmdGb3I9XCJsZXQgbmEgb2Ygbm90QWxsb3dlZExpc3Q7bGV0IGo9aW5kZXhcIj5cclxuICAgICAgICA8cCBjbGFzcz1cImNvbC14cy0zIHRleHRPdmVyZmxvd1wiPjxzcGFuPnt7bmFbJ2ZpbGVOYW1lJ119fTwvc3Bhbj48L3A+XHJcbiAgICAgICAgPHAgY2xhc3M9XCJjb2wteHMtMyBwYWRNYXJnIHNpemVDXCI+PHN0cm9uZz4oe3tuYVsnZmlsZVNpemUnXX19KTwvc3Ryb25nPjwvcD5cclxuICAgICAgICA8cCBjbGFzcz1cImNvbC14cy0zIFwiPnt7bmFbJ2Vycm9yTXNnJ119fTwvcD5cclxuICAgICAgICA8YSBjbGFzcz1cImNvbC14cy0xIGRlbEZpbGVJY29uXCIgcm9sZT1cImJ1dHRvblwiIChjbGljayk9XCJyZW1vdmVGaWxlKGosJ25hJylcIiAqbmdJZj1cInVwbG9hZENsaWNrXCI+Jm5ic3A7PGkgY2xhc3M9XCJmYSBmYS10aW1lc1wiPjwvaT48L2E+XHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICA8cCAqbmdJZj1cInVwbG9hZE1zZ1wiIGNsYXNzPVwie3t1cGxvYWRNc2dDbGFzc319ICsgYWZ1LXVwbG9hZC1zdGF0dXNcIj57e3VwbG9hZE1zZ1RleHR9fTxwPlxyXG4gICAgPGRpdiAqbmdJZj1cIiFzaW5nbGVGaWxlICYmIHByb2dyZXNzQmFyU2hvdyAmJiAhaGlkZVByb2dyZXNzQmFyXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzIGNvbC14cy00IHBhZE1hcmcgYWZ1LXByb2dyZXNzLWJhclwiPlxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInByb2dyZXNzLWJhciBwcm9ncmVzcy1iYXItc3VjY2Vzc1wiIHJvbGU9XCJwcm9ncmVzc2JhclwiIFtuZ1N0eWxlXT1cInsnd2lkdGgnOnBlcmNlbnRDb21wbGV0ZSsnJSd9XCI+e3twZXJjZW50Q29tcGxldGV9fSU8L3NwYW4+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGJyPlxyXG4gICAgICAgIDxicj5cclxuICAgIDwvZGl2PlxyXG4gICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tc3VjY2VzcyBhZnUtdXBsb2FkLWJ0blwiIHR5cGU9XCJidXR0b25cIiAoY2xpY2spPVwidXBsb2FkRmlsZXMoKVwiIFtkaXNhYmxlZF09IXVwbG9hZEJ0bj57e3VwbG9hZEJ0blRleHR9fTwvYnV0dG9uPlxyXG4gICAgPGJyPlxyXG48L2Rpdj5cclxuXHJcbjwhLS0vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8gQVRUQUNIIFBJTiBUSEVNRSAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy0tPlxyXG48ZGl2ICpuZ0lmPVwidGhlbWUgPT0gJ2F0dGFjaFBpbidcIiBpZD1cImF0dGFjaFBpblwiPlxyXG4gICAgPGRpdiBzdHlsZT1cInBvc2l0aW9uOnJlbGF0aXZlO3BhZGRpbmctbGVmdDo2cHhcIj5cclxuICAgICAgICA8YSBjbGFzcz0nYnRuIHVwX2J0biBhZnUtYXR0YWNoLXBpbicgKGNsaWNrKT1cImF0dGFjaHBpbk9uY2xpY2soKVwiPlxyXG4gICAgICAgICAgICB7e2F0dGFjaFBpblRleHR9fVxyXG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXBhcGVyY2xpcFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cclxuICAgICAgICAgICAgPCEtLSA8cCBzdHlsZT1cIm1hcmdpbi10b3A6MTBweFwiPih7e2Zvcm1hdHNBbGxvd2VkfX0pIFNpemUgbGltaXQtIHt7KGNvbnZlcnRTaXplKG1heFNpemUgKiAxMDI0MDAwKSl9fTwvcD4gLS0+XHJcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiZmlsZVwiIGlkPVwic2Vse3tpZH19XCIgKGNoYW5nZSk9XCJvbkNoYW5nZSgkZXZlbnQpXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lXCIgdGl0bGU9XCJTZWxlY3QgZmlsZVwiIG5hbWU9XCJmaWxlc1tdXCIgW2FjY2VwdF09Zm9ybWF0c0FsbG93ZWRcclxuICAgICAgICAgICAgICAgIFthdHRyLm11bHRpcGxlXT1cIm11bHRpcGxlID8gJycgOiBudWxsXCIgLz5cclxuICAgICAgICAgICAgPGJyPlxyXG4gICAgICAgIDwvYT5cclxuICAgICAgICAmbmJzcDtcclxuICAgICAgICA8c3BhbiBjbGFzcz0nbGFiZWwgbGFiZWwtaW5mbycgaWQ9XCJ1cGxvYWQtZmlsZS1pbmZve3tpZH19XCI+e3tzZWxlY3RlZEZpbGVzWzBdPy5uYW1lfX08L3NwYW4+XHJcbiAgICA8L2Rpdj5cclxuPC9kaXY+XHJcblxyXG48IS0tLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vIERSQUcgTiBEUk9QIFRIRU1FICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLS0+XHJcbjwhLS0gPGRpdiAqbmdJZj1cInRoZW1lID09ICdkcmFnTkRyb3AnXCIgaWQ9XCJkcmFnTkRyb3BcIj5cclxuICA8ZGl2IHN0eWxlPVwicG9zaXRpb246cmVsYXRpdmU7cGFkZGluZy1sZWZ0OjZweFwiPlxyXG4gICAgPGRpdiBpZD1cImRpdjFcIiAoZHJvcCk9XCJkcm9wKCRldmVudClcIiAoZHJhZ292ZXIpPVwiYWxsb3dEcm9wKCRldmVudClcIj5cclxuICAgICAgPHA+RHJhZyBOIERyb3A8L3A+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxzcGFuIGNsYXNzPSdsYWJlbCBsYWJlbC1pbmZvJyBpZD1cInVwbG9hZC1maWxlLWluZm97e2lkfX1cIj57e3NlbGVjdGVkRmlsZXNbMF0/Lm5hbWV9fTwvc3Bhbj5cclxuICA8L2Rpdj5cclxuPC9kaXY+IC0tPmAgLFxuICBzdHlsZXM6IFtgLmNvbnN0cmFpbnRzLWluZm97bWFyZ2luLXRvcDoxMHB4O2ZvbnQtc3R5bGU6aXRhbGljfS5wYWRNYXJne3BhZGRpbmc6MDttYXJnaW4tYm90dG9tOjB9LmNhcHRpb257bWFyZ2luLXJpZ2h0OjVweH0udGV4dE92ZXJmbG93e3doaXRlLXNwYWNlOm5vd3JhcDtwYWRkaW5nLXJpZ2h0OjA7b3ZlcmZsb3c6aGlkZGVuO3RleHQtb3ZlcmZsb3c6ZWxsaXBzaXN9LnVwX2J0bntjb2xvcjojMDAwO2JhY2tncm91bmQtY29sb3I6dHJhbnNwYXJlbnQ7Ym9yZGVyOjJweCBzb2xpZCAjNWM1YjViO2JvcmRlci1yYWRpdXM6MjJweH0uZGVsRmlsZUljb257dGV4dC1kZWNvcmF0aW9uOm5vbmU7Y29sb3I6I2NlMDkwOX0uZHJhZ05Ecm9wIC5kaXYxe2Rpc3BsYXk6Ym9yZGVyLWJveDtib3JkZXI6MnB4IGRhc2hlZCAjNWM1YjViO2hlaWdodDo2cmVtO3dpZHRoOjIwcmVtfS5kcmFnTkRyb3AgLmRpdjE+cHt0ZXh0LWFsaWduOmNlbnRlcjtmb250LXdlaWdodDo3MDA7Y29sb3I6IzVjNWI1YjttYXJnaW4tdG9wOjEuNGVtfS5kcmFnTkRyb3BCdG1QYWR7cGFkZGluZy1ib3R0b206MnJlbX1AbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOjYyMHB4KXsuY2FwdGlvbntwYWRkaW5nOjB9fUBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6NTEwcHgpey5zaXplQ3t3aWR0aDoyNSV9fUBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6MjYwcHgpey5jYXB0aW9uLC5zaXplQ3tmb250LXNpemU6MTBweH19LnJlc2V0QnRue21hcmdpbi1sZWZ0OjNweH1gXVxufSlcbmV4cG9ydCBjbGFzcyBBbmd1bGFyRmlsZVVwbG9hZGVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xuICBASW5wdXQoKVxuICBjb25maWc6IGFueSA9IHt9O1xuICBASW5wdXQoKVxuICByZXNldFVwbG9hZDogYm9vbGVhbiA9IHRoaXMuY29uZmlnW1wicmVzZXRVcGxvYWRcIl07XG4gIEBPdXRwdXQoKVxuICBBcGlSZXNwb25zZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICB0aGVtZTogc3RyaW5nO1xuICBpZDogbnVtYmVyO1xuICBoaWRlUHJvZ3Jlc3NCYXI6IGJvb2xlYW47XG4gIG1heFNpemU6IG51bWJlcjtcbiAgdXBsb2FkQVBJOiBzdHJpbmc7XG4gIGZvcm1hdHNBbGxvd2VkOiBzdHJpbmc7XG4gIG11bHRpcGxlOiBib29sZWFuO1xuICBoZWFkZXJzOiBhbnk7XG4gIGhpZGVSZXNldEJ0bjogYm9vbGVhbjtcbiAgaGlkZVNlbGVjdEJ0bjogYm9vbGVhbjtcbiAgYXR0YWNoUGluVGV4dDogc3RyaW5nO1xuICB1cGxvYWRCdG5UZXh0OiBzdHJpbmc7XG5cbiAgaWREYXRlOiBudW1iZXIgPSArbmV3IERhdGUoKTtcbiAgcmVnOiBSZWdFeHAgPSAvKD86XFwuKFteLl0rKSk/JC87XG4gIHNlbGVjdGVkRmlsZXM6IEFycmF5PGFueT4gPSBbXTtcbiAgbm90QWxsb3dlZExpc3Q6IEFycmF5PE9iamVjdD4gPSBbXTtcbiAgQ2FwdGlvbjogQXJyYXk8c3RyaW5nPiA9IFtdO1xuICBzaW5nbGVGaWxlID0gdHJ1ZTtcbiAgcHJvZ3Jlc3NCYXJTaG93ID0gZmFsc2U7XG4gIHVwbG9hZEJ0biA9IGZhbHNlO1xuICB1cGxvYWRNc2cgPSBmYWxzZTtcbiAgYWZ0ZXJVcGxvYWQgPSBmYWxzZTtcbiAgdXBsb2FkQ2xpY2sgPSB0cnVlO1xuICB1cGxvYWRNc2dUZXh0OiBzdHJpbmc7XG4gIHVwbG9hZE1zZ0NsYXNzOiBzdHJpbmc7XG4gIHBlcmNlbnRDb21wbGV0ZTogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIC8vY29uc29sZS5sb2coXCJpZDogXCIsdGhpcy5pZCk7XG4gICAgLy9jb25zb2xlLmxvZyhcImlkRGF0ZTogXCIsdGhpcy5pZERhdGUpO1xuICAgIC8vY29uc29sZS5sb2coTWF0aC5yYW5kb20oKSk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhyc3Q6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAocnN0W1wiY29uZmlnXCJdKSB7XG4gICAgICB0aGlzLnRoZW1lID0gdGhpcy5jb25maWdbXCJ0aGVtZVwiXSB8fCBcIlwiO1xuICAgICAgdGhpcy5pZCA9XG4gICAgICAgIHRoaXMuY29uZmlnW1wiaWRcIl0gfHxcbiAgICAgICAgcGFyc2VJbnQoKHRoaXMuaWREYXRlIC8gMTAwMDApLnRvU3RyaW5nKCkuc3BsaXQoXCIuXCIpWzFdKSArXG4gICAgICAgICAgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMjApICogMTAwMDA7XG4gICAgICB0aGlzLmhpZGVQcm9ncmVzc0JhciA9IHRoaXMuY29uZmlnW1wiaGlkZVByb2dyZXNzQmFyXCJdIHx8IGZhbHNlO1xuICAgICAgdGhpcy5oaWRlUmVzZXRCdG4gPSB0aGlzLmNvbmZpZ1tcImhpZGVSZXNldEJ0blwiXSB8fCBmYWxzZTtcbiAgICAgIHRoaXMuaGlkZVNlbGVjdEJ0biA9IHRoaXMuY29uZmlnW1wiaGlkZVNlbGVjdEJ0blwiXSB8fCBmYWxzZTtcbiAgICAgIHRoaXMudXBsb2FkQnRuVGV4dCA9IHRoaXMuY29uZmlnW1widXBsb2FkQnRuVGV4dFwiXSB8fCBcIlVwbG9hZFwiO1xuICAgICAgdGhpcy5tYXhTaXplID0gdGhpcy5jb25maWdbXCJtYXhTaXplXCJdIHx8IDIwO1xuICAgICAgdGhpcy51cGxvYWRBUEkgPSB0aGlzLmNvbmZpZ1tcInVwbG9hZEFQSVwiXVtcInVybFwiXTtcbiAgICAgIHRoaXMuZm9ybWF0c0FsbG93ZWQgPVxuICAgICAgICB0aGlzLmNvbmZpZ1tcImZvcm1hdHNBbGxvd2VkXCJdIHx8IFwiLmpwZywucG5nLC5wZGYsLmRvY3gsLnR4dCwuZ2lmLC5qcGVnXCI7XG4gICAgICB0aGlzLm11bHRpcGxlID0gdGhpcy5jb25maWdbXCJtdWx0aXBsZVwiXSB8fCBmYWxzZTtcbiAgICAgIHRoaXMuaGVhZGVycyA9IHRoaXMuY29uZmlnW1widXBsb2FkQVBJXCJdW1wiaGVhZGVyc1wiXSB8fCB7fTtcbiAgICAgIHRoaXMuYXR0YWNoUGluVGV4dCA9XG4gICAgICAgIHRoaXMuY29uZmlnW1wiYXR0YWNoUGluVGV4dFwiXSB8fCBcIkF0dGFjaCBzdXBwb3J0aW5nIGRvY3VtZW50cy4uXCI7XG4gICAgICAvL2NvbnNvbGUubG9nKFwiY29uZmlnOiBcIiwgdGhpcy5jb25maWcpO1xuICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLmNvbmZpZ1tcIm1heFNpemVcIl0pO1xuICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLmhlYWRlcnMpO1xuICAgICAgLy9jb25zb2xlLmxvZyhcInJzdDogXCIsIHJzdCk7XG4gICAgfVxuXG4gICAgaWYgKHJzdFtcInJlc2V0VXBsb2FkXCJdKSB7XG4gICAgICBpZiAocnN0W1wicmVzZXRVcGxvYWRcIl0uY3VycmVudFZhbHVlID09PSB0cnVlKSB7XG4gICAgICAgIHRoaXMucmVzZXRGaWxlVXBsb2FkKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgLy9jb25zb2xlLmxvZyhcIklkOiBcIiwgdGhpcy5pZCk7XG4gICAgdGhpcy5yZXNldFVwbG9hZCA9IGZhbHNlO1xuICB9XG5cbiAgcmVzZXRGaWxlVXBsb2FkKCkge1xuICAgIHRoaXMuc2VsZWN0ZWRGaWxlcyA9IFtdO1xuICAgIHRoaXMuQ2FwdGlvbiA9IFtdO1xuICAgIHRoaXMubm90QWxsb3dlZExpc3QgPSBbXTtcbiAgICB0aGlzLnVwbG9hZE1zZyA9IGZhbHNlO1xuICAgIHRoaXMudXBsb2FkQnRuID0gZmFsc2U7XG4gIH1cblxuICBvbkNoYW5nZShldmVudDogYW55KSB7XG4gICAgLy9jb25zb2xlLmxvZyh0aGlzLm1heFNpemUgKyB0aGlzLmZvcm1hdHNBbGxvd2VkICsgdGhpcy5tdWx0aXBsZSk7XG4gICAgdGhpcy5ub3RBbGxvd2VkTGlzdCA9IFtdO1xuICAgIC8vY29uc29sZS5sb2coXCJvbmNoYW5nZSBoaXRcIik7XG4gICAgaWYgKHRoaXMuYWZ0ZXJVcGxvYWQgfHwgIXRoaXMubXVsdGlwbGUpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWRGaWxlcyA9IFtdO1xuICAgICAgdGhpcy5DYXB0aW9uID0gW107XG4gICAgICB0aGlzLmFmdGVyVXBsb2FkID0gZmFsc2U7XG4gICAgfVxuICAgIC8vRk9STUFUUyBBTExPV0VEIExJU1RcbiAgICAvL2NvbnNvbGUubG9nKFwiRk9STUFUUyBBTExPV0VEIExJU1Q9IFwiK3RoaXMuZm9ybWF0c0FsbG93ZWQpO1xuICAgIC8vTk8gT0YgRk9STUFUUyBBTExPV0VEXG4gICAgbGV0IGZvcm1hdHNDb3VudDogYW55O1xuICAgIGZvcm1hdHNDb3VudCA9IHRoaXMuZm9ybWF0c0FsbG93ZWQubWF0Y2gobmV3IFJlZ0V4cChcIlxcXFwuXCIsIFwiZ1wiKSk7XG4gICAgZm9ybWF0c0NvdW50ID0gZm9ybWF0c0NvdW50Lmxlbmd0aDtcbiAgICAvL2NvbnNvbGUubG9nKFwiTk8gT0YgRk9STUFUUyBBTExPV0VEPSBcIitmb3JtYXRzQ291bnQpO1xuICAgIC8vY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuXG4gICAgLy9JVEVSQVRFIFNFTEVDVEVEIEZJTEVTXG4gICAgbGV0IGZpbGU6IEZpbGVMaXN0O1xuICAgIGlmIChldmVudC50eXBlID09IFwiZHJvcFwiKSB7XG4gICAgICBmaWxlID0gZXZlbnQuZGF0YVRyYW5zZmVyLmZpbGVzO1xuICAgICAgLy9jb25zb2xlLmxvZyhcInR5cGU6IGRyb3BcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZpbGUgPSBldmVudC50YXJnZXQuZmlsZXMgfHwgZXZlbnQuc3JjRWxlbWVudC5maWxlcztcbiAgICAgIC8vY29uc29sZS5sb2coXCJ0eXBlOiBjaGFuZ2VcIik7XG4gICAgfVxuICAgIC8vY29uc29sZS5sb2coZmlsZSk7XG4gICAgbGV0IGN1cnJlbnRGaWxlRXh0OiBhbnk7XG4gICAgbGV0IGV4dDogYW55O1xuICAgIGxldCBmcm10QWxsb3dlZDogYm9vbGVhbjtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpbGUubGVuZ3RoOyBpKyspIHtcbiAgICAgIC8vQ0hFQ0sgRk9STUFUXG4gICAgICAvL0NVUlJFTlQgRklMRSBFWFRFTlNJT05cbiAgICAgIGN1cnJlbnRGaWxlRXh0ID0gdGhpcy5yZWcuZXhlYyhmaWxlW2ldLm5hbWUpO1xuICAgICAgY3VycmVudEZpbGVFeHQgPSBjdXJyZW50RmlsZUV4dFsxXTtcbiAgICAgIC8vY29uc29sZS5sb2coZmlsZVtpXS5uYW1lKTtcbiAgICAgIGZybXRBbGxvd2VkID0gZmFsc2U7XG4gICAgICAvL0ZPUk1BVCBBTExPV0VEIExJU1QgSVRFUkFURVxuICAgICAgZm9yIChsZXQgaiA9IGZvcm1hdHNDb3VudDsgaiA+IDA7IGotLSkge1xuICAgICAgICBleHQgPSB0aGlzLmZvcm1hdHNBbGxvd2VkLnNwbGl0KFwiLlwiKVtqXTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIkZPUk1BVCBMSVNUIChcIitqK1wiKT0gXCIrZXh0LnNwbGl0KFwiLFwiKVswXSk7XG4gICAgICAgIGlmIChqID09IGZvcm1hdHNDb3VudCkge1xuICAgICAgICAgIGV4dCA9IHRoaXMuZm9ybWF0c0FsbG93ZWQuc3BsaXQoXCIuXCIpW2pdICsgXCIsXCI7XG4gICAgICAgIH0gLy9jaGVjayBmb3JtYXRcbiAgICAgICAgaWYgKGN1cnJlbnRGaWxlRXh0LnRvTG93ZXJDYXNlKCkgPT0gZXh0LnNwbGl0KFwiLFwiKVswXSkge1xuICAgICAgICAgIGZybXRBbGxvd2VkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZnJtdEFsbG93ZWQpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIkZPUk1BVCBBTExPV0VEXCIpO1xuICAgICAgICAvL0NIRUNLIFNJWkVcbiAgICAgICAgaWYgKGZpbGVbaV0uc2l6ZSA+IHRoaXMubWF4U2l6ZSAqIDEwMjQwMDApIHtcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiU0laRSBOT1QgQUxMT1dFRCAoXCIrZmlsZVtpXS5zaXplK1wiKVwiKTtcbiAgICAgICAgICB0aGlzLm5vdEFsbG93ZWRMaXN0LnB1c2goe1xuICAgICAgICAgICAgZmlsZU5hbWU6IGZpbGVbaV0ubmFtZSxcbiAgICAgICAgICAgIGZpbGVTaXplOiB0aGlzLmNvbnZlcnRTaXplKGZpbGVbaV0uc2l6ZSksXG4gICAgICAgICAgICBlcnJvck1zZzogXCJJbnZhbGlkIHNpemVcIlxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vZm9ybWF0IGFsbG93ZWQgYW5kIHNpemUgYWxsb3dlZCB0aGVuIGFkZCBmaWxlIHRvIHNlbGVjdGVkRmlsZSBhcnJheVxuICAgICAgICAgIHRoaXMuc2VsZWN0ZWRGaWxlcy5wdXNoKGZpbGVbaV0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwiRk9STUFUIE5PVCBBTExPV0VEXCIpO1xuICAgICAgICB0aGlzLm5vdEFsbG93ZWRMaXN0LnB1c2goe1xuICAgICAgICAgIGZpbGVOYW1lOiBmaWxlW2ldLm5hbWUsXG4gICAgICAgICAgZmlsZVNpemU6IHRoaXMuY29udmVydFNpemUoZmlsZVtpXS5zaXplKSxcbiAgICAgICAgICBlcnJvck1zZzogXCJJbnZhbGlkIGZvcm1hdFwiXG4gICAgICAgIH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5zZWxlY3RlZEZpbGVzLmxlbmd0aCAhPT0gMCkge1xuICAgICAgdGhpcy51cGxvYWRCdG4gPSB0cnVlO1xuICAgICAgaWYgKHRoaXMudGhlbWUgPT0gXCJhdHRhY2hQaW5cIikgdGhpcy51cGxvYWRGaWxlcygpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnVwbG9hZEJ0biA9IGZhbHNlO1xuICAgIH1cbiAgICB0aGlzLnVwbG9hZE1zZyA9IGZhbHNlO1xuICAgIHRoaXMudXBsb2FkQ2xpY2sgPSB0cnVlO1xuICAgIHRoaXMucGVyY2VudENvbXBsZXRlID0gMDtcbiAgICBldmVudC50YXJnZXQudmFsdWUgPSBudWxsO1xuICB9XG5cbiAgdXBsb2FkRmlsZXMoKSB7XG4gICAgLy9jb25zb2xlLmxvZyh0aGlzLnNlbGVjdGVkRmlsZXMpO1xuXG4gICAgbGV0IGk6IGFueTtcbiAgICB0aGlzLnByb2dyZXNzQmFyU2hvdyA9IHRydWU7XG4gICAgdGhpcy51cGxvYWRDbGljayA9IGZhbHNlO1xuICAgIHRoaXMubm90QWxsb3dlZExpc3QgPSBbXTtcbiAgICBsZXQgaXNFcnJvciA9IGZhbHNlO1xuXG4gICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIGxldCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IHRoaXMuc2VsZWN0ZWRGaWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHRoaXMuQ2FwdGlvbltpXSA9PSB1bmRlZmluZWQpIHRoaXMuQ2FwdGlvbltpXSA9IFwiZmlsZVwiO1xuICAgICAgLy9BZGQgREFUQSBUTyBCRSBTRU5UXG4gICAgICBmb3JtRGF0YS5hcHBlbmQoXG4gICAgICAgIHRoaXMuQ2FwdGlvbltpXSxcbiAgICAgICAgdGhpcy5zZWxlY3RlZEZpbGVzW2ldIC8qLCB0aGlzLnNlbGVjdGVkRmlsZXNbaV0ubmFtZSovXG4gICAgICApO1xuICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLnNlbGVjdGVkRmlsZXNbaV0rXCJ7XCIrdGhpcy5DYXB0aW9uW2ldK1wiIChDYXB0aW9uKX1cIik7XG4gICAgfVxuXG4gICAgaWYgKGkgPiAxKSB7XG4gICAgICB0aGlzLnNpbmdsZUZpbGUgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zaW5nbGVGaWxlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZXZudCA9PiB7XG4gICAgICAvL2NvbnNvbGUubG9nKFwib25yZWFkeVwiKTtcbiAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICBpZiAoeGhyLnN0YXR1cyAhPT0gMjAwKSB7XG4gICAgICAgICAgaXNFcnJvciA9IHRydWU7XG4gICAgICAgICAgdGhpcy5wcm9ncmVzc0JhclNob3cgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLnVwbG9hZEJ0biA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMudXBsb2FkTXNnID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmFmdGVyVXBsb2FkID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLnVwbG9hZE1zZ1RleHQgPSBcIlVwbG9hZCBGYWlsZWQgIVwiO1xuICAgICAgICAgIHRoaXMudXBsb2FkTXNnQ2xhc3MgPSBcInRleHQtZGFuZ2VyIGxlYWRcIjtcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKHRoaXMudXBsb2FkTXNnVGV4dCk7XG4gICAgICAgICAgLy9jb25zb2xlLmxvZyhldm50KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLkFwaVJlc3BvbnNlLmVtaXQoeGhyKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgeGhyLnVwbG9hZC5vbnByb2dyZXNzID0gZXZudCA9PiB7XG4gICAgICB0aGlzLnVwbG9hZEJ0biA9IGZhbHNlOyAvLyBidXR0b24gc2hvdWxkIGJlIGRpc2FibGVkIGJ5IHByb2Nlc3MgdXBsb2FkaW5nXG4gICAgICBpZiAoZXZudC5sZW5ndGhDb21wdXRhYmxlKSB7XG4gICAgICAgIHRoaXMucGVyY2VudENvbXBsZXRlID0gTWF0aC5yb3VuZCgoZXZudC5sb2FkZWQgLyBldm50LnRvdGFsKSAqIDEwMCk7XG4gICAgICB9XG4gICAgICAvL2NvbnNvbGUubG9nKFwiUHJvZ3Jlc3MuLi5cIi8qK3RoaXMucGVyY2VudENvbXBsZXRlK1wiICVcIiovKTtcbiAgICB9O1xuXG4gICAgeGhyLm9ubG9hZCA9IGV2bnQgPT4ge1xuICAgICAgLy9jb25zb2xlLmxvZyhcIm9ubG9hZFwiKTtcbiAgICAgIC8vY29uc29sZS5sb2coZXZudCk7XG4gICAgICB0aGlzLnByb2dyZXNzQmFyU2hvdyA9IGZhbHNlO1xuICAgICAgdGhpcy51cGxvYWRCdG4gPSBmYWxzZTtcbiAgICAgIHRoaXMudXBsb2FkTXNnID0gdHJ1ZTtcbiAgICAgIHRoaXMuYWZ0ZXJVcGxvYWQgPSB0cnVlO1xuICAgICAgaWYgKCFpc0Vycm9yKSB7XG4gICAgICAgIHRoaXMudXBsb2FkTXNnVGV4dCA9IFwiU3VjY2Vzc2Z1bGx5IFVwbG9hZGVkICFcIjtcbiAgICAgICAgdGhpcy51cGxvYWRNc2dDbGFzcyA9IFwidGV4dC1zdWNjZXNzIGxlYWRcIjtcbiAgICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLnVwbG9hZE1zZ1RleHQgKyBcIiBcIiArIHRoaXMuc2VsZWN0ZWRGaWxlcy5sZW5ndGggKyBcIiBmaWxlXCIpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB4aHIub25lcnJvciA9IGV2bnQgPT4ge1xuICAgICAgLy9jb25zb2xlLmxvZyhcIm9uZXJyb3JcIik7XG4gICAgICAvL2NvbnNvbGUubG9nKGV2bnQpO1xuICAgIH07XG5cbiAgICB4aHIub3BlbihcIlBPU1RcIiwgdGhpcy51cGxvYWRBUEksIHRydWUpO1xuICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHRoaXMuaGVhZGVycykpIHtcbiAgICAgIC8vIE9iamVjdC5rZXlzIHdpbGwgZ2l2ZSBhbiBBcnJheSBvZiBrZXlzXG4gICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihrZXksIHRoaXMuaGVhZGVyc1trZXldKTtcbiAgICB9XG4gICAgLy9sZXQgdG9rZW4gPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwidG9rZW5cIik7XG4gICAgLy94aHIuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcInRleHQvcGxhaW47Y2hhcnNldD1VVEYtOFwiKTtcbiAgICAvL3hoci5zZXRSZXF1ZXN0SGVhZGVyKCdBdXRob3JpemF0aW9uJywgYEJlYXJlciAke3Rva2VufWApO1xuICAgIHhoci5zZW5kKGZvcm1EYXRhKTtcbiAgfVxuXG4gIHJlbW92ZUZpbGUoaTogYW55LCBzZl9uYTogYW55KSB7XG4gICAgLy9jb25zb2xlLmxvZyhcInJlbW92ZSBmaWxlIGNsaWNrZWQgXCIgKyBpKVxuICAgIGlmIChzZl9uYSA9PSBcInNmXCIpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWRGaWxlcy5zcGxpY2UoaSwgMSk7XG4gICAgICB0aGlzLkNhcHRpb24uc3BsaWNlKGksIDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm5vdEFsbG93ZWRMaXN0LnNwbGljZShpLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zZWxlY3RlZEZpbGVzLmxlbmd0aCA9PSAwKSB7XG4gICAgICB0aGlzLnVwbG9hZEJ0biA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGNvbnZlcnRTaXplKGZpbGVTaXplOiBudW1iZXIpIHtcbiAgICAvL2NvbnNvbGUubG9nKGZpbGVTaXplICsgXCIgLSBcIisgc3RyKTtcbiAgICByZXR1cm4gZmlsZVNpemUgPCAxMDI0MDAwXG4gICAgICA/IChmaWxlU2l6ZSAvIDEwMjQpLnRvRml4ZWQoMikgKyBcIiBLQlwiXG4gICAgICA6IChmaWxlU2l6ZSAvIDEwMjQwMDApLnRvRml4ZWQoMikgKyBcIiBNQlwiO1xuICB9XG5cbiAgYXR0YWNocGluT25jbGljaygpIHtcbiAgICAvL2NvbnNvbGUubG9nKFwiSUQ6IFwiLCB0aGlzLmlkKTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbFwiICsgdGhpcy5pZCkhLmNsaWNrKCk7XG4gICAgLy8kKFwiI1wiK1wic2VsXCIrdGhpcy5pZCkuY2xpY2soKTtcbiAgfVxuXG4gIGRyb3AoZXZlbnQ6IGFueSkge1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgLy9jb25zb2xlLmxvZyhcImRyb3A6IFwiLCBldmVudCk7XG4gICAgLy9jb25zb2xlLmxvZyhcImRyb3A6IFwiLCBldmVudC5kYXRhVHJhbnNmZXIuZmlsZXMpO1xuICAgIHRoaXMub25DaGFuZ2UoZXZlbnQpO1xuICB9XG4gIGFsbG93RHJvcChldmVudDogYW55KSB7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwiY29weVwiO1xuICAgIC8vY29uc29sZS5sb2coXCJhbGxvd0Ryb3A6IFwiLGV2ZW50KVxuICB9XG59XG5cbi8qIGludGVyZmFjZSBDT05GSUcge1xuICB1cGxvYWRBUEk6IHN0cmluZztcbiAgbXVsdGlwbGU/OiBib29sZWFuO1xuICBmb3JtYXRzQWxsb3dlZD86IHN0cmluZztcbiAgbWF4U2l6ZT86IG51bWJlcjtcbiAgaWQ/OiBudW1iZXI7XG4gIHJlc2V0VXBsb2FkPzogYm9vbGVhbjtcbiAgdGhlbWU/OiBzdHJpbmc7XG4gIGhpZGVQcm9ncmVzc0Jhcj86IGJvb2xlYW47XG4gfVxuICovIl19