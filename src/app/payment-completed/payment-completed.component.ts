import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable, timer } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import * as jsPDF from 'jspdf';
import { finalize } from 'rxjs/operators';
import * as firebase from 'firebase';

@Component({
  selector: 'app-payment-completed',
  templateUrl: './payment-completed.component.html',
  styleUrls: ['./payment-completed.component.css']
})
export class PaymentCompletedComponent implements OnInit,AfterViewInit {
  results: any;
  // results1: any;
 
  channelID: string;
  appointmentData: any;
  paymentAppoinmentID: any;
  dateToday;
  task: AngularFireUploadTask;

  uploadProgress: Observable<number>;
  downloadURL: Observable<string>;
  fb;
  patientUID: string;

  constructor(
    public auth: AuthService,
    private afStorage: AngularFireStorage,
    private db: AngularFirestore
  ) {
    this.paymentAppoinmentID = localStorage.getItem('paymentAppointmentID') ;
    this.dateToday = new Date();
  }

  
  ngOnInit(): void {
    // this.db.collection('Users').doc(localStorage.getItem('uid')).valueChanges()
    //   .subscribe(output => {
    //     this.results = output;
    //     console.log("payment successful - ",this.results)
    //   })

      this.db.collection('Appointments').doc(localStorage.getItem('paymentAppointmentID')).valueChanges()
      .subscribe(output => {
        this.results = output;
        console.log("payment successful - ",this.results);
        // this.htmlToPdf();
      })
      
  }

  htmlToPdf() {
    console.log("from html2pdf");    

    this.db.collection('Users', ref => ref.where("patientID", "==", this.results.patientID)).snapshotChanges()
      .subscribe(output => {
        this.patientUID = output[0].payload.doc.id;
        console.log("patient UID - ", this.patientUID);
      })

    const doc = new jsPDF('p', 'pt', 'a5')
    const ta = document.getElementById('htmlData');
    doc.fromHTML(ta, 20, 20);

    const file = doc.output("blob");
    const filePath = `Receipts/${this.results.patientID}/${this.results.appointmentID}`;
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
            console.log("url from finalize - ", this.fb);
            this.db.collection('Users').doc(this.patientUID).collection("Receipts").add({
             
              receiptID: this.dateToday + '_' + this.results.doctorName,
              doctorName: this.results.doctorName,
              doctorID: this.results.doctorID,
              receiptURL: this.fb,
              uploadedAt: new Date(),
              appointmentTime: this.results.appointmentTime,
              appointmentDate: this.results.appointmentDate,
              appointmentShortDate: this.results.appointmentShortDate,
              totalFee: this.results.totalFee,
              nameToSearch: this.results.doctorName.toLowerCase(),
              status: 'Active'
            });
            this.db.collection('Appointments').doc(this.results.appointmentID).collection("Receipts").add({
             
              receiptID: this.dateToday + '_' + this.results.doctorName,
              doctorName: this.results.doctorName,
              doctorID: this.results.doctorID,
              receiptURL: this.fb,
              uploadedAt: new Date(),
              appointmentTime: this.results.appointmentTime,
              appointmentDate: this.results.appointmentDate,
              appointmentShortDate: this.results.appointmentShortDate,
              totalFee: this.results.totalFee,
              nameToSearch: this.results.doctorName.toLowerCase(),
              status: 'Active'
            });
            // setTimeout(() => {
            //   this.prescriptionContent = []
            //   this.otherNotesArray = []
            // }, 500)
          });
        }),
      )
      .subscribe(url => {
        if (url) {
          console.log("url from subscribe - ", url);
        }
      });
      console.log("at the end from html2pdf");    


  }

  download(){
    var storage = firebase.storage();
    storage.refFromURL(this.fb)
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
        a.download = this.dateToday + '_' + this.results.doctorName+".pdf";
        // if(ftype=="image/jpeg"){
        //   a.download = repName+".jpg";
        // }
        // else if(ftype=="image/png"){
        //   a.download = repName+".png";
        // }
        // else if(ftype=="image/jpg"){
        //   a.download = repName+".jpg";
        // }
        // else{
        //   a.download = repName+".pdf";
        // }
        a.click();
        window.URL.revokeObjectURL(url);
      };
      xhr.open("GET",url);
      xhr.send();
    }).catch(function(error) {
      console.log(error);
    });
  }

  ngAfterViewInit(){
    this.htmlToPdf();
  }



}
