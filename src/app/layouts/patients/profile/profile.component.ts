import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { AngularFireUploadTask } from '@angular/fire/storage/task';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  uploadProgress: Observable<number>; //view progress of the upload
  downloadURL: Observable<string>; //firebase url of the uploaded document
  selectedFile: File = null;  //file selected to upload
  task: AngularFireUploadTask;
  fb;
  uid:any;
  result:any;
  lgdis:any[];
  alergies:any[];
  operations:any[];
  constructor(
    private router:Router,
    private db:AngularFirestore,
    private afStorage: AngularFireStorage,) { }

  ngOnInit(): void {
    this.uid=localStorage.getItem("uid");
    this.db.collection("Users").doc(this.uid).valueChanges()
    .subscribe(output =>{
        this.result=output;
        this.lgdis=this.result.longTermDiseases;
        console.log("result-",this.result.longTermDiseases)
        this.alergies=this.result.allergies;
        console.log("result-",this.result.allergies)
        this.operations=this.result.operations;
        console.log("result-",this.result.operations)
    })
  }
  edit() {
    this.router.navigate(['/patients/edit-profile'])
  }
  detectFiles(event) {
    this.selectedFile = event.target.files[0];
  }
  upload() {
    const file = this.selectedFile;
    const filePath = `${this.uid}/proPic`;
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
            this.db.collection("Users").doc(this.uid).update({
              proPicURL:url
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
  
}
