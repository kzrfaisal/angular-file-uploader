import { Injectable, NgModule, defineInjectable, EventEmitter, Component, Input, Output } from '@angular/core';
import { __values } from 'tslib';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var AngularFileUploaderService = /** @class */ (function () {
    function AngularFileUploaderService() {
    }
    AngularFileUploaderService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] },
    ];
    /** @nocollapse */
    AngularFileUploaderService.ctorParameters = function () { return []; };
    /** @nocollapse */ AngularFileUploaderService.ngInjectableDef = defineInjectable({ factory: function AngularFileUploaderService_Factory() { return new AngularFileUploaderService(); }, token: AngularFileUploaderService, providedIn: "root" });
    return AngularFileUploaderService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var AngularFileUploaderComponent = /** @class */ (function () {
    function AngularFileUploaderComponent() {
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
    AngularFileUploaderComponent.prototype.ngOnChanges = /**
     * @param {?} rst
     * @return {?}
     */
    function (rst) {
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
    };
    /**
     * @return {?}
     */
    AngularFileUploaderComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        //console.log("Id: ", this.id);
        this.resetUpload = false;
    };
    /**
     * @return {?}
     */
    AngularFileUploaderComponent.prototype.resetFileUpload = /**
     * @return {?}
     */
    function () {
        this.selectedFiles = [];
        this.Caption = [];
        this.notAllowedList = [];
        this.uploadMsg = false;
        this.uploadBtn = false;
    };
    /**
     * @param {?} event
     * @return {?}
     */
    AngularFileUploaderComponent.prototype.onChange = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
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
        var /** @type {?} */ formatsCount;
        formatsCount = this.formatsAllowed.match(new RegExp("\\.", "g"));
        formatsCount = formatsCount.length;
        //console.log("NO OF FORMATS ALLOWED= "+formatsCount);
        //console.log("-------------------------------");
        //ITERATE SELECTED FILES
        var /** @type {?} */ file;
        if (event.type == "drop") {
            file = event.dataTransfer.files;
            //console.log("type: drop");
        }
        else {
            file = event.target.files || event.srcElement.files;
            //console.log("type: change");
        }
        //console.log(file);
        var /** @type {?} */ currentFileExt;
        var /** @type {?} */ ext;
        var /** @type {?} */ frmtAllowed;
        for (var /** @type {?} */ i = 0; i < file.length; i++) {
            //CHECK FORMAT
            //CURRENT FILE EXTENSION
            currentFileExt = this.reg.exec(file[i].name);
            currentFileExt = currentFileExt[1];
            //console.log(file[i].name);
            frmtAllowed = false;
            //FORMAT ALLOWED LIST ITERATE
            for (var /** @type {?} */ j = formatsCount; j > 0; j--) {
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
    };
    /**
     * @return {?}
     */
    AngularFileUploaderComponent.prototype.uploadFiles = /**
     * @return {?}
     */
    function () {
        var _this = this;
        //console.log(this.selectedFiles);
        var /** @type {?} */ i;
        this.progressBarShow = true;
        this.uploadClick = false;
        this.notAllowedList = [];
        var /** @type {?} */ isError = false;
        var /** @type {?} */ xhr = new XMLHttpRequest();
        var /** @type {?} */ formData = new FormData();
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
        xhr.onreadystatechange = function (evnt) {
            //console.log("onready");
            if (xhr.readyState === 4) {
                if (xhr.status !== 200) {
                    isError = true;
                    _this.progressBarShow = false;
                    _this.uploadBtn = false;
                    _this.uploadMsg = true;
                    _this.afterUpload = true;
                    _this.uploadMsgText = "Upload Failed !";
                    _this.uploadMsgClass = "text-danger lead";
                    //console.log(this.uploadMsgText);
                    //console.log(evnt);
                }
                _this.ApiResponse.emit(xhr);
            }
        };
        xhr.upload.onprogress = function (evnt) {
            _this.uploadBtn = false; // button should be disabled by process uploading
            if (evnt.lengthComputable) {
                _this.percentComplete = Math.round((evnt.loaded / evnt.total) * 100);
            }
            //console.log("Progress..."/*+this.percentComplete+" %"*/);
        };
        xhr.onload = function (evnt) {
            //console.log("onload");
            //console.log(evnt);
            //console.log("onload");
            //console.log(evnt);
            _this.progressBarShow = false;
            _this.uploadBtn = false;
            _this.uploadMsg = true;
            _this.afterUpload = true;
            if (!isError) {
                _this.uploadMsgText = "Successfully Uploaded !";
                _this.uploadMsgClass = "text-success lead";
                //console.log(this.uploadMsgText + " " + this.selectedFiles.length + " file");
            }
        };
        xhr.onerror = function (evnt) {
            //console.log("onerror");
            //console.log(evnt);
        };
        xhr.open("POST", this.uploadAPI, true);
        try {
            for (var _a = __values(Object.keys(this.headers)), _b = _a.next(); !_b.done; _b = _a.next()) {
                var key = _b.value;
                // Object.keys will give an Array of keys
                xhr.setRequestHeader(key, this.headers[key]);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_1) throw e_1.error; }
        }
        //let token = sessionStorage.getItem("token");
        //xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
        //xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.send(formData);
        var e_1, _c;
    };
    /**
     * @param {?} i
     * @param {?} sf_na
     * @return {?}
     */
    AngularFileUploaderComponent.prototype.removeFile = /**
     * @param {?} i
     * @param {?} sf_na
     * @return {?}
     */
    function (i, sf_na) {
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
    };
    /**
     * @param {?} fileSize
     * @return {?}
     */
    AngularFileUploaderComponent.prototype.convertSize = /**
     * @param {?} fileSize
     * @return {?}
     */
    function (fileSize) {
        //console.log(fileSize + " - "+ str);
        return fileSize < 1024000
            ? (fileSize / 1024).toFixed(2) + " KB"
            : (fileSize / 1024000).toFixed(2) + " MB";
    };
    /**
     * @return {?}
     */
    AngularFileUploaderComponent.prototype.attachpinOnclick = /**
     * @return {?}
     */
    function () {
        /** @type {?} */ ((
        //console.log("ID: ", this.id);
        document.getElementById("sel" + this.id))).click();
        //$("#"+"sel"+this.id).click();
    };
    /**
     * @param {?} event
     * @return {?}
     */
    AngularFileUploaderComponent.prototype.drop = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        event.stopPropagation();
        event.preventDefault();
        //console.log("drop: ", event);
        //console.log("drop: ", event.dataTransfer.files);
        this.onChange(event);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    AngularFileUploaderComponent.prototype.allowDrop = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
        //console.log("allowDrop: ",event)
    };
    AngularFileUploaderComponent.decorators = [
        { type: Component, args: [{
                    selector: "angular-file-uploader",
                    template: "<div class=\"container\" *ngIf=\"(theme !== 'attachPin')\" id=\"default\">\n\n    <!-- Drag n Drop theme Starts -->\n    <div *ngIf=\"theme == 'dragNDrop'\" id=\"dragNDrop\" [ngClass]=\"(hideSelectBtn && hideResetBtn) ? null : 'dragNDropBtmPad'\" class=\"dragNDrop\">\n        <div style=\"position:relative;\">\n            <div id=\"div1\" class=\"div1 afu-dragndrop-box\" (drop)=\"drop($event)\" (dragover)=\"allowDrop($event)\">\n                <p class=\"afu-dragndrop-text\">Drag N Drop</p>\n            </div>\n            <!-- <span class='label label-info' id=\"upload-file-info{{id}}\">{{selectedFiles[0]?.name}}</span> -->\n        </div>\n    </div>\n    <!-- Drag n Drop theme Ends -->\n\n    <label for=\"sel{{id}}\" class=\"btn btn-primary btn-sm afu-select-btn\" *ngIf=\"!hideSelectBtn\">Select File<span *ngIf=\"multiple\">s</span></label>\n    <input type=\"file\" id=\"sel{{id}}\" style=\"display: none\" *ngIf=\"!hideSelectBtn\" (change)=\"onChange($event)\" title=\"Select file\"\n        name=\"files[]\" [accept]=formatsAllowed [attr.multiple]=\"multiple ? '' : null\" />\n    <button class=\"btn btn-info btn-sm resetBtn afu-reset-btn\" (click)=\"resetFileUpload()\" *ngIf=\"!hideResetBtn\">Reset</button>\n    <br *ngIf=\"!hideSelectBtn\">\n    <p class=\"constraints-info afu-constraints-info\">({{formatsAllowed}}) Size limit- {{(convertSize(maxSize *1024000))}}</p>\n    <!--Selected file list-->\n    <div class=\"row afu-valid-file\" *ngFor=\"let sf of selectedFiles;let i=index\" >\n        <p class=\"col-xs-3 textOverflow\"><span class=\"text-primary\">{{sf.name}}</span></p>\n        <p class=\"col-xs-3 padMarg sizeC\"><strong>({{convertSize(sf.size)}})</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>\n        <!--  <input class=\"col-xs-3 progress caption\"  type=\"text\"  placeholder=\"Caption..\"  [(ngModel)]=\"Caption[i]\"  *ngIf=\"uploadClick\"/> -->\n        <div class=\"progress col-xs-3 padMarg afu-progress-bar\" *ngIf=\"singleFile && progressBarShow && !hideProgressBar\">\n            <span class=\"progress-bar progress-bar-success\" role=\"progressbar\" [ngStyle]=\"{'width':percentComplete+'%'}\">{{percentComplete}}%</span>\n        </div>\n        <a class=\"col-xs-1\" role=\"button\" (click)=\"removeFile(i,'sf')\" *ngIf=\"uploadClick\"><i class=\"fa fa-times\"></i></a>\n    </div>\n    <!--Invalid file list-->\n    <div class=\"row text-danger afu-invalid-file\" *ngFor=\"let na of notAllowedList;let j=index\">\n        <p class=\"col-xs-3 textOverflow\"><span>{{na['fileName']}}</span></p>\n        <p class=\"col-xs-3 padMarg sizeC\"><strong>({{na['fileSize']}})</strong></p>\n        <p class=\"col-xs-3 \">{{na['errorMsg']}}</p>\n        <a class=\"col-xs-1 delFileIcon\" role=\"button\" (click)=\"removeFile(j,'na')\" *ngIf=\"uploadClick\">&nbsp;<i class=\"fa fa-times\"></i></a>\n    </div>\n\n    <p *ngIf=\"uploadMsg\" class=\"{{uploadMsgClass}} + afu-upload-status\">{{uploadMsgText}}<p>\n    <div *ngIf=\"!singleFile && progressBarShow && !hideProgressBar\">\n        <div class=\"progress col-xs-4 padMarg afu-progress-bar\">\n            <span class=\"progress-bar progress-bar-success\" role=\"progressbar\" [ngStyle]=\"{'width':percentComplete+'%'}\">{{percentComplete}}%</span>\n        </div>\n        <br>\n        <br>\n    </div>\n    <button class=\"btn btn-success afu-upload-btn\" type=\"button\" (click)=\"uploadFiles()\" [disabled]=!uploadBtn>{{uploadBtnText}}</button>\n    <br>\n</div>\n\n<!--/////////////////////////// ATTACH PIN THEME  //////////////////////////////////////////////////////////-->\n<div *ngIf=\"theme == 'attachPin'\" id=\"attachPin\">\n    <div style=\"position:relative;padding-left:6px\">\n        <a class='btn up_btn afu-attach-pin' (click)=\"attachpinOnclick()\">\n            {{attachPinText}}\n            <i class=\"fa fa-paperclip\" aria-hidden=\"true\"></i>\n            <!-- <p style=\"margin-top:10px\">({{formatsAllowed}}) Size limit- {{(convertSize(maxSize * 1024000))}}</p> -->\n            <input type=\"file\" id=\"sel{{id}}\" (change)=\"onChange($event)\" style=\"display: none\" title=\"Select file\" name=\"files[]\" [accept]=formatsAllowed\n                [attr.multiple]=\"multiple ? '' : null\" />\n            <br>\n        </a>\n        &nbsp;\n        <span class='label label-info' id=\"upload-file-info{{id}}\">{{selectedFiles[0]?.name}}</span>\n    </div>\n</div>\n\n<!--/////////////////////////// DRAG N DROP THEME  //////////////////////////////////////////////////////////-->\n<!-- <div *ngIf=\"theme == 'dragNDrop'\" id=\"dragNDrop\">\n  <div style=\"position:relative;padding-left:6px\">\n    <div id=\"div1\" (drop)=\"drop($event)\" (dragover)=\"allowDrop($event)\">\n      <p>Drag N Drop</p>\n    </div>\n    <span class='label label-info' id=\"upload-file-info{{id}}\">{{selectedFiles[0]?.name}}</span>\n  </div>\n</div> -->",
                    styles: [".constraints-info{margin-top:10px;font-style:italic}.padMarg{padding:0;margin-bottom:0}.caption{margin-right:5px}.textOverflow{white-space:nowrap;padding-right:0;overflow:hidden;text-overflow:ellipsis}.up_btn{color:#000;background-color:transparent;border:2px solid #5c5b5b;border-radius:22px}.delFileIcon{text-decoration:none;color:#ce0909}.dragNDrop .div1{display:border-box;border:2px dashed #5c5b5b;height:6rem;width:20rem}.dragNDrop .div1>p{text-align:center;font-weight:700;color:#5c5b5b;margin-top:1.4em}.dragNDropBtmPad{padding-bottom:2rem}@media screen and (max-width:620px){.caption{padding:0}}@media screen and (max-width:510px){.sizeC{width:25%}}@media screen and (max-width:260px){.caption,.sizeC{font-size:10px}}.resetBtn{margin-left:3px}"]
                },] },
    ];
    /** @nocollapse */
    AngularFileUploaderComponent.ctorParameters = function () { return []; };
    AngularFileUploaderComponent.propDecorators = {
        config: [{ type: Input }],
        resetUpload: [{ type: Input }],
        ApiResponse: [{ type: Output }]
    };
    return AngularFileUploaderComponent;
}());
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var AngularFileUploaderModule = /** @class */ (function () {
    function AngularFileUploaderModule() {
    }
    AngularFileUploaderModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        CommonModule
                    ],
                    declarations: [AngularFileUploaderComponent],
                    exports: [AngularFileUploaderComponent]
                },] },
    ];
    return AngularFileUploaderModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

