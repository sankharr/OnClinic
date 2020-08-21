import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import * as _ from "lodash";
import { group } from "console";

@Component({
  selector: "app-doctor-channeling",
  templateUrl: "./doctor-channeling.component.html",
  styleUrls: ["./doctor-channeling.component.css"],
})
export class DoctorChannelingComponent implements OnInit {
  result: any;
  userId: any;
  app: any;
  // doctorId : string;

  constructor(private db: AngularFirestore) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem("uid");
    this.db
      .collection("Appointments")
      .valueChanges()
      .subscribe((output) => {
        this.result = output;
        // console.log(this.result);
        this.test(this.result);
        this.getUserState();
      });
  }

  getUserState() {
    //   this.userId = localStorage.getItem("uid");
    //   this.db.collection("Users").doc(this.userId).valueChanges()
    //   .subscribe(res=>{
    //     // console.log(res)
    //     this.doctorId = res["doctorID"];
    //     console.log(this.doctorId)
    // })
  }

  test(data) {
    // this.userId = localStorage.getItem("uid");
    // console.log(this.userId);
    // var id = toString(this.userId);
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
