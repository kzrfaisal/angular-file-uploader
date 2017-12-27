import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from "./file-upload.component";
export var FileUploadModule = (function () {
    function FileUploadModule() {
    }
    FileUploadModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        CommonModule
                    ],
                    declarations: [
                        FileUploadComponent],
                    exports: [FileUploadComponent]
                },] },
    ];
    /** @nocollapse */
    FileUploadModule.ctorParameters = function () { return []; };
    return FileUploadModule;
}());
//# sourceMappingURL=file-upload.module.js.map