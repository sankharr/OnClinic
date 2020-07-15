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

  constructor(
    private datePipe: DatePipe,
    private db: AngularFirestore,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.todayDate = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    console.log(this.todayDate);

    this.db.collection('Users').doc(localStorage.getItem("uid")).collection('Appointments').doc(this.todayDate).collection("dayAppointments",ref => ref.where("status","==","Active").orderBy("appointmentNo")).valueChanges()
    .subscribe(output => {
      this.result = output;
      console.log("available appointments (waitingroom-doctorView) - ",this.result);
    })
  }

  joinLiveConsultation(appoID){
    console.log("selected appointmentID from DOCTOR - ",appoID);
    localStorage.setItem('selectedAppointmentID_doctor',appoID);
    this.router.navigate(['/doctors/lcd']);
    // href="/doctors/lcd"
  }

}
