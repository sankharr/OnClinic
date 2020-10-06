import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-patient-payments',
  templateUrl: './patient-payments.component.html',
  styleUrls: ['./patient-payments.component.css']
})
export class PatientPaymentsComponent implements OnInit {
  searchValue:string = "";
  searchResult:any;
  uid: any;
  userData: any;
  result: any[];
  inquiryForm: FormGroup;
  last_InquiryID: any;
  sys_variableData: any;
  selectedInquiryAppointmentData: any;
  inquirySubmitted: boolean = false;
  constructor(
    private db: AngularFirestore,
    private _formbuilder: FormBuilder,
    private datePipe: DatePipe
  ) { this.uid = localStorage.getItem("uid"); }

  ngOnInit(): void {
    this.db.collection('Users').doc(this.uid).valueChanges()
      .subscribe(output => {
        this.userData = output;
        console.log("userData of patients - ", this.userData);
        this.db.collection('Users').doc(this.uid).collection('Receipts').valueChanges()
          .subscribe(output3 => {
            this.result = output3;
            console.log("Get All Past Channelings - ", this.result);
          })
      })
    this.inquiryForm = this._formbuilder.group({
      Reason: ["", Validators.required],
    });
  }

  loadInquiryData(appoID) {
    this.db.collection("Appointments").doc(appoID).valueChanges()
      .subscribe(output => {
        this.selectedInquiryAppointmentData = output
      })
      this.db.collection("system_variables").doc("system_variables").valueChanges()
      .subscribe(output4 => {
        this.sys_variableData = output4;
      })

  }
  viewRecipt(url){
    window.open(url, "myWindow", "height=900,width=1000");
  }
  searchByName(){
    let value = this.searchValue.toLowerCase();
    this.db.collection('Appointments', ref => ref.where("patientID", "==", this.userData.patientID).where("nameToSearch",">=",value).where("nameToSearch","<=",value+"\uf8ff")).valueChanges()
          .subscribe(output3 => {
            this.result = output3;
            console.log("Get All Past Channelings - ", this.result);
          })
  }
  submit() {
   
    var data = {
      inquiryID: this.sys_variableData.last_InquiryID + 1,
      appointmentID: this.selectedInquiryAppointmentData.appointmentID,
      patientID: this.selectedInquiryAppointmentData.patientID,
      patientName: this.selectedInquiryAppointmentData.patientName,
      doctorID: this.selectedInquiryAppointmentData.doctorID,
      doctorName: this.selectedInquiryAppointmentData.doctorName,
      appointmentDate: (this.selectedInquiryAppointmentData.appointmentDate),
      inquiryDate: new Date(),
      totalFee: this.selectedInquiryAppointmentData.totalFee,
      appointmentNo: this.selectedInquiryAppointmentData.appointmentNo,
      doctorSpeciality: this.selectedInquiryAppointmentData.doctorSpeciality,
      reason: this.inquiryForm.controls["Reason"].value,
      status: 'Unread'
    }
    this.db.collection("Inquries").add(data)
      .then(() => {
        this.inquirySubmitted = true;
        setTimeout(() => {this.inquirySubmitted=false}, 1000)
        this.db.collection("system_variables").doc("system_variables").update({
          last_InquiryID:data.inquiryID,
        })
      });
    console.log("data to be saved from submit() - ", data);
  }
}

