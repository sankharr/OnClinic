import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import * as _ from "lodash";
import { group } from "console";
import { Timestamp } from "rxjs/internal/operators/timestamp";

@Component({
  selector: "app-doctor-channeling",
  templateUrl: "./doctor-channeling.component.html",
  styleUrls: ["./doctor-channeling.component.css"],
})
export class DoctorChannelingComponent implements OnInit {
  result: any;
  userId: any;
  app: any;
  result2: any;
  //tt: any;
  
  // doctorId : string;

  constructor(private db: AngularFirestore) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem("uid");
    this.db
      .collection("Appointments")
      .valueChanges()
      .subscribe((output) => {
        // var ts = output["doctorName"];
        // this.tt = ts;
        // console.log(ts);

        this.result = output;
        // console.log(this.result);
        // console.log(this.result["appointmentDate"]);
        this.test(this.result);
        this.getUserState();
        this.getTime();
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

        // var ts = this.app["appointmentDate"];
        // console.log(ts);
        
      });
  }

  getTime() {
    // this.userId = localStorage.getItem("uid");
    // this.db
    //   .collection("Appointments")
    //   .doc(this.userId)
    //   .valueChanges()
    //   .subscribe((res) => {
    //     // console.log(res)
    //     var ts = res["appointmentDate"];
    //     console.log(ts);
        
        
        
      // });

  }
}
