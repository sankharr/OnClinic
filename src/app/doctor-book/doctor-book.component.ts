import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-doctor-book",
  templateUrl: "./doctor-book.component.html",
  styleUrls: ["./doctor-book.component.css"],
})
export class DoctorBookComponent implements OnInit {
  document: any;
  id: any;
  data: any;
  availableAppointments: Array<AvailableAppointment>;

  private routeSub: Subscription;
  constructor(
    public auth: AuthService,
    private db: AngularFirestore,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id");

    this.db
      .collection("Users")
      .doc(this.id)
      .ref.get()
      .then((doc) => {
        this.data = doc.data();
        this.getAvailableAppointmentDates(this.data);
        console.log(this.data);
      });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  getAvailableAppointmentDates(data: any) {
    console.log("here");
  }
}
