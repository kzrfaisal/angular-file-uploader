Angular file uploader is an Angular 2/4/5/6/7/8/9/10/11/12/13 + file uploader module with Real-Time Progress Bar, Responsive design, Angular Universal Compatibility, localization and multiple themes which includes Drag and Drop and much more.

### Demo
<https://kzrfaisal.github.io/#/afu>
### Install
```
npm i angular-file-uploader
```

### Support
Support this package if it really helped you, send your support at [Patreon](https://www.patreon.com/kzrfaisal).

### Video Guide
[Youtube | Angular File Uploader](https://www.youtube.com/watch?v=EpJRGmEDOJ0)


### Usage
- Bootstrap.min.css is required.
  Include 
  ```html
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
  ```
  in your index.html.
- Import AngularFileUploaderModule inside your app.module.ts 
  ```javascript
  import { AngularFileUploaderModule } from "angular-file-uploader";
  ```
  ```javascript
  @NgModule({
    imports: [
        ...,
        AngularFileUploaderModule,
        ...
    ]
  })
  ```
##### Example-1 ( with minimal configuration )
  ```html
  <angular-file-uploader
        [config]="afuConfig">
  </angular-file-uploader>
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
  <angular-file-uploader 
        [config]="afuConfig"
        [resetUpload]=resetVar
        (fileSelected)="fileSelected($event)"
        (ApiResponse)="docUpload($event)">
  </angular-file-uploader>
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
        withCredentials: false,
      },
      theme: "dragNDrop",
      hideProgressBar: true,
      hideResetBtn: true,
      hideSelectBtn: true,
      hideSelectBtn: true,
      fileNameIndex: true,
      autoUpload: false,
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
| fileSelected:EventEmitter   | It will return the standard html onchange/drop event when the file is selected/dropped. Assign one custom function ,for example " fileSelected($event) " here, to catch the event.                                                           |                                        |
| ApiResponse:EventEmitter   | It will return the response it gets back from the uploadAPI. Assign one custom function ,for example " docUpload($event) " here, where " $event " will contain the response from the api.                                                           |                                        |
| resetUpload : boolean      | Give it's value as " true " whenever you want to clear the list of  uploads being displayed. It's better to assign one boolean variable ('resetVar' here)to it and then  change that variable's value. Remember to change 'resetVar' value 'true' to 'false' after every reset. | false                                  |


| **[config]**               | **Description**                                                                                                                                                                       | **Default Value**                      |
|----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------|
| multiple : boolean         | Set it as " true " for uploading multiple files at a time and as " false " for single file at a time.                                                                                 | false                                  |
| formatsAllowed : string    | Specify the formats of file you want to upload (ex: `'.jpg,.png'` for jpg and png), you can also specify formats like `'image/*'` for all images, `'video/*'` for videos , `'audio/*'` for all audios and `'*'` for everything,                                                                                                                                   | `'*'`|
| maxSize : number           | Maximum size limit for files in MB.                                                                                                                                                   | 20 MB                                  |
| uploadAPI.url : string     | Complete api url to which you want to upload.                                                                                                                                         | undefined                              |
| uploadAPI.method : string     | HTTP method to use for upload.                                                                                                                                         | POST                              |
| uploadAPI.headers : {}     | Provide headers in HttpClient Options here.                                                                                                                                                        | {}                                     |
| uploadAPI.params : {}     | Provide params in HttpClient Options here.                                                                                                                                                        | {}                                     |
| uploadAPI.responseType : string     | Provide responseType in HttpClient Options here.                                                                                                                                                        | 'json'                                     |
| uploadAPI.withCredentials : boolean     | Provide withCredentials in HttpClient Options here.                                                                                                                                                        | false                                     |
| theme : string             | Specify the theme name you want to apply. Available Themes: ' dragNDrop ', ' attachPin '                                                                                                                | If no theme or wrong theme is specified, default theme will be used instead.|
| hideProgressBar:boolean    | Set it as " true " to hide the Progress bar. | false |
| hideResetBtn:boolean       | Set it as " true " to hide the 'Reset' Button. | false |
| hideSelectBtn:boolean      | Set it as " true " to hide the 'Select File' Button. | false |
| fileNameIndex:boolean      | Set it as " false " to get the same file name as 'file' instead of 'file1', 'file2'.... in formdata object. | true |
| autoUpload:boolean      | Set it as "true" to upload the files directly after files are selected without the need of Upload Button. | false |
| replaceTexts:object       | Replace default texts with your own custom texts. | refer to example-2|

---
##### A Better Way to reset the module
You have seen that by using 'resetUpload' property, you can reset the module easily, however if you need to reset more than one time, there's a better way of doing that( bcoz in 'resetUpload' property, you have to make it as false in order to use it again):-

###### Example-3
  ```html
  <angular-file-uploader #fileUpload1
        [config]="afuConfig"
        [resetUpload]=resetVar
        (ApiResponse)="DocUpload($event)">
  </angular-file-uploader>
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
        import { AngularFileUploaderComponent } from "angular-file-uploader";
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

### Coming Soon:
- More themes.
- More customization options.
---
#### For Versions < 6.x : [Click Here !](https://github.com/kzrfaisal/angular-file-uploader#for-versions--6x-) 
---
---
#### For Versions < 5.x : [Click Here !](https://github.com/kzrfaisal/angular-file-uploader#for-versions--5x-) 
---
#### For Versions =< 4.0.12 :
- Replace AngularFileUploaderModule and AngularFileUploaderComponent with   FileUploadModule and FileUploadComponent respectively.
---
#### For Versions < 2.x : [Click Here !](https://github.com/kzrfaisal/angular-file-uploader#for-versions--2x-) 
---
