Angular file uploader is an Angular 2+ file uploader module with real-time progress bar and Angular Universal Compatibility.

***Install
```
npm install angular-file-uploader
```
###Usage
- Bootstrap.min.css is required.
  Include 
  ```html
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
  ```
  in your index.html.
- Import FileUploadModule inside your app.module.ts 
  ```javascript
  import { FileUploadModule } from "angular-file-uploader";
  ```
  ```javascript
  @NgModule({
    imports: [
        ...,
        FileUploadModule,
        ...
    ]
  })
  ```
#####Example-1
```html
<angular-file-uploader
    [uploadAPI]="'https://example-file-upload-api'">
</angular-file-uploader>
```  
#####Example-2
```html
<angular-file-uploader
    [multiple]="true" 
    [formatsAllowed]="'.jpg,.png'" 
    [maxSize]="5" 
    [uploadAPI]="'https://example-file-upload-api'"
    [resetUpload]=resetUpload
    (ApiResponse)="DocUpload($event)">
</angular-file-uploader>
```  

| **Properties**             | **Description**                                                                                                                                                                       | **Default Value**                          |
|----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------|
| multiple : boolean         | true- multiple file upload. false- single file upload                                                                                                                                 | false                                  |
| formatsAllowed : string    | specify the formats of file you want to upload.                                                                                                                                       | '.jpg,.png,.pdf,.docx, .txt,.gif,.jpeg' |
| uploadAPI : string         | complete api url to which you want to upload.                                                                                                                                         | undefined                              |
| maxSize : number           | maximum size limit for files in MB.                                                                                                                                                   | 20                                     |
| ApiResponse : EventEmitter | assign one custom function ,for example " DocUpload($event) " here where " $event " will contain the response from the api.                                                           |                                        |
| resetUpload : boolean      | give it's value as " true " whenever you want to clear the list of  uploads being displayed. It's better to assign one boolean variable (resetUpload here)to it and then  change that variable's value. | false                                  |

#####Points to note:
- Set resetUpload as true to reset the module instantly.
    Remember to change resetUpload value 'true' to 'false' after every reset.
- ApiResponse will return the response it gets back from the uploadAPI. 
- Files are uploaded in FormData format.

###Coming Soon:
- Multiple themes.
- Drag n Drop.
- More customization options.