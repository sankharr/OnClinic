import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import * as _ from "lodash";
import { group } from "console";
import { Timestamp } from "rxjs/internal/operators/timestamp";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";

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
  closeResult: string;
  //tt: any;
  
  // doctorId : string;

  constructor(private db: AngularFirestore, private modalService: NgbModal) {}

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

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }

}

}
