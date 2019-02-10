import { Injectable, NgModule, defineInjectable, EventEmitter, Component, Input, Output } from '@angular/core';
import { __assign, __values } from 'tslib';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var AngularFileUploaderService = /** @class */ (function () {
    function AngularFileUploaderService() {
    }
    AngularFileUploaderService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] },
    ];
    AngularFileUploaderService.ctorParameters = function () { return []; };
    /** @nocollapse */ AngularFileUploaderService.ngInjectableDef = defineInjectable({ factory: function AngularFileUploaderService_Factory() { return new AngularFileUploaderService(); }, token: AngularFileUploaderService, providedIn: "root" });
    return AngularFileUploaderService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var AngularFileUploaderComponent = /** @class */ (function () {
    function AngularFileUploaderComponent() {
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
        //console.log("id: ",this.id);
        //console.log("idDate: ",this.idDate);
        //console.log(Math.random());
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
            this.maxSize = this.config["maxSize"] || 20;
            this.uploadAPI = this.config["uploadAPI"]["url"];
            this.formatsAllowed =
                this.config["formatsAllowed"] || ".jpg,.png,.pdf,.docx,.txt,.gif,.jpeg";
            this.multiple = this.config["multiple"] || false;
            this.headers = this.config["uploadAPI"]["headers"] || {};
            /** @type {?} */
            var defaultReplaceTextsValues = {
                selectFileBtn: this.multiple ? 'Select Files' : 'Select File',
                resetBtn: 'Reset',
                uploadBtn: 'Upload',
                dragNDropBox: 'Drag N Drop',
                attachPinBtn: this.multiple ? 'Attach Files...' : 'Attach File...',
                afterUploadMsg_success: 'Successfully Uploaded !',
                afterUploadMsg_error: 'Upload Failed !'
            };
            this.replaceTexts = __assign({}, defaultReplaceTextsValues);
            if (this.config["replaceTexts"]) {
                this.replaceTexts = __assign({}, defaultReplaceTextsValues, this.config['replaceTexts']);
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
        /** @type {?} */
        var formatsCount;
        formatsCount = this.formatsAllowed.match(new RegExp("\\.", "g"));
        formatsCount = formatsCount.length;
        //console.log("NO OF FORMATS ALLOWED= "+formatsCount);
        //console.log("-------------------------------");
        //ITERATE SELECTED FILES
        /** @type {?} */
        var file;
        if (event.type == "drop") {
            file = event.dataTransfer.files;
            //console.log("type: drop");
        }
        else {
            file = event.target.files || event.srcElement.files;
            //console.log("type: change");
        }
        //console.log(file);
        /** @type {?} */
        var currentFileExt;
        /** @type {?} */
        var ext;
        /** @type {?} */
        var frmtAllowed;
        for (var i = 0; i < file.length; i++) {
            //CHECK FORMAT
            //CURRENT FILE EXTENSION
            currentFileExt = this.reg.exec(file[i].name);
            currentFileExt = currentFileExt[1];
            //console.log(file[i].name);
            frmtAllowed = false;
            //FORMAT ALLOWED LIST ITERATE
            for (var j = formatsCount; j > 0; j--) {
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
        //console.log(this.selectedFiles);
        var _this = this;
        //console.log(this.selectedFiles);
        /** @type {?} */
        var i;
        this.progressBarShow = true;
        this.uploadClick = false;
        this.notAllowedList = [];
        /** @type {?} */
        var isError = false;
        /** @type {?} */
        var xhr = new XMLHttpRequest();
        /** @type {?} */
        var formData = new FormData();
        for (i = 0; i < this.selectedFiles.length; i++) {
            if (this.Caption[i] == undefined)
                this.Caption[i] = "file" + i;
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
                    _this.uploadMsgText = _this.replaceTexts.afterUploadMsg_error;
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
            _this.progressBarShow = false;
            _this.uploadBtn = false;
            _this.uploadMsg = true;
            _this.afterUpload = true;
            if (!isError) {
                _this.uploadMsgText = _this.replaceTexts.afterUploadMsg_success;
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
        //console.log("ID: ", this.id);
        (/** @type {?} */ (document.getElementById("sel" + this.id))).click();
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
                    template: "<div class=\"container\" *ngIf=\"(theme !== 'attachPin')\" id=\"default\">\n\n    <!-- Drag n Drop theme Starts -->\n    <div *ngIf=\"theme == 'dragNDrop'\" id=\"dragNDrop\" [ngClass]=\"(hideSelectBtn && hideResetBtn) ? null : 'dragNDropBtmPad'\" class=\"dragNDrop\">\n        <div style=\"position:relative;\">\n            <div id=\"div1\" class=\"div1 afu-dragndrop-box\" (drop)=\"drop($event)\" (dragover)=\"allowDrop($event)\">\n                <p class=\"afu-dragndrop-text\">{{replaceTexts?.dragNDropBox}}</p>\n            </div>\n            <!-- <span class='label label-info' id=\"upload-file-info{{id}}\">{{selectedFiles[0]?.name}}</span> -->\n        </div>\n    </div>\n    <!-- Drag n Drop theme Ends -->\n\n    <label for=\"sel{{id}}\" class=\"btn btn-primary btn-sm afu-select-btn\" *ngIf=\"!hideSelectBtn\">{{replaceTexts?.selectFileBtn}}</label>\n    <input type=\"file\" id=\"sel{{id}}\" style=\"display: none\" *ngIf=\"!hideSelectBtn\" (change)=\"onChange($event)\" title=\"Select file\"\n        name=\"files[]\" [accept]=formatsAllowed [attr.multiple]=\"multiple ? '' : null\" />\n    <button class=\"btn btn-info btn-sm resetBtn afu-reset-btn\" (click)=\"resetFileUpload()\" *ngIf=\"!hideResetBtn\">{{replaceTexts?.resetBtn}}</button>\n    <br *ngIf=\"!hideSelectBtn\">\n    <p class=\"constraints-info afu-constraints-info\">({{formatsAllowed}}) Size limit- {{(convertSize(maxSize *1024000))}}</p>\n    <!--Selected file list-->\n    <div class=\"row afu-valid-file\" *ngFor=\"let sf of selectedFiles;let i=index\" >\n        <p class=\"col-xs-3 textOverflow\"><span class=\"text-primary\">{{sf.name}}</span></p>\n        <p class=\"col-xs-3 padMarg sizeC\"><strong>({{convertSize(sf.size)}})</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>\n        <!--  <input class=\"col-xs-3 progress caption\"  type=\"text\"  placeholder=\"Caption..\"  [(ngModel)]=\"Caption[i]\"  *ngIf=\"uploadClick\"/> -->\n        <div class=\"progress col-xs-3 padMarg afu-progress-bar\" *ngIf=\"singleFile && progressBarShow && !hideProgressBar\">\n            <span class=\"progress-bar progress-bar-success\" role=\"progressbar\" [ngStyle]=\"{'width':percentComplete+'%'}\">{{percentComplete}}%</span>\n        </div>\n        <a class=\"col-xs-1\" role=\"button\" (click)=\"removeFile(i,'sf')\" *ngIf=\"uploadClick\"><i class=\"fa fa-times\"></i></a>\n    </div>\n    <!--Invalid file list-->\n    <div class=\"row text-danger afu-invalid-file\" *ngFor=\"let na of notAllowedList;let j=index\">\n        <p class=\"col-xs-3 textOverflow\"><span>{{na['fileName']}}</span></p>\n        <p class=\"col-xs-3 padMarg sizeC\"><strong>({{na['fileSize']}})</strong></p>\n        <p class=\"col-xs-3 \">{{na['errorMsg']}}</p>\n        <a class=\"col-xs-1 delFileIcon\" role=\"button\" (click)=\"removeFile(j,'na')\" *ngIf=\"uploadClick\">&nbsp;<i class=\"fa fa-times\"></i></a>\n    </div>\n\n    <p *ngIf=\"uploadMsg\" class=\"{{uploadMsgClass}} + afu-upload-status\">{{uploadMsgText}}<p>\n    <div *ngIf=\"!singleFile && progressBarShow && !hideProgressBar\">\n        <div class=\"progress col-xs-4 padMarg afu-progress-bar\">\n            <span class=\"progress-bar progress-bar-success\" role=\"progressbar\" [ngStyle]=\"{'width':percentComplete+'%'}\">{{percentComplete}}%</span>\n        </div>\n        <br>\n        <br>\n    </div>\n    <button class=\"btn btn-success afu-upload-btn\" type=\"button\" (click)=\"uploadFiles()\" [disabled]=!uploadBtn>{{replaceTexts?.uploadBtn}}</button>\n    <br>\n</div>\n\n<!--/////////////////////////// ATTACH PIN THEME  //////////////////////////////////////////////////////////-->\n<div *ngIf=\"theme == 'attachPin'\" id=\"attachPin\">\n    <div style=\"position:relative;padding-left:6px\">\n        <a class='btn up_btn afu-attach-pin' (click)=\"attachpinOnclick()\">\n          {{replaceTexts?.attachPinBtn}}\n            <i class=\"fa fa-paperclip\" aria-hidden=\"true\"></i>\n            <!-- <p style=\"margin-top:10px\">({{formatsAllowed}}) Size limit- {{(convertSize(maxSize * 1024000))}}</p> -->\n            <input type=\"file\" id=\"sel{{id}}\" (change)=\"onChange($event)\" style=\"display: none\" title=\"Select file\" name=\"files[]\" [accept]=formatsAllowed\n                [attr.multiple]=\"multiple ? '' : null\" />\n            <br>\n        </a>\n        &nbsp;\n        <span class='label label-info' id=\"upload-file-info{{id}}\">{{selectedFiles[0]?.name}}</span>\n    </div>\n</div>\n\n<!--/////////////////////////// DRAG N DROP THEME  //////////////////////////////////////////////////////////-->\n<!-- <div *ngIf=\"theme == 'dragNDrop'\" id=\"dragNDrop\">\n  <div style=\"position:relative;padding-left:6px\">\n    <div id=\"div1\" (drop)=\"drop($event)\" (dragover)=\"allowDrop($event)\">\n      <p>Drag N Drop</p>\n    </div>\n    <span class='label label-info' id=\"upload-file-info{{id}}\">{{selectedFiles[0]?.name}}</span>\n  </div>\n</div> -->\n",
                    styles: [".constraints-info{margin-top:10px;font-style:italic}.padMarg{padding:0;margin-bottom:0}.caption{margin-right:5px}.textOverflow{white-space:nowrap;padding-right:0;overflow:hidden;text-overflow:ellipsis}.up_btn{color:#000;background-color:transparent;border:2px solid #5c5b5b;border-radius:22px}.delFileIcon{text-decoration:none;color:#ce0909}.dragNDrop .div1{display:border-box;border:2px dashed #5c5b5b;height:6rem;width:20rem}.dragNDrop .div1>p{text-align:center;font-weight:700;color:#5c5b5b;margin-top:1.4em}.dragNDropBtmPad{padding-bottom:2rem}@media screen and (max-width:620px){.caption{padding:0}}@media screen and (max-width:510px){.sizeC{width:25%}}@media screen and (max-width:260px){.caption,.sizeC{font-size:10px}}.resetBtn{margin-left:3px}"]
                },] },
    ];
    AngularFileUploaderComponent.ctorParameters = function () { return []; };
    AngularFileUploaderComponent.propDecorators = {
        config: [{ type: Input }],
        resetUpload: [{ type: Input }],
        ApiResponse: [{ type: Output }]
    };
    return AngularFileUploaderComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
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
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

export { AngularFileUploaderService, AngularFileUploaderComponent, AngularFileUploaderModule };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1maWxlLXVwbG9hZGVyLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9hbmd1bGFyLWZpbGUtdXBsb2FkZXIvbGliL2FuZ3VsYXItZmlsZS11cGxvYWRlci5zZXJ2aWNlLnRzIiwibmc6Ly9hbmd1bGFyLWZpbGUtdXBsb2FkZXIvbGliL2FuZ3VsYXItZmlsZS11cGxvYWRlci5jb21wb25lbnQudHMiLCJuZzovL2FuZ3VsYXItZmlsZS11cGxvYWRlci9saWIvYW5ndWxhci1maWxlLXVwbG9hZGVyLm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIEFuZ3VsYXJGaWxlVXBsb2FkZXJTZXJ2aWNlIHtcblxuICBjb25zdHJ1Y3RvcigpIHsgfVxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2VzLCBJbmplY3QsIFZpZXdFbmNhcHN1bGF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6IFwiYW5ndWxhci1maWxlLXVwbG9hZGVyXCIsXG4gIHRlbXBsYXRlOiBgPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiICpuZ0lmPVwiKHRoZW1lICE9PSAnYXR0YWNoUGluJylcIiBpZD1cImRlZmF1bHRcIj5cblxuICAgIDwhLS0gRHJhZyBuIERyb3AgdGhlbWUgU3RhcnRzIC0tPlxuICAgIDxkaXYgKm5nSWY9XCJ0aGVtZSA9PSAnZHJhZ05Ecm9wJ1wiIGlkPVwiZHJhZ05Ecm9wXCIgW25nQ2xhc3NdPVwiKGhpZGVTZWxlY3RCdG4gJiYgaGlkZVJlc2V0QnRuKSA/IG51bGwgOiAnZHJhZ05Ecm9wQnRtUGFkJ1wiIGNsYXNzPVwiZHJhZ05Ecm9wXCI+XG4gICAgICAgIDxkaXYgc3R5bGU9XCJwb3NpdGlvbjpyZWxhdGl2ZTtcIj5cbiAgICAgICAgICAgIDxkaXYgaWQ9XCJkaXYxXCIgY2xhc3M9XCJkaXYxIGFmdS1kcmFnbmRyb3AtYm94XCIgKGRyb3ApPVwiZHJvcCgkZXZlbnQpXCIgKGRyYWdvdmVyKT1cImFsbG93RHJvcCgkZXZlbnQpXCI+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJhZnUtZHJhZ25kcm9wLXRleHRcIj57e3JlcGxhY2VUZXh0cz8uZHJhZ05Ecm9wQm94fX08L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwhLS0gPHNwYW4gY2xhc3M9J2xhYmVsIGxhYmVsLWluZm8nIGlkPVwidXBsb2FkLWZpbGUtaW5mb3t7aWR9fVwiPnt7c2VsZWN0ZWRGaWxlc1swXT8ubmFtZX19PC9zcGFuPiAtLT5cbiAgICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPCEtLSBEcmFnIG4gRHJvcCB0aGVtZSBFbmRzIC0tPlxuXG4gICAgPGxhYmVsIGZvcj1cInNlbHt7aWR9fVwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5IGJ0bi1zbSBhZnUtc2VsZWN0LWJ0blwiICpuZ0lmPVwiIWhpZGVTZWxlY3RCdG5cIj57e3JlcGxhY2VUZXh0cz8uc2VsZWN0RmlsZUJ0bn19PC9sYWJlbD5cbiAgICA8aW5wdXQgdHlwZT1cImZpbGVcIiBpZD1cInNlbHt7aWR9fVwiIHN0eWxlPVwiZGlzcGxheTogbm9uZVwiICpuZ0lmPVwiIWhpZGVTZWxlY3RCdG5cIiAoY2hhbmdlKT1cIm9uQ2hhbmdlKCRldmVudClcIiB0aXRsZT1cIlNlbGVjdCBmaWxlXCJcbiAgICAgICAgbmFtZT1cImZpbGVzW11cIiBbYWNjZXB0XT1mb3JtYXRzQWxsb3dlZCBbYXR0ci5tdWx0aXBsZV09XCJtdWx0aXBsZSA/ICcnIDogbnVsbFwiIC8+XG4gICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4taW5mbyBidG4tc20gcmVzZXRCdG4gYWZ1LXJlc2V0LWJ0blwiIChjbGljayk9XCJyZXNldEZpbGVVcGxvYWQoKVwiICpuZ0lmPVwiIWhpZGVSZXNldEJ0blwiPnt7cmVwbGFjZVRleHRzPy5yZXNldEJ0bn19PC9idXR0b24+XG4gICAgPGJyICpuZ0lmPVwiIWhpZGVTZWxlY3RCdG5cIj5cbiAgICA8cCBjbGFzcz1cImNvbnN0cmFpbnRzLWluZm8gYWZ1LWNvbnN0cmFpbnRzLWluZm9cIj4oe3tmb3JtYXRzQWxsb3dlZH19KSBTaXplIGxpbWl0LSB7eyhjb252ZXJ0U2l6ZShtYXhTaXplICoxMDI0MDAwKSl9fTwvcD5cbiAgICA8IS0tU2VsZWN0ZWQgZmlsZSBsaXN0LS0+XG4gICAgPGRpdiBjbGFzcz1cInJvdyBhZnUtdmFsaWQtZmlsZVwiICpuZ0Zvcj1cImxldCBzZiBvZiBzZWxlY3RlZEZpbGVzO2xldCBpPWluZGV4XCIgPlxuICAgICAgICA8cCBjbGFzcz1cImNvbC14cy0zIHRleHRPdmVyZmxvd1wiPjxzcGFuIGNsYXNzPVwidGV4dC1wcmltYXJ5XCI+e3tzZi5uYW1lfX08L3NwYW4+PC9wPlxuICAgICAgICA8cCBjbGFzcz1cImNvbC14cy0zIHBhZE1hcmcgc2l6ZUNcIj48c3Ryb25nPih7e2NvbnZlcnRTaXplKHNmLnNpemUpfX0pPC9zdHJvbmc+Jm5ic3A7Jm5ic3A7Jm5ic3A7Jm5ic3A7Jm5ic3A7PC9wPlxuICAgICAgICA8IS0tICA8aW5wdXQgY2xhc3M9XCJjb2wteHMtMyBwcm9ncmVzcyBjYXB0aW9uXCIgIHR5cGU9XCJ0ZXh0XCIgIHBsYWNlaG9sZGVyPVwiQ2FwdGlvbi4uXCIgIFsobmdNb2RlbCldPVwiQ2FwdGlvbltpXVwiICAqbmdJZj1cInVwbG9hZENsaWNrXCIvPiAtLT5cbiAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzIGNvbC14cy0zIHBhZE1hcmcgYWZ1LXByb2dyZXNzLWJhclwiICpuZ0lmPVwic2luZ2xlRmlsZSAmJiBwcm9ncmVzc0JhclNob3cgJiYgIWhpZGVQcm9ncmVzc0JhclwiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwcm9ncmVzcy1iYXIgcHJvZ3Jlc3MtYmFyLXN1Y2Nlc3NcIiByb2xlPVwicHJvZ3Jlc3NiYXJcIiBbbmdTdHlsZV09XCJ7J3dpZHRoJzpwZXJjZW50Q29tcGxldGUrJyUnfVwiPnt7cGVyY2VudENvbXBsZXRlfX0lPC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGEgY2xhc3M9XCJjb2wteHMtMVwiIHJvbGU9XCJidXR0b25cIiAoY2xpY2spPVwicmVtb3ZlRmlsZShpLCdzZicpXCIgKm5nSWY9XCJ1cGxvYWRDbGlja1wiPjxpIGNsYXNzPVwiZmEgZmEtdGltZXNcIj48L2k+PC9hPlxuICAgIDwvZGl2PlxuICAgIDwhLS1JbnZhbGlkIGZpbGUgbGlzdC0tPlxuICAgIDxkaXYgY2xhc3M9XCJyb3cgdGV4dC1kYW5nZXIgYWZ1LWludmFsaWQtZmlsZVwiICpuZ0Zvcj1cImxldCBuYSBvZiBub3RBbGxvd2VkTGlzdDtsZXQgaj1pbmRleFwiPlxuICAgICAgICA8cCBjbGFzcz1cImNvbC14cy0zIHRleHRPdmVyZmxvd1wiPjxzcGFuPnt7bmFbJ2ZpbGVOYW1lJ119fTwvc3Bhbj48L3A+XG4gICAgICAgIDxwIGNsYXNzPVwiY29sLXhzLTMgcGFkTWFyZyBzaXplQ1wiPjxzdHJvbmc+KHt7bmFbJ2ZpbGVTaXplJ119fSk8L3N0cm9uZz48L3A+XG4gICAgICAgIDxwIGNsYXNzPVwiY29sLXhzLTMgXCI+e3tuYVsnZXJyb3JNc2cnXX19PC9wPlxuICAgICAgICA8YSBjbGFzcz1cImNvbC14cy0xIGRlbEZpbGVJY29uXCIgcm9sZT1cImJ1dHRvblwiIChjbGljayk9XCJyZW1vdmVGaWxlKGosJ25hJylcIiAqbmdJZj1cInVwbG9hZENsaWNrXCI+Jm5ic3A7PGkgY2xhc3M9XCJmYSBmYS10aW1lc1wiPjwvaT48L2E+XG4gICAgPC9kaXY+XG5cbiAgICA8cCAqbmdJZj1cInVwbG9hZE1zZ1wiIGNsYXNzPVwie3t1cGxvYWRNc2dDbGFzc319ICsgYWZ1LXVwbG9hZC1zdGF0dXNcIj57e3VwbG9hZE1zZ1RleHR9fTxwPlxuICAgIDxkaXYgKm5nSWY9XCIhc2luZ2xlRmlsZSAmJiBwcm9ncmVzc0JhclNob3cgJiYgIWhpZGVQcm9ncmVzc0JhclwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MgY29sLXhzLTQgcGFkTWFyZyBhZnUtcHJvZ3Jlc3MtYmFyXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInByb2dyZXNzLWJhciBwcm9ncmVzcy1iYXItc3VjY2Vzc1wiIHJvbGU9XCJwcm9ncmVzc2JhclwiIFtuZ1N0eWxlXT1cInsnd2lkdGgnOnBlcmNlbnRDb21wbGV0ZSsnJSd9XCI+e3twZXJjZW50Q29tcGxldGV9fSU8L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8YnI+XG4gICAgICAgIDxicj5cbiAgICA8L2Rpdj5cbiAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1zdWNjZXNzIGFmdS11cGxvYWQtYnRuXCIgdHlwZT1cImJ1dHRvblwiIChjbGljayk9XCJ1cGxvYWRGaWxlcygpXCIgW2Rpc2FibGVkXT0hdXBsb2FkQnRuPnt7cmVwbGFjZVRleHRzPy51cGxvYWRCdG59fTwvYnV0dG9uPlxuICAgIDxicj5cbjwvZGl2PlxuXG48IS0tLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vIEFUVEFDSCBQSU4gVEhFTUUgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8tLT5cbjxkaXYgKm5nSWY9XCJ0aGVtZSA9PSAnYXR0YWNoUGluJ1wiIGlkPVwiYXR0YWNoUGluXCI+XG4gICAgPGRpdiBzdHlsZT1cInBvc2l0aW9uOnJlbGF0aXZlO3BhZGRpbmctbGVmdDo2cHhcIj5cbiAgICAgICAgPGEgY2xhc3M9J2J0biB1cF9idG4gYWZ1LWF0dGFjaC1waW4nIChjbGljayk9XCJhdHRhY2hwaW5PbmNsaWNrKClcIj5cbiAgICAgICAgICB7e3JlcGxhY2VUZXh0cz8uYXR0YWNoUGluQnRufX1cbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtcGFwZXJjbGlwXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxuICAgICAgICAgICAgPCEtLSA8cCBzdHlsZT1cIm1hcmdpbi10b3A6MTBweFwiPih7e2Zvcm1hdHNBbGxvd2VkfX0pIFNpemUgbGltaXQtIHt7KGNvbnZlcnRTaXplKG1heFNpemUgKiAxMDI0MDAwKSl9fTwvcD4gLS0+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cImZpbGVcIiBpZD1cInNlbHt7aWR9fVwiIChjaGFuZ2UpPVwib25DaGFuZ2UoJGV2ZW50KVwiIHN0eWxlPVwiZGlzcGxheTogbm9uZVwiIHRpdGxlPVwiU2VsZWN0IGZpbGVcIiBuYW1lPVwiZmlsZXNbXVwiIFthY2NlcHRdPWZvcm1hdHNBbGxvd2VkXG4gICAgICAgICAgICAgICAgW2F0dHIubXVsdGlwbGVdPVwibXVsdGlwbGUgPyAnJyA6IG51bGxcIiAvPlxuICAgICAgICAgICAgPGJyPlxuICAgICAgICA8L2E+XG4gICAgICAgICZuYnNwO1xuICAgICAgICA8c3BhbiBjbGFzcz0nbGFiZWwgbGFiZWwtaW5mbycgaWQ9XCJ1cGxvYWQtZmlsZS1pbmZve3tpZH19XCI+e3tzZWxlY3RlZEZpbGVzWzBdPy5uYW1lfX08L3NwYW4+XG4gICAgPC9kaXY+XG48L2Rpdj5cblxuPCEtLS8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyBEUkFHIE4gRFJPUCBUSEVNRSAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy0tPlxuPCEtLSA8ZGl2ICpuZ0lmPVwidGhlbWUgPT0gJ2RyYWdORHJvcCdcIiBpZD1cImRyYWdORHJvcFwiPlxuICA8ZGl2IHN0eWxlPVwicG9zaXRpb246cmVsYXRpdmU7cGFkZGluZy1sZWZ0OjZweFwiPlxuICAgIDxkaXYgaWQ9XCJkaXYxXCIgKGRyb3ApPVwiZHJvcCgkZXZlbnQpXCIgKGRyYWdvdmVyKT1cImFsbG93RHJvcCgkZXZlbnQpXCI+XG4gICAgICA8cD5EcmFnIE4gRHJvcDwvcD5cbiAgICA8L2Rpdj5cbiAgICA8c3BhbiBjbGFzcz0nbGFiZWwgbGFiZWwtaW5mbycgaWQ9XCJ1cGxvYWQtZmlsZS1pbmZve3tpZH19XCI+e3tzZWxlY3RlZEZpbGVzWzBdPy5uYW1lfX08L3NwYW4+XG4gIDwvZGl2PlxuPC9kaXY+IC0tPlxuYCAsXG4gIHN0eWxlczogW2AuY29uc3RyYWludHMtaW5mb3ttYXJnaW4tdG9wOjEwcHg7Zm9udC1zdHlsZTppdGFsaWN9LnBhZE1hcmd7cGFkZGluZzowO21hcmdpbi1ib3R0b206MH0uY2FwdGlvbnttYXJnaW4tcmlnaHQ6NXB4fS50ZXh0T3ZlcmZsb3d7d2hpdGUtc3BhY2U6bm93cmFwO3BhZGRpbmctcmlnaHQ6MDtvdmVyZmxvdzpoaWRkZW47dGV4dC1vdmVyZmxvdzplbGxpcHNpc30udXBfYnRue2NvbG9yOiMwMDA7YmFja2dyb3VuZC1jb2xvcjp0cmFuc3BhcmVudDtib3JkZXI6MnB4IHNvbGlkICM1YzViNWI7Ym9yZGVyLXJhZGl1czoyMnB4fS5kZWxGaWxlSWNvbnt0ZXh0LWRlY29yYXRpb246bm9uZTtjb2xvcjojY2UwOTA5fS5kcmFnTkRyb3AgLmRpdjF7ZGlzcGxheTpib3JkZXItYm94O2JvcmRlcjoycHggZGFzaGVkICM1YzViNWI7aGVpZ2h0OjZyZW07d2lkdGg6MjByZW19LmRyYWdORHJvcCAuZGl2MT5we3RleHQtYWxpZ246Y2VudGVyO2ZvbnQtd2VpZ2h0OjcwMDtjb2xvcjojNWM1YjViO21hcmdpbi10b3A6MS40ZW19LmRyYWdORHJvcEJ0bVBhZHtwYWRkaW5nLWJvdHRvbToycmVtfUBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6NjIwcHgpey5jYXB0aW9ue3BhZGRpbmc6MH19QG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDo1MTBweCl7LnNpemVDe3dpZHRoOjI1JX19QG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDoyNjBweCl7LmNhcHRpb24sLnNpemVDe2ZvbnQtc2l6ZToxMHB4fX0ucmVzZXRCdG57bWFyZ2luLWxlZnQ6M3B4fWBdXG59KVxuZXhwb3J0IGNsYXNzIEFuZ3VsYXJGaWxlVXBsb2FkZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XG4gIEBJbnB1dCgpXG4gIGNvbmZpZzogYW55ID0ge307XG4gIEBJbnB1dCgpXG4gIHJlc2V0VXBsb2FkOiBib29sZWFuID0gdGhpcy5jb25maWdbXCJyZXNldFVwbG9hZFwiXTtcbiAgQE91dHB1dCgpXG4gIEFwaVJlc3BvbnNlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIHRoZW1lOiBzdHJpbmc7XG4gIGlkOiBudW1iZXI7XG4gIGhpZGVQcm9ncmVzc0JhcjogYm9vbGVhbjtcbiAgbWF4U2l6ZTogbnVtYmVyO1xuICB1cGxvYWRBUEk6IHN0cmluZztcbiAgZm9ybWF0c0FsbG93ZWQ6IHN0cmluZztcbiAgbXVsdGlwbGU6IGJvb2xlYW47XG4gIGhlYWRlcnM6IGFueTtcbiAgaGlkZVJlc2V0QnRuOiBib29sZWFuO1xuICBoaWRlU2VsZWN0QnRuOiBib29sZWFuO1xuXG4gIGlkRGF0ZTogbnVtYmVyID0gK25ldyBEYXRlKCk7XG4gIHJlZzogUmVnRXhwID0gLyg/OlxcLihbXi5dKykpPyQvO1xuICBzZWxlY3RlZEZpbGVzOiBBcnJheTxhbnk+ID0gW107XG4gIG5vdEFsbG93ZWRMaXN0OiBBcnJheTxPYmplY3Q+ID0gW107XG4gIENhcHRpb246IEFycmF5PHN0cmluZz4gPSBbXTtcbiAgc2luZ2xlRmlsZSA9IHRydWU7XG4gIHByb2dyZXNzQmFyU2hvdyA9IGZhbHNlO1xuICB1cGxvYWRCdG4gPSBmYWxzZTtcbiAgdXBsb2FkTXNnID0gZmFsc2U7XG4gIGFmdGVyVXBsb2FkID0gZmFsc2U7XG4gIHVwbG9hZENsaWNrID0gdHJ1ZTtcbiAgdXBsb2FkTXNnVGV4dDogc3RyaW5nO1xuICB1cGxvYWRNc2dDbGFzczogc3RyaW5nO1xuICBwZXJjZW50Q29tcGxldGU6IG51bWJlcjtcbiAgcmVwbGFjZVRleHRzO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIC8vY29uc29sZS5sb2coXCJpZDogXCIsdGhpcy5pZCk7XG4gICAgLy9jb25zb2xlLmxvZyhcImlkRGF0ZTogXCIsdGhpcy5pZERhdGUpO1xuICAgIC8vY29uc29sZS5sb2coTWF0aC5yYW5kb20oKSk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhyc3Q6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAocnN0W1wiY29uZmlnXCJdKSB7XG4gICAgICB0aGlzLnRoZW1lID0gdGhpcy5jb25maWdbXCJ0aGVtZVwiXSB8fCBcIlwiO1xuICAgICAgdGhpcy5pZCA9XG4gICAgICAgIHRoaXMuY29uZmlnW1wiaWRcIl0gfHxcbiAgICAgICAgcGFyc2VJbnQoKHRoaXMuaWREYXRlIC8gMTAwMDApLnRvU3RyaW5nKCkuc3BsaXQoXCIuXCIpWzFdKSArXG4gICAgICAgICAgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMjApICogMTAwMDA7XG4gICAgICB0aGlzLmhpZGVQcm9ncmVzc0JhciA9IHRoaXMuY29uZmlnW1wiaGlkZVByb2dyZXNzQmFyXCJdIHx8IGZhbHNlO1xuICAgICAgdGhpcy5oaWRlUmVzZXRCdG4gPSB0aGlzLmNvbmZpZ1tcImhpZGVSZXNldEJ0blwiXSB8fCBmYWxzZTtcbiAgICAgIHRoaXMuaGlkZVNlbGVjdEJ0biA9IHRoaXMuY29uZmlnW1wiaGlkZVNlbGVjdEJ0blwiXSB8fCBmYWxzZTtcbiAgICAgIHRoaXMubWF4U2l6ZSA9IHRoaXMuY29uZmlnW1wibWF4U2l6ZVwiXSB8fCAyMDtcbiAgICAgIHRoaXMudXBsb2FkQVBJID0gdGhpcy5jb25maWdbXCJ1cGxvYWRBUElcIl1bXCJ1cmxcIl07XG4gICAgICB0aGlzLmZvcm1hdHNBbGxvd2VkID1cbiAgICAgICAgdGhpcy5jb25maWdbXCJmb3JtYXRzQWxsb3dlZFwiXSB8fCBcIi5qcGcsLnBuZywucGRmLC5kb2N4LC50eHQsLmdpZiwuanBlZ1wiO1xuICAgICAgdGhpcy5tdWx0aXBsZSA9IHRoaXMuY29uZmlnW1wibXVsdGlwbGVcIl0gfHwgZmFsc2U7XG4gICAgICB0aGlzLmhlYWRlcnMgPSB0aGlzLmNvbmZpZ1tcInVwbG9hZEFQSVwiXVtcImhlYWRlcnNcIl0gfHwge307XG4gICAgICBsZXQgZGVmYXVsdFJlcGxhY2VUZXh0c1ZhbHVlczogUmVwbGFjZVRleHRzID0gIHtcbiAgICAgICAgc2VsZWN0RmlsZUJ0bjogdGhpcy5tdWx0aXBsZSA/ICdTZWxlY3QgRmlsZXMnIDogJ1NlbGVjdCBGaWxlJyxcbiAgICAgICAgcmVzZXRCdG46ICdSZXNldCcsXG4gICAgICAgIHVwbG9hZEJ0bjogJ1VwbG9hZCcsXG4gICAgICAgIGRyYWdORHJvcEJveDogJ0RyYWcgTiBEcm9wJyxcbiAgICAgICAgYXR0YWNoUGluQnRuOiB0aGlzLm11bHRpcGxlID8gJ0F0dGFjaCBGaWxlcy4uLicgOiAnQXR0YWNoIEZpbGUuLi4nLFxuICAgICAgICBhZnRlclVwbG9hZE1zZ19zdWNjZXNzOiAnU3VjY2Vzc2Z1bGx5IFVwbG9hZGVkICEnLFxuICAgICAgICBhZnRlclVwbG9hZE1zZ19lcnJvcjogJ1VwbG9hZCBGYWlsZWQgISdcbiAgICAgIH07XG4gICAgICB0aGlzLnJlcGxhY2VUZXh0cyA9IHsuLi5kZWZhdWx0UmVwbGFjZVRleHRzVmFsdWVzfTtcbiAgICAgIGlmKHRoaXMuY29uZmlnW1wicmVwbGFjZVRleHRzXCJdKSB7XG4gICAgICAgIHRoaXMucmVwbGFjZVRleHRzID0ge1xuICAgICAgICAgIC4uLmRlZmF1bHRSZXBsYWNlVGV4dHNWYWx1ZXMsXG4gICAgICAgICAgLi4udGhpcy5jb25maWdbJ3JlcGxhY2VUZXh0cyddXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy9jb25zb2xlLmxvZyhcImNvbmZpZzogXCIsIHRoaXMuY29uZmlnKTtcbiAgICAgIC8vY29uc29sZS5sb2codGhpcy5jb25maWdbXCJtYXhTaXplXCJdKTtcbiAgICAgIC8vY29uc29sZS5sb2codGhpcy5oZWFkZXJzKTtcbiAgICAgIC8vY29uc29sZS5sb2coXCJyc3Q6IFwiLCByc3QpO1xuICAgIH1cblxuICAgIGlmIChyc3RbXCJyZXNldFVwbG9hZFwiXSkge1xuICAgICAgaWYgKHJzdFtcInJlc2V0VXBsb2FkXCJdLmN1cnJlbnRWYWx1ZSA9PT0gdHJ1ZSkge1xuICAgICAgICB0aGlzLnJlc2V0RmlsZVVwbG9hZCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIC8vY29uc29sZS5sb2coXCJJZDogXCIsIHRoaXMuaWQpO1xuICAgIHRoaXMucmVzZXRVcGxvYWQgPSBmYWxzZTtcbiAgfVxuXG4gIHJlc2V0RmlsZVVwbG9hZCgpIHtcbiAgICB0aGlzLnNlbGVjdGVkRmlsZXMgPSBbXTtcbiAgICB0aGlzLkNhcHRpb24gPSBbXTtcbiAgICB0aGlzLm5vdEFsbG93ZWRMaXN0ID0gW107XG4gICAgdGhpcy51cGxvYWRNc2cgPSBmYWxzZTtcbiAgICB0aGlzLnVwbG9hZEJ0biA9IGZhbHNlO1xuICB9XG5cbiAgb25DaGFuZ2UoZXZlbnQ6IGFueSkge1xuICAgIC8vY29uc29sZS5sb2codGhpcy5tYXhTaXplICsgdGhpcy5mb3JtYXRzQWxsb3dlZCArIHRoaXMubXVsdGlwbGUpO1xuICAgIHRoaXMubm90QWxsb3dlZExpc3QgPSBbXTtcbiAgICAvL2NvbnNvbGUubG9nKFwib25jaGFuZ2UgaGl0XCIpO1xuICAgIGlmICh0aGlzLmFmdGVyVXBsb2FkIHx8ICF0aGlzLm11bHRpcGxlKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkRmlsZXMgPSBbXTtcbiAgICAgIHRoaXMuQ2FwdGlvbiA9IFtdO1xuICAgICAgdGhpcy5hZnRlclVwbG9hZCA9IGZhbHNlO1xuICAgIH1cbiAgICAvL0ZPUk1BVFMgQUxMT1dFRCBMSVNUXG4gICAgLy9jb25zb2xlLmxvZyhcIkZPUk1BVFMgQUxMT1dFRCBMSVNUPSBcIit0aGlzLmZvcm1hdHNBbGxvd2VkKTtcbiAgICAvL05PIE9GIEZPUk1BVFMgQUxMT1dFRFxuICAgIGxldCBmb3JtYXRzQ291bnQ6IGFueTtcbiAgICBmb3JtYXRzQ291bnQgPSB0aGlzLmZvcm1hdHNBbGxvd2VkLm1hdGNoKG5ldyBSZWdFeHAoXCJcXFxcLlwiLCBcImdcIikpO1xuICAgIGZvcm1hdHNDb3VudCA9IGZvcm1hdHNDb3VudC5sZW5ndGg7XG4gICAgLy9jb25zb2xlLmxvZyhcIk5PIE9GIEZPUk1BVFMgQUxMT1dFRD0gXCIrZm9ybWF0c0NvdW50KTtcbiAgICAvL2NvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcblxuICAgIC8vSVRFUkFURSBTRUxFQ1RFRCBGSUxFU1xuICAgIGxldCBmaWxlOiBGaWxlTGlzdDtcbiAgICBpZiAoZXZlbnQudHlwZSA9PSBcImRyb3BcIikge1xuICAgICAgZmlsZSA9IGV2ZW50LmRhdGFUcmFuc2Zlci5maWxlcztcbiAgICAgIC8vY29uc29sZS5sb2coXCJ0eXBlOiBkcm9wXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmaWxlID0gZXZlbnQudGFyZ2V0LmZpbGVzIHx8IGV2ZW50LnNyY0VsZW1lbnQuZmlsZXM7XG4gICAgICAvL2NvbnNvbGUubG9nKFwidHlwZTogY2hhbmdlXCIpO1xuICAgIH1cbiAgICAvL2NvbnNvbGUubG9nKGZpbGUpO1xuICAgIGxldCBjdXJyZW50RmlsZUV4dDogYW55O1xuICAgIGxldCBleHQ6IGFueTtcbiAgICBsZXQgZnJtdEFsbG93ZWQ6IGJvb2xlYW47XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWxlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAvL0NIRUNLIEZPUk1BVFxuICAgICAgLy9DVVJSRU5UIEZJTEUgRVhURU5TSU9OXG4gICAgICBjdXJyZW50RmlsZUV4dCA9IHRoaXMucmVnLmV4ZWMoZmlsZVtpXS5uYW1lKTtcbiAgICAgIGN1cnJlbnRGaWxlRXh0ID0gY3VycmVudEZpbGVFeHRbMV07XG4gICAgICAvL2NvbnNvbGUubG9nKGZpbGVbaV0ubmFtZSk7XG4gICAgICBmcm10QWxsb3dlZCA9IGZhbHNlO1xuICAgICAgLy9GT1JNQVQgQUxMT1dFRCBMSVNUIElURVJBVEVcbiAgICAgIGZvciAobGV0IGogPSBmb3JtYXRzQ291bnQ7IGogPiAwOyBqLS0pIHtcbiAgICAgICAgZXh0ID0gdGhpcy5mb3JtYXRzQWxsb3dlZC5zcGxpdChcIi5cIilbal07XG4gICAgICAgIC8vY29uc29sZS5sb2coXCJGT1JNQVQgTElTVCAoXCIraitcIik9IFwiK2V4dC5zcGxpdChcIixcIilbMF0pO1xuICAgICAgICBpZiAoaiA9PSBmb3JtYXRzQ291bnQpIHtcbiAgICAgICAgICBleHQgPSB0aGlzLmZvcm1hdHNBbGxvd2VkLnNwbGl0KFwiLlwiKVtqXSArIFwiLFwiO1xuICAgICAgICB9IC8vY2hlY2sgZm9ybWF0XG4gICAgICAgIGlmIChjdXJyZW50RmlsZUV4dC50b0xvd2VyQ2FzZSgpID09IGV4dC5zcGxpdChcIixcIilbMF0pIHtcbiAgICAgICAgICBmcm10QWxsb3dlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGZybXRBbGxvd2VkKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coXCJGT1JNQVQgQUxMT1dFRFwiKTtcbiAgICAgICAgLy9DSEVDSyBTSVpFXG4gICAgICAgIGlmIChmaWxlW2ldLnNpemUgPiB0aGlzLm1heFNpemUgKiAxMDI0MDAwKSB7XG4gICAgICAgICAgLy9jb25zb2xlLmxvZyhcIlNJWkUgTk9UIEFMTE9XRUQgKFwiK2ZpbGVbaV0uc2l6ZStcIilcIik7XG4gICAgICAgICAgdGhpcy5ub3RBbGxvd2VkTGlzdC5wdXNoKHtcbiAgICAgICAgICAgIGZpbGVOYW1lOiBmaWxlW2ldLm5hbWUsXG4gICAgICAgICAgICBmaWxlU2l6ZTogdGhpcy5jb252ZXJ0U2l6ZShmaWxlW2ldLnNpemUpLFxuICAgICAgICAgICAgZXJyb3JNc2c6IFwiSW52YWxpZCBzaXplXCJcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvL2Zvcm1hdCBhbGxvd2VkIGFuZCBzaXplIGFsbG93ZWQgdGhlbiBhZGQgZmlsZSB0byBzZWxlY3RlZEZpbGUgYXJyYXlcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkRmlsZXMucHVzaChmaWxlW2ldKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIkZPUk1BVCBOT1QgQUxMT1dFRFwiKTtcbiAgICAgICAgdGhpcy5ub3RBbGxvd2VkTGlzdC5wdXNoKHtcbiAgICAgICAgICBmaWxlTmFtZTogZmlsZVtpXS5uYW1lLFxuICAgICAgICAgIGZpbGVTaXplOiB0aGlzLmNvbnZlcnRTaXplKGZpbGVbaV0uc2l6ZSksXG4gICAgICAgICAgZXJyb3JNc2c6IFwiSW52YWxpZCBmb3JtYXRcIlxuICAgICAgICB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2VsZWN0ZWRGaWxlcy5sZW5ndGggIT09IDApIHtcbiAgICAgIHRoaXMudXBsb2FkQnRuID0gdHJ1ZTtcbiAgICAgIGlmICh0aGlzLnRoZW1lID09IFwiYXR0YWNoUGluXCIpIHRoaXMudXBsb2FkRmlsZXMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy51cGxvYWRCdG4gPSBmYWxzZTtcbiAgICB9XG4gICAgdGhpcy51cGxvYWRNc2cgPSBmYWxzZTtcbiAgICB0aGlzLnVwbG9hZENsaWNrID0gdHJ1ZTtcbiAgICB0aGlzLnBlcmNlbnRDb21wbGV0ZSA9IDA7XG4gICAgZXZlbnQudGFyZ2V0LnZhbHVlID0gbnVsbDtcbiAgfVxuXG4gIHVwbG9hZEZpbGVzKCkge1xuICAgIC8vY29uc29sZS5sb2codGhpcy5zZWxlY3RlZEZpbGVzKTtcblxuICAgIGxldCBpOiBhbnk7XG4gICAgdGhpcy5wcm9ncmVzc0JhclNob3cgPSB0cnVlO1xuICAgIHRoaXMudXBsb2FkQ2xpY2sgPSBmYWxzZTtcbiAgICB0aGlzLm5vdEFsbG93ZWRMaXN0ID0gW107XG4gICAgbGV0IGlzRXJyb3IgPSBmYWxzZTtcblxuICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICBsZXQgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLnNlbGVjdGVkRmlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLkNhcHRpb25baV0gPT0gdW5kZWZpbmVkKVxuICAgICAgICB0aGlzLkNhcHRpb25baV0gPSBcImZpbGVcIiArIGk7XG4gICAgICAvL0FkZCBEQVRBIFRPIEJFIFNFTlRcbiAgICAgIGZvcm1EYXRhLmFwcGVuZChcbiAgICAgICAgdGhpcy5DYXB0aW9uW2ldLFxuICAgICAgICB0aGlzLnNlbGVjdGVkRmlsZXNbaV0gLyosIHRoaXMuc2VsZWN0ZWRGaWxlc1tpXS5uYW1lKi9cbiAgICAgICk7XG4gICAgICAvL2NvbnNvbGUubG9nKHRoaXMuc2VsZWN0ZWRGaWxlc1tpXStcIntcIit0aGlzLkNhcHRpb25baV0rXCIgKENhcHRpb24pfVwiKTtcbiAgICB9XG5cbiAgICBpZiAoaSA+IDEpIHtcbiAgICAgIHRoaXMuc2luZ2xlRmlsZSA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNpbmdsZUZpbGUgPSB0cnVlO1xuICAgIH1cblxuICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBldm50ID0+IHtcbiAgICAgIC8vY29uc29sZS5sb2coXCJvbnJlYWR5XCIpO1xuICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgIGlmICh4aHIuc3RhdHVzICE9PSAyMDApIHtcbiAgICAgICAgICBpc0Vycm9yID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLnByb2dyZXNzQmFyU2hvdyA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMudXBsb2FkQnRuID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy51cGxvYWRNc2cgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuYWZ0ZXJVcGxvYWQgPSB0cnVlO1xuICAgICAgICAgIHRoaXMudXBsb2FkTXNnVGV4dCA9IHRoaXMucmVwbGFjZVRleHRzLmFmdGVyVXBsb2FkTXNnX2Vycm9yO1xuICAgICAgICAgIHRoaXMudXBsb2FkTXNnQ2xhc3MgPSBcInRleHQtZGFuZ2VyIGxlYWRcIjtcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKHRoaXMudXBsb2FkTXNnVGV4dCk7XG4gICAgICAgICAgLy9jb25zb2xlLmxvZyhldm50KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLkFwaVJlc3BvbnNlLmVtaXQoeGhyKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgeGhyLnVwbG9hZC5vbnByb2dyZXNzID0gZXZudCA9PiB7XG4gICAgICB0aGlzLnVwbG9hZEJ0biA9IGZhbHNlOyAvLyBidXR0b24gc2hvdWxkIGJlIGRpc2FibGVkIGJ5IHByb2Nlc3MgdXBsb2FkaW5nXG4gICAgICBpZiAoZXZudC5sZW5ndGhDb21wdXRhYmxlKSB7XG4gICAgICAgIHRoaXMucGVyY2VudENvbXBsZXRlID0gTWF0aC5yb3VuZCgoZXZudC5sb2FkZWQgLyBldm50LnRvdGFsKSAqIDEwMCk7XG4gICAgICB9XG4gICAgICAvL2NvbnNvbGUubG9nKFwiUHJvZ3Jlc3MuLi5cIi8qK3RoaXMucGVyY2VudENvbXBsZXRlK1wiICVcIiovKTtcbiAgICB9O1xuXG4gICAgeGhyLm9ubG9hZCA9IGV2bnQgPT4ge1xuICAgICAgLy9jb25zb2xlLmxvZyhcIm9ubG9hZFwiKTtcbiAgICAgIC8vY29uc29sZS5sb2coZXZudCk7XG4gICAgICB0aGlzLnByb2dyZXNzQmFyU2hvdyA9IGZhbHNlO1xuICAgICAgdGhpcy51cGxvYWRCdG4gPSBmYWxzZTtcbiAgICAgIHRoaXMudXBsb2FkTXNnID0gdHJ1ZTtcbiAgICAgIHRoaXMuYWZ0ZXJVcGxvYWQgPSB0cnVlO1xuICAgICAgaWYgKCFpc0Vycm9yKSB7XG4gICAgICAgIHRoaXMudXBsb2FkTXNnVGV4dCA9IHRoaXMucmVwbGFjZVRleHRzLmFmdGVyVXBsb2FkTXNnX3N1Y2Nlc3M7XG4gICAgICAgIHRoaXMudXBsb2FkTXNnQ2xhc3MgPSBcInRleHQtc3VjY2VzcyBsZWFkXCI7XG4gICAgICAgIC8vY29uc29sZS5sb2codGhpcy51cGxvYWRNc2dUZXh0ICsgXCIgXCIgKyB0aGlzLnNlbGVjdGVkRmlsZXMubGVuZ3RoICsgXCIgZmlsZVwiKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgeGhyLm9uZXJyb3IgPSBldm50ID0+IHtcbiAgICAgIC8vY29uc29sZS5sb2coXCJvbmVycm9yXCIpO1xuICAgICAgLy9jb25zb2xlLmxvZyhldm50KTtcbiAgICB9O1xuXG4gICAgeGhyLm9wZW4oXCJQT1NUXCIsIHRoaXMudXBsb2FkQVBJLCB0cnVlKTtcbiAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyh0aGlzLmhlYWRlcnMpKSB7XG4gICAgICAvLyBPYmplY3Qua2V5cyB3aWxsIGdpdmUgYW4gQXJyYXkgb2Yga2V5c1xuICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoa2V5LCB0aGlzLmhlYWRlcnNba2V5XSk7XG4gICAgfVxuICAgIC8vbGV0IHRva2VuID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInRva2VuXCIpO1xuICAgIC8veGhyLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJ0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLThcIik7XG4gICAgLy94aHIuc2V0UmVxdWVzdEhlYWRlcignQXV0aG9yaXphdGlvbicsIGBCZWFyZXIgJHt0b2tlbn1gKTtcbiAgICB4aHIuc2VuZChmb3JtRGF0YSk7XG4gIH1cblxuICByZW1vdmVGaWxlKGk6IGFueSwgc2ZfbmE6IGFueSkge1xuICAgIC8vY29uc29sZS5sb2coXCJyZW1vdmUgZmlsZSBjbGlja2VkIFwiICsgaSlcbiAgICBpZiAoc2ZfbmEgPT0gXCJzZlwiKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkRmlsZXMuc3BsaWNlKGksIDEpO1xuICAgICAgdGhpcy5DYXB0aW9uLnNwbGljZShpLCAxKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ub3RBbGxvd2VkTGlzdC5zcGxpY2UoaSwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2VsZWN0ZWRGaWxlcy5sZW5ndGggPT0gMCkge1xuICAgICAgdGhpcy51cGxvYWRCdG4gPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBjb252ZXJ0U2l6ZShmaWxlU2l6ZTogbnVtYmVyKSB7XG4gICAgLy9jb25zb2xlLmxvZyhmaWxlU2l6ZSArIFwiIC0gXCIrIHN0cik7XG4gICAgcmV0dXJuIGZpbGVTaXplIDwgMTAyNDAwMFxuICAgICAgPyAoZmlsZVNpemUgLyAxMDI0KS50b0ZpeGVkKDIpICsgXCIgS0JcIlxuICAgICAgOiAoZmlsZVNpemUgLyAxMDI0MDAwKS50b0ZpeGVkKDIpICsgXCIgTUJcIjtcbiAgfVxuXG4gIGF0dGFjaHBpbk9uY2xpY2soKSB7XG4gICAgLy9jb25zb2xlLmxvZyhcIklEOiBcIiwgdGhpcy5pZCk7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxcIiArIHRoaXMuaWQpIS5jbGljaygpO1xuICAgIC8vJChcIiNcIitcInNlbFwiK3RoaXMuaWQpLmNsaWNrKCk7XG4gIH1cblxuICBkcm9wKGV2ZW50OiBhbnkpIHtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIC8vY29uc29sZS5sb2coXCJkcm9wOiBcIiwgZXZlbnQpO1xuICAgIC8vY29uc29sZS5sb2coXCJkcm9wOiBcIiwgZXZlbnQuZGF0YVRyYW5zZmVyLmZpbGVzKTtcbiAgICB0aGlzLm9uQ2hhbmdlKGV2ZW50KTtcbiAgfVxuICBhbGxvd0Ryb3AoZXZlbnQ6IGFueSkge1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcImNvcHlcIjtcbiAgICAvL2NvbnNvbGUubG9nKFwiYWxsb3dEcm9wOiBcIixldmVudClcbiAgfVxufVxuXG4vKiBpbnRlcmZhY2UgQ09ORklHIHtcbiAgdXBsb2FkQVBJOiBzdHJpbmc7XG4gIG11bHRpcGxlPzogYm9vbGVhbjtcbiAgZm9ybWF0c0FsbG93ZWQ/OiBzdHJpbmc7XG4gIG1heFNpemU/OiBudW1iZXI7XG4gIGlkPzogbnVtYmVyO1xuICByZXNldFVwbG9hZD86IGJvb2xlYW47XG4gIHRoZW1lPzogc3RyaW5nO1xuICBoaWRlUHJvZ3Jlc3NCYXI/OiBib29sZWFuO1xuIH1cbiAqL1xuXG4gaW50ZXJmYWNlIFJlcGxhY2VUZXh0cyB7XG4gIHNlbGVjdEZpbGVCdG46IHN0cmluZyxcbiAgcmVzZXRCdG46IHN0cmluZyxcbiAgdXBsb2FkQnRuOiBzdHJpbmcsXG4gIGRyYWdORHJvcEJveDogc3RyaW5nLFxuICBhdHRhY2hQaW5CdG46IHN0cmluZyxcbiAgYWZ0ZXJVcGxvYWRNc2dfc3VjY2Vzczogc3RyaW5nLFxuICBhZnRlclVwbG9hZE1zZ19lcnJvcjogc3RyaW5nLFxufTtcbiIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgQW5ndWxhckZpbGVVcGxvYWRlckNvbXBvbmVudCB9IGZyb20gJy4vYW5ndWxhci1maWxlLXVwbG9hZGVyLmNvbXBvbmVudCc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBDb21tb25Nb2R1bGVcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbQW5ndWxhckZpbGVVcGxvYWRlckNvbXBvbmVudF0sXG4gIGV4cG9ydHM6IFtBbmd1bGFyRmlsZVVwbG9hZGVyQ29tcG9uZW50XVxufSlcbmV4cG9ydCBjbGFzcyBBbmd1bGFyRmlsZVVwbG9hZGVyTW9kdWxlIHsgfVxuIl0sIm5hbWVzIjpbInRzbGliXzEuX192YWx1ZXMiXSwibWFwcGluZ3Mi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