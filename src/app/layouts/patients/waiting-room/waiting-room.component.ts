import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize, map, tap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-waiting-room',
  templateUrl: './waiting-room.component.html',
  styleUrls: ['./waiting-room.component.css']
})
export class WaitingRoomComponent implements OnInit {

  uploadReportForm: FormGroup;
  currentDate = new Date();
  uploadProgress: Observable<number>; //view progress of the upload
  downloadURL: Observable<string>; //firebase url of the uploaded document
  selectedFile: File = null;  //file selected to upload
  uid: any;
  fb;
  todayDate: string;
  result: any;
  task: AngularFireUploadTask;
  reports: any;
  result1: any;
  appDate: any;
  docID: string;
  appID: string;
  status1:any;
  status2:any;
  status3:any;
  status4:any;
  currentappData: any;
  constructor(
    private _formbuilder: FormBuilder,
    private db: AngularFirestore,
    private router: Router,
    private afStorage: AngularFireStorage,
    private datePipe: DatePipe
  ) {
    this.uid = localStorage.getItem("uid");
    // this.appDate = this.datePipe.transform(localStorage.getItem("selectedAppointment_appointmentDate"), "yyyy-MM-dd");
    this.docID = localStorage.getItem("selectedAppointment_doctorID");
    this.appID = localStorage.getItem("selectedAppointmentID_patient")
    console.log(this.currentDate, " --- ", this.docID, "");
  }

  ngOnInit(): void {
    this.uploadReportForm = this._formbuilder.group({
      reportDate: ["", Validators.required],
      reportName: ["", Validators.required],
    });
    this.db.collection("Appointments").doc(this.appID).valueChanges()
    .subscribe(value=>{
      this.currentappData = value;
      this.db.collection('Appointments', ref => ref.where("appointmentShortDate", "==", this.currentappData.appointmentShortDate).where("doctorID", "==", this.docID).orderBy("appointmentTime")).valueChanges()
      .subscribe(output7 => {
        this.result1 = output7;
        console.log("Get All Upcomming channelings - ", this.result1);
      })
    })
    
  }
  detectFiles(event) {
    this.selectedFile = event.target.files[0];
  }

  displayReports() {
    this.db.collection("Users").doc(this.uid).collection("Reports", ref =>
      (ref.orderBy("uploadedAt", "desc"))).valueChanges()
      .subscribe(output => {
        this.reports = output;
        console.log("result-", this.reports)
      })
  }

  upload(repDate, repName) {
    const file = this.selectedFile;
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
              reportURL: this.fb
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

  leave() {
    this.router.navigate(['patients/dashboard']);
  }
  ready() {
    this.db.collection("Appointments").doc(this.appID).update({
      availabilityStatus:"Ready"
    }).then(()=>{
      this.router.navigate(['patients/lcp']);
    })
    
  }
  submit() {
  }
}
