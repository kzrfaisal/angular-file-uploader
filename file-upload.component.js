import { Component, Input, Output, EventEmitter } from '@angular/core';
export var FileUploadComponent = (function () {
    function FileUploadComponent() {
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
    FileUploadComponent.prototype.ngOnChanges = function (rst) {
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
        }
        if (rst["resetUpload"]) {
            if (rst["resetUpload"].currentValue === true) {
                this.resetFileUpload();
            }
        }
    };
    FileUploadComponent.prototype.ngOnInit = function () {
        //console.log("Id: ", this.id);
        this.resetUpload = false;
    };
    FileUploadComponent.prototype.resetFileUpload = function () {
        this.selectedFiles = [];
        this.Caption = [];
        this.notAllowedList = [];
        this.uploadMsg = false;
        this.uploadBtn = false;
    };
    FileUploadComponent.prototype.onChange = function (event) {
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
        var formatsCount;
        formatsCount = this.formatsAllowed.match(new RegExp("\\.", "g"));
        formatsCount = formatsCount.length;
        //console.log("NO OF FORMATS ALLOWED= "+formatsCount);
        //console.log("-------------------------------");
        //ITERATE SELECTED FILES
        var file;
        if (event.type == "drop") {
            file = event.dataTransfer.files;
            console.log("type: drop");
        }
        else {
            file = event.target.files || event.srcElement.files;
            console.log("type: change");
        }
        console.log(file);
        var currentFileExt;
        var ext;
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
    FileUploadComponent.prototype.uploadFiles = function () {
        //console.log(this.selectedFiles);
        var _this = this;
        var i;
        this.progressBarShow = true;
        this.uploadClick = false;
        this.notAllowedList = [];
        var isError = false;
        var xhr = new XMLHttpRequest();
        var formData = new FormData();
        for (i = 0; i < this.selectedFiles.length; i++) {
            if (this.Caption[i] == undefined)
                this.Caption[i] = "file";
            //Add DATA TO BE SENT
            formData.append(this.Caption[i], this.selectedFiles[i] /*, this.selectedFiles[i].name*/);
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
                if (xhr.status === 200) {
                    //this.ApiResponse.emit(JSON.parse(xhr.response));
                    _this.ApiResponse.emit(xhr.response);
                }
                else {
                    //console.log("ERRRRRRor");
                    //console.log(xhr.statusText + " (From SERVER)");
                    isError = true;
                    _this.progressBarShow = false;
                    _this.uploadBtn = false;
                    _this.uploadMsg = true;
                    _this.afterUpload = true;
                    _this.uploadMsgText = "Upload Failed !";
                    _this.uploadMsgClass = "text-danger lead";
                }
            }
        };
        xhr.upload.onprogress = function (evnt) {
            if (evnt.lengthComputable) {
                _this.percentComplete = Math.round(evnt.loaded / evnt.total * 100);
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
            }
        };
        xhr.onerror = function (evnt) {
            //console.log("onerror");
            //console.log(evnt);
        };
        xhr.open("POST", this.uploadAPI, true);
        for (var _i = 0, _a = Object.keys(this.headers); _i < _a.length; _i++) {
            var key = _a[_i];
            // Object.keys will give an Array of keys
            xhr.setRequestHeader(key, this.headers[key]);
        }
        //let token = sessionStorage.getItem("token");
        //xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
        //xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.send(formData);
    };
    FileUploadComponent.prototype.removeFile = function (i, sf_na) {
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
    FileUploadComponent.prototype.convertSize = function (fileSize) {
        //console.log(fileSize + " - "+ str);
        return fileSize < 1024000
            ? (fileSize / 1024).toFixed(2) + " KB"
            : (fileSize / 1024000).toFixed(2) + " MB";
    };
    FileUploadComponent.prototype.attachpinOnclick = function () {
        //console.log("ID: ", this.id);
        //document.getElementById("sel" + this.id).click();
        //$("#"+"sel"+this.id).click();
    };
    FileUploadComponent.prototype.drop = function (event) {
        event.stopPropagation();
        event.preventDefault();
        console.log("drop: ", event);
        console.log("drop: ", event.dataTransfer.files);
        this.onChange(event);
    };
    FileUploadComponent.prototype.allowDrop = function (event) {
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
        //console.log("allowDrop: ",event)
    };
    FileUploadComponent.decorators = [
        { type: Component, args: [{
                    selector: "angular-file-uploader",
                    template: "<div class=\"container\" *ngIf=\"(theme !== 'attachPin')\" id=\"default\">\n  <div *ngIf=\"theme == 'dragNDrop'\" id=\"dragNDrop\" [ngClass]=\"(hideSelectBtn && hideResetBtn) ? null : 'dragNDropBtmPad'\">\n    <div style=\"position:relative;\">\n      <div id=\"div1\" (drop)=\"drop($event)\" (dragover)=\"allowDrop($event)\">\n        <p>Drag N Drop</p>\n      </div>\n      <!-- <span class='label label-info' id=\"upload-file-info{{id}}\">{{selectedFiles[0]?.name}}</span> -->\n    </div>\n  </div>\n    <label for=\"sel{{id}}\" class=\"btn btn-primary btn-sm\" *ngIf=\"!hideSelectBtn\">Select File<span *ngIf=\"multiple\">s</span></label>\n    <input type=\"file\" id=\"sel{{id}}\" style=\"display: none\" *ngIf=\"!hideSelectBtn\" (change)=\"onChange($event)\" title=\"Select file\" name=\"files[]\" [accept]=formatsAllowed\n        [attr.multiple]=\"multiple ? '' : null\" />\n    <button class=\"btn btn-info btn-sm\" (click)=\"resetFileUpload()\" *ngIf=\"!hideResetBtn\">Reset</button>\n    <br *ngIf=\"!hideSelectBtn\">\n    <p class=\"constraints-info\">({{formatsAllowed}}) Size limit- {{(convertSize(maxSize *1024000))}}</p>\n    <!--Selected file list-->\n    <div class=\"row\" *ngFor=\"let sf of selectedFiles;let i=index\">\n        <p class=\"col-xs-3 textOverflow\">\n            <span class=\"text-primary\">{{sf.name}}</span>\n        </p>\n        <p class=\"col-xs-3 padMarg sizeC\">\n            <strong>({{convertSize(sf.size)}})</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>\n        <!--  <input class=\"col-xs-3 progress caption\"  type=\"text\"  placeholder=\"Caption..\"  [(ngModel)]=\"Caption[i]\"  *ngIf=\"uploadClick\"/> -->\n        <div class=\"progress col-xs-3 padMarg\" *ngIf=\"singleFile && progressBarShow && !hideProgressBar\">\n            <span class=\"progress-bar progress-bar-success\" role=\"progressbar\" [ngStyle]=\"{'width':percentComplete+'%'}\">{{percentComplete}}%</span>\n        </div>\n        <a class=\"col-xs-1\" role=\"button\" (click)=\"removeFile(i,'sf')\" *ngIf=\"uploadClick\"><i class=\"fa fa-times\"></i></a>\n    </div>\n    <!--Invalid file list-->\n    <div class=\"row text-danger\" *ngFor=\"let na of notAllowedList;let j=index\">\n        <p class=\"col-xs-3 textOverflow\">\n            <span>{{na['fileName']}}</span>\n        </p>\n        <p class=\"col-xs-3 padMarg sizeC\">\n            <strong>({{na['fileSize']}})</strong>\n        </p>\n        <p class=\"col-xs-3 \">{{na['errorMsg']}}</p>\n        <a class=\"col-xs-1 delFileIcon\" role=\"button\" (click)=\"removeFile(j,'na')\" *ngIf=\"uploadClick\">&nbsp;<i class=\"fa fa-times\"></i></a>\n    </div>\n\n    <p *ngIf=\"uploadMsg\" class=\"{{uploadMsgClass}}\">{{uploadMsgText}}<p>\n    <div *ngIf=\"!singleFile && progressBarShow && !hideProgressBar\">\n        <div class=\"progress col-xs-4 padMarg\">\n            <span class=\"progress-bar progress-bar-success\" role=\"progressbar\" [ngStyle]=\"{'width':percentComplete+'%'}\">{{percentComplete}}%</span>\n        </div>\n        <br>\n        <br>\n    </div>\n    <button class=\"btn btn-success\" type=\"button\" (click)=\"uploadFiles()\" [disabled]=!uploadBtn>Upload</button>\n    <br>\n</div>\n\n<!--/////////////////////////// ATTACH PIN THEME  //////////////////////////////////////////////////////////-->\n<div *ngIf=\"theme == 'attachPin'\" id=\"attachPin\">\n    <div style=\"position:relative;padding-left:6px\">\n        <a class='btn up_btn'>\n            Attach supporting documents..\n            <i class=\"fa fa-paperclip\" aria-hidden=\"true\" (click)=\"attachpinOnclick()\"></i>\n            <!-- <p style=\"margin-top:10px\">({{formatsAllowed}}) Size limit- {{(convertSize(maxSize * 1024000))}}</p> -->\n            <input type=\"file\" id=\"sel{{id}}\" (change)=\"onChange($event)\" style=\"display: none\" title=\"Select file\" name=\"files[]\" [accept]=formatsAllowed\n                [attr.multiple]=\"multiple ? '' : null\" />\n            <br>\n        </a>\n        &nbsp;\n        <span class='label label-info' id=\"upload-file-info{{id}}\">{{selectedFiles[0]?.name}}</span>\n    </div>\n</div>\n\n<!--/////////////////////////// DRAG N DROP THEME  //////////////////////////////////////////////////////////-->\n<!-- <div *ngIf=\"theme == 'dragNDrop'\" id=\"dragNDrop\">\n  <div style=\"position:relative;padding-left:6px\">\n    <div id=\"div1\" (drop)=\"drop($event)\" (dragover)=\"allowDrop($event)\">\n      <p>Drag N Drop</p>\n    </div>\n    <span class='label label-info' id=\"upload-file-info{{id}}\">{{selectedFiles[0]?.name}}</span>\n  </div>\n</div> -->\n",
                    styles: [
                        ".constraints-info{\n    margin-top:10px;\n    font-style: italic;\n}\n.padMarg{\n    padding: 0px;\n    margin-bottom:0px;\n}\n.caption{\n    margin-right:5px;\n}\n.textOverflow{\n    white-space: nowrap;\n    padding-right: 0;\n    overflow: hidden;\n    text-overflow: ellipsis;\n}\n.up_btn{\n    color: black;\n    background-color: transparent;\n    border: 2px solid rgb(92, 91, 91);\n    border-radius: 22px;\n}\n.delFileIcon{\n  text-decoration: none;\n  color:#ce0909;\n}\n/*--------------------- DRAG N DROP ----------------------*/\n#dragNDrop #div1{\n  display: border-box;\n  border: 2px dashed rgb(92, 91, 91);\n  height: 6rem;\n  width: 20rem;\n}\n#dragNDrop #div1>p{\n  text-align: center;\n  font-weight: bold;\n  color: rgb(92, 91, 91);\n  margin-top: 1.4em;\n}\n\n.dragNDropBtmPad {\n  padding-bottom: 2rem;\n}\n/*--------------------- X-X-X-X ----------------------*/\n@media screen and (max-width: 620px){\n    .caption{\n        padding: 0;\n    }\n}\n@media screen and (max-width: 510px){\n    .sizeC{\n        width:25%;\n    }\n}\n@media screen and (max-width: 260px){\n    .sizeC{\n        font-size:10px;\n    }\n    .caption{\n        font-size:10px;\n    }\n}\n"
                    ]
                },] },
    ];
    /** @nocollapse */
    FileUploadComponent.ctorParameters = function () { return []; };
    FileUploadComponent.propDecorators = {
        'config': [{ type: Input },],
        'resetUpload': [{ type: Input },],
        'ApiResponse': [{ type: Output },],
    };
    return FileUploadComponent;
}());
//# sourceMappingURL=file-upload.component.js.map