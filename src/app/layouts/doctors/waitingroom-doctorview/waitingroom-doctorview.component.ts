import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Timestamp } from "rxjs/internal/operators/timestamp";
import { group } from "console";

@Component({
  selector: 'app-waitingroom-doctorview',
  templateUrl: './waitingroom-doctorview.component.html',
  styleUrls: ['./waitingroom-doctorview.component.css']
})
export class WaitingroomDoctorviewComponent implements OnInit {

  todayDate: string;
  result: any;
  doctorData: any;
  currentAppointment: any;
  userId: any;
  result1: any;
  app: any;

  constructor(
    private datePipe: DatePipe,
    private db: AngularFirestore,
    private router: Router
  ) {
    this.todayDate = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    // (<HTMLButtonElement>document.getElementById("joinBtn")).disabled = true;
  }

  ngOnInit(): void {

    console.log(this.todayDate);

    this.db.collection('Users').doc(localStorage.getItem("uid")).valueChanges()
      .subscribe(output => {
        this.doctorData = output;
        this.db.collection('Appointments', ref => ref.where("status", "==", "Active").where("doctorID", "==", this.doctorData.doctorID).orderBy("appointmentDate").orderBy("appointmentNo")).valueChanges()
          .subscribe(output => {
            this.result1 = output;
            this.currentAppointment = output[0];

            if (this.currentAppointment?.appointmentID != null) {
              console.log("buttonVisible");
              (<HTMLButtonElement>document.getElementById("joinBtn")).disabled = false;
            }
            console.log("available appointments (waitingroom-doctorView) - ", this.currentAppointment);
          })

      })

    // this.userId = localStorage.getItem("uid");
    // this.db
    //   .collection("Appointments")
    //   .valueChanges()
    //   .subscribe((output) => {

    //     this.result1 = output;

    //   })
  }

  joinLiveConsultation(appoID) {

    // this.db.collection('Users').doc(localStorage.getItem("uid")).update({
    //   currentAppointmentNumber:this.currentAppointment.appointmentNo
    // }).then(()=>{
    //   console.log("selected appointmentID from DOCTOR - ",appoID);
    //   localStorage.setItem('selectedAppointmentID_doctor',appoID);
    //   this.router.navigate(['/doctors/lcd']);
    // })
    console.log("selected appointmentID from DOCTOR - ", appoID);
    localStorage.setItem('selectedAppointmentID_doctor', appoID);
    this.router.navigate(['/doctors/lcd']);

    // href="/doctors/lcd"
  }

  // test(data) {
  //   this.userId = localStorage.getItem("uid");
  //   this.db
  //     .collection("Users")
  //     .doc(this.userId)
  //     .valueChanges()
  //     .subscribe((res) => {
  //       // console.log(res)
  //       var doctorId = res["doctorID"];
  //       console.log(doctorId);

  //       var grouped = _.mapValues(_.groupBy(data, "doctorID"), (clist) =>
  //         clist.map((data) => _.omit(data, "doctorID"))
  //       );
  //       this.app = grouped[doctorId];
  //       console.log(this.app);

  //       // var ts = this.app["appointmentDate"];
  //       // console.log(ts);

  //     });
  // }

}
