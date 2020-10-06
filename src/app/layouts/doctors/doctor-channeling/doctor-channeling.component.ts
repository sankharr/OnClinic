import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { DatePipe } from "@angular/common";
import * as _ from "lodash";
import { group } from "console";
import { Timestamp } from "rxjs/internal/operators/timestamp";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: "app-doctor-channeling",
  templateUrl: "./doctor-channeling.component.html",
  styleUrls: ["./doctor-channeling.component.css"],
})
export class DoctorChannelingComponent implements OnInit {
  result1: any;
  userId: any;
  app: any;
  result2: any;
  closeResult: string;
  appointmentId: string;
  data2: any;
  res: any;

  //tt: any;

  // doctorId : string;

  constructor(private db: AngularFirestore, private modalService: NgbModal ,private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem("uid");
    this.db
      .collection("Appointments")
      .valueChanges()
      .subscribe(async (output) => {
        var appointmentId = output["appointmentID"];
        console.log(appointmentId);

        this.result1 = output;
        // console.log(this.result);
        // console.log(this.result["appointmentDate"]);
        this.test(this.result1);
        this.testMaheema();
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

        // var ts = this.app["appointmentDate"];
        //console.log(this.data2);
      });
  }

  testMaheema() {
    const data2 = this.db
      .collection("Appointments")
      .doc("2020-10-06_d0000014_p0000002_2")
      .collection("Prescriptions")
      .valueChanges()
      .subscribe((output2) => {
        this.res = output2;
        console.log(output2);
      });
    // console.log(data2)
  }

  open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  link;

  open2(content2) {
    this.testMaheema();
    this.link = this.res.prescriptionURL;
    this.modalService
      .open(content2, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
  transform(){
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.res.prescriptionURL);

  }
}
