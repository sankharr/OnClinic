import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-channeling',
  templateUrl: './channeling.component.html',
  styleUrls: ['./channeling.component.css']
})
export class ChannelingComponent implements OnInit {
  uid: any;
  userData: any;
  result2: any[];
  result3: any[];
  moreView: any;
  constructor(
    private router: Router,
    private db: AngularFirestore
  ) {
    this.uid = localStorage.getItem("uid")
  }

  ngOnInit(): void {
        this.db.collection('Appointments', ref => ref.where("status", "==", "Active").where("patientID", "==", localStorage.getItem("loggedPatientID")).orderBy("appointmentDate")).valueChanges()
          .subscribe(output2 => {
            this.result2 = output2;
            console.log("Get All Upcomming channelings - ", this.result2);
          })
        this.db.collection('Users').doc(this.uid).collection("Prescriptions").valueChanges()
          .subscribe(output3 => {
            this.result3 = output3;
            console.log("Get All Past Channelings - ", this.result3);
          })
      
  }
  joinlc() {
    this.router.navigate(['/patients/waiting-room'])
  }
  moreview(appoID) {
    this.db.collection("Appointments").doc(appoID).valueChanges()
      .subscribe(value => {
        this.moreView = value;
      })
  }
  viewPrescription(url){
    window.open(url, "myWindow", "height=900,width=1000");
  }
}
