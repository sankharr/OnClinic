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
  userData: any;
  result2: any[];
  firstAppointment: any;
  doctorUID: string;

  constructor(public auth:AuthService,
              private router:Router,
              private db: AngularFirestore) { 
  }

  ngOnInit(): void {
    this.auth.getUserState().subscribe(res=>{
      this.userid = res.uid
      this.auth.updateLastlogin(this.userid)
    })

    this.db.collection('Users').doc(localStorage.getItem("uid")).valueChanges()
    .subscribe(output => {
      this.userData = output;
      console.log("userData from patients dashboard - ",this.userData);
      this.db.collection('Appointments',ref => ref.where("status","==","Active").where("patientID","==",this.userData.patientID).orderBy("appointmentDate")).valueChanges()
      .subscribe(output2 => {
        this.result2 = output2;
        this.firstAppointment = output2[0]
        this.db.collection("Users",ref => ref.where("doctorID","==",this.firstAppointment.doctorID)).snapshotChanges()
        .subscribe(output3 => {
          this.doctorUID = output3[0].payload.doc.id;
          localStorage.setItem("selectedAppointmentDoctorUID",this.doctorUID);
        })
        console.log("JOIN data from patients dashboard - ",this.result2);
      })
    })

    
  }
  joinlc(appoID) {
    localStorage.setItem('selectedAppointmentID_patient',appoID);
    this.router.navigate(['/patients/waiting-room'])
  }

}

