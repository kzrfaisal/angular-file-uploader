/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component, Input, Output, EventEmitter } from '@angular/core';
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
            for (var _a = tslib_1.__values(Object.keys(this.headers)), _b = _a.next(); !_b.done; _b = _a.next()) {
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
export { AngularFileUploaderComponent };
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1maWxlLXVwbG9hZGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItZmlsZS11cGxvYWRlci8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWZpbGUtdXBsb2FkZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBdUQsTUFBTSxlQUFlLENBQUM7O0lBbUhsSTs7OztzQkFsQ2MsRUFBRTsyQkFFTyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQzsyQkFFbkMsSUFBSSxZQUFZLEVBQUU7c0JBZWYsQ0FBQyxJQUFJLElBQUksRUFBRTttQkFDZCxpQkFBaUI7NkJBQ0gsRUFBRTs4QkFDRSxFQUFFO3VCQUNULEVBQUU7MEJBQ2QsSUFBSTsrQkFDQyxLQUFLO3lCQUNYLEtBQUs7eUJBQ0wsS0FBSzsyQkFDSCxLQUFLOzJCQUNMLElBQUk7S0FTakI7Ozs7O0lBRUQsa0RBQVc7Ozs7SUFBWCxVQUFZLEdBQWtCO1FBQzVCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUN4QyxJQUFJLENBQUMsRUFBRTtnQkFDTCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztvQkFDakIsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3RELElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUMzQyxJQUFJLENBQUMs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cnQgeyBDb21wb25lbnQsIE9uSW5pdCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMsIEluamVjdCwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogXCJhbmd1bGFyLWZpbGUtdXBsb2FkZXJcIixcbiAgdGVtcGxhdGU6IGA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCIgKm5nSWY9XCIodGhlbWUgIT09ICdhdHRhY2hQaW4nKVwiIGlkPVwiZGVmYXVsdFwiPlxyXG5cclxuICAgIDwhLS0gRHJhZyBuIERyb3AgdGhlbWUgU3RhcnRzIC0tPlxyXG4gICAgPGRpdiAqbmdJZj1cInRoZW1lID09ICdkcmFnTkRyb3AnXCIgaWQ9XCJkcmFnTkRyb3BcIiBbbmdDbGFzc109XCIoaGlkZVNlbGVjdEJ0biAmJiBoaWRlUmVzZXRCdG4pID8gbnVsbCA6ICdkcmFnTkRyb3BCdG1QYWQnXCIgY2xhc3M9XCJkcmFnTkRyb3BcIj5cclxuICAgICAgICA8ZGl2IHN0eWxlPVwicG9zaXRpb246cmVsYXRpdmU7XCI+XHJcbiAgICAgICAgICAgIDxkaXYgaWQ9XCJkaXYxXCIgY2xhc3M9XCJkaXYxIGFmdS1kcmFnbmRyb3AtYm94XCIgKGRyb3ApPVwiZHJvcCgkZXZlbnQpXCIgKGRyYWdvdmVyKT1cImFsbG93RHJvcCgkZXZlbnQpXCI+XHJcbiAgICAgICAgICAgICAgICA8cCBjbGFzcz1cImFmdS1kcmFnbmRyb3AtdGV4dFwiPkRyYWcgTiBEcm9wPC9wPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPCEtLSA8c3BhbiBjbGFzcz0nbGFiZWwgbGFiZWwtaW5mbycgaWQ9XCJ1cGxvYWQtZmlsZS1pbmZve3tpZH19XCI+e3tzZWxlY3RlZEZpbGVzWzBdPy5uYW1lfX08L3NwYW4+IC0tPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgICA8IS0tIERyYWcgbiBEcm9wIHRoZW1lIEVuZHMgLS0+XHJcblxyXG4gICAgPGxhYmVsIGZvcj1cInNlbHt7aWR9fVwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5IGJ0bi1zbSBhZnUtc2VsZWN0LWJ0blwiICpuZ0lmPVwiIWhpZGVTZWxlY3RCdG5cIj5TZWxlY3QgRmlsZTxzcGFuICpuZ0lmPVwibXVsdGlwbGVcIj5zPC9zcGFuPjwvbGFiZWw+XHJcbiAgICA8aW5wdXQgdHlwZT1cImZpbGVcIiBpZD1cInNlbHt7aWR9fVwiIHN0eWxlPVwiZGlzcGxheTogbm9uZVwiICpuZ0lmPVwiIWhpZGVTZWxlY3RCdG5cIiAoY2hhbmdlKT1cIm9uQ2hhbmdlKCRldmVudClcIiB0aXRsZT1cIlNlbGVjdCBmaWxlXCJcclxuICAgICAgICBuYW1lPVwiZmlsZXNbXVwiIFthY2NlcHRdPWZvcm1hdHNBbGxvd2VkIFthdHRyLm11bHRpcGxlXT1cIm11bHRpcGxlID8gJycgOiBudWxsXCIgLz5cclxuICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLWluZm8gYnRuLXNtIHJlc2V0QnRuIGFmdS1yZXNldC1idG5cIiAoY2xpY2spPVwicmVzZXRGaWxlVXBsb2FkKClcIiAqbmdJZj1cIiFoaWRlUmVzZXRCdG5cIj5SZXNldDwvYnV0dG9uPlxyXG4gICAgPGJyICpuZ0lmPVwiIWhpZGVTZWxlY3RCdG5cIj5cclxuICAgIDxwIGNsYXNzPVwiY29uc3RyYWludHMtaW5mbyBhZnUtY29uc3RyYWludHMtaW5mb1wiPih7e2Zvcm1hdHNBbGxvd2VkfX0pIFNpemUgbGltaXQtIHt7KGNvbnZlcnRTaXplKG1heFNpemUgKjEwMjQwMDApKX19PC9wPlxyXG4gICAgPCEtLVNlbGVjdGVkIGZpbGUgbGlzdC0tPlxyXG4gICAgPGRpdiBjbGFzcz1cInJvdyBhZnUtdmFsaWQtZmlsZVwiICpuZ0Zvcj1cImxldCBzZiBvZiBzZWxlY3RlZEZpbGVzO2xldCBpPWluZGV4XCIgPlxyXG4gICAgICAgIDxwIGNsYXNzPVwiY29sLXhzLTMgdGV4dE92ZXJmbG93XCI+PHNwYW4gY2xhc3M9XCJ0ZXh0LXByaW1hcnlcIj57e3NmLm5hbWV9fTwvc3Bhbj48L3A+XHJcbiAgICAgICAgPHAgY2xhc3M9XCJjb2wteHMtMyBwYWRNYXJnIHNpemVDXCI+PHN0cm9uZz4oe3tjb252ZXJ0U2l6ZShzZi5zaXplKX19KTwvc3Ryb25nPiZuYnNwOyZuYnNwOyZuYnNwOyZuYnNwOyZuYnNwOzwvcD5cclxuICAgICAgICA8IS0tICA8aW5wdXQgY2xhc3M9XCJjb2wteHMtMyBwcm9ncmVzcyBjYXB0aW9uXCIgIHR5cGU9XCJ0ZXh0XCIgIHBsYWNlaG9sZGVyPVwiQ2FwdGlvbi4uXCIgIFsobmdNb2RlbCldPVwiQ2FwdGlvbltpXVwiICAqbmdJZj1cInVwbG9hZENsaWNrXCIvPiAtLT5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MgY29sLXhzLTMgcGFkTWFyZyBhZnUtcHJvZ3Jlc3MtYmFyXCIgKm5nSWY9XCJzaW5nbGVGaWxlICYmIHByb2dyZXNzQmFyU2hvdyAmJiAhaGlkZVByb2dyZXNzQmFyXCI+XHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicHJvZ3Jlc3MtYmFyIHByb2dyZXNzLWJhci1zdWNjZXNzXCIgcm9sZT1cInByb2dyZXNzYmFyXCIgW25nU3R5bGVdPVwieyd3aWR0aCc6cGVyY2VudENvbXBsZXRlKyclJ31cIj57e3BlcmNlbnRDb21wbGV0ZX19JTwvc3Bhbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8YSBjbGFzcz1cImNvbC14cy0xXCIgcm9sZT1cImJ1dHRvblwiIChjbGljayk9XCJyZW1vdmVGaWxlKGksJ3NmJylcIiAqbmdJZj1cInVwbG9hZENsaWNrXCI+PGkgY2xhc3M9XCJmYSBmYS10aW1lc1wiPjwvaT48L2E+XHJcbiAgICA8L2Rpdj5cclxuICAgIDwhLS1JbnZhbGlkIGZpbGUgbGlzdC0tPlxyXG4gICAgPGRpdiBjbGFzcz1cInJvdyB0ZXh0LWRhbmdlciBhZnUtaW52YWxpZC1maWxlXCIgKm5nRm9yPVwibGV0IG5hIG9mIG5vdEFsbG93ZWRMaXN0O2xldCBqPWluZGV4XCI+XHJcbiAgICAgICAgPHAgY2xhc3M9XCJjb2wteHMtMyB0ZXh0T3ZlcmZsb3dcIj48c3Bhbj57e25hWydmaWxlTmFtZSddfX08L3NwYW4+PC9wPlxyXG4gICAgICAgIDxwIGNsYXNzPVwiY29sLXhzLTMgcGFkTWFyZyBzaXplQ1wiPjxzdHJvbmc+KHt7bmFbJ2ZpbGVTaXplJ119fSk8L3N0cm9uZz48L3A+XHJcbiAgICAgICAgPHAgY2xhc3M9XCJjb2wteHMtMyBcIj57e25hWydlcnJvck1zZyddfX08L3A+XHJcbiAgICAgICAgPGEgY2xhc3M9XCJjb2wteHMtMSBkZWxGaWxlSWNvblwiIHJvbGU9XCJidXR0b25cIiAoY2xpY2spPVwicmVtb3ZlRmlsZShqLCduYScpXCIgKm5nSWY9XCJ1cGxvYWRDbGlja1wiPiZuYnNwOzxpIGNsYXNzPVwiZmEgZmEtdGltZXNcIj48L2k+PC9hPlxyXG4gICAgPC9kaXY+XHJcblxyXG4gICAgPHAgKm5nSWY9XCJ1cGxvYWRNc2dcIiBjbGFzcz1cInt7dXBsb2FkTXNnQ2xhc3N9fSArIGFmdS11cGxvYWQtc3RhdHVzXCI+e3t1cGxvYWRNc2dUZXh0fX08cD5cclxuICAgIDxkaXYgKm5nSWY9XCIhc2luZ2xlRmlsZSAmJiBwcm9ncmVzc0JhclNob3cgJiYgIWhpZGVQcm9ncmVzc0JhclwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzcyBjb2wteHMtNCBwYWRNYXJnIGFmdS1wcm9ncmVzcy1iYXJcIj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwcm9ncmVzcy1iYXIgcHJvZ3Jlc3MtYmFyLXN1Y2Nlc3NcIiByb2xlPVwicHJvZ3Jlc3NiYXJcIiBbbmdTdHlsZV09XCJ7J3dpZHRoJzpwZXJjZW50Q29tcGxldGUrJyUnfVwiPnt7cGVyY2VudENvbXBsZXRlfX0lPC9zcGFuPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxicj5cclxuICAgICAgICA8YnI+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLXN1Y2Nlc3MgYWZ1LXVwbG9hZC1idG5cIiB0eXBlPVwiYnV0dG9uXCIgKGNsaWNrKT1cInVwbG9hZEZpbGVzKClcIiBbZGlzYWJsZWRdPSF1cGxvYWRCdG4+e3t1cGxvYWRCdG5UZXh0fX08L2J1dHRvbj5cclxuICAgIDxicj5cclxuPC9kaXY+XHJcblxyXG48IS0tLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vIEFUVEFDSCBQSU4gVEhFTUUgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8tLT5cclxuPGRpdiAqbmdJZj1cInRoZW1lID09ICdhdHRhY2hQaW4nXCIgaWQ9XCJhdHRhY2hQaW5cIj5cclxuICAgIDxkaXYgc3R5bGU9XCJwb3NpdGlvbjpyZWxhdGl2ZTtwYWRkaW5nLWxlZnQ6NnB4XCI+XHJcbiAgICAgICAgPGEgY2xhc3M9J2J0biB1cF9idG4gYWZ1LWF0dGFjaC1waW4nIChjbGljayk9XCJhdHRhY2hwaW5PbmNsaWNrKClcIj5cclxuICAgICAgICAgICAge3thdHRhY2hQaW5UZXh0fX1cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1wYXBlcmNsaXBcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XHJcbiAgICAgICAgICAgIDwhLS0gPHAgc3R5bGU9XCJtYXJnaW4tdG9wOjEwcHhcIj4oe3tmb3JtYXRzQWxsb3dlZH19KSBTaXplIGxpbWl0LSB7eyhjb252ZXJ0U2l6ZShtYXhTaXplICogMTAyNDAwMCkpfX08L3A+IC0tPlxyXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cImZpbGVcIiBpZD1cInNlbHt7aWR9fVwiIChjaGFuZ2UpPVwib25DaGFuZ2UoJGV2ZW50KVwiIHN0eWxlPVwiZGlzcGxheTogbm9uZVwiIHRpdGxlPVwiU2VsZWN0IGZpbGVcIiBuYW1lPVwiZmlsZXNbXVwiIFthY2NlcHRdPWZvcm1hdHNBbGxvd2VkXHJcbiAgICAgICAgICAgICAgICBbYXR0ci5tdWx0aXBsZV09XCJtdWx0aXBsZSA/ICcnIDogbnVsbFwiIC8+XHJcbiAgICAgICAgICAgIDxicj5cclxuICAgICAgICA8L2E+XHJcbiAgICAgICAgJm5ic3A7XHJcbiAgICAgICAgPHNwYW4gY2xhc3M9J2xhYmVsIGxhYmVsLWluZm8nIGlkPVwidXBsb2FkLWZpbGUtaW5mb3t7aWR9fVwiPnt7c2VsZWN0ZWRGaWxlc1swXT8ubmFtZX19PC9zcGFuPlxyXG4gICAgPC9kaXY+XHJcbjwvZGl2PlxyXG5cclxuPCEtLS8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyBEUkFHIE4gRFJPUCBUSEVNRSAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy0tPlxyXG48IS0tIDxkaXYgKm5nSWY9XCJ0aGVtZSA9PSAnZHJhZ05Ecm9wJ1wiIGlkPVwiZHJhZ05Ecm9wXCI+XHJcbiAgPGRpdiBzdHlsZT1cInBvc2l0aW9uOnJlbGF0aXZlO3BhZGRpbmctbGVmdDo2cHhcIj5cclxuICAgIDxkaXYgaWQ9XCJkaXYxXCIgKGRyb3ApPVwiZHJvcCgkZXZlbnQpXCIgKGRyYWdvdmVyKT1cImFsbG93RHJvcCgkZXZlbnQpXCI+XHJcbiAgICAgIDxwPkRyYWcgTiBEcm9wPC9wPlxyXG4gICAgPC9kaXY+XHJcbiAgICA8c3BhbiBjbGFzcz0nbGFiZWwgbGFiZWwtaW5mbycgaWQ9XCJ1cGxvYWQtZmlsZS1pbmZve3tpZH19XCI+e3tzZWxlY3RlZEZpbGVzWzBdPy5uYW1lfX08L3NwYW4+XHJcbiAgPC9kaXY+XHJcbjwvZGl2PiAtLT5gICxcbiAgc3R5bGVzOiBbYC5jb25zdHJhaW50cy1pbmZve21hcmdpbi10b3A6MTBweDtmb250LXN0eWxlOml0YWxpY30ucGFkTWFyZ3twYWRkaW5nOjA7bWFyZ2luLWJvdHRvbTowfS5jYXB0aW9ue21hcmdpbi1yaWdodDo1cHh9LnRleHRPdmVyZmxvd3t3aGl0ZS1zcGFjZTpub3dyYXA7cGFkZGluZy1yaWdodDowO292ZXJmbG93OmhpZGRlbjt0ZXh0LW92ZXJmbG93OmVsbGlwc2lzfS51cF9idG57Y29sb3I6IzAwMDtiYWNrZ3JvdW5kLWNvbG9yOnRyYW5zcGFyZW50O2JvcmRlcjoycHggc29saWQgIzVjNWI1Yjtib3JkZXItcmFkaXVzOjIycHh9LmRlbEZpbGVJY29ue3RleHQtZGVjb3JhdGlvbjpub25lO2NvbG9yOiNjZTA5MDl9LmRyYWdORHJvcCAuZGl2MXtkaXNwbGF5OmJvcmRlci1ib3g7Ym9yZGVyOjJweCBkYXNoZWQgIzVjNWI1YjtoZWlnaHQ6NnJlbTt3aWR0aDoyMHJlbX0uZHJhZ05Ecm9wIC5kaXYxPnB7dGV4dC1hbGlnbjpjZW50ZXI7Zm9udC13ZWlnaHQ6NzAwO2NvbG9yOiM1YzViNWI7bWFyZ2luLXRvcDoxLjRlbX0uZHJhZ05Ecm9wQnRtUGFke3BhZGRpbmctYm90dG9tOjJyZW19QG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDo2MjBweCl7LmNhcHRpb257cGFkZGluZzowfX1AbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOjUxMHB4KXsuc2l6ZUN7d2lkdGg6MjUlfX1AbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOjI2MHB4KXsuY2FwdGlvbiwuc2l6ZUN7Zm9udC1zaXplOjEwcHh9fS5yZXNldEJ0bnttYXJnaW4tbGVmdDozcHh9YF1cbn0pXG5leHBvcnQgY2xhc3MgQW5ndWxhckZpbGVVcGxvYWRlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcbiAgQElucHV0KClcbiAgY29uZmlnOiBhbnkgPSB7fTtcbiAgQElucHV0KClcbiAgcmVzZXRVcGxvYWQ6IGJvb2xlYW4gPSB0aGlzLmNvbmZpZ1tcInJlc2V0VXBsb2FkXCJdO1xuICBAT3V0cHV0KClcbiAgQXBpUmVzcG9uc2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgdGhlbWU6IHN0cmluZztcbiAgaWQ6IG51bWJlcjtcbiAgaGlkZVByb2dyZXNzQmFyOiBib29sZWFuO1xuICBtYXhTaXplOiBudW1iZXI7XG4gIHVwbG9hZEFQSTogc3RyaW5nO1xuICBmb3JtYXRzQWxsb3dlZDogc3RyaW5nO1xuICBtdWx0aXBsZTogYm9vbGVhbjtcbiAgaGVhZGVyczogYW55O1xuICBoaWRlUmVzZXRCdG46IGJvb2xlYW47XG4gIGhpZGVTZWxlY3RCdG46IGJvb2xlYW47XG4gIGF0dGFjaFBpblRleHQ6IHN0cmluZztcbiAgdXBsb2FkQnRuVGV4dDogc3RyaW5nO1xuXG4gIGlkRGF0ZTogbnVtYmVyID0gK25ldyBEYXRlKCk7XG4gIHJlZzogUmVnRXhwID0gLyg/OlxcLihbXi5dKykpPyQvO1xuICBzZWxlY3RlZEZpbGVzOiBBcnJheTxhbnk+ID0gW107XG4gIG5vdEFsbG93ZWRMaXN0OiBBcnJheTxPYmplY3Q+ID0gW107XG4gIENhcHRpb246IEFycmF5PHN0cmluZz4gPSBbXTtcbiAgc2luZ2xlRmlsZSA9IHRydWU7XG4gIHByb2dyZXNzQmFyU2hvdyA9IGZhbHNlO1xuICB1cGxvYWRCdG4gPSBmYWxzZTtcbiAgdXBsb2FkTXNnID0gZmFsc2U7XG4gIGFmdGVyVXBsb2FkID0gZmFsc2U7XG4gIHVwbG9hZENsaWNrID0gdHJ1ZTtcbiAgdXBsb2FkTXNnVGV4dDogc3RyaW5nO1xuICB1cGxvYWRNc2dDbGFzczogc3RyaW5nO1xuICBwZXJjZW50Q29tcGxldGU6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICAvL2NvbnNvbGUubG9nKFwiaWQ6IFwiLHRoaXMuaWQpO1xuICAgIC8vY29uc29sZS5sb2coXCJpZERhdGU6IFwiLHRoaXMuaWREYXRlKTtcbiAgICAvL2NvbnNvbGUubG9nKE1hdGgucmFuZG9tKCkpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMocnN0OiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKHJzdFtcImNvbmZpZ1wiXSkge1xuICAgICAgdGhpcy50aGVtZSA9IHRoaXMuY29uZmlnW1widGhlbWVcIl0gfHwgXCJcIjtcbiAgICAgIHRoaXMuaWQgPVxuICAgICAgICB0aGlzLmNvbmZpZ1tcImlkXCJdIHx8XG4gICAgICAgIHBhcnNlSW50KCh0aGlzLmlkRGF0ZSAvIDEwMDAwKS50b1N0cmluZygpLnNwbGl0KFwiLlwiKVsxXSkgK1xuICAgICAgICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIwKSAqIDEwMDAwO1xuICAgICAgdGhpcy5oaWRlUHJvZ3Jlc3NCYXIgPSB0aGlzLmNvbmZpZ1tcImhpZGVQcm9ncmVzc0JhclwiXSB8fCBmYWxzZTtcbiAgICAgIHRoaXMuaGlkZVJlc2V0QnRuID0gdGhpcy5jb25maWdbXCJoaWRlUmVzZXRCdG5cIl0gfHwgZmFsc2U7XG4gICAgICB0aGlzLmhpZGVTZWxlY3RCdG4gPSB0aGlzLmNvbmZpZ1tcImhpZGVTZWxlY3RCdG5cIl0gfHwgZmFsc2U7XG4gICAgICB0aGlzLnVwbG9hZEJ0blRleHQgPSB0aGlzLmNvbmZpZ1tcInVwbG9hZEJ0blRleHRcIl0gfHwgXCJVcGxvYWRcIjtcbiAgICAgIHRoaXMubWF4U2l6ZSA9IHRoaXMuY29uZmlnW1wibWF4U2l6ZVwiXSB8fCAyMDtcbiAgICAgIHRoaXMudXBsb2FkQVBJID0gdGhpcy5jb25maWdbXCJ1cGxvYWRBUElcIl1bXCJ1cmxcIl07XG4gICAgICB0aGlzLmZvcm1hdHNBbGxvd2VkID1cbiAgICAgICAgdGhpcy5jb25maWdbXCJmb3JtYXRzQWxsb3dlZFwiXSB8fCBcIi5qcGcsLnBuZywucGRmLC5kb2N4LC50eHQsLmdpZiwuanBlZ1wiO1xuICAgICAgdGhpcy5tdWx0aXBsZSA9IHRoaXMuY29uZmlnW1wibXVsdGlwbGVcIl0gfHwgZmFsc2U7XG4gICAgICB0aGlzLmhlYWRlcnMgPSB0aGlzLmNvbmZpZ1tcInVwbG9hZEFQSVwiXVtcImhlYWRlcnNcIl0gfHwge307XG4gICAgICB0aGlzLmF0dGFjaFBpblRleHQgPVxuICAgICAgICB0aGlzLmNvbmZpZ1tcImF0dGFjaFBpblRleHRcIl0gfHwgXCJBdHRhY2ggc3VwcG9ydGluZyBkb2N1bWVudHMuLlwiO1xuICAgICAgLy9jb25zb2xlLmxvZyhcImNvbmZpZzogXCIsIHRoaXMuY29uZmlnKTtcbiAgICAgIC8vY29uc29sZS5sb2codGhpcy5jb25maWdbXCJtYXhTaXplXCJdKTtcbiAgICAgIC8vY29uc29sZS5sb2codGhpcy5oZWFkZXJzKTtcbiAgICAgIC8vY29uc29sZS5sb2coXCJyc3Q6IFwiLCByc3QpO1xuICAgIH1cblxuICAgIGlmIChyc3RbXCJyZXNldFVwbG9hZFwiXSkge1xuICAgICAgaWYgKHJzdFtcInJlc2V0VXBsb2FkXCJdLmN1cnJlbnRWYWx1ZSA9PT0gdHJ1ZSkge1xuICAgICAgICB0aGlzLnJlc2V0RmlsZVVwbG9hZCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIC8vY29uc29sZS5sb2coXCJJZDogXCIsIHRoaXMuaWQpO1xuICAgIHRoaXMucmVzZXRVcGxvYWQgPSBmYWxzZTtcbiAgfVxuXG4gIHJlc2V0RmlsZVVwbG9hZCgpIHtcbiAgICB0aGlzLnNlbGVjdGVkRmlsZXMgPSBbXTtcbiAgICB0aGlzLkNhcHRpb24gPSBbXTtcbiAgICB0aGlzLm5vdEFsbG93ZWRMaXN0ID0gW107XG4gICAgdGhpcy51cGxvYWRNc2cgPSBmYWxzZTtcbiAgICB0aGlzLnVwbG9hZEJ0biA9IGZhbHNlO1xuICB9XG5cbiAgb25DaGFuZ2UoZXZlbnQ6IGFueSkge1xuICAgIC8vY29uc29sZS5sb2codGhpcy5tYXhTaXplICsgdGhpcy5mb3JtYXRzQWxsb3dlZCArIHRoaXMubXVsdGlwbGUpO1xuICAgIHRoaXMubm90QWxsb3dlZExpc3QgPSBbXTtcbiAgICAvL2NvbnNvbGUubG9nKFwib25jaGFuZ2UgaGl0XCIpO1xuICAgIGlmICh0aGlzLmFmdGVyVXBsb2FkIHx8ICF0aGlzLm11bHRpcGxlKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkRmlsZXMgPSBbXTtcbiAgICAgIHRoaXMuQ2FwdGlvbiA9IFtdO1xuICAgICAgdGhpcy5hZnRlclVwbG9hZCA9IGZhbHNlO1xuICAgIH1cbiAgICAvL0ZPUk1BVFMgQUxMT1dFRCBMSVNUXG4gICAgLy9jb25zb2xlLmxvZyhcIkZPUk1BVFMgQUxMT1dFRCBMSVNUPSBcIit0aGlzLmZvcm1hdHNBbGxvd2VkKTtcbiAgICAvL05PIE9GIEZPUk1BVFMgQUxMT1dFRFxuICAgIGxldCBmb3JtYXRzQ291bnQ6IGFueTtcbiAgICBmb3JtYXRzQ291bnQgPSB0aGlzLmZvcm1hdHNBbGxvd2VkLm1hdGNoKG5ldyBSZWdFeHAoXCJcXFxcLlwiLCBcImdcIikpO1xuICAgIGZvcm1hdHNDb3VudCA9IGZvcm1hdHNDb3VudC5sZW5ndGg7XG4gICAgLy9jb25zb2xlLmxvZyhcIk5PIE9GIEZPUk1BVFMgQUxMT1dFRD0gXCIrZm9ybWF0c0NvdW50KTtcbiAgICAvL2NvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcblxuICAgIC8vSVRFUkFURSBTRUxFQ1RFRCBGSUxFU1xuICAgIGxldCBmaWxlOiBGaWxlTGlzdDtcbiAgICBpZiAoZXZlbnQudHlwZSA9PSBcImRyb3BcIikge1xuICAgICAgZmlsZSA9IGV2ZW50LmRhdGFUcmFuc2Zlci5maWxlcztcbiAgICAgIC8vY29uc29sZS5sb2coXCJ0eXBlOiBkcm9wXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmaWxlID0gZXZlbnQudGFyZ2V0LmZpbGVzIHx8IGV2ZW50LnNyY0VsZW1lbnQuZmlsZXM7XG4gICAgICAvL2NvbnNvbGUubG9nKFwidHlwZTogY2hhbmdlXCIpO1xuICAgIH1cbiAgICAvL2NvbnNvbGUubG9nKGZpbGUpO1xuICAgIGxldCBjdXJyZW50RmlsZUV4dDogYW55O1xuICAgIGxldCBleHQ6IGFueTtcbiAgICBsZXQgZnJtdEFsbG93ZWQ6IGJvb2xlYW47XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWxlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAvL0NIRUNLIEZPUk1BVFxuICAgICAgLy9DVVJSRU5UIEZJTEUgRVhURU5TSU9OXG4gICAgICBjdXJyZW50RmlsZUV4dCA9IHRoaXMucmVnLmV4ZWMoZmlsZVtpXS5uYW1lKTtcbiAgICAgIGN1cnJlbnRGaWxlRXh0ID0gY3VycmVudEZpbGVFeHRbMV07XG4gICAgICAvL2NvbnNvbGUubG9nKGZpbGVbaV0ubmFtZSk7XG4gICAgICBmcm10QWxsb3dlZCA9IGZhbHNlO1xuICAgICAgLy9GT1JNQVQgQUxMT1dFRCBMSVNUIElURVJBVEVcbiAgICAgIGZvciAobGV0IGogPSBmb3JtYXRzQ291bnQ7IGogPiAwOyBqLS0pIHtcbiAgICAgICAgZXh0ID0gdGhpcy5mb3JtYXRzQWxsb3dlZC5zcGxpdChcIi5cIilbal07XG4gICAgICAgIC8vY29uc29sZS5sb2coXCJGT1JNQVQgTElTVCAoXCIraitcIik9IFwiK2V4dC5zcGxpdChcIixcIilbMF0pO1xuICAgICAgICBpZiAoaiA9PSBmb3JtYXRzQ291bnQpIHtcbiAgICAgICAgICBleHQgPSB0aGlzLmZvcm1hdHNBbGxvd2VkLnNwbGl0KFwiLlwiKVtqXSArIFwiLFwiO1xuICAgICAgICB9IC8vY2hlY2sgZm9ybWF0XG4gICAgICAgIGlmIChjdXJyZW50RmlsZUV4dC50b0xvd2VyQ2FzZSgpID09IGV4dC5zcGxpdChcIixcIilbMF0pIHtcbiAgICAgICAgICBmcm10QWxsb3dlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGZybXRBbGxvd2VkKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coXCJGT1JNQVQgQUxMT1dFRFwiKTtcbiAgICAgICAgLy9DSEVDSyBTSVpFXG4gICAgICAgIGlmIChmaWxlW2ldLnNpemUgPiB0aGlzLm1heFNpemUgKiAxMDI0MDAwKSB7XG4gICAgICAgICAgLy9jb25zb2xlLmxvZyhcIlNJWkUgTk9UIEFMTE9XRUQgKFwiK2ZpbGVbaV0uc2l6ZStcIilcIik7XG4gICAgICAgICAgdGhpcy5ub3RBbGxvd2VkTGlzdC5wdXNoKHtcbiAgICAgICAgICAgIGZpbGVOYW1lOiBmaWxlW2ldLm5hbWUsXG4gICAgICAgICAgICBmaWxlU2l6ZTogdGhpcy5jb252ZXJ0U2l6ZShmaWxlW2ldLnNpemUpLFxuICAgICAgICAgICAgZXJyb3JNc2c6IFwiSW52YWxpZCBzaXplXCJcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvL2Zvcm1hdCBhbGxvd2VkIGFuZCBzaXplIGFsbG93ZWQgdGhlbiBhZGQgZmlsZSB0byBzZWxlY3RlZEZpbGUgYXJyYXlcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkRmlsZXMucHVzaChmaWxlW2ldKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIkZPUk1BVCBOT1QgQUxMT1dFRFwiKTtcbiAgICAgICAgdGhpcy5ub3RBbGxvd2VkTGlzdC5wdXNoKHtcbiAgICAgICAgICBmaWxlTmFtZTogZmlsZVtpXS5uYW1lLFxuICAgICAgICAgIGZpbGVTaXplOiB0aGlzLmNvbnZlcnRTaXplKGZpbGVbaV0uc2l6ZSksXG4gICAgICAgICAgZXJyb3JNc2c6IFwiSW52YWxpZCBmb3JtYXRcIlxuICAgICAgICB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2VsZWN0ZWRGaWxlcy5sZW5ndGggIT09IDApIHtcbiAgICAgIHRoaXMudXBsb2FkQnRuID0gdHJ1ZTtcbiAgICAgIGlmICh0aGlzLnRoZW1lID09IFwiYXR0YWNoUGluXCIpIHRoaXMudXBsb2FkRmlsZXMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy51cGxvYWRCdG4gPSBmYWxzZTtcbiAgICB9XG4gICAgdGhpcy51cGxvYWRNc2cgPSBmYWxzZTtcbiAgICB0aGlzLnVwbG9hZENsaWNrID0gdHJ1ZTtcbiAgICB0aGlzLnBlcmNlbnRDb21wbGV0ZSA9IDA7XG4gICAgZXZlbnQudGFyZ2V0LnZhbHVlID0gbnVsbDtcbiAgfVxuXG4gIHVwbG9hZEZpbGVzKCkge1xuICAgIC8vY29uc29sZS5sb2codGhpcy5zZWxlY3RlZEZpbGVzKTtcblxuICAgIGxldCBpOiBhbnk7XG4gICAgdGhpcy5wcm9ncmVzc0JhclNob3cgPSB0cnVlO1xuICAgIHRoaXMudXBsb2FkQ2xpY2sgPSBmYWxzZTtcbiAgICB0aGlzLm5vdEFsbG93ZWRMaXN0ID0gW107XG4gICAgbGV0IGlzRXJyb3IgPSBmYWxzZTtcblxuICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICBsZXQgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLnNlbGVjdGVkRmlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLkNhcHRpb25baV0gPT0gdW5kZWZpbmVkKSB0aGlzLkNhcHRpb25baV0gPSBcImZpbGVcIjtcbiAgICAgIC8vQWRkIERBVEEgVE8gQkUgU0VOVFxuICAgICAgZm9ybURhdGEuYXBwZW5kKFxuICAgICAgICB0aGlzLkNhcHRpb25baV0sXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRGaWxlc1tpXSAvKiwgdGhpcy5zZWxlY3RlZEZpbGVzW2ldLm5hbWUqL1xuICAgICAgKTtcbiAgICAgIC8vY29uc29sZS5sb2codGhpcy5zZWxlY3RlZEZpbGVzW2ldK1wie1wiK3RoaXMuQ2FwdGlvbltpXStcIiAoQ2FwdGlvbil9XCIpO1xuICAgIH1cblxuICAgIGlmIChpID4gMSkge1xuICAgICAgdGhpcy5zaW5nbGVGaWxlID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2luZ2xlRmlsZSA9IHRydWU7XG4gICAgfVxuXG4gICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGV2bnQgPT4ge1xuICAgICAgLy9jb25zb2xlLmxvZyhcIm9ucmVhZHlcIik7XG4gICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgaWYgKHhoci5zdGF0dXMgIT09IDIwMCkge1xuICAgICAgICAgIGlzRXJyb3IgPSB0cnVlO1xuICAgICAgICAgIHRoaXMucHJvZ3Jlc3NCYXJTaG93ID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy51cGxvYWRCdG4gPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLnVwbG9hZE1zZyA9IHRydWU7XG4gICAgICAgICAgdGhpcy5hZnRlclVwbG9hZCA9IHRydWU7XG4gICAgICAgICAgdGhpcy51cGxvYWRNc2dUZXh0ID0gXCJVcGxvYWQgRmFpbGVkICFcIjtcbiAgICAgICAgICB0aGlzLnVwbG9hZE1zZ0NsYXNzID0gXCJ0ZXh0LWRhbmdlciBsZWFkXCI7XG4gICAgICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLnVwbG9hZE1zZ1RleHQpO1xuICAgICAgICAgIC8vY29uc29sZS5sb2coZXZudCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5BcGlSZXNwb25zZS5lbWl0KHhocik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHhoci51cGxvYWQub25wcm9ncmVzcyA9IGV2bnQgPT4ge1xuICAgICAgdGhpcy51cGxvYWRCdG4gPSBmYWxzZTsgLy8gYnV0dG9uIHNob3VsZCBiZSBkaXNhYmxlZCBieSBwcm9jZXNzIHVwbG9hZGluZ1xuICAgICAgaWYgKGV2bnQubGVuZ3RoQ29tcHV0YWJsZSkge1xuICAgICAgICB0aGlzLnBlcmNlbnRDb21wbGV0ZSA9IE1hdGgucm91bmQoKGV2bnQubG9hZGVkIC8gZXZudC50b3RhbCkgKiAxMDApO1xuICAgICAgfVxuICAgICAgLy9jb25zb2xlLmxvZyhcIlByb2dyZXNzLi4uXCIvKit0aGlzLnBlcmNlbnRDb21wbGV0ZStcIiAlXCIqLyk7XG4gICAgfTtcblxuICAgIHhoci5vbmxvYWQgPSBldm50ID0+IHtcbiAgICAgIC8vY29uc29sZS5sb2coXCJvbmxvYWRcIik7XG4gICAgICAvL2NvbnNvbGUubG9nKGV2bnQpO1xuICAgICAgdGhpcy5wcm9ncmVzc0JhclNob3cgPSBmYWxzZTtcbiAgICAgIHRoaXMudXBsb2FkQnRuID0gZmFsc2U7XG4gICAgICB0aGlzLnVwbG9hZE1zZyA9IHRydWU7XG4gICAgICB0aGlzLmFmdGVyVXBsb2FkID0gdHJ1ZTtcbiAgICAgIGlmICghaXNFcnJvcikge1xuICAgICAgICB0aGlzLnVwbG9hZE1zZ1RleHQgPSBcIlN1Y2Nlc3NmdWxseSBVcGxvYWRlZCAhXCI7XG4gICAgICAgIHRoaXMudXBsb2FkTXNnQ2xhc3MgPSBcInRleHQtc3VjY2VzcyBsZWFkXCI7XG4gICAgICAgIC8vY29uc29sZS5sb2codGhpcy51cGxvYWRNc2dUZXh0ICsgXCIgXCIgKyB0aGlzLnNlbGVjdGVkRmlsZXMubGVuZ3RoICsgXCIgZmlsZVwiKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgeGhyLm9uZXJyb3IgPSBldm50ID0+IHtcbiAgICAgIC8vY29uc29sZS5sb2coXCJvbmVycm9yXCIpO1xuICAgICAgLy9jb25zb2xlLmxvZyhldm50KTtcbiAgICB9O1xuXG4gICAgeGhyLm9wZW4oXCJQT1NUXCIsIHRoaXMudXBsb2FkQVBJLCB0cnVlKTtcbiAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyh0aGlzLmhlYWRlcnMpKSB7XG4gICAgICAvLyBPYmplY3Qua2V5cyB3aWxsIGdpdmUgYW4gQXJyYXkgb2Yga2V5c1xuICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoa2V5LCB0aGlzLmhlYWRlcnNba2V5XSk7XG4gICAgfVxuICAgIC8vbGV0IHRva2VuID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInRva2VuXCIpO1xuICAgIC8veGhyLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJ0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLThcIik7XG4gICAgLy94aHIuc2V0UmVxdWVzdEhlYWRlcignQXV0aG9yaXphdGlvbicsIGBCZWFyZXIgJHt0b2tlbn1gKTtcbiAgICB4aHIuc2VuZChmb3JtRGF0YSk7XG4gIH1cblxuICByZW1vdmVGaWxlKGk6IGFueSwgc2ZfbmE6IGFueSkge1xuICAgIC8vY29uc29sZS5sb2coXCJyZW1vdmUgZmlsZSBjbGlja2VkIFwiICsgaSlcbiAgICBpZiAoc2ZfbmEgPT0gXCJzZlwiKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkRmlsZXMuc3BsaWNlKGksIDEpO1xuICAgICAgdGhpcy5DYXB0aW9uLnNwbGljZShpLCAxKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ub3RBbGxvd2VkTGlzdC5zcGxpY2UoaSwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2VsZWN0ZWRGaWxlcy5sZW5ndGggPT0gMCkge1xuICAgICAgdGhpcy51cGxvYWRCdG4gPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBjb252ZXJ0U2l6ZShmaWxlU2l6ZTogbnVtYmVyKSB7XG4gICAgLy9jb25zb2xlLmxvZyhmaWxlU2l6ZSArIFwiIC0gXCIrIHN0cik7XG4gICAgcmV0dXJuIGZpbGVTaXplIDwgMTAyNDAwMFxuICAgICAgPyAoZmlsZVNpemUgLyAxMDI0KS50b0ZpeGVkKDIpICsgXCIgS0JcIlxuICAgICAgOiAoZmlsZVNpemUgLyAxMDI0MDAwKS50b0ZpeGVkKDIpICsgXCIgTUJcIjtcbiAgfVxuXG4gIGF0dGFjaHBpbk9uY2xpY2soKSB7XG4gICAgLy9jb25zb2xlLmxvZyhcIklEOiBcIiwgdGhpcy5pZCk7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxcIiArIHRoaXMuaWQpIS5jbGljaygpO1xuICAgIC8vJChcIiNcIitcInNlbFwiK3RoaXMuaWQpLmNsaWNrKCk7XG4gIH1cblxuICBkcm9wKGV2ZW50OiBhbnkpIHtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIC8vY29uc29sZS5sb2coXCJkcm9wOiBcIiwgZXZlbnQpO1xuICAgIC8vY29uc29sZS5sb2coXCJkcm9wOiBcIiwgZXZlbnQuZGF0YVRyYW5zZmVyLmZpbGVzKTtcbiAgICB0aGlzLm9uQ2hhbmdlKGV2ZW50KTtcbiAgfVxuICBhbGxvd0Ryb3AoZXZlbnQ6IGFueSkge1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcImNvcHlcIjtcbiAgICAvL2NvbnNvbGUubG9nKFwiYWxsb3dEcm9wOiBcIixldmVudClcbiAgfVxufVxuXG4vKiBpbnRlcmZhY2UgQ09ORklHIHtcbiAgdXBsb2FkQVBJOiBzdHJpbmc7XG4gIG11bHRpcGxlPzogYm9vbGVhbjtcbiAgZm9ybWF0c0FsbG93ZWQ/OiBzdHJpbmc7XG4gIG1heFNpemU/OiBudW1iZXI7XG4gIGlkPzogbnVtYmVyO1xuICByZXNldFVwbG9hZD86IGJvb2xlYW47XG4gIHRoZW1lPzogc3RyaW5nO1xuICBoaWRlUHJvZ3Jlc3NCYXI/OiBib29sZWFuO1xuIH1cbiAqLyJdfQ==