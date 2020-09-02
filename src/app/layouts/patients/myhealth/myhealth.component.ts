import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize, map, tap } from 'rxjs/operators';
import * as firebase from 'firebase';

@Component({
  selector: 'app-myhealth',
  templateUrl: './myhealth.component.html',
  styleUrls: ['./myhealth.component.css']
})
export class MyhealthComponent implements OnInit {
  uploadReportForm: FormGroup;

  uploadProgress: Observable<number>; //view progress of the upload
  downloadURL: Observable<string>; //firebase url of the uploaded document
  selectedFile: File = null;  //file selected to upload
  uid: any;
  result:any;
  fb;
  reports: any[];
  task: AngularFireUploadTask;
  deleteReportName: any;
  deleteReportDate: any;
  
   constructor(
    private _formbuilder: FormBuilder,
    private db: AngularFirestore,
    private router: Router,
    private afStorage: AngularFireStorage
   ) { }

  ngOnInit(): void {
    this.uid=localStorage.getItem("uid");
    this.uploadReportForm = this._formbuilder.group({
      reportDate: ["", Validators.required],
      reportName: ["", Validators.required],
    });
    this.db.collection("Users").doc(this.uid).collection("Reports",ref=>
    (ref.where("status","==","Active").orderBy("uploadedAt","desc"))).valueChanges()
    .subscribe(output =>{
        this.reports=output;
        console.log("result-",this.reports)
    })
  }
  view(url) {
    window.open(url, "myWindow", "height=900,width=1000");
  }
  detectFiles(event){
    this.selectedFile = event.target.files[0];
  }
  upload(repDate, repName) {
    const file = this.selectedFile;
    const filetype = file.type;
    const filePath = `${this.uid}/${repDate}_${repName}`;
    const fileRef = this.afStorage.ref(filePath);
    this.task = this.afStorage.upload(filePath, file);
    this.uploadProgress = this.task.percentageChanges();

    this.task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              this.fb = url;
            }
            //add report url to database
            console.log("url from finalize - ", this.fb);
            this.db.collection('Users').doc(this.uid).collection("Reports").doc(`${repDate}_${repName}`).set({
              reportDate: repDate,
              reportName: repName,
              reportURL: this.fb,
              fileType: filetype,
              uploadedAt: new Date(),
              status: 'Active'
            })
          });
        }),
      )
      .subscribe(url => {
        if (url) {
          console.log("url from subscribe - ", url);
        }
      });
      
  }
  OpenDeleteBox(reportDate,reportName){
    this.deleteReportDate = reportDate;
    this.deleteReportName = reportName;
  }
  Delete(){
    // console.log("date and report name to be deleted- ", date+"----"+name);
    this.db.collection('Users').doc(this.uid).collection("Reports").doc(`${this.deleteReportDate}_${this.deleteReportName}`).update({
      status:"Deleted"
    })
  }
  download(repName,furl,ftype){
    var storage = firebase.storage();
    storage.refFromURL(furl)
    .getDownloadURL().then((url)=>{
      const xhr = new XMLHttpRequest();
      xhr.responseType = "blob";
      xhr.onload = (event)=>{
        const blob = new Blob([xhr.response]);
        const a:any = document.createElement("a");
        a.style = "display:none";
        document.body.appendChild(a);
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        if(ftype=="image/jpeg"){
          a.download = repName+".jpg";
        }
        else if(ftype=="image/png"){
          a.download = repName+".png";
        }
        else if(ftype=="image/jpg"){
          a.download = repName+".jpg";
        }
        else{
          a.download = repName+".pdf";
        }
        a.click();
        window.URL.revokeObjectURL(url);
      };
      xhr.open("GET",url);
      xhr.send();
    }).catch(function(error) {
      console.log(error);
    });
  }
}