export { AngularFileUploaderService, AngularFileUploaderComponent, AngularFileUploaderModule };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1maWxlLXVwbG9hZGVyLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9hbmd1bGFyLWZpbGUtdXBsb2FkZXIvbGliL2FuZ3VsYXItZmlsZS11cGxvYWRlci5zZXJ2aWNlLnRzIiwibmc6Ly9hbmd1bGFyLWZpbGUtdXBsb2FkZXIvbGliL2FuZ3VsYXItZmlsZS11cGxvYWRlci5jb21wb25lbnQudHMiLCJuZzovL2FuZ3VsYXItZmlsZS11cGxvYWRlci9saWIvYW5ndWxhci1maWxlLXVwbG9hZGVyLm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIEFuZ3VsYXJGaWxlVXBsb2FkZXJTZXJ2aWNlIHtcblxuICBjb25zdHJ1Y3RvcigpIHsgfVxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2VzLCBJbmplY3QsIFZpZXdFbmNhcHN1bGF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6IFwiYW5ndWxhci1maWxlLXVwbG9hZGVyXCIsXG4gIHRlbXBsYXRlOiBgPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiICpuZ0lmPVwiKHRoZW1lICE9PSAnYXR0YWNoUGluJylcIiBpZD1cImRlZmF1bHRcIj5cclxuXHJcbiAgICA8IS0tIERyYWcgbiBEcm9wIHRoZW1lIFN0YXJ0cyAtLT5cclxuICAgIDxkaXYgKm5nSWY9XCJ0aGVtZSA9PSAnZHJhZ05Ecm9wJ1wiIGlkPVwiZHJhZ05Ecm9wXCIgW25nQ2xhc3NdPVwiKGhpZGVTZWxlY3RCdG4gJiYgaGlkZVJlc2V0QnRuKSA/IG51bGwgOiAnZHJhZ05Ecm9wQnRtUGFkJ1wiIGNsYXNzPVwiZHJhZ05Ecm9wXCI+XHJcbiAgICAgICAgPGRpdiBzdHlsZT1cInBvc2l0aW9uOnJlbGF0aXZlO1wiPlxyXG4gICAgICAgICAgICA8ZGl2IGlkPVwiZGl2MVwiIGNsYXNzPVwiZGl2MSBhZnUtZHJhZ25kcm9wLWJveFwiIChkcm9wKT1cImRyb3AoJGV2ZW50KVwiIChkcmFnb3Zlcik9XCJhbGxvd0Ryb3AoJGV2ZW50KVwiPlxyXG4gICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJhZnUtZHJhZ25kcm9wLXRleHRcIj5EcmFnIE4gRHJvcDwvcD5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwhLS0gPHNwYW4gY2xhc3M9J2xhYmVsIGxhYmVsLWluZm8nIGlkPVwidXBsb2FkLWZpbGUtaW5mb3t7aWR9fVwiPnt7c2VsZWN0ZWRGaWxlc1swXT8ubmFtZX19PC9zcGFuPiAtLT5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICAgPCEtLSBEcmFnIG4gRHJvcCB0aGVtZSBFbmRzIC0tPlxyXG5cclxuICAgIDxsYWJlbCBmb3I9XCJzZWx7e2lkfX1cIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeSBidG4tc20gYWZ1LXNlbGVjdC1idG5cIiAqbmdJZj1cIiFoaWRlU2VsZWN0QnRuXCI+U2VsZWN0IEZpbGU8c3BhbiAqbmdJZj1cIm11bHRpcGxlXCI+czwvc3Bhbj48L2xhYmVsPlxyXG4gICAgPGlucHV0IHR5cGU9XCJmaWxlXCIgaWQ9XCJzZWx7e2lkfX1cIiBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIiAqbmdJZj1cIiFoaWRlU2VsZWN0QnRuXCIgKGNoYW5nZSk9XCJvbkNoYW5nZSgkZXZlbnQpXCIgdGl0bGU9XCJTZWxlY3QgZmlsZVwiXHJcbiAgICAgICAgbmFtZT1cImZpbGVzW11cIiBbYWNjZXB0XT1mb3JtYXRzQWxsb3dlZCBbYXR0ci5tdWx0aXBsZV09XCJtdWx0aXBsZSA/ICcnIDogbnVsbFwiIC8+XHJcbiAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1pbmZvIGJ0bi1zbSByZXNldEJ0biBhZnUtcmVzZXQtYnRuXCIgKGNsaWNrKT1cInJlc2V0RmlsZVVwbG9hZCgpXCIgKm5nSWY9XCIhaGlkZVJlc2V0QnRuXCI+UmVzZXQ8L2J1dHRvbj5cclxuICAgIDxiciAqbmdJZj1cIiFoaWRlU2VsZWN0QnRuXCI+XHJcbiAgICA8cCBjbGFzcz1cImNvbnN0cmFpbnRzLWluZm8gYWZ1LWNvbnN0cmFpbnRzLWluZm9cIj4oe3tmb3JtYXRzQWxsb3dlZH19KSBTaXplIGxpbWl0LSB7eyhjb252ZXJ0U2l6ZShtYXhTaXplICoxMDI0MDAwKSl9fTwvcD5cclxuICAgIDwhLS1TZWxlY3RlZCBmaWxlIGxpc3QtLT5cclxuICAgIDxkaXYgY2xhc3M9XCJyb3cgYWZ1LXZhbGlkLWZpbGVcIiAqbmdGb3I9XCJsZXQgc2Ygb2Ygc2VsZWN0ZWRGaWxlcztsZXQgaT1pbmRleFwiID5cclxuICAgICAgICA8cCBjbGFzcz1cImNvbC14cy0zIHRleHRPdmVyZmxvd1wiPjxzcGFuIGNsYXNzPVwidGV4dC1wcmltYXJ5XCI+e3tzZi5uYW1lfX08L3NwYW4+PC9wPlxyXG4gICAgICAgIDxwIGNsYXNzPVwiY29sLXhzLTMgcGFkTWFyZyBzaXplQ1wiPjxzdHJvbmc+KHt7Y29udmVydFNpemUoc2Yuc2l6ZSl9fSk8L3N0cm9uZz4mbmJzcDsmbmJzcDsmbmJzcDsmbmJzcDsmbmJzcDs8L3A+XHJcbiAgICAgICAgPCEtLSAgPGlucHV0IGNsYXNzPVwiY29sLXhzLTMgcHJvZ3Jlc3MgY2FwdGlvblwiICB0eXBlPVwidGV4dFwiICBwbGFjZWhvbGRlcj1cIkNhcHRpb24uLlwiICBbKG5nTW9kZWwpXT1cIkNhcHRpb25baV1cIiAgKm5nSWY9XCJ1cGxvYWRDbGlja1wiLz4gLS0+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzIGNvbC14cy0zIHBhZE1hcmcgYWZ1LXByb2dyZXNzLWJhclwiICpuZ0lmPVwic2luZ2xlRmlsZSAmJiBwcm9ncmVzc0JhclNob3cgJiYgIWhpZGVQcm9ncmVzc0JhclwiPlxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInByb2dyZXNzLWJhciBwcm9ncmVzcy1iYXItc3VjY2Vzc1wiIHJvbGU9XCJwcm9ncmVzc2JhclwiIFtuZ1N0eWxlXT1cInsnd2lkdGgnOnBlcmNlbnRDb21wbGV0ZSsnJSd9XCI+e3twZXJjZW50Q29tcGxldGV9fSU8L3NwYW4+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGEgY2xhc3M9XCJjb2wteHMtMVwiIHJvbGU9XCJidXR0b25cIiAoY2xpY2spPVwicmVtb3ZlRmlsZShpLCdzZicpXCIgKm5nSWY9XCJ1cGxvYWRDbGlja1wiPjxpIGNsYXNzPVwiZmEgZmEtdGltZXNcIj48L2k+PC9hPlxyXG4gICAgPC9kaXY+XHJcbiAgICA8IS0tSW52YWxpZCBmaWxlIGxpc3QtLT5cclxuICAgIDxkaXYgY2xhc3M9XCJyb3cgdGV4dC1kYW5nZXIgYWZ1LWludmFsaWQtZmlsZVwiICpuZ0Zvcj1cImxldCBuYSBvZiBub3RBbGxvd2VkTGlzdDtsZXQgaj1pbmRleFwiPlxyXG4gICAgICAgIDxwIGNsYXNzPVwiY29sLXhzLTMgdGV4dE92ZXJmbG93XCI+PHNwYW4+e3tuYVsnZmlsZU5hbWUnXX19PC9zcGFuPjwvcD5cclxuICAgICAgICA8cCBjbGFzcz1cImNvbC14cy0zIHBhZE1hcmcgc2l6ZUNcIj48c3Ryb25nPih7e25hWydmaWxlU2l6ZSddfX0pPC9zdHJvbmc+PC9wPlxyXG4gICAgICAgIDxwIGNsYXNzPVwiY29sLXhzLTMgXCI+e3tuYVsnZXJyb3JNc2cnXX19PC9wPlxyXG4gICAgICAgIDxhIGNsYXNzPVwiY29sLXhzLTEgZGVsRmlsZUljb25cIiByb2xlPVwiYnV0dG9uXCIgKGNsaWNrKT1cInJlbW92ZUZpbGUoaiwnbmEnKVwiICpuZ0lmPVwidXBsb2FkQ2xpY2tcIj4mbmJzcDs8aSBjbGFzcz1cImZhIGZhLXRpbWVzXCI+PC9pPjwvYT5cclxuICAgIDwvZGl2PlxyXG5cclxuICAgIDxwICpuZ0lmPVwidXBsb2FkTXNnXCIgY2xhc3M9XCJ7e3VwbG9hZE1zZ0NsYXNzfX0gKyBhZnUtdXBsb2FkLXN0YXR1c1wiPnt7dXBsb2FkTXNnVGV4dH19PHA+XHJcbiAgICA8ZGl2ICpuZ0lmPVwiIXNpbmdsZUZpbGUgJiYgcHJvZ3Jlc3NCYXJTaG93ICYmICFoaWRlUHJvZ3Jlc3NCYXJcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MgY29sLXhzLTQgcGFkTWFyZyBhZnUtcHJvZ3Jlc3MtYmFyXCI+XHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicHJvZ3Jlc3MtYmFyIHByb2dyZXNzLWJhci1zdWNjZXNzXCIgcm9sZT1cInByb2dyZXNzYmFyXCIgW25nU3R5bGVdPVwieyd3aWR0aCc6cGVyY2VudENvbXBsZXRlKyclJ31cIj57e3BlcmNlbnRDb21wbGV0ZX19JTwvc3Bhbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8YnI+XHJcbiAgICAgICAgPGJyPlxyXG4gICAgPC9kaXY+XHJcbiAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1zdWNjZXNzIGFmdS11cGxvYWQtYnRuXCIgdHlwZT1cImJ1dHRvblwiIChjbGljayk9XCJ1cGxvYWRGaWxlcygpXCIgW2Rpc2FibGVkXT0hdXBsb2FkQnRuPnt7dXBsb2FkQnRuVGV4dH19PC9idXR0b24+XHJcbiAgICA8YnI+XHJcbjwvZGl2PlxyXG5cclxuPCEtLS8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyBBVFRBQ0ggUElOIFRIRU1FICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLS0+XHJcbjxkaXYgKm5nSWY9XCJ0aGVtZSA9PSAnYXR0YWNoUGluJ1wiIGlkPVwiYXR0YWNoUGluXCI+XHJcbiAgICA8ZGl2IHN0eWxlPVwicG9zaXRpb246cmVsYXRpdmU7cGFkZGluZy1sZWZ0OjZweFwiPlxyXG4gICAgICAgIDxhIGNsYXNzPSdidG4gdXBfYnRuIGFmdS1hdHRhY2gtcGluJyAoY2xpY2spPVwiYXR0YWNocGluT25jbGljaygpXCI+XHJcbiAgICAgICAgICAgIHt7YXR0YWNoUGluVGV4dH19XHJcbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtcGFwZXJjbGlwXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxyXG4gICAgICAgICAgICA8IS0tIDxwIHN0eWxlPVwibWFyZ2luLXRvcDoxMHB4XCI+KHt7Zm9ybWF0c0FsbG93ZWR9fSkgU2l6ZSBsaW1pdC0ge3soY29udmVydFNpemUobWF4U2l6ZSAqIDEwMjQwMDApKX19PC9wPiAtLT5cclxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJmaWxlXCIgaWQ9XCJzZWx7e2lkfX1cIiAoY2hhbmdlKT1cIm9uQ2hhbmdlKCRldmVudClcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIiB0aXRsZT1cIlNlbGVjdCBmaWxlXCIgbmFtZT1cImZpbGVzW11cIiBbYWNjZXB0XT1mb3JtYXRzQWxsb3dlZFxyXG4gICAgICAgICAgICAgICAgW2F0dHIubXVsdGlwbGVdPVwibXVsdGlwbGUgPyAnJyA6IG51bGxcIiAvPlxyXG4gICAgICAgICAgICA8YnI+XHJcbiAgICAgICAgPC9hPlxyXG4gICAgICAgICZuYnNwO1xyXG4gICAgICAgIDxzcGFuIGNsYXNzPSdsYWJlbCBsYWJlbC1pbmZvJyBpZD1cInVwbG9hZC1maWxlLWluZm97e2lkfX1cIj57e3NlbGVjdGVkRmlsZXNbMF0/Lm5hbWV9fTwvc3Bhbj5cclxuICAgIDwvZGl2PlxyXG48L2Rpdj5cclxuXHJcbjwhLS0vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8gRFJBRyBOIERST1AgVEhFTUUgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8tLT5cclxuPCEtLSA8ZGl2ICpuZ0lmPVwidGhlbWUgPT0gJ2RyYWdORHJvcCdcIiBpZD1cImRyYWdORHJvcFwiPlxyXG4gIDxkaXYgc3R5bGU9XCJwb3NpdGlvbjpyZWxhdGl2ZTtwYWRkaW5nLWxlZnQ6NnB4XCI+XHJcbiAgICA8ZGl2IGlkPVwiZGl2MVwiIChkcm9wKT1cImRyb3AoJGV2ZW50KVwiIChkcmFnb3Zlcik9XCJhbGxvd0Ryb3AoJGV2ZW50KVwiPlxyXG4gICAgICA8cD5EcmFnIE4gRHJvcDwvcD5cclxuICAgIDwvZGl2PlxyXG4gICAgPHNwYW4gY2xhc3M9J2xhYmVsIGxhYmVsLWluZm8nIGlkPVwidXBsb2FkLWZpbGUtaW5mb3t7aWR9fVwiPnt7c2VsZWN0ZWRGaWxlc1swXT8ubmFtZX19PC9zcGFuPlxyXG4gIDwvZGl2PlxyXG48L2Rpdj4gLS0+YCAsXG4gIHN0eWxlczogW2AuY29uc3RyYWludHMtaW5mb3ttYXJnaW4tdG9wOjEwcHg7Zm9udC1zdHlsZTppdGFsaWN9LnBhZE1hcmd7cGFkZGluZzowO21hcmdpbi1ib3R0b206MH0uY2FwdGlvbnttYXJnaW4tcmlnaHQ6NXB4fS50ZXh0T3ZlcmZsb3d7d2hpdGUtc3BhY2U6bm93cmFwO3BhZGRpbmctcmlnaHQ6MDtvdmVyZmxvdzpoaWRkZW47dGV4dC1vdmVyZmxvdzplbGxpcHNpc30udXBfYnRue2NvbG9yOiMwMDA7YmFja2dyb3VuZC1jb2xvcjp0cmFuc3BhcmVudDtib3JkZXI6MnB4IHNvbGlkICM1YzViNWI7Ym9yZGVyLXJhZGl1czoyMnB4fS5kZWxGaWxlSWNvbnt0ZXh0LWRlY29yYXRpb246bm9uZTtjb2xvcjojY2UwOTA5fS5kcmFnTkRyb3AgLmRpdjF7ZGlzcGxheTpib3JkZXItYm94O2JvcmRlcjoycHggZGFzaGVkICM1YzViNWI7aGVpZ2h0OjZyZW07d2lkdGg6MjByZW19LmRyYWdORHJvcCAuZGl2MT5we3RleHQtYWxpZ246Y2VudGVyO2ZvbnQtd2VpZ2h0OjcwMDtjb2xvcjojNWM1YjViO21hcmdpbi10b3A6MS40ZW19LmRyYWdORHJvcEJ0bVBhZHtwYWRkaW5nLWJvdHRvbToycmVtfUBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6NjIwcHgpey5jYXB0aW9ue3BhZGRpbmc6MH19QG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDo1MTBweCl7LnNpemVDe3dpZHRoOjI1JX19QG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDoyNjBweCl7LmNhcHRpb24sLnNpemVDe2ZvbnQtc2l6ZToxMHB4fX0ucmVzZXRCdG57bWFyZ2luLWxlZnQ6M3B4fWBdXG59KVxuZXhwb3J0IGNsYXNzIEFuZ3VsYXJGaWxlVXBsb2FkZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XG4gIEBJbnB1dCgpXG4gIGNvbmZpZzogYW55ID0ge307XG4gIEBJbnB1dCgpXG4gIHJlc2V0VXBsb2FkOiBib29sZWFuID0gdGhpcy5jb25maWdbXCJyZXNldFVwbG9hZFwiXTtcbiAgQE91dHB1dCgpXG4gIEFwaVJlc3BvbnNlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIHRoZW1lOiBzdHJpbmc7XG4gIGlkOiBudW1iZXI7XG4gIGhpZGVQcm9ncmVzc0JhcjogYm9vbGVhbjtcbiAgbWF4U2l6ZTogbnVtYmVyO1xuICB1cGxvYWRBUEk6IHN0cmluZztcbiAgZm9ybWF0c0FsbG93ZWQ6IHN0cmluZztcbiAgbXVsdGlwbGU6IGJvb2xlYW47XG4gIGhlYWRlcnM6IGFueTtcbiAgaGlkZVJlc2V0QnRuOiBib29sZWFuO1xuICBoaWRlU2VsZWN0QnRuOiBib29sZWFuO1xuICBhdHRhY2hQaW5UZXh0OiBzdHJpbmc7XG4gIHVwbG9hZEJ0blRleHQ6IHN0cmluZztcblxuICBpZERhdGU6IG51bWJlciA9ICtuZXcgRGF0ZSgpO1xuICByZWc6IFJlZ0V4cCA9IC8oPzpcXC4oW14uXSspKT8kLztcbiAgc2VsZWN0ZWRGaWxlczogQXJyYXk8YW55PiA9IFtdO1xuICBub3RBbGxvd2VkTGlzdDogQXJyYXk8T2JqZWN0PiA9IFtdO1xuICBDYXB0aW9uOiBBcnJheTxzdHJpbmc+ID0gW107XG4gIHNpbmdsZUZpbGUgPSB0cnVlO1xuICBwcm9ncmVzc0JhclNob3cgPSBmYWxzZTtcbiAgdXBsb2FkQnRuID0gZmFsc2U7XG4gIHVwbG9hZE1zZyA9IGZhbHNlO1xuICBhZnRlclVwbG9hZCA9IGZhbHNlO1xuICB1cGxvYWRDbGljayA9IHRydWU7XG4gIHVwbG9hZE1zZ1RleHQ6IHN0cmluZztcbiAgdXBsb2FkTXNnQ2xhc3M6IHN0cmluZztcbiAgcGVyY2VudENvbXBsZXRlOiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgLy9jb25zb2xlLmxvZyhcImlkOiBcIix0aGlzLmlkKTtcbiAgICAvL2NvbnNvbGUubG9nKFwiaWREYXRlOiBcIix0aGlzLmlkRGF0ZSk7XG4gICAgLy9jb25zb2xlLmxvZyhNYXRoLnJhbmRvbSgpKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKHJzdDogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChyc3RbXCJjb25maWdcIl0pIHtcbiAgICAgIHRoaXMudGhlbWUgPSB0aGlzLmNvbmZpZ1tcInRoZW1lXCJdIHx8IFwiXCI7XG4gICAgICB0aGlzLmlkID1cbiAgICAgICAgdGhpcy5jb25maWdbXCJpZFwiXSB8fFxuICAgICAgICBwYXJzZUludCgodGhpcy5pZERhdGUgLyAxMDAwMCkudG9TdHJpbmcoKS5zcGxpdChcIi5cIilbMV0pICtcbiAgICAgICAgICBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyMCkgKiAxMDAwMDtcbiAgICAgIHRoaXMuaGlkZVByb2dyZXNzQmFyID0gdGhpcy5jb25maWdbXCJoaWRlUHJvZ3Jlc3NCYXJcIl0gfHwgZmFsc2U7XG4gICAgICB0aGlzLmhpZGVSZXNldEJ0biA9IHRoaXMuY29uZmlnW1wiaGlkZVJlc2V0QnRuXCJdIHx8IGZhbHNlO1xuICAgICAgdGhpcy5oaWRlU2VsZWN0QnRuID0gdGhpcy5jb25maWdbXCJoaWRlU2VsZWN0QnRuXCJdIHx8IGZhbHNlO1xuICAgICAgdGhpcy51cGxvYWRCdG5UZXh0ID0gdGhpcy5jb25maWdbXCJ1cGxvYWRCdG5UZXh0XCJdIHx8IFwiVXBsb2FkXCI7XG4gICAgICB0aGlzLm1heFNpemUgPSB0aGlzLmNvbmZpZ1tcIm1heFNpemVcIl0gfHwgMjA7XG4gICAgICB0aGlzLnVwbG9hZEFQSSA9IHRoaXMuY29uZmlnW1widXBsb2FkQVBJXCJdW1widXJsXCJdO1xuICAgICAgdGhpcy5mb3JtYXRzQWxsb3dlZCA9XG4gICAgICAgIHRoaXMuY29uZmlnW1wiZm9ybWF0c0FsbG93ZWRcIl0gfHwgXCIuanBnLC5wbmcsLnBkZiwuZG9jeCwudHh0LC5naWYsLmpwZWdcIjtcbiAgICAgIHRoaXMubXVsdGlwbGUgPSB0aGlzLmNvbmZpZ1tcIm11bHRpcGxlXCJdIHx8IGZhbHNlO1xuICAgICAgdGhpcy5oZWFkZXJzID0gdGhpcy5jb25maWdbXCJ1cGxvYWRBUElcIl1bXCJoZWFkZXJzXCJdIHx8IHt9O1xuICAgICAgdGhpcy5hdHRhY2hQaW5UZXh0ID1cbiAgICAgICAgdGhpcy5jb25maWdbXCJhdHRhY2hQaW5UZXh0XCJdIHx8IFwiQXR0YWNoIHN1cHBvcnRpbmcgZG9jdW1lbnRzLi5cIjtcbiAgICAgIC8vY29uc29sZS5sb2coXCJjb25maWc6IFwiLCB0aGlzLmNvbmZpZyk7XG4gICAgICAvL2NvbnNvbGUubG9nKHRoaXMuY29uZmlnW1wibWF4U2l6ZVwiXSk7XG4gICAgICAvL2NvbnNvbGUubG9nKHRoaXMuaGVhZGVycyk7XG4gICAgICAvL2NvbnNvbGUubG9nKFwicnN0OiBcIiwgcnN0KTtcbiAgICB9XG5cbiAgICBpZiAocnN0W1wicmVzZXRVcGxvYWRcIl0pIHtcbiAgICAgIGlmIChyc3RbXCJyZXNldFVwbG9hZFwiXS5jdXJyZW50VmFsdWUgPT09IHRydWUpIHtcbiAgICAgICAgdGhpcy5yZXNldEZpbGVVcGxvYWQoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICAvL2NvbnNvbGUubG9nKFwiSWQ6IFwiLCB0aGlzLmlkKTtcbiAgICB0aGlzLnJlc2V0VXBsb2FkID0gZmFsc2U7XG4gIH1cblxuICByZXNldEZpbGVVcGxvYWQoKSB7XG4gICAgdGhpcy5zZWxlY3RlZEZpbGVzID0gW107XG4gICAgdGhpcy5DYXB0aW9uID0gW107XG4gICAgdGhpcy5ub3RBbGxvd2VkTGlzdCA9IFtdO1xuICAgIHRoaXMudXBsb2FkTXNnID0gZmFsc2U7XG4gICAgdGhpcy51cGxvYWRCdG4gPSBmYWxzZTtcbiAgfVxuXG4gIG9uQ2hhbmdlKGV2ZW50OiBhbnkpIHtcbiAgICAvL2NvbnNvbGUubG9nKHRoaXMubWF4U2l6ZSArIHRoaXMuZm9ybWF0c0FsbG93ZWQgKyB0aGlzLm11bHRpcGxlKTtcbiAgICB0aGlzLm5vdEFsbG93ZWRMaXN0ID0gW107XG4gICAgLy9jb25zb2xlLmxvZyhcIm9uY2hhbmdlIGhpdFwiKTtcbiAgICBpZiAodGhpcy5hZnRlclVwbG9hZCB8fCAhdGhpcy5tdWx0aXBsZSkge1xuICAgICAgdGhpcy5zZWxlY3RlZEZpbGVzID0gW107XG4gICAgICB0aGlzLkNhcHRpb24gPSBbXTtcbiAgICAgIHRoaXMuYWZ0ZXJVcGxvYWQgPSBmYWxzZTtcbiAgICB9XG4gICAgLy9GT1JNQVRTIEFMTE9XRUQgTElTVFxuICAgIC8vY29uc29sZS5sb2coXCJGT1JNQVRTIEFMTE9XRUQgTElTVD0gXCIrdGhpcy5mb3JtYXRzQWxsb3dlZCk7XG4gICAgLy9OTyBPRiBGT1JNQVRTIEFMTE9XRURcbiAgICBsZXQgZm9ybWF0c0NvdW50OiBhbnk7XG4gICAgZm9ybWF0c0NvdW50ID0gdGhpcy5mb3JtYXRzQWxsb3dlZC5tYXRjaChuZXcgUmVnRXhwKFwiXFxcXC5cIiwgXCJnXCIpKTtcbiAgICBmb3JtYXRzQ291bnQgPSBmb3JtYXRzQ291bnQubGVuZ3RoO1xuICAgIC8vY29uc29sZS5sb2coXCJOTyBPRiBGT1JNQVRTIEFMTE9XRUQ9IFwiK2Zvcm1hdHNDb3VudCk7XG4gICAgLy9jb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XG5cbiAgICAvL0lURVJBVEUgU0VMRUNURUQgRklMRVNcbiAgICBsZXQgZmlsZTogRmlsZUxpc3Q7XG4gICAgaWYgKGV2ZW50LnR5cGUgPT0gXCJkcm9wXCIpIHtcbiAgICAgIGZpbGUgPSBldmVudC5kYXRhVHJhbnNmZXIuZmlsZXM7XG4gICAgICAvL2NvbnNvbGUubG9nKFwidHlwZTogZHJvcFwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZmlsZSA9IGV2ZW50LnRhcmdldC5maWxlcyB8fCBldmVudC5zcmNFbGVtZW50LmZpbGVzO1xuICAgICAgLy9jb25zb2xlLmxvZyhcInR5cGU6IGNoYW5nZVwiKTtcbiAgICB9XG4gICAgLy9jb25zb2xlLmxvZyhmaWxlKTtcbiAgICBsZXQgY3VycmVudEZpbGVFeHQ6IGFueTtcbiAgICBsZXQgZXh0OiBhbnk7XG4gICAgbGV0IGZybXRBbGxvd2VkOiBib29sZWFuO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsZS5sZW5ndGg7IGkrKykge1xuICAgICAgLy9DSEVDSyBGT1JNQVRcbiAgICAgIC8vQ1VSUkVOVCBGSUxFIEVYVEVOU0lPTlxuICAgICAgY3VycmVudEZpbGVFeHQgPSB0aGlzLnJlZy5leGVjKGZpbGVbaV0ubmFtZSk7XG4gICAgICBjdXJyZW50RmlsZUV4dCA9IGN1cnJlbnRGaWxlRXh0WzFdO1xuICAgICAgLy9jb25zb2xlLmxvZyhmaWxlW2ldLm5hbWUpO1xuICAgICAgZnJtdEFsbG93ZWQgPSBmYWxzZTtcbiAgICAgIC8vRk9STUFUIEFMTE9XRUQgTElTVCBJVEVSQVRFXG4gICAgICBmb3IgKGxldCBqID0gZm9ybWF0c0NvdW50OyBqID4gMDsgai0tKSB7XG4gICAgICAgIGV4dCA9IHRoaXMuZm9ybWF0c0FsbG93ZWQuc3BsaXQoXCIuXCIpW2pdO1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwiRk9STUFUIExJU1QgKFwiK2orXCIpPSBcIitleHQuc3BsaXQoXCIsXCIpWzBdKTtcbiAgICAgICAgaWYgKGogPT0gZm9ybWF0c0NvdW50KSB7XG4gICAgICAgICAgZXh0ID0gdGhpcy5mb3JtYXRzQWxsb3dlZC5zcGxpdChcIi5cIilbal0gKyBcIixcIjtcbiAgICAgICAgfSAvL2NoZWNrIGZvcm1hdFxuICAgICAgICBpZiAoY3VycmVudEZpbGVFeHQudG9Mb3dlckNhc2UoKSA9PSBleHQuc3BsaXQoXCIsXCIpWzBdKSB7XG4gICAgICAgICAgZnJtdEFsbG93ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChmcm10QWxsb3dlZCkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwiRk9STUFUIEFMTE9XRURcIik7XG4gICAgICAgIC8vQ0hFQ0sgU0laRVxuICAgICAgICBpZiAoZmlsZVtpXS5zaXplID4gdGhpcy5tYXhTaXplICogMTAyNDAwMCkge1xuICAgICAgICAgIC8vY29uc29sZS5sb2coXCJTSVpFIE5PVCBBTExPV0VEIChcIitmaWxlW2ldLnNpemUrXCIpXCIpO1xuICAgICAgICAgIHRoaXMubm90QWxsb3dlZExpc3QucHVzaCh7XG4gICAgICAgICAgICBmaWxlTmFtZTogZmlsZVtpXS5uYW1lLFxuICAgICAgICAgICAgZmlsZVNpemU6IHRoaXMuY29udmVydFNpemUoZmlsZVtpXS5zaXplKSxcbiAgICAgICAgICAgIGVycm9yTXNnOiBcIkludmFsaWQgc2l6ZVwiXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy9mb3JtYXQgYWxsb3dlZCBhbmQgc2l6ZSBhbGxvd2VkIHRoZW4gYWRkIGZpbGUgdG8gc2VsZWN0ZWRGaWxlIGFycmF5XG4gICAgICAgICAgdGhpcy5zZWxlY3RlZEZpbGVzLnB1c2goZmlsZVtpXSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coXCJGT1JNQVQgTk9UIEFMTE9XRURcIik7XG4gICAgICAgIHRoaXMubm90QWxsb3dlZExpc3QucHVzaCh7XG4gICAgICAgICAgZmlsZU5hbWU6IGZpbGVbaV0ubmFtZSxcbiAgICAgICAgICBmaWxlU2l6ZTogdGhpcy5jb252ZXJ0U2l6ZShmaWxlW2ldLnNpemUpLFxuICAgICAgICAgIGVycm9yTXNnOiBcIkludmFsaWQgZm9ybWF0XCJcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLnNlbGVjdGVkRmlsZXMubGVuZ3RoICE9PSAwKSB7XG4gICAgICB0aGlzLnVwbG9hZEJ0biA9IHRydWU7XG4gICAgICBpZiAodGhpcy50aGVtZSA9PSBcImF0dGFjaFBpblwiKSB0aGlzLnVwbG9hZEZpbGVzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudXBsb2FkQnRuID0gZmFsc2U7XG4gICAgfVxuICAgIHRoaXMudXBsb2FkTXNnID0gZmFsc2U7XG4gICAgdGhpcy51cGxvYWRDbGljayA9IHRydWU7XG4gICAgdGhpcy5wZXJjZW50Q29tcGxldGUgPSAwO1xuICAgIGV2ZW50LnRhcmdldC52YWx1ZSA9IG51bGw7XG4gIH1cblxuICB1cGxvYWRGaWxlcygpIHtcbiAgICAvL2NvbnNvbGUubG9nKHRoaXMuc2VsZWN0ZWRGaWxlcyk7XG5cbiAgICBsZXQgaTogYW55O1xuICAgIHRoaXMucHJvZ3Jlc3NCYXJTaG93ID0gdHJ1ZTtcbiAgICB0aGlzLnVwbG9hZENsaWNrID0gZmFsc2U7XG4gICAgdGhpcy5ub3RBbGxvd2VkTGlzdCA9IFtdO1xuICAgIGxldCBpc0Vycm9yID0gZmFsc2U7XG5cbiAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgbGV0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5zZWxlY3RlZEZpbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodGhpcy5DYXB0aW9uW2ldID09IHVuZGVmaW5lZCkgdGhpcy5DYXB0aW9uW2ldID0gXCJmaWxlXCI7XG4gICAgICAvL0FkZCBEQVRBIFRPIEJFIFNFTlRcbiAgICAgIGZvcm1EYXRhLmFwcGVuZChcbiAgICAgICAgdGhpcy5DYXB0aW9uW2ldLFxuICAgICAgICB0aGlzLnNlbGVjdGVkRmlsZXNbaV0gLyosIHRoaXMuc2VsZWN0ZWRGaWxlc1tpXS5uYW1lKi9cbiAgICAgICk7XG4gICAgICAvL2NvbnNvbGUubG9nKHRoaXMuc2VsZWN0ZWRGaWxlc1tpXStcIntcIit0aGlzLkNhcHRpb25baV0rXCIgKENhcHRpb24pfVwiKTtcbiAgICB9XG5cbiAgICBpZiAoaSA+IDEpIHtcbiAgICAgIHRoaXMuc2luZ2xlRmlsZSA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNpbmdsZUZpbGUgPSB0cnVlO1xuICAgIH1cblxuICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBldm50ID0+IHtcbiAgICAgIC8vY29uc29sZS5sb2coXCJvbnJlYWR5XCIpO1xuICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgIGlmICh4aHIuc3RhdHVzICE9PSAyMDApIHtcbiAgICAgICAgICBpc0Vycm9yID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLnByb2dyZXNzQmFyU2hvdyA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMudXBsb2FkQnRuID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy51cGxvYWRNc2cgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuYWZ0ZXJVcGxvYWQgPSB0cnVlO1xuICAgICAgICAgIHRoaXMudXBsb2FkTXNnVGV4dCA9IFwiVXBsb2FkIEZhaWxlZCAhXCI7XG4gICAgICAgICAgdGhpcy51cGxvYWRNc2dDbGFzcyA9IFwidGV4dC1kYW5nZXIgbGVhZFwiO1xuICAgICAgICAgIC8vY29uc29sZS5sb2codGhpcy51cGxvYWRNc2dUZXh0KTtcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKGV2bnQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuQXBpUmVzcG9uc2UuZW1pdCh4aHIpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB4aHIudXBsb2FkLm9ucHJvZ3Jlc3MgPSBldm50ID0+IHtcbiAgICAgIHRoaXMudXBsb2FkQnRuID0gZmFsc2U7IC8vIGJ1dHRvbiBzaG91bGQgYmUgZGlzYWJsZWQgYnkgcHJvY2VzcyB1cGxvYWRpbmdcbiAgICAgIGlmIChldm50Lmxlbmd0aENvbXB1dGFibGUpIHtcbiAgICAgICAgdGhpcy5wZXJjZW50Q29tcGxldGUgPSBNYXRoLnJvdW5kKChldm50LmxvYWRlZCAvIGV2bnQudG90YWwpICogMTAwKTtcbiAgICAgIH1cbiAgICAgIC8vY29uc29sZS5sb2coXCJQcm9ncmVzcy4uLlwiLyordGhpcy5wZXJjZW50Q29tcGxldGUrXCIgJVwiKi8pO1xuICAgIH07XG5cbiAgICB4aHIub25sb2FkID0gZXZudCA9PiB7XG4gICAgICAvL2NvbnNvbGUubG9nKFwib25sb2FkXCIpO1xuICAgICAgLy9jb25zb2xlLmxvZyhldm50KTtcbiAgICAgIHRoaXMucHJvZ3Jlc3NCYXJTaG93ID0gZmFsc2U7XG4gICAgICB0aGlzLnVwbG9hZEJ0biA9IGZhbHNlO1xuICAgICAgdGhpcy51cGxvYWRNc2cgPSB0cnVlO1xuICAgICAgdGhpcy5hZnRlclVwbG9hZCA9IHRydWU7XG4gICAgICBpZiAoIWlzRXJyb3IpIHtcbiAgICAgICAgdGhpcy51cGxvYWRNc2dUZXh0ID0gXCJTdWNjZXNzZnVsbHkgVXBsb2FkZWQgIVwiO1xuICAgICAgICB0aGlzLnVwbG9hZE1zZ0NsYXNzID0gXCJ0ZXh0LXN1Y2Nlc3MgbGVhZFwiO1xuICAgICAgICAvL2NvbnNvbGUubG9nKHRoaXMudXBsb2FkTXNnVGV4dCArIFwiIFwiICsgdGhpcy5zZWxlY3RlZEZpbGVzLmxlbmd0aCArIFwiIGZpbGVcIik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHhoci5vbmVycm9yID0gZXZudCA9PiB7XG4gICAgICAvL2NvbnNvbGUubG9nKFwib25lcnJvclwiKTtcbiAgICAgIC8vY29uc29sZS5sb2coZXZudCk7XG4gICAgfTtcblxuICAgIHhoci5vcGVuKFwiUE9TVFwiLCB0aGlzLnVwbG9hZEFQSSwgdHJ1ZSk7XG4gICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXModGhpcy5oZWFkZXJzKSkge1xuICAgICAgLy8gT2JqZWN0LmtleXMgd2lsbCBnaXZlIGFuIEFycmF5IG9mIGtleXNcbiAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgdGhpcy5oZWFkZXJzW2tleV0pO1xuICAgIH1cbiAgICAvL2xldCB0b2tlbiA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oXCJ0b2tlblwiKTtcbiAgICAvL3hoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwidGV4dC9wbGFpbjtjaGFyc2V0PVVURi04XCIpO1xuICAgIC8veGhyLnNldFJlcXVlc3RIZWFkZXIoJ0F1dGhvcml6YXRpb24nLCBgQmVhcmVyICR7dG9rZW59YCk7XG4gICAgeGhyLnNlbmQoZm9ybURhdGEpO1xuICB9XG5cbiAgcmVtb3ZlRmlsZShpOiBhbnksIHNmX25hOiBhbnkpIHtcbiAgICAvL2NvbnNvbGUubG9nKFwicmVtb3ZlIGZpbGUgY2xpY2tlZCBcIiArIGkpXG4gICAgaWYgKHNmX25hID09IFwic2ZcIikge1xuICAgICAgdGhpcy5zZWxlY3RlZEZpbGVzLnNwbGljZShpLCAxKTtcbiAgICAgIHRoaXMuQ2FwdGlvbi5zcGxpY2UoaSwgMSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubm90QWxsb3dlZExpc3Quc3BsaWNlKGksIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNlbGVjdGVkRmlsZXMubGVuZ3RoID09IDApIHtcbiAgICAgIHRoaXMudXBsb2FkQnRuID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgY29udmVydFNpemUoZmlsZVNpemU6IG51bWJlcikge1xuICAgIC8vY29uc29sZS5sb2coZmlsZVNpemUgKyBcIiAtIFwiKyBzdHIpO1xuICAgIHJldHVybiBmaWxlU2l6ZSA8IDEwMjQwMDBcbiAgICAgID8gKGZpbGVTaXplIC8gMTAyNCkudG9GaXhlZCgyKSArIFwiIEtCXCJcbiAgICAgIDogKGZpbGVTaXplIC8gMTAyNDAwMCkudG9GaXhlZCgyKSArIFwiIE1CXCI7XG4gIH1cblxuICBhdHRhY2hwaW5PbmNsaWNrKCkge1xuICAgIC8vY29uc29sZS5sb2coXCJJRDogXCIsIHRoaXMuaWQpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsXCIgKyB0aGlzLmlkKSEuY2xpY2soKTtcbiAgICAvLyQoXCIjXCIrXCJzZWxcIit0aGlzLmlkKS5jbGljaygpO1xuICB9XG5cbiAgZHJvcChldmVudDogYW55KSB7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAvL2NvbnNvbGUubG9nKFwiZHJvcDogXCIsIGV2ZW50KTtcbiAgICAvL2NvbnNvbGUubG9nKFwiZHJvcDogXCIsIGV2ZW50LmRhdGFUcmFuc2Zlci5maWxlcyk7XG4gICAgdGhpcy5vbkNoYW5nZShldmVudCk7XG4gIH1cbiAgYWxsb3dEcm9wKGV2ZW50OiBhbnkpIHtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJjb3B5XCI7XG4gICAgLy9jb25zb2xlLmxvZyhcImFsbG93RHJvcDogXCIsZXZlbnQpXG4gIH1cbn1cblxuLyogaW50ZXJmYWNlIENPTkZJRyB7XG4gIHVwbG9hZEFQSTogc3RyaW5nO1xuICBtdWx0aXBsZT86IGJvb2xlYW47XG4gIGZvcm1hdHNBbGxvd2VkPzogc3RyaW5nO1xuICBtYXhTaXplPzogbnVtYmVyO1xuICBpZD86IG51bWJlcjtcbiAgcmVzZXRVcGxvYWQ/OiBib29sZWFuO1xuICB0aGVtZT86IHN0cmluZztcbiAgaGlkZVByb2dyZXNzQmFyPzogYm9vbGVhbjtcbiB9XG4gKi8iLCJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEFuZ3VsYXJGaWxlVXBsb2FkZXJDb21wb25lbnQgfSBmcm9tICcuL2FuZ3VsYXItZmlsZS11cGxvYWRlci5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgQ29tbW9uTW9kdWxlXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW0FuZ3VsYXJGaWxlVXBsb2FkZXJDb21wb25lbnRdLFxuICBleHBvcnRzOiBbQW5ndWxhckZpbGVVcGxvYWRlckNvbXBvbmVudF1cbn0pXG5leHBvcnQgY2xhc3MgQW5ndWxhckZpbGVVcGxvYWRlck1vZHVsZSB7IH1cbiJdLCJuYW1lcyI6WyJ0c2xpYl8xLl9fdmFsdWVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBO0lBT0U7S0FBaUI7O2dCQUxsQixVQUFVLFNBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25COzs7OztxQ0FKRDs7Ozs7Ozs7SUNtSEU7Ozs7c0JBbENjLEVBQUU7MkJBRU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUM7MkJBRW5DLElBQUksWUFBWSxFQUFFO3NCQWVmLENBQUMsSUFBSSxJQUFJLEVBQUU7bUJBQ2QsaUJBQWlCOzZCQUNILEVBQUU7OEJBQ0UsRUFBRTt1QkFDVCxFQUFFOzBCQUNkLElBQUk7K0JBQ0MsS0FBSzt5QkFDWCxLQUFLO3lCQUNMLEtBQUs7MkJBQ0gsS0FBSzsyQkFDTCxJQUFJO0tBU2pCOzs7OztJQUVELGtEQUFXOzs7O0lBQVgsVUFBWSxHQUFrQjtRQUM1QixJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUNqQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3hDLElBQUksQ0FBQyxFQUFFO2dCQUNMLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO29CQUNqQixRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssRUFBRSxRQUFRLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENB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