import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-patient-payments',
  templateUrl: './patient-payments.component.html',
  styleUrls: ['./patient-payments.component.css']
})
export class PatientPaymentsComponent implements OnInit {
  uid: any;
  userData: any;
  result: any[];

  constructor(
    private db: AngularFirestore,
  ) {this.uid=localStorage.getItem("uid"); }

  ngOnInit(): void {
    this.db.collection('Users').doc(this.uid).valueChanges()
      .subscribe(output => {
        this.userData = output;
        console.log("userData of patients - ", this.userData);
        this.db.collection('Appointments', ref => ref.where("status", "==", "Success").where("patientID", "==", this.userData.patientID).orderBy("appointmentDate")).valueChanges()
          .subscribe(output3 => {
            this.result = output3;
            console.log("Get All Past Channelings - ", this.result);
          })
      })
  }

}
