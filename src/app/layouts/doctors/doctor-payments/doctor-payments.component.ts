import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import * as _ from "lodash";
import { group } from "console";
import { Timestamp } from "rxjs/internal/operators/timestamp";

@Component({
  selector: "app-doctor-payments",
  templateUrl: "./doctor-payments.component.html",
  styleUrls: ["./doctor-payments.component.css"],
})
export class DoctorPaymentsComponent implements OnInit {
  result: any;
  userId: any;
  app: any;
  result2: any;

  constructor(private db: AngularFirestore) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem("uid");
    this.db
      .collection("Appointments")
      .valueChanges()
      .subscribe((output) => {
        this.result = output;
        this.test(this.result);
      });
  }

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

        var grouped = _.mapValues(_.groupBy(data, "doctorID"), (clist) =>
          clist.map((data) => _.omit(data, "doctorID"))
        );
        this.app = grouped[doctorId];
        console.log(this.app);
      });
  }
}
