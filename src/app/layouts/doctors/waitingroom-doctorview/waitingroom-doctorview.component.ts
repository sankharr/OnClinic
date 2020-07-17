import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-waitingroom-doctorview',
  templateUrl: './waitingroom-doctorview.component.html',
  styleUrls: ['./waitingroom-doctorview.component.css']
})
export class WaitingroomDoctorviewComponent implements OnInit {

  todayDate:string;
  result: any;
  doctorData: any;
  currentAppointment: any;

  constructor(
    private datePipe: DatePipe,
    private db: AngularFirestore,
    private router: Router
  ) {
    this.todayDate = this.datePipe.transform(new Date(), "yyyy-MM-dd");
   }

  ngOnInit(): void {
    
    console.log(this.todayDate);

    this.db.collection('Users').doc(localStorage.getItem("uid")).valueChanges()
    .subscribe(output => {
      this.doctorData = output;
      this.db.collection('Appointments',ref => ref.where("status","==","Active").where("doctorID","==",this.doctorData.doctorID).where("appointmentShortDate","==",this.todayDate).orderBy("appointmentNo")).valueChanges()
      .subscribe(output => {
        this.currentAppointment = output[0];
        console.log("available appointments (waitingroom-doctorView) - ",this.currentAppointment);
      })
      
    })
  }

  joinLiveConsultation(appoID){
    console.log("selected appointmentID from DOCTOR - ",appoID);
    localStorage.setItem('selectedAppointmentID_doctor',appoID);
    this.router.navigate(['/doctors/lcd']);
    // href="/doctors/lcd"
  }

}
