import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { DatePipe } from '@angular/common';
import { EventSettingsModel, DayService, WeekService, WorkWeekService, MonthService, AgendaService } from '@syncfusion/ej2-angular-schedule';

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.css'],
  providers: [DayService, WeekService, WorkWeekService, MonthService, AgendaService],
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
  currentappData: any;
  nextappData1: any;
  nextappData2: any;
  todayDateInt: number;
  appDateInt: number;
  activestatus: boolean = false;
  @Input() public data: any[] = [];
  public eventSettings: EventSettingsModel = {
    dataSource: this.data,
    allowAdding: false,
    allowDeleting: false,
    allowEditing: false,
    enableTooltip: true,
    // tooltipTemplate: "Hii"
  }
  patientID: string;
  allAppointments: any[];

  constructor(
    public auth: AuthService,
    private router: Router,
    private datePipe: DatePipe,
    private db: AngularFirestore
  ) {
    this.uid = localStorage.getItem("uid");
    this.todayDateInt = parseInt(this.datePipe.transform(new Date(), "yyyyMMddhhmmss"));
    console.log("appointmentBtnDate - ", this.todayDateInt)
    this.patientID = localStorage.getItem("loggedPatientID");
    this.db.collection('Appointments', ref => ref.where('patientID', '==', this.patientID)).valueChanges()
      .subscribe(output => {
        this.allAppointments = output;
        console.log('All appointments relevant to the logged in patient - ', this.allAppointments);
        let schObj = (document.querySelector('.e-schedule') as any).ej2_instances[0];
        let length = this.allAppointments.length;
        for (let i = 0; i < length; i++) {
          // let endTime = this.test[i].EndTime.seconds.toString() + "000";
          // let tempData: calendarObject;
          let srtTime = this.allAppointments[i].appointmentShortDate;
          let tempData = {
            StartTime: new Date(srtTime),
            EndTime: new Date(srtTime),
            IsAllDay: true,
            Subject: 'Dr. ' + this.allAppointments[i].doctorName + ' - ' + this.allAppointments[i].doctorSpeciality
          }
          this.data.push(tempData);
          schObj.eventSettings.dataSource = this.data;
          // this.refresh.next();
        }
        // this.data.slice();
        var nextBtn = document.getElementById("e-tbr-btn_1");
        var prevBtn = document.getElementById("e-tbr-btn_0");
        nextBtn.click();
        prevBtn.click();
      })
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
            this.currentappData = this.result2[0]
            this.appDateInt = parseInt(this.datePipe.transform(this.currentappData.appointmentDate.toDate(), "yyyyMMddhhmmss"));
            this.buttonActive();

            this.nextappData1 = this.result2[1]
            this.nextappData2 = this.result2[2]
            console.log("JOIN data from patients dashboard - ", this.result2);
          })
        this.db.collection('Appointments', ref => ref.where("status", "==", "Success").where("patientID", "==", this.userData.patientID).orderBy("appointmentDate").limit(2)).valueChanges()
          .subscribe(output3 => {
            this.result3 = output3;
            console.log("JOIN data from patients dashboard - ", this.result3);
          })
      })
    this.db.collection("Users").doc(this.uid).collection("Reports", ref => (ref.orderBy("uploadedAt", "desc").limit(1))).valueChanges()
      .subscribe(output => {
        this.reports = output;
        this.lastupload = this.reports[0].uploadedAt
      })
  }
  joinlc(appoid) {
    localStorage.setItem("selectedAppointmentID_patient", appoid)
    console.log(appoid);
    localStorage.setItem("selectedAppointment_doctorID", this.result2[0].doctorID);
    localStorage.setItem("selectedAppointment_appointmentDate", this.result2[0].appointmentDate);
    this.router.navigate(['/patients/waiting-room'])
  }
  bmi(bmi_val) {
    console.log("from BMI function-", bmi_val)
    if (bmi_val < 18.5) {
      this.bmiRange = "Under-Weight",
        (<HTMLInputElement>document.getElementById("bmi")).style.color = "red";
    } else if (bmi_val <= 24.9 && bmi_val > 18.5) {
      this.bmiRange = "Normal"
    } else if (bmi_val <= 29.9 && bmi_val > 24.9) {
      this.bmiRange = "Over-Weight",
        (<HTMLInputElement>document.getElementById("bmi")).style.color = "red";
    } else {
      this.bmiRange = "Obese",
        (<HTMLInputElement>document.getElementById("bmi")).style.color = "darkred";
    }

  }
  buttonActive() {
    var timeDif = this.appDateInt - this.todayDateInt;
    console.log("Time diffrence - ", timeDif)
    if (timeDif <= 3000) {
      // window.onload = () => {
      //   (<HTMLButtonElement>document.getElementById("btndd")).disabled = false;
      // }
      // console.log("time to active....")
      this.activestatus = true;
    }
  }
}

