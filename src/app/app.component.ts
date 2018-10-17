import { Component, ViewChild } from '@angular/core';
//import { AngularFileUploaderComponent } from "angular-file-uploader";

@Component({
  selector: 'ld-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  resetUpload1: boolean;
  resetUpload2: boolean;
  resetUpload3: boolean;
  token: string = "lkdjlfjld";
  afuConfig1 = {
    multiple:true,
    uploadAPI: {
      url: "https://slack.com/api/files.upload"
    }
  };

  afuConfig2 = {
    theme: "attachPin",
    hideProgressBar: "true",
    hideResetBtn: "true",
    maxSize: "1",
    uploadAPI: {
      url: "https://slack.com/api/files.upload",
      headers: {
        "Content-Type": "multipart/form-data"
      }
    },
    formatsAllowed: ".jpg,.png",
    multiple: "true"
  };
  afuConfig3 = {
    theme: "dragNDrop",
    hideProgressBar: true,
    hideResetBtn: true,
    hideSelectBtn: true,
    maxSize: "1",
    uploadAPI: {
      url: "https://slack.com/api/files.upload"
    },
    formatsAllowed: ".jpg,.png",
    multiple: true
  };
  /*
  afuConfig2 = {
    theme: "hjkhkh",
    hideProgressBar: "true",
    maxSize: "1",
    uploadAPI: {
      url: "https://evening-anchorage-3159.herokuapp.com/api",
      headers: {
       "Content-Type" : "text/plain;charset=UTF-8",
       "Authorization" : `Bearer ${this.token}`
      }
    },
    formatsAllowed: ".jpg,.png",
    multiple: "false"
  };
  */
 // @ViewChild("afu1") private afuref1: AngularFileUploaderComponent;
 // @ViewChild("afu2") private afuref2: AngularFileUploaderComponent;
 // @ViewChild("afu3") private afuref3: AngularFileUploaderComponent;
  constructor() { }

  ngOnInit() {
    /* Notification.requestPermission(function(params) {
      var n = new Notification('HTML5 Notifications API', {
        body: "It's working woohoooooooooooooo...!",
        icon:'https://www.wikihow.com/images/4/4b/Right-Click-on-a-Mouse-That-Does-Not-Have-Right-Click-Step-5.jpg'
      });
    }) */
  }
  DocUpload(env) {
    console.log(env);
  }

  resetfu(id) {
    //this.rfu.resetFileUpload(id);
    //id == 1 ? this.afuref1.resetFileUpload() : this.afuref2.resetFileUpload();
    this[`afuref${id}`].resetFileUpload();
    //this.resetUpload1 = true;
  }
}
