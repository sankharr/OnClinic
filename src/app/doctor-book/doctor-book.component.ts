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
  definitions = [
    "sundayTime",
    "mondayTime",
    "tuesdayTime",
    "wednesdayTime",
    "thursdayTime",
    "fridayTime",
    "saturdayTime",
  ];

  days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

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
        this.availableAppointments = this.chunk(this.availableAppointments, 3);
      });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  getAvailableAppointmentDates(data: any) {
    const timeNow = new Date();
    this.availableAppointments = new Array<AvailableAppointment>();

    const dateObjects = this.getDateObjectsFromToday(data, 14);

    let initialDate = dateObjects[0];
    if (initialDate < timeNow) {
      this.availableAppointments.push({
        date: initialDate.toString(),
        time: this.calculateTime(initialDate, data.numberOfAppointments),
        totalCount: data.numberOfAppointments,
        day: this.days[initialDate.getDay()],
      });
    }

    dateObjects.slice(1).forEach((date) => {
      this.availableAppointments.push({
        date: date.toString(),
        time: this.calculateTime(date, data.numberOfAppointments),
        totalCount: data.numberOfAppointments,
        day: this.days[date.getDay()],
      });
    });
  }

  getHourAndMinutes(time: string): { hour: number; minutes: number } {
    let hour: number = +time.replace(/AM|PM/g, "").split(".")[0];
    const minute: number = +time.replace(/AM|PM/g, "").split(".")[1];
    if (time.includes("PM")) {
      hour += 12;
    }

    return {
      hour: hour,
      minutes: minute,
    };
  }

  calculateTime(date: Date, totalAppointments: number): string {
    return "8.00AM - 10.00AM";
  }

  getDateObjectsFromToday(data: any, count: number): Array<Date> {
    const todayTime: Date = new Date();
    let i = todayTime.getDay();
    let offset = 0;
    let curCount = 0;

    let dateObjects: Array<Date> = new Array();
    while (curCount < count) {
      const dayNum: number = i % 7;
      if (data[this.definitions[dayNum]]) {
        const hourAndMinute = this.getHourAndMinutes(
          data[this.definitions[dayNum]]
        );

        const dateObject: Date = new Date();
        dateObject.setDate(todayTime.getDate() + offset);
        dateObject.setHours(hourAndMinute.hour);
        dateObject.setMinutes(hourAndMinute.minutes);
        dateObjects.push(dateObject);
        curCount++;
      }
      i++;
      offset++;
    }
    return dateObjects;
  }

  chunk(arr, size) {
    let newArr = [];
    for (let i = 0; i < arr.length; i += size) {
      newArr.push(arr.slice(i, i + size));
    }
    return newArr;
  }
}
