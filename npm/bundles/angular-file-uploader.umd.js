(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('angular-file-uploader', ['exports', '@angular/core', '@angular/common'], factory) :
    (factory((global['angular-file-uploader'] = {}),global.ng.core,global.ng.common));
}(this, (function (exports,i0,common) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var AngularFileUploaderService = (function () {
        function AngularFileUploaderService() {
        }
        AngularFileUploaderService.decorators = [
            { type: i0.Injectable, args: [{
                        providedIn: 'root'
                    },] },
        ];
        AngularFileUploaderService.ctorParameters = function () { return []; };
        /** @nocollapse */ AngularFileUploaderService.ngInjectableDef = i0.defineInjectable({ factory: function AngularFileUploaderService_Factory() { return new AngularFileUploaderService(); }, token: AngularFileUploaderService, providedIn: "root" });
        return AngularFileUploaderService;
    }());

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m)
            return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length)
                    o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var AngularFileUploaderComponent = (function () {
        function AngularFileUploaderComponent() {
            this.config = {};
            this.resetUpload = this.config["resetUpload"];
            this.ApiResponse = new i0.EventEmitter();
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
                catch (e_1_1) {
                    e_1 = { error: e_1_1 };
                }
                finally {
                    try {
                        if (_b && !_b.done && (_c = _a.return))
                            _c.call(_a);
                    }
                    finally {
                        if (e_1)
                            throw e_1.error;
                    }
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
                ((document.getElementById("sel" + this.id))).click();
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
            { type: i0.Component, args: [{
                        selector: "angular-file-uploader",
                        template: "<div class=\"container\" *ngIf=\"(theme !== 'attachPin')\" id=\"default\">\n\n    <!-- Drag n Drop theme Starts -->\n    <div *ngIf=\"theme == 'dragNDrop'\" id=\"dragNDrop\" [ngClass]=\"(hideSelectBtn && hideResetBtn) ? null : 'dragNDropBtmPad'\" class=\"dragNDrop\">\n        <div style=\"position:relative;\">\n            <div id=\"div1\" class=\"div1 afu-dragndrop-box\" (drop)=\"drop($event)\" (dragover)=\"allowDrop($event)\">\n                <p class=\"afu-dragndrop-text\">Drag N Drop</p>\n            </div>\n            <!-- <span class='label label-info' id=\"upload-file-info{{id}}\">{{selectedFiles[0]?.name}}</span> -->\n        </div>\n    </div>\n    <!-- Drag n Drop theme Ends -->\n\n    <label for=\"sel{{id}}\" class=\"btn btn-primary btn-sm afu-select-btn\" *ngIf=\"!hideSelectBtn\">Select File<span *ngIf=\"multiple\">s</span></label>\n    <input type=\"file\" id=\"sel{{id}}\" style=\"display: none\" *ngIf=\"!hideSelectBtn\" (change)=\"onChange($event)\" title=\"Select file\"\n        name=\"files[]\" [accept]=formatsAllowed [attr.multiple]=\"multiple ? '' : null\" />\n    <button class=\"btn btn-info btn-sm resetBtn afu-reset-btn\" (click)=\"resetFileUpload()\" *ngIf=\"!hideResetBtn\">Reset</button>\n    <br *ngIf=\"!hideSelectBtn\">\n    <p class=\"constraints-info afu-constraints-info\">({{formatsAllowed}}) Size limit- {{(convertSize(maxSize *1024000))}}</p>\n    <!--Selected file list-->\n    <div class=\"row afu-valid-file\" *ngFor=\"let sf of selectedFiles;let i=index\" >\n        <p class=\"col-xs-3 textOverflow\"><span class=\"text-primary\">{{sf.name}}</span></p>\n        <p class=\"col-xs-3 padMarg sizeC\"><strong>({{convertSize(sf.size)}})</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>\n        <!--  <input class=\"col-xs-3 progress caption\"  type=\"text\"  placeholder=\"Caption..\"  [(ngModel)]=\"Caption[i]\"  *ngIf=\"uploadClick\"/> -->\n        <div class=\"progress col-xs-3 padMarg afu-progress-bar\" *ngIf=\"singleFile && progressBarShow && !hideProgressBar\">\n            <span class=\"progress-bar progress-bar-success\" role=\"progressbar\" [ngStyle]=\"{'width':percentComplete+'%'}\">{{percentComplete}}%</span>\n        </div>\n        <a class=\"col-xs-1\" role=\"button\" (click)=\"removeFile(i,'sf')\" *ngIf=\"uploadClick\"><i class=\"fa fa-times\"></i></a>\n    </div>\n    <!--Invalid file list-->\n    <div class=\"row text-danger afu-invalid-file\" *ngFor=\"let na of notAllowedList;let j=index\">\n        <p class=\"col-xs-3 textOverflow\"><span>{{na['fileName']}}</span></p>\n        <p class=\"col-xs-3 padMarg sizeC\"><strong>({{na['fileSize']}})</strong></p>\n        <p class=\"col-xs-3 \">{{na['errorMsg']}}</p>\n        <a class=\"col-xs-1 delFileIcon\" role=\"button\" (click)=\"removeFile(j,'na')\" *ngIf=\"uploadClick\">&nbsp;<i class=\"fa fa-times\"></i></a>\n    </div>\n\n    <p *ngIf=\"uploadMsg\" class=\"{{uploadMsgClass}} + afu-upload-status\">{{uploadMsgText}}<p>\n    <div *ngIf=\"!singleFile && progressBarShow && !hideProgressBar\">\n        <div class=\"progress col-xs-4 padMarg afu-progress-bar\">\n            <span class=\"progress-bar progress-bar-success\" role=\"progressbar\" [ngStyle]=\"{'width':percentComplete+'%'}\">{{percentComplete}}%</span>\n        </div>\n        <br>\n        <br>\n    </div>\n    <button class=\"btn btn-success afu-upload-btn\" type=\"button\" (click)=\"uploadFiles()\" [disabled]=!uploadBtn>{{uploadBtnText}}</button>\n    <br>\n</div>\n\n<!--/////////////////////////// ATTACH PIN THEME  //////////////////////////////////////////////////////////-->\n<div *ngIf=\"theme == 'attachPin'\" id=\"attachPin\">\n    <div style=\"position:relative;padding-left:6px\">\n        <a class='btn up_btn afu-attach-pin' (click)=\"attachpinOnclick()\">\n            {{attachPinText}}\n            <i class=\"fa fa-paperclip\" aria-hidden=\"true\"></i>\n            <!-- <p style=\"margin-top:10px\">({{formatsAllowed}}) Size limit- {{(convertSize(maxSize * 1024000))}}</p> -->\n            <input type=\"file\" id=\"sel{{id}}\" (change)=\"onChange($event)\" style=\"display: none\" title=\"Select file\" name=\"files[]\" [accept]=formatsAllowed\n                [attr.multiple]=\"multiple ? '' : null\" />\n            <br>\n        </a>\n        &nbsp;\n        <span class='label label-info' id=\"upload-file-info{{id}}\">{{selectedFiles[0]?.name}}</span>\n    </div>\n</div>\n\n<!--/////////////////////////// DRAG N DROP THEME  //////////////////////////////////////////////////////////-->\n<!-- <div *ngIf=\"theme == 'dragNDrop'\" id=\"dragNDrop\">\n  <div style=\"position:relative;padding-left:6px\">\n    <div id=\"div1\" (drop)=\"drop($event)\" (dragover)=\"allowDrop($event)\">\n      <p>Drag N Drop</p>\n    </div>\n    <span class='label label-info' id=\"upload-file-info{{id}}\">{{selectedFiles[0]?.name}}</span>\n  </div>\n</div> -->",
                        styles: [".constraints-info{margin-top:10px;font-style:italic}.padMarg{padding:0;margin-bottom:0}.caption{margin-right:5px}.textOverflow{white-space:nowrap;padding-right:0;overflow:hidden;text-overflow:ellipsis}.up_btn{color:#000;background-color:transparent;border:2px solid #5c5b5b;border-radius:22px}.delFileIcon{text-decoration:none;color:#ce0909}.dragNDrop .div1{display:border-box;border:2px dashed #5c5b5b;height:6rem;width:20rem}.dragNDrop .div1>p{text-align:center;font-weight:700;color:#5c5b5b;margin-top:1.4em}.dragNDropBtmPad{padding-bottom:2rem}@media screen and (max-width:620px){.caption{padding:0}}@media screen and (max-width:510px){.sizeC{width:25%}}@media screen and (max-width:260px){.caption,.sizeC{font-size:10px}}.resetBtn{margin-left:3px}"]
                    },] },
        ];
        AngularFileUploaderComponent.ctorParameters = function () { return []; };
        AngularFileUploaderComponent.propDecorators = {
            config: [{ type: i0.Input }],
            resetUpload: [{ type: i0.Input }],
            ApiResponse: [{ type: i0.Output }]
        };
        return AngularFileUploaderComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var AngularFileUploaderModule = (function () {
        function AngularFileUploaderModule() {
        }
        AngularFileUploaderModule.decorators = [
            { type: i0.NgModule, args: [{
                        imports: [
                            common.CommonModule
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

    exports.AngularFileUploaderService = AngularFileUploaderService;
    exports.AngularFileUploaderComponent = AngularFileUploaderComponent;
    exports.AngularFileUploaderModule = AngularFileUploaderModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1maWxlLXVwbG9hZGVyLnVtZC5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vYW5ndWxhci1maWxlLXVwbG9hZGVyL2xpYi9hbmd1bGFyLWZpbGUtdXBsb2FkZXIuc2VydmljZS50cyIsbnVsbCwibmc6Ly9hbmd1bGFyLWZpbGUtdXBsb2FkZXIvbGliL2FuZ3VsYXItZmlsZS11cGxvYWRlci5jb21wb25lbnQudHMiLCJuZzovL2FuZ3VsYXItZmlsZS11cGxvYWRlci9saWIvYW5ndWxhci1maWxlLXVwbG9hZGVyLm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIEFuZ3VsYXJGaWxlVXBsb2FkZXJTZXJ2aWNlIHtcblxuICBjb25zdHJ1Y3RvcigpIHsgfVxufVxuIiwiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2VcclxudGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGVcclxuTGljZW5zZSBhdCBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuXHJcblRISVMgQ09ERSBJUyBQUk9WSURFRCBPTiBBTiAqQVMgSVMqIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcclxuS0lORCwgRUlUSEVSIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIFdJVEhPVVQgTElNSVRBVElPTiBBTlkgSU1QTElFRFxyXG5XQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgVElUTEUsIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLFxyXG5NRVJDSEFOVEFCTElUWSBPUiBOT04tSU5GUklOR0VNRU5ULlxyXG5cclxuU2VlIHRoZSBBcGFjaGUgVmVyc2lvbiAyLjAgTGljZW5zZSBmb3Igc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zXHJcbmFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBmdW5jdGlvbigpIHtcclxuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIGlmIChlLmluZGV4T2YocFtpXSkgPCAwKVxyXG4gICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIGV4cG9ydHMpIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKCFleHBvcnRzLmhhc093blByb3BlcnR5KHApKSBleHBvcnRzW3BdID0gbVtwXTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0U3Rhcihtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgcmVzdWx0W2tdID0gbW9kW2tdO1xyXG4gICAgcmVzdWx0LmRlZmF1bHQgPSBtb2Q7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnREZWZhdWx0KG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBkZWZhdWx0OiBtb2QgfTtcclxufVxyXG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMsIEluamVjdCwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogXCJhbmd1bGFyLWZpbGUtdXBsb2FkZXJcIixcbiAgdGVtcGxhdGU6IGA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCIgKm5nSWY9XCIodGhlbWUgIT09ICdhdHRhY2hQaW4nKVwiIGlkPVwiZGVmYXVsdFwiPlxuXG4gICAgPCEtLSBEcmFnIG4gRHJvcCB0aGVtZSBTdGFydHMgLS0+XG4gICAgPGRpdiAqbmdJZj1cInRoZW1lID09ICdkcmFnTkRyb3AnXCIgaWQ9XCJkcmFnTkRyb3BcIiBbbmdDbGFzc109XCIoaGlkZVNlbGVjdEJ0biAmJiBoaWRlUmVzZXRCdG4pID8gbnVsbCA6ICdkcmFnTkRyb3BCdG1QYWQnXCIgY2xhc3M9XCJkcmFnTkRyb3BcIj5cbiAgICAgICAgPGRpdiBzdHlsZT1cInBvc2l0aW9uOnJlbGF0aXZlO1wiPlxuICAgICAgICAgICAgPGRpdiBpZD1cImRpdjFcIiBjbGFzcz1cImRpdjEgYWZ1LWRyYWduZHJvcC1ib3hcIiAoZHJvcCk9XCJkcm9wKCRldmVudClcIiAoZHJhZ292ZXIpPVwiYWxsb3dEcm9wKCRldmVudClcIj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzcz1cImFmdS1kcmFnbmRyb3AtdGV4dFwiPkRyYWcgTiBEcm9wPC9wPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8IS0tIDxzcGFuIGNsYXNzPSdsYWJlbCBsYWJlbC1pbmZvJyBpZD1cInVwbG9hZC1maWxlLWluZm97e2lkfX1cIj57e3NlbGVjdGVkRmlsZXNbMF0/Lm5hbWV9fTwvc3Bhbj4gLS0+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDwhLS0gRHJhZyBuIERyb3AgdGhlbWUgRW5kcyAtLT5cblxuICAgIDxsYWJlbCBmb3I9XCJzZWx7e2lkfX1cIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeSBidG4tc20gYWZ1LXNlbGVjdC1idG5cIiAqbmdJZj1cIiFoaWRlU2VsZWN0QnRuXCI+U2VsZWN0IEZpbGU8c3BhbiAqbmdJZj1cIm11bHRpcGxlXCI+czwvc3Bhbj48L2xhYmVsPlxuICAgIDxpbnB1dCB0eXBlPVwiZmlsZVwiIGlkPVwic2Vse3tpZH19XCIgc3R5bGU9XCJkaXNwbGF5OiBub25lXCIgKm5nSWY9XCIhaGlkZVNlbGVjdEJ0blwiIChjaGFuZ2UpPVwib25DaGFuZ2UoJGV2ZW50KVwiIHRpdGxlPVwiU2VsZWN0IGZpbGVcIlxuICAgICAgICBuYW1lPVwiZmlsZXNbXVwiIFthY2NlcHRdPWZvcm1hdHNBbGxvd2VkIFthdHRyLm11bHRpcGxlXT1cIm11bHRpcGxlID8gJycgOiBudWxsXCIgLz5cbiAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1pbmZvIGJ0bi1zbSByZXNldEJ0biBhZnUtcmVzZXQtYnRuXCIgKGNsaWNrKT1cInJlc2V0RmlsZVVwbG9hZCgpXCIgKm5nSWY9XCIhaGlkZVJlc2V0QnRuXCI+UmVzZXQ8L2J1dHRvbj5cbiAgICA8YnIgKm5nSWY9XCIhaGlkZVNlbGVjdEJ0blwiPlxuICAgIDxwIGNsYXNzPVwiY29uc3RyYWludHMtaW5mbyBhZnUtY29uc3RyYWludHMtaW5mb1wiPih7e2Zvcm1hdHNBbGxvd2VkfX0pIFNpemUgbGltaXQtIHt7KGNvbnZlcnRTaXplKG1heFNpemUgKjEwMjQwMDApKX19PC9wPlxuICAgIDwhLS1TZWxlY3RlZCBmaWxlIGxpc3QtLT5cbiAgICA8ZGl2IGNsYXNzPVwicm93IGFmdS12YWxpZC1maWxlXCIgKm5nRm9yPVwibGV0IHNmIG9mIHNlbGVjdGVkRmlsZXM7bGV0IGk9aW5kZXhcIiA+XG4gICAgICAgIDxwIGNsYXNzPVwiY29sLXhzLTMgdGV4dE92ZXJmbG93XCI+PHNwYW4gY2xhc3M9XCJ0ZXh0LXByaW1hcnlcIj57e3NmLm5hbWV9fTwvc3Bhbj48L3A+XG4gICAgICAgIDxwIGNsYXNzPVwiY29sLXhzLTMgcGFkTWFyZyBzaXplQ1wiPjxzdHJvbmc+KHt7Y29udmVydFNpemUoc2Yuc2l6ZSl9fSk8L3N0cm9uZz4mbmJzcDsmbmJzcDsmbmJzcDsmbmJzcDsmbmJzcDs8L3A+XG4gICAgICAgIDwhLS0gIDxpbnB1dCBjbGFzcz1cImNvbC14cy0zIHByb2dyZXNzIGNhcHRpb25cIiAgdHlwZT1cInRleHRcIiAgcGxhY2Vob2xkZXI9XCJDYXB0aW9uLi5cIiAgWyhuZ01vZGVsKV09XCJDYXB0aW9uW2ldXCIgICpuZ0lmPVwidXBsb2FkQ2xpY2tcIi8+IC0tPlxuICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MgY29sLXhzLTMgcGFkTWFyZyBhZnUtcHJvZ3Jlc3MtYmFyXCIgKm5nSWY9XCJzaW5nbGVGaWxlICYmIHByb2dyZXNzQmFyU2hvdyAmJiAhaGlkZVByb2dyZXNzQmFyXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInByb2dyZXNzLWJhciBwcm9ncmVzcy1iYXItc3VjY2Vzc1wiIHJvbGU9XCJwcm9ncmVzc2JhclwiIFtuZ1N0eWxlXT1cInsnd2lkdGgnOnBlcmNlbnRDb21wbGV0ZSsnJSd9XCI+e3twZXJjZW50Q29tcGxldGV9fSU8L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8YSBjbGFzcz1cImNvbC14cy0xXCIgcm9sZT1cImJ1dHRvblwiIChjbGljayk9XCJyZW1vdmVGaWxlKGksJ3NmJylcIiAqbmdJZj1cInVwbG9hZENsaWNrXCI+PGkgY2xhc3M9XCJmYSBmYS10aW1lc1wiPjwvaT48L2E+XG4gICAgPC9kaXY+XG4gICAgPCEtLUludmFsaWQgZmlsZSBsaXN0LS0+XG4gICAgPGRpdiBjbGFzcz1cInJvdyB0ZXh0LWRhbmdlciBhZnUtaW52YWxpZC1maWxlXCIgKm5nRm9yPVwibGV0IG5hIG9mIG5vdEFsbG93ZWRMaXN0O2xldCBqPWluZGV4XCI+XG4gICAgICAgIDxwIGNsYXNzPVwiY29sLXhzLTMgdGV4dE92ZXJmbG93XCI+PHNwYW4+e3tuYVsnZmlsZU5hbWUnXX19PC9zcGFuPjwvcD5cbiAgICAgICAgPHAgY2xhc3M9XCJjb2wteHMtMyBwYWRNYXJnIHNpemVDXCI+PHN0cm9uZz4oe3tuYVsnZmlsZVNpemUnXX19KTwvc3Ryb25nPjwvcD5cbiAgICAgICAgPHAgY2xhc3M9XCJjb2wteHMtMyBcIj57e25hWydlcnJvck1zZyddfX08L3A+XG4gICAgICAgIDxhIGNsYXNzPVwiY29sLXhzLTEgZGVsRmlsZUljb25cIiByb2xlPVwiYnV0dG9uXCIgKGNsaWNrKT1cInJlbW92ZUZpbGUoaiwnbmEnKVwiICpuZ0lmPVwidXBsb2FkQ2xpY2tcIj4mbmJzcDs8aSBjbGFzcz1cImZhIGZhLXRpbWVzXCI+PC9pPjwvYT5cbiAgICA8L2Rpdj5cblxuICAgIDxwICpuZ0lmPVwidXBsb2FkTXNnXCIgY2xhc3M9XCJ7e3VwbG9hZE1zZ0NsYXNzfX0gKyBhZnUtdXBsb2FkLXN0YXR1c1wiPnt7dXBsb2FkTXNnVGV4dH19PHA+XG4gICAgPGRpdiAqbmdJZj1cIiFzaW5nbGVGaWxlICYmIHByb2dyZXNzQmFyU2hvdyAmJiAhaGlkZVByb2dyZXNzQmFyXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzcyBjb2wteHMtNCBwYWRNYXJnIGFmdS1wcm9ncmVzcy1iYXJcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicHJvZ3Jlc3MtYmFyIHByb2dyZXNzLWJhci1zdWNjZXNzXCIgcm9sZT1cInByb2dyZXNzYmFyXCIgW25nU3R5bGVdPVwieyd3aWR0aCc6cGVyY2VudENvbXBsZXRlKyclJ31cIj57e3BlcmNlbnRDb21wbGV0ZX19JTwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxicj5cbiAgICAgICAgPGJyPlxuICAgIDwvZGl2PlxuICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLXN1Y2Nlc3MgYWZ1LXVwbG9hZC1idG5cIiB0eXBlPVwiYnV0dG9uXCIgKGNsaWNrKT1cInVwbG9hZEZpbGVzKClcIiBbZGlzYWJsZWRdPSF1cGxvYWRCdG4+e3t1cGxvYWRCdG5UZXh0fX08L2J1dHRvbj5cbiAgICA8YnI+XG48L2Rpdj5cblxuPCEtLS8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyBBVFRBQ0ggUElOIFRIRU1FICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLS0+XG48ZGl2ICpuZ0lmPVwidGhlbWUgPT0gJ2F0dGFjaFBpbidcIiBpZD1cImF0dGFjaFBpblwiPlxuICAgIDxkaXYgc3R5bGU9XCJwb3NpdGlvbjpyZWxhdGl2ZTtwYWRkaW5nLWxlZnQ6NnB4XCI+XG4gICAgICAgIDxhIGNsYXNzPSdidG4gdXBfYnRuIGFmdS1hdHRhY2gtcGluJyAoY2xpY2spPVwiYXR0YWNocGluT25jbGljaygpXCI+XG4gICAgICAgICAgICB7e2F0dGFjaFBpblRleHR9fVxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1wYXBlcmNsaXBcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XG4gICAgICAgICAgICA8IS0tIDxwIHN0eWxlPVwibWFyZ2luLXRvcDoxMHB4XCI+KHt7Zm9ybWF0c0FsbG93ZWR9fSkgU2l6ZSBsaW1pdC0ge3soY29udmVydFNpemUobWF4U2l6ZSAqIDEwMjQwMDApKX19PC9wPiAtLT5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiZmlsZVwiIGlkPVwic2Vse3tpZH19XCIgKGNoYW5nZSk9XCJvbkNoYW5nZSgkZXZlbnQpXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lXCIgdGl0bGU9XCJTZWxlY3QgZmlsZVwiIG5hbWU9XCJmaWxlc1tdXCIgW2FjY2VwdF09Zm9ybWF0c0FsbG93ZWRcbiAgICAgICAgICAgICAgICBbYXR0ci5tdWx0aXBsZV09XCJtdWx0aXBsZSA/ICcnIDogbnVsbFwiIC8+XG4gICAgICAgICAgICA8YnI+XG4gICAgICAgIDwvYT5cbiAgICAgICAgJm5ic3A7XG4gICAgICAgIDxzcGFuIGNsYXNzPSdsYWJlbCBsYWJlbC1pbmZvJyBpZD1cInVwbG9hZC1maWxlLWluZm97e2lkfX1cIj57e3NlbGVjdGVkRmlsZXNbMF0/Lm5hbWV9fTwvc3Bhbj5cbiAgICA8L2Rpdj5cbjwvZGl2PlxuXG48IS0tLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vIERSQUcgTiBEUk9QIFRIRU1FICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLS0+XG48IS0tIDxkaXYgKm5nSWY9XCJ0aGVtZSA9PSAnZHJhZ05Ecm9wJ1wiIGlkPVwiZHJhZ05Ecm9wXCI+XG4gIDxkaXYgc3R5bGU9XCJwb3NpdGlvbjpyZWxhdGl2ZTtwYWRkaW5nLWxlZnQ6NnB4XCI+XG4gICAgPGRpdiBpZD1cImRpdjFcIiAoZHJvcCk9XCJkcm9wKCRldmVudClcIiAoZHJhZ292ZXIpPVwiYWxsb3dEcm9wKCRldmVudClcIj5cbiAgICAgIDxwPkRyYWcgTiBEcm9wPC9wPlxuICAgIDwvZGl2PlxuICAgIDxzcGFuIGNsYXNzPSdsYWJlbCBsYWJlbC1pbmZvJyBpZD1cInVwbG9hZC1maWxlLWluZm97e2lkfX1cIj57e3NlbGVjdGVkRmlsZXNbMF0/Lm5hbWV9fTwvc3Bhbj5cbiAgPC9kaXY+XG48L2Rpdj4gLS0+YCAsXG4gIHN0eWxlczogW2AuY29uc3RyYWludHMtaW5mb3ttYXJnaW4tdG9wOjEwcHg7Zm9udC1zdHlsZTppdGFsaWN9LnBhZE1hcmd7cGFkZGluZzowO21hcmdpbi1ib3R0b206MH0uY2FwdGlvbnttYXJnaW4tcmlnaHQ6NXB4fS50ZXh0T3ZlcmZsb3d7d2hpdGUtc3BhY2U6bm93cmFwO3BhZGRpbmctcmlnaHQ6MDtvdmVyZmxvdzpoaWRkZW47dGV4dC1vdmVyZmxvdzplbGxpcHNpc30udXBfYnRue2NvbG9yOiMwMDA7YmFja2dyb3VuZC1jb2xvcjp0cmFuc3BhcmVudDtib3JkZXI6MnB4IHNvbGlkICM1YzViNWI7Ym9yZGVyLXJhZGl1czoyMnB4fS5kZWxGaWxlSWNvbnt0ZXh0LWRlY29yYXRpb246bm9uZTtjb2xvcjojY2UwOTA5fS5kcmFnTkRyb3AgLmRpdjF7ZGlzcGxheTpib3JkZXItYm94O2JvcmRlcjoycHggZGFzaGVkICM1YzViNWI7aGVpZ2h0OjZyZW07d2lkdGg6MjByZW19LmRyYWdORHJvcCAuZGl2MT5we3RleHQtYWxpZ246Y2VudGVyO2ZvbnQtd2VpZ2h0OjcwMDtjb2xvcjojNWM1YjViO21hcmdpbi10b3A6MS40ZW19LmRyYWdORHJvcEJ0bVBhZHtwYWRkaW5nLWJvdHRvbToycmVtfUBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6NjIwcHgpey5jYXB0aW9ue3BhZGRpbmc6MH19QG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDo1MTBweCl7LnNpemVDe3dpZHRoOjI1JX19QG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDoyNjBweCl7LmNhcHRpb24sLnNpemVDe2ZvbnQtc2l6ZToxMHB4fX0ucmVzZXRCdG57bWFyZ2luLWxlZnQ6M3B4fWBdXG59KVxuZXhwb3J0IGNsYXNzIEFuZ3VsYXJGaWxlVXBsb2FkZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XG4gIEBJbnB1dCgpXG4gIGNvbmZpZzogYW55ID0ge307XG4gIEBJbnB1dCgpXG4gIHJlc2V0VXBsb2FkOiBib29sZWFuID0gdGhpcy5jb25maWdbXCJyZXNldFVwbG9hZFwiXTtcbiAgQE91dHB1dCgpXG4gIEFwaVJlc3BvbnNlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIHRoZW1lOiBzdHJpbmc7XG4gIGlkOiBudW1iZXI7XG4gIGhpZGVQcm9ncmVzc0JhcjogYm9vbGVhbjtcbiAgbWF4U2l6ZTogbnVtYmVyO1xuICB1cGxvYWRBUEk6IHN0cmluZztcbiAgZm9ybWF0c0FsbG93ZWQ6IHN0cmluZztcbiAgbXVsdGlwbGU6IGJvb2xlYW47XG4gIGhlYWRlcnM6IGFueTtcbiAgaGlkZVJlc2V0QnRuOiBib29sZWFuO1xuICBoaWRlU2VsZWN0QnRuOiBib29sZWFuO1xuICBhdHRhY2hQaW5UZXh0OiBzdHJpbmc7XG4gIHVwbG9hZEJ0blRleHQ6IHN0cmluZztcblxuICBpZERhdGU6IG51bWJlciA9ICtuZXcgRGF0ZSgpO1xuICByZWc6IFJlZ0V4cCA9IC8oPzpcXC4oW14uXSspKT8kLztcbiAgc2VsZWN0ZWRGaWxlczogQXJyYXk8YW55PiA9IFtdO1xuICBub3RBbGxvd2VkTGlzdDogQXJyYXk8T2JqZWN0PiA9IFtdO1xuICBDYXB0aW9uOiBBcnJheTxzdHJpbmc+ID0gW107XG4gIHNpbmdsZUZpbGUgPSB0cnVlO1xuICBwcm9ncmVzc0JhclNob3cgPSBmYWxzZTtcbiAgdXBsb2FkQnRuID0gZmFsc2U7XG4gIHVwbG9hZE1zZyA9IGZhbHNlO1xuICBhZnRlclVwbG9hZCA9IGZhbHNlO1xuICB1cGxvYWRDbGljayA9IHRydWU7XG4gIHVwbG9hZE1zZ1RleHQ6IHN0cmluZztcbiAgdXBsb2FkTXNnQ2xhc3M6IHN0cmluZztcbiAgcGVyY2VudENvbXBsZXRlOiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgLy9jb25zb2xlLmxvZyhcImlkOiBcIix0aGlzLmlkKTtcbiAgICAvL2NvbnNvbGUubG9nKFwiaWREYXRlOiBcIix0aGlzLmlkRGF0ZSk7XG4gICAgLy9jb25zb2xlLmxvZyhNYXRoLnJhbmRvbSgpKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKHJzdDogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChyc3RbXCJjb25maWdcIl0pIHtcbiAgICAgIHRoaXMudGhlbWUgPSB0aGlzLmNvbmZpZ1tcInRoZW1lXCJdIHx8IFwiXCI7XG4gICAgICB0aGlzLmlkID1cbiAgICAgICAgdGhpcy5jb25maWdbXCJpZFwiXSB8fFxuICAgICAgICBwYXJzZUludCgodGhpcy5pZERhdGUgLyAxMDAwMCkudG9TdHJpbmcoKS5zcGxpdChcIi5cIilbMV0pICtcbiAgICAgICAgICBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyMCkgKiAxMDAwMDtcbiAgICAgIHRoaXMuaGlkZVByb2dyZXNzQmFyID0gdGhpcy5jb25maWdbXCJoaWRlUHJvZ3Jlc3NCYXJcIl0gfHwgZmFsc2U7XG4gICAgICB0aGlzLmhpZGVSZXNldEJ0biA9IHRoaXMuY29uZmlnW1wiaGlkZVJlc2V0QnRuXCJdIHx8IGZhbHNlO1xuICAgICAgdGhpcy5oaWRlU2VsZWN0QnRuID0gdGhpcy5jb25maWdbXCJoaWRlU2VsZWN0QnRuXCJdIHx8IGZhbHNlO1xuICAgICAgdGhpcy51cGxvYWRCdG5UZXh0ID0gdGhpcy5jb25maWdbXCJ1cGxvYWRCdG5UZXh0XCJdIHx8IFwiVXBsb2FkXCI7XG4gICAgICB0aGlzLm1heFNpemUgPSB0aGlzLmNvbmZpZ1tcIm1heFNpemVcIl0gfHwgMjA7XG4gICAgICB0aGlzLnVwbG9hZEFQSSA9IHRoaXMuY29uZmlnW1widXBsb2FkQVBJXCJdW1widXJsXCJdO1xuICAgICAgdGhpcy5mb3JtYXRzQWxsb3dlZCA9XG4gICAgICAgIHRoaXMuY29uZmlnW1wiZm9ybWF0c0FsbG93ZWRcIl0gfHwgXCIuanBnLC5wbmcsLnBkZiwuZG9jeCwudHh0LC5naWYsLmpwZWdcIjtcbiAgICAgIHRoaXMubXVsdGlwbGUgPSB0aGlzLmNvbmZpZ1tcIm11bHRpcGxlXCJdIHx8IGZhbHNlO1xuICAgICAgdGhpcy5oZWFkZXJzID0gdGhpcy5jb25maWdbXCJ1cGxvYWRBUElcIl1bXCJoZWFkZXJzXCJdIHx8IHt9O1xuICAgICAgdGhpcy5hdHRhY2hQaW5UZXh0ID1cbiAgICAgICAgdGhpcy5jb25maWdbXCJhdHRhY2hQaW5UZXh0XCJdIHx8IFwiQXR0YWNoIHN1cHBvcnRpbmcgZG9jdW1lbnRzLi5cIjtcbiAgICAgIC8vY29uc29sZS5sb2coXCJjb25maWc6IFwiLCB0aGlzLmNvbmZpZyk7XG4gICAgICAvL2NvbnNvbGUubG9nKHRoaXMuY29uZmlnW1wibWF4U2l6ZVwiXSk7XG4gICAgICAvL2NvbnNvbGUubG9nKHRoaXMuaGVhZGVycyk7XG4gICAgICAvL2NvbnNvbGUubG9nKFwicnN0OiBcIiwgcnN0KTtcbiAgICB9XG5cbiAgICBpZiAocnN0W1wicmVzZXRVcGxvYWRcIl0pIHtcbiAgICAgIGlmIChyc3RbXCJyZXNldFVwbG9hZFwiXS5jdXJyZW50VmFsdWUgPT09IHRydWUpIHtcbiAgICAgICAgdGhpcy5yZXNldEZpbGVVcGxvYWQoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICAvL2NvbnNvbGUubG9nKFwiSWQ6IFwiLCB0aGlzLmlkKTtcbiAgICB0aGlzLnJlc2V0VXBsb2FkID0gZmFsc2U7XG4gIH1cblxuICByZXNldEZpbGVVcGxvYWQoKSB7XG4gICAgdGhpcy5zZWxlY3RlZEZpbGVzID0gW107XG4gICAgdGhpcy5DYXB0aW9uID0gW107XG4gICAgdGhpcy5ub3RBbGxvd2VkTGlzdCA9IFtdO1xuICAgIHRoaXMudXBsb2FkTXNnID0gZmFsc2U7XG4gICAgdGhpcy51cGxvYWRCdG4gPSBmYWxzZTtcbiAgfVxuXG4gIG9uQ2hhbmdlKGV2ZW50OiBhbnkpIHtcbiAgICAvL2NvbnNvbGUubG9nKHRoaXMubWF4U2l6ZSArIHRoaXMuZm9ybWF0c0FsbG93ZWQgKyB0aGlzLm11bHRpcGxlKTtcbiAgICB0aGlzLm5vdEFsbG93ZWRMaXN0ID0gW107XG4gICAgLy9jb25zb2xlLmxvZyhcIm9uY2hhbmdlIGhpdFwiKTtcbiAgICBpZiAodGhpcy5hZnRlclVwbG9hZCB8fCAhdGhpcy5tdWx0aXBsZSkge1xuICAgICAgdGhpcy5zZWxlY3RlZEZpbGVzID0gW107XG4gICAgICB0aGlzLkNhcHRpb24gPSBbXTtcbiAgICAgIHRoaXMuYWZ0ZXJVcGxvYWQgPSBmYWxzZTtcbiAgICB9XG4gICAgLy9GT1JNQVRTIEFMTE9XRUQgTElTVFxuICAgIC8vY29uc29sZS5sb2coXCJGT1JNQVRTIEFMTE9XRUQgTElTVD0gXCIrdGhpcy5mb3JtYXRzQWxsb3dlZCk7XG4gICAgLy9OTyBPRiBGT1JNQVRTIEFMTE9XRURcbiAgICBsZXQgZm9ybWF0c0NvdW50OiBhbnk7XG4gICAgZm9ybWF0c0NvdW50ID0gdGhpcy5mb3JtYXRzQWxsb3dlZC5tYXRjaChuZXcgUmVnRXhwKFwiXFxcXC5cIiwgXCJnXCIpKTtcbiAgICBmb3JtYXRzQ291bnQgPSBmb3JtYXRzQ291bnQubGVuZ3RoO1xuICAgIC8vY29uc29sZS5sb2coXCJOTyBPRiBGT1JNQVRTIEFMTE9XRUQ9IFwiK2Zvcm1hdHNDb3VudCk7XG4gICAgLy9jb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XG5cbiAgICAvL0lURVJBVEUgU0VMRUNURUQgRklMRVNcbiAgICBsZXQgZmlsZTogRmlsZUxpc3Q7XG4gICAgaWYgKGV2ZW50LnR5cGUgPT0gXCJkcm9wXCIpIHtcbiAgICAgIGZpbGUgPSBldmVudC5kYXRhVHJhbnNmZXIuZmlsZXM7XG4gICAgICAvL2NvbnNvbGUubG9nKFwidHlwZTogZHJvcFwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZmlsZSA9IGV2ZW50LnRhcmdldC5maWxlcyB8fCBldmVudC5zcmNFbGVtZW50LmZpbGVzO1xuICAgICAgLy9jb25zb2xlLmxvZyhcInR5cGU6IGNoYW5nZVwiKTtcbiAgICB9XG4gICAgLy9jb25zb2xlLmxvZyhmaWxlKTtcbiAgICBsZXQgY3VycmVudEZpbGVFeHQ6IGFueTtcbiAgICBsZXQgZXh0OiBhbnk7XG4gICAgbGV0IGZybXRBbGxvd2VkOiBib29sZWFuO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsZS5sZW5ndGg7IGkrKykge1xuICAgICAgLy9DSEVDSyBGT1JNQVRcbiAgICAgIC8vQ1VSUkVOVCBGSUxFIEVYVEVOU0lPTlxuICAgICAgY3VycmVudEZpbGVFeHQgPSB0aGlzLnJlZy5leGVjKGZpbGVbaV0ubmFtZSk7XG4gICAgICBjdXJyZW50RmlsZUV4dCA9IGN1cnJlbnRGaWxlRXh0WzFdO1xuICAgICAgLy9jb25zb2xlLmxvZyhmaWxlW2ldLm5hbWUpO1xuICAgICAgZnJtdEFsbG93ZWQgPSBmYWxzZTtcbiAgICAgIC8vRk9STUFUIEFMTE9XRUQgTElTVCBJVEVSQVRFXG4gICAgICBmb3IgKGxldCBqID0gZm9ybWF0c0NvdW50OyBqID4gMDsgai0tKSB7XG4gICAgICAgIGV4dCA9IHRoaXMuZm9ybWF0c0FsbG93ZWQuc3BsaXQoXCIuXCIpW2pdO1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwiRk9STUFUIExJU1QgKFwiK2orXCIpPSBcIitleHQuc3BsaXQoXCIsXCIpWzBdKTtcbiAgICAgICAgaWYgKGogPT0gZm9ybWF0c0NvdW50KSB7XG4gICAgICAgICAgZXh0ID0gdGhpcy5mb3JtYXRzQWxsb3dlZC5zcGxpdChcIi5cIilbal0gKyBcIixcIjtcbiAgICAgICAgfSAvL2NoZWNrIGZvcm1hdFxuICAgICAgICBpZiAoY3VycmVudEZpbGVFeHQudG9Mb3dlckNhc2UoKSA9PSBleHQuc3BsaXQoXCIsXCIpWzBdKSB7XG4gICAgICAgICAgZnJtdEFsbG93ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChmcm10QWxsb3dlZCkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwiRk9STUFUIEFMTE9XRURcIik7XG4gICAgICAgIC8vQ0hFQ0sgU0laRVxuICAgICAgICBpZiAoZmlsZVtpXS5zaXplID4gdGhpcy5tYXhTaXplICogMTAyNDAwMCkge1xuICAgICAgICAgIC8vY29uc29sZS5sb2coXCJTSVpFIE5PVCBBTExPV0VEIChcIitmaWxlW2ldLnNpemUrXCIpXCIpO1xuICAgICAgICAgIHRoaXMubm90QWxsb3dlZExpc3QucHVzaCh7XG4gICAgICAgICAgICBmaWxlTmFtZTogZmlsZVtpXS5uYW1lLFxuICAgICAgICAgICAgZmlsZVNpemU6IHRoaXMuY29udmVydFNpemUoZmlsZVtpXS5zaXplKSxcbiAgICAgICAgICAgIGVycm9yTXNnOiBcIkludmFsaWQgc2l6ZVwiXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy9mb3JtYXQgYWxsb3dlZCBhbmQgc2l6ZSBhbGxvd2VkIHRoZW4gYWRkIGZpbGUgdG8gc2VsZWN0ZWRGaWxlIGFycmF5XG4gICAgICAgICAgdGhpcy5zZWxlY3RlZEZpbGVzLnB1c2goZmlsZVtpXSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coXCJGT1JNQVQgTk9UIEFMTE9XRURcIik7XG4gICAgICAgIHRoaXMubm90QWxsb3dlZExpc3QucHVzaCh7XG4gICAgICAgICAgZmlsZU5hbWU6IGZpbGVbaV0ubmFtZSxcbiAgICAgICAgICBmaWxlU2l6ZTogdGhpcy5jb252ZXJ0U2l6ZShmaWxlW2ldLnNpemUpLFxuICAgICAgICAgIGVycm9yTXNnOiBcIkludmFsaWQgZm9ybWF0XCJcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLnNlbGVjdGVkRmlsZXMubGVuZ3RoICE9PSAwKSB7XG4gICAgICB0aGlzLnVwbG9hZEJ0biA9IHRydWU7XG4gICAgICBpZiAodGhpcy50aGVtZSA9PSBcImF0dGFjaFBpblwiKSB0aGlzLnVwbG9hZEZpbGVzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudXBsb2FkQnRuID0gZmFsc2U7XG4gICAgfVxuICAgIHRoaXMudXBsb2FkTXNnID0gZmFsc2U7XG4gICAgdGhpcy51cGxvYWRDbGljayA9IHRydWU7XG4gICAgdGhpcy5wZXJjZW50Q29tcGxldGUgPSAwO1xuICAgIGV2ZW50LnRhcmdldC52YWx1ZSA9IG51bGw7XG4gIH1cblxuICB1cGxvYWRGaWxlcygpIHtcbiAgICAvL2NvbnNvbGUubG9nKHRoaXMuc2VsZWN0ZWRGaWxlcyk7XG5cbiAgICBsZXQgaTogYW55O1xuICAgIHRoaXMucHJvZ3Jlc3NCYXJTaG93ID0gdHJ1ZTtcbiAgICB0aGlzLnVwbG9hZENsaWNrID0gZmFsc2U7XG4gICAgdGhpcy5ub3RBbGxvd2VkTGlzdCA9IFtdO1xuICAgIGxldCBpc0Vycm9yID0gZmFsc2U7XG5cbiAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgbGV0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5zZWxlY3RlZEZpbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodGhpcy5DYXB0aW9uW2ldID09IHVuZGVmaW5lZCkgXG4gICAgICAgIHRoaXMuQ2FwdGlvbltpXSA9IFwiZmlsZVwiICsgaTtcbiAgICAgIC8vQWRkIERBVEEgVE8gQkUgU0VOVFxuICAgICAgZm9ybURhdGEuYXBwZW5kKFxuICAgICAgICB0aGlzLkNhcHRpb25baV0sXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRGaWxlc1tpXSAvKiwgdGhpcy5zZWxlY3RlZEZpbGVzW2ldLm5hbWUqL1xuICAgICAgKTtcbiAgICAgIC8vY29uc29sZS5sb2codGhpcy5zZWxlY3RlZEZpbGVzW2ldK1wie1wiK3RoaXMuQ2FwdGlvbltpXStcIiAoQ2FwdGlvbil9XCIpO1xuICAgIH1cblxuICAgIGlmIChpID4gMSkge1xuICAgICAgdGhpcy5zaW5nbGVGaWxlID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2luZ2xlRmlsZSA9IHRydWU7XG4gICAgfVxuXG4gICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGV2bnQgPT4ge1xuICAgICAgLy9jb25zb2xlLmxvZyhcIm9ucmVhZHlcIik7XG4gICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgaWYgKHhoci5zdGF0dXMgIT09IDIwMCkge1xuICAgICAgICAgIGlzRXJyb3IgPSB0cnVlO1xuICAgICAgICAgIHRoaXMucHJvZ3Jlc3NCYXJTaG93ID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy51cGxvYWRCdG4gPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLnVwbG9hZE1zZyA9IHRydWU7XG4gICAgICAgICAgdGhpcy5hZnRlclVwbG9hZCA9IHRydWU7XG4gICAgICAgICAgdGhpcy51cGxvYWRNc2dUZXh0ID0gXCJVcGxvYWQgRmFpbGVkICFcIjtcbiAgICAgICAgICB0aGlzLnVwbG9hZE1zZ0NsYXNzID0gXCJ0ZXh0LWRhbmdlciBsZWFkXCI7XG4gICAgICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLnVwbG9hZE1zZ1RleHQpO1xuICAgICAgICAgIC8vY29uc29sZS5sb2coZXZudCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5BcGlSZXNwb25zZS5lbWl0KHhocik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHhoci51cGxvYWQub25wcm9ncmVzcyA9IGV2bnQgPT4ge1xuICAgICAgdGhpcy51cGxvYWRCdG4gPSBmYWxzZTsgLy8gYnV0dG9uIHNob3VsZCBiZSBkaXNhYmxlZCBieSBwcm9jZXNzIHVwbG9hZGluZ1xuICAgICAgaWYgKGV2bnQubGVuZ3RoQ29tcHV0YWJsZSkge1xuICAgICAgICB0aGlzLnBlcmNlbnRDb21wbGV0ZSA9IE1hdGgucm91bmQoKGV2bnQubG9hZGVkIC8gZXZudC50b3RhbCkgKiAxMDApO1xuICAgICAgfVxuICAgICAgLy9jb25zb2xlLmxvZyhcIlByb2dyZXNzLi4uXCIvKit0aGlzLnBlcmNlbnRDb21wbGV0ZStcIiAlXCIqLyk7XG4gICAgfTtcblxuICAgIHhoci5vbmxvYWQgPSBldm50ID0+IHtcbiAgICAgIC8vY29uc29sZS5sb2coXCJvbmxvYWRcIik7XG4gICAgICAvL2NvbnNvbGUubG9nKGV2bnQpO1xuICAgICAgdGhpcy5wcm9ncmVzc0JhclNob3cgPSBmYWxzZTtcbiAgICAgIHRoaXMudXBsb2FkQnRuID0gZmFsc2U7XG4gICAgICB0aGlzLnVwbG9hZE1zZyA9IHRydWU7XG4gICAgICB0aGlzLmFmdGVyVXBsb2FkID0gdHJ1ZTtcbiAgICAgIGlmICghaXNFcnJvcikge1xuICAgICAgICB0aGlzLnVwbG9hZE1zZ1RleHQgPSBcIlN1Y2Nlc3NmdWxseSBVcGxvYWRlZCAhXCI7XG4gICAgICAgIHRoaXMudXBsb2FkTXNnQ2xhc3MgPSBcInRleHQtc3VjY2VzcyBsZWFkXCI7XG4gICAgICAgIC8vY29uc29sZS5sb2codGhpcy51cGxvYWRNc2dUZXh0ICsgXCIgXCIgKyB0aGlzLnNlbGVjdGVkRmlsZXMubGVuZ3RoICsgXCIgZmlsZVwiKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgeGhyLm9uZXJyb3IgPSBldm50ID0+IHtcbiAgICAgIC8vY29uc29sZS5sb2coXCJvbmVycm9yXCIpO1xuICAgICAgLy9jb25zb2xlLmxvZyhldm50KTtcbiAgICB9O1xuXG4gICAgeGhyLm9wZW4oXCJQT1NUXCIsIHRoaXMudXBsb2FkQVBJLCB0cnVlKTtcbiAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyh0aGlzLmhlYWRlcnMpKSB7XG4gICAgICAvLyBPYmplY3Qua2V5cyB3aWxsIGdpdmUgYW4gQXJyYXkgb2Yga2V5c1xuICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoa2V5LCB0aGlzLmhlYWRlcnNba2V5XSk7XG4gICAgfVxuICAgIC8vbGV0IHRva2VuID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInRva2VuXCIpO1xuICAgIC8veGhyLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJ0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLThcIik7XG4gICAgLy94aHIuc2V0UmVxdWVzdEhlYWRlcignQXV0aG9yaXphdGlvbicsIGBCZWFyZXIgJHt0b2tlbn1gKTtcbiAgICB4aHIuc2VuZChmb3JtRGF0YSk7XG4gIH1cblxuICByZW1vdmVGaWxlKGk6IGFueSwgc2ZfbmE6IGFueSkge1xuICAgIC8vY29uc29sZS5sb2coXCJyZW1vdmUgZmlsZSBjbGlja2VkIFwiICsgaSlcbiAgICBpZiAoc2ZfbmEgPT0gXCJzZlwiKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkRmlsZXMuc3BsaWNlKGksIDEpO1xuICAgICAgdGhpcy5DYXB0aW9uLnNwbGljZShpLCAxKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ub3RBbGxvd2VkTGlzdC5zcGxpY2UoaSwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2VsZWN0ZWRGaWxlcy5sZW5ndGggPT0gMCkge1xuICAgICAgdGhpcy51cGxvYWRCdG4gPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBjb252ZXJ0U2l6ZShmaWxlU2l6ZTogbnVtYmVyKSB7XG4gICAgLy9jb25zb2xlLmxvZyhmaWxlU2l6ZSArIFwiIC0gXCIrIHN0cik7XG4gICAgcmV0dXJuIGZpbGVTaXplIDwgMTAyNDAwMFxuICAgICAgPyAoZmlsZVNpemUgLyAxMDI0KS50b0ZpeGVkKDIpICsgXCIgS0JcIlxuICAgICAgOiAoZmlsZVNpemUgLyAxMDI0MDAwKS50b0ZpeGVkKDIpICsgXCIgTUJcIjtcbiAgfVxuXG4gIGF0dGFjaHBpbk9uY2xpY2soKSB7XG4gICAgLy9jb25zb2xlLmxvZyhcIklEOiBcIiwgdGhpcy5pZCk7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxcIiArIHRoaXMuaWQpIS5jbGljaygpO1xuICAgIC8vJChcIiNcIitcInNlbFwiK3RoaXMuaWQpLmNsaWNrKCk7XG4gIH1cblxuICBkcm9wKGV2ZW50OiBhbnkpIHtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIC8vY29uc29sZS5sb2coXCJkcm9wOiBcIiwgZXZlbnQpO1xuICAgIC8vY29uc29sZS5sb2coXCJkcm9wOiBcIiwgZXZlbnQuZGF0YVRyYW5zZmVyLmZpbGVzKTtcbiAgICB0aGlzLm9uQ2hhbmdlKGV2ZW50KTtcbiAgfVxuICBhbGxvd0Ryb3AoZXZlbnQ6IGFueSkge1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcImNvcHlcIjtcbiAgICAvL2NvbnNvbGUubG9nKFwiYWxsb3dEcm9wOiBcIixldmVudClcbiAgfVxufVxuXG4vKiBpbnRlcmZhY2UgQ09ORklHIHtcbiAgdXBsb2FkQVBJOiBzdHJpbmc7XG4gIG11bHRpcGxlPzogYm9vbGVhbjtcbiAgZm9ybWF0c0FsbG93ZWQ/OiBzdHJpbmc7XG4gIG1heFNpemU/OiBudW1iZXI7XG4gIGlkPzogbnVtYmVyO1xuICByZXNldFVwbG9hZD86IGJvb2xlYW47XG4gIHRoZW1lPzogc3RyaW5nO1xuICBoaWRlUHJvZ3Jlc3NCYXI/OiBib29sZWFuO1xuIH1cbiAqLyIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgQW5ndWxhckZpbGVVcGxvYWRlckNvbXBvbmVudCB9IGZyb20gJy4vYW5ndWxhci1maWxlLXVwbG9hZGVyLmNvbXBvbmVudCc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBDb21tb25Nb2R1bGVcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbQW5ndWxhckZpbGVVcGxvYWRlckNvbXBvbmVudF0sXG4gIGV4cG9ydHM6IFtBbmd1bGFyRmlsZVVwbG9hZGVyQ29tcG9uZW50XVxufSlcbmV4cG9ydCBjbGFzcyBBbmd1bGFyRmlsZVVwbG9hZGVyTW9kdWxlIHsgfVxuIl0sIm5hbWVzIjpbIkluamVjdGFibGUiLCJFdmVudEVtaXR0ZXIiLCJ0c2xpYl8xLl9fdmFsdWVzIiwiQ29tcG9uZW50IiwiSW5wdXQiLCJPdXRwdXQiLCJOZ01vZHVsZSIsIkNvbW1vbk1vZHVsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO1FBT0U7U0FBaUI7O29CQUxsQkEsYUFBVSxTQUFDO3dCQUNWLFVBQVUsRUFBRSxNQUFNO3FCQUNuQjs7Ozt5Q0FKRDtLQVFDOztJQ1JEOzs7Ozs7Ozs7Ozs7OztBQWNBLHNCQTRGeUIsQ0FBQztRQUN0QixJQUFJLENBQUMsR0FBRyxPQUFPLE1BQU0sS0FBSyxVQUFV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