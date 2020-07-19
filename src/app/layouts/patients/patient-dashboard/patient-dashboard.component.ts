import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.css']
})
export class PatientDashboardComponent implements OnInit {
  userid: string;
  uid: any;
  result: any;
  reports: any;
  lastupload: any;
  result2: any[];
  userData: any;
  result3: any[];
  bmiRange: any;
  bmi_val: any;

  constructor(
    public auth: AuthService,
    private router: Router,
    private db: AngularFirestore
  ) {
    this.uid = localStorage.getItem("uid");
  }
  // docref=this.db.collection("Users")
  ngOnInit(): void {
    this.auth.getUserState().subscribe(res => {
      this.userid = res.uid
      this.auth.updateLastlogin(this.userid)
    })
    this.db.collection('Users').doc(this.uid).valueChanges()
      .subscribe(output => {
        this.userData = output;
        console.log("userData from patients dashboard - ", this.userData);
        this.bmi_val = parseFloat(this.userData.bmi);
        this.bmi(this.bmi_val);
        this.db.collection('Appointments', ref => ref.where("status", "==", "Active").where("patientID", "==", this.userData.patientID).orderBy("appointmentDate")).valueChanges()
          .subscribe(output2 => {
            this.result2 = output2;
            console.log("JOIN data from patients dashboard - ", this.result2);
          })
        this.db.collection('Appointments', ref => ref.where("status", "==", "Success").where("patientID", "==", this.userData.patientID).orderBy("appointmentDate")).valueChanges()
          .subscribe(output3 => {
            this.result3 = output3;
            console.log("JOIN data from patients dashboard - ", this.result3);
          })
      })
    this.db.collection("Users").doc(this.uid).collection("Reports",ref=>(ref.orderBy("uploadedAt","desc").limit(1))).valueChanges()
    .subscribe(output =>{
        this.reports=output;
        this.lastupload=this.reports[0].uploadedAt
    })
  }
  joinlc(appoid) {
    localStorage.setItem("selectedAppointmentID_patient",appoid)
    console.log(appoid);
    this.router.navigate(['/patients/waiting-room'])  
  }
  bmi(bmi_val){
    console.log("from BMI function-",bmi_val)
    if(bmi_val<18.5){
      this.bmiRange = "Under-Weight",
      (<HTMLInputElement>document.getElementById("bmi")).style.color = "red";
    }else if(bmi_val<=24.9 && bmi_val>18.5){
      this.bmiRange = "Normal"
    }else if(bmi_val<=29.9 && bmi_val>24.9){
      this.bmiRange = "Over-Weight",
      (<HTMLInputElement>document.getElementById("bmi")).style.color = "red";
    }else{
      this.bmiRange = "Obese",
      (<HTMLInputElement>document.getElementById("bmi")).style.color = "darkred";
    }
    
  }

}

