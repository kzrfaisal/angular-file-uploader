Ngx file uploader is an Angular 9/10 + file uploader (fork from angular-file-uploader -> https://github.com/kzrfaisal/angular-file-uploader)

### Install
```
npm i ngx-file-uploader
```

### Usage
- Bootstrap.min.css is required.
  Include 
  ```html
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
  ```
  in your index.html.
- Import NgxFileUploaderModule inside your app.module.ts 
  ```javascript
  import { NgxFileUploaderModule } from "ngx-file-uploader";
  ```
  ```javascript
  @NgModule({
    imports: [
        ...,
        NgxFileUploaderModule,
        ...
    ]
  })
  ```
##### Example-1 ( with minimal configuration )
  ```html
  <ngx-file-uploader
        [config]="afuConfig">
  </ngx-file-uploader>
  ```  
  ```javascript
  afuConfig = {
      uploadAPI: {
        url:"https://example-file-upload-api"
      }
  };
  ```
##### Example-2 ( with all available configuration )
  ```html
  <ngx-file-uploader 
        [config]="afuConfig"
        [resetUpload]=resetVar
        (ApiResponse)="DocUpload($event)">
  </ngx-file-uploader>
  ``` 
  ```javascript
  afuConfig = {
      multiple: false,
      formatsAllowed: ".jpg,.png",
      maxSize: "1",
      uploadAPI:  {
        url:"https://example-file-upload-api",
        method:"POST",
        headers: {
       "Content-Type" : "text/plain;charset=UTF-8",
       "Authorization" : `Bearer ${token}`
        },
        params: {
          'page': '1'
        },
        responseType: 'blob',
      },
      theme: "dragNDrop",
      hideProgressBar: true,
      hideResetBtn: true,
      hideSelectBtn: true,
      fileNameIndex: true,
      replaceTexts: {
        selectFileBtn: 'Select Files',
        resetBtn: 'Reset',
        uploadBtn: 'Upload',
        dragNDropBox: 'Drag N Drop',
        attachPinBtn: 'Attach Files...',
        afterUploadMsg_success: 'Successfully Uploaded !',
        afterUploadMsg_error: 'Upload Failed !',
        sizeLimit: 'Size Limit'
      }
  };
  ``` 

| **Properties**             | **Description**                                                                                                                                                                       | **Default Value**                          |
|----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------|
| config : object            | It's a javascript object. Use this to add custom constraints to the module. All available key-value pairs are given in example 2.For detailed decription refer the table below.        | {}                              |
| ApiResponse:EventEmitter   | It will return the response it gets back from the uploadAPI. Assign one custom function ,for example " DocUpload($event) " here, where " $event " will contain the response from the api.                                                           |                                        |
| resetUpload : boolean      | Give it's value as " true " whenever you want to clear the list of  uploads being displayed. It's better to assign one boolean variable ('resetVar' here)to it and then  change that variable's value. Remember to change 'resetVar' value 'true' to 'false' after every reset. | false                                  |


| **[config]**               | **Description**                                                                                                                                                                       | **Default Value**                      |
|----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------|
| multiple : boolean         | Set it as " true " for uploading multiple files at a time and as " false " for single file at a time.                                                                                 | false                                  |
| formatsAllowed : string    | Specify the formats of file you want to upload.                                                                                                                                       | '.jpg,.png,.pdf,.docx, .txt,.gif,.jpeg'|
| maxSize : number           | Maximum size limit for files in MB.                                                                                                                                                   | 20 MB                                  |
| uploadAPI.url : string     | Complete api url to which you want to upload.                                                                                                                                         | undefined                              |
| uploadAPI.method : string     | HTTP method to use for upload.                                                                                                                                         | POST                              |
| uploadAPI.headers : {}     | Provide headers you need here.                                                                                                                                                        | {}                                     |
| theme : string             | Specify the theme name you want to apply. Available Themes: ' dragNDrop ', ' attachPin '                                                                                                                | If no theme or wrong theme is specified, default theme will be used instead.|
| hideProgressBar:boolean    | Set it as " true " to hide the Progress bar. | false |
| hideResetBtn:boolean       | Set it as " true " to hide the 'Reset' Button. | false |
| hideSelectBtn:boolean      | Set it as " true " to hide the 'Select File' Button. | false |
| fileNameIndex:boolean      | Set it as " false " to get the same file name as 'file' instead of 'file1', 'file2'.... in formdata object. | true |
| replaceTexts:object       | Replace default texts with your own custom texts. | refer to example-2|

---
##### A Better Way to reset the module
You have seen that by using 'resetUpload' property, you can reset the module easily, however if you need to reset more than one time, there's a better way of doing that( bcoz in 'resetUpload' property, you have to make it as false in order to use it again):-

###### Example-3
  ```html
  <ngx-file-uploader #fileUpload1
        [config]="afuConfig"
        [resetUpload]=resetVar
        (ApiResponse)="DocUpload($event)">
  </ngx-file-uploader>
  ```
  - Assign one local reference variable (here 'fileUpload1') to the component.
  - Now use this local reference variable in your xyz.component.ts file.
    ```javascript
        @ViewChild('fileUpload1')
        private fileUpload1:  AngularFileUploaderComponent;
    ```
    - Remember to import ViewChild and AngularFileUploaderComponent properly in your component.
      ```javascript
        import { ViewChild } from '@angular/core';
        import { AngularFileUploaderComponent } from "ngx-file-uploader";
      ```
  - That's it.....all done, now just use
    ```javascript
        this.fileUpload1.resetFileUpload();
    ```
    to reset the module hassle-free anytime.

### Styling: 
##### Following classes are available for customisation :
##### *Include them in your global css class (src/styles.css)*
##### *Use '!important' if something doesn't works*
- .afu-select-btn {}
- .afu-reset-btn {}
- .afu-upload-btn {}
- .afu-dragndrop-box {}
- .afu-dragndrop-text {}
- .afu-constraints-info {}
- .afu-valid-file {}
- .afu-invalid-file {}
- .afu-progress-bar {}
- .afu-upload-status {}
- .afu-attach-pin {}

#### Points to note:
- Files are uploaded in FormData format.
