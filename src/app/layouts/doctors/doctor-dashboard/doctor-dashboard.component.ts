import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { AuthService } from "../../../services/auth.service";
import * as _ from "lodash";
import { AngularFirestore } from "@angular/fire/firestore";

@Component({
  selector: "app-doctor-dashboard",
  templateUrl: "./doctor-dashboard.component.html",
  styleUrls: ["./doctor-dashboard.component.css"],
})
export class DoctorDashboardComponent implements OnInit {
  @ViewChild("chart") el: ElementRef;
  // @ViewChild("pieChart") el2: ElementRef;
  userId: any;
  result: any;
  result2: any;
  app: any;
  channellings: any;
  patientId: any;
  patientCount: any;
  patients;
  app1: any;

  // +userid: string;

  constructor(private auth: AuthService, private db: AngularFirestore) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem("uid");
    this.db
      .collection("Appointments")
      .valueChanges()
      .subscribe((output) => {
        this.result = output;
        this.test(this.result);
        this.charts();

        // console.log(this.result);
      });
    // this.db.collection('Users').doc(this.userId).collection('appointmentCounts')
  }
  

  // pieChart() {
  
  //   console.log("Pie chart");
  //   const data = [
  //     {
  //       values: [19, 26],
  //       labels: ["Treated", "All"],
  //       type: "pie",
  //     },
  //   ];

  //   var layout = {
  //     height: 300,
  //     width: 320,
  //   };

  //   Plotly.newPlot("pie", data, layout);
  // }

  test(data) {
    this.userId = localStorage.getItem("uid");
    this.db
      .collection("Users")
      .doc(this.userId)
      .valueChanges()
      .subscribe((res) => {
        // console.log(res)
        var doctorId = res["doctorID"];
        console.log(doctorId);
        this.result2 = res;

        var grouped = _.mapValues(_.groupBy(data, "doctorID"), (clist) =>
          clist.map((data) => _.omit(data, "doctorID"))
        );
        this.app = grouped[doctorId];
        console.log(this.app);

        var numOfChannelings = this.app.length;
        console.log(numOfChannelings);
        this.channellings = numOfChannelings;

        var p_count = this.app.map((a) => a.patientID);
        var p_count_unique = _.uniq(p_count);
        console.log(p_count_unique);
        this.patientCount = p_count_unique;

        var patient_count = this.patientCount.length;
        console.log(patient_count);
        this.patients = patient_count;

        var dates = this.app.map((a) => a.appointmentShortDate);
        var dates_unique = _.uniq(dates);
        console.log(dates_unique);

        var groupedDates = _.mapValues(
          _.groupBy(data, "appointmentShortDate"),
          (clist) => clist.map((data) => _.omit(data, "appointmentShortDate"))
        );
        this.app1 = groupedDates["dates_unique"];
        console.log(this.app1);
      });
  }

  charts() {
    console.log("chart called");
    this.lineChart();
    // this.pieChart();
  }
  lineChart() {
    // const element = this.el.nativeElement;

    const data = [
      {
        x: ["10/1", "10/2", "10/3", "10/4", "10/5", "10/6", "10/7"],
        y: [0, 0, 0, 0, 0, 10000, 0],
      },
    ];

    const style = {
      margin: { t: 0 },
      title: "Daily Income",
      height: 240,
    };

    Plotly.newPlot("linechart", data, style);
  }

  // test2(data) {
  //   this.db
  //     .collection("Appointments")
  //     .valueChanges()
  //     .subscribe((output) => {
  //       this.result3 = output;

  //       console.log(this.result3);

  //       // this.patientId = output["patientID"];
  //       // console.log(this.patientId);

  //       // this.patientId = this.result3.patiemtID;
  //       // console.log(this.patientId);
  //     });
  // }
}
