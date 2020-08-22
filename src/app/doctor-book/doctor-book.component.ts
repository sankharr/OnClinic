import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DatePipe } from '@angular/common';

interface InputData {
  name: string
  value: string
}

interface FormInputData {
  inputData: Array<InputData>
}

@Component({
  selector: "app-doctor-book",
  templateUrl: "./doctor-book.component.html",
  styleUrls: ["./doctor-book.component.css"],
})
export class DoctorBookComponent implements OnInit {
  document: any;
  id: any;
  data: any;
  results: any;
  appointmentNo: any;
  avgTime: any;
  finalEstimatedAppointmentTime: any;
  appointmentID: any;
  hospitalCoreCharges = 200;
  // url = "https://sandbox.payhere.lk/pay/checkout";

  appointmentForm: FormGroup;

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
  selectedAppointmentDate: any;
  appointmentsCount: any;
  resultz: any;
  
  currentUserID: any;
  totalFee: any;
  appointmentShortDate: string;

  constructor(
    public auth: AuthService,
    private db: AngularFirestore,
    private route: ActivatedRoute,
    private _formbuilder: FormBuilder,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.db.collection('Users').doc(localStorage.getItem('uid')).valueChanges()
      .subscribe(output => {
        this.results = output;
        console.log("doctor booking retrived data - ", this.results)
      })

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

    this.appointmentForm = this._formbuilder.group({
      first_name: ["", Validators.required],
      last_name: ["", Validators.required],
      email: ["", Validators.required],
      phone: ["", Validators.required],
      address: ["", Validators.required],
      city: ["", Validators.required],
      country: ["", Validators.required],
      // merchant_id: ["", Validators.required],
      // return_url: ["", Validators.required],
      // cancel_url: ["", Validators.required],
      // notify_url: ["", Validators.required],
      // order_id: ["", Validators.required],
      // currency: ["", Validators.required],
      // items: ["", Validators.required],
      // amount: ["", Validators.required],
      // doctorName: ["", Validators.required],
      // appoinmentDate: ["", Validators.required],
      // estimatedTime: ["", Validators.required],
      // appoinmnetID: ["", Validators.required],
      // totalAmount: ["", Validators.required],
      // channelNo: ["", Validators.required],
    });
  }

  appointmentIDGenerator() {

  }

  setResult(date) {
    var hours: number = 0;
    let finalEstimatedTime;
    // let appointmentNo = 5;
    let avgTime = parseInt(this.data.averageConsulationTime)
    let datex: Date = new Date(date);
    let minsString;
    let appointmentDate;
    let resultz;
    var appoCount;
    
    this.totalFee = this.hospitalCoreCharges + parseInt(this.data.doctorFee);

//     appointmentDate = this.datePipe.transform(datex, "yyyy-MM-dd");
    this.appointmentShortDate = this.datePipe.transform(datex, "yyyy-MM-dd");
    console.log("appointmentdaTE - ", appointmentDate);
    
    if (this.results.role == 'doctor') {
      this.currentUserID = this.results.doctorID;

    }
    else if (this.results.role == 'patient') {
      this.currentUserID = this.results.patientID;
    }

    var docRef = this.db.collection('Users').doc(this.id).collection('appointmentCounts').doc(this.appointmentShortDate);
    docRef.valueChanges().subscribe(doc => {

      if (doc) {
        resultz = doc;
        appoCount = resultz.patientsCount + 1;
        console.log("new appointmentsCount - ", appoCount);
        // sessionStorage.setItem("currentAppointmentsCount",doc.get("patientsCount"));
        console.log("Document data:", resultz.patientsCount);

        this.appointmentsCount = appoCount;

        this.selectedAppointmentDate = date;
        console.log("time - ", datex.getHours())

        hours = datex.getHours()
        let estTimeTotMins = (appoCount - 1) * avgTime;
        let extraHours = estTimeTotMins / 60;
        let mins = estTimeTotMins % 60;
        if (mins < 10) {
          minsString = '0' + mins;
        }
        else {
          minsString = mins;
        }
        // var intvalue = Math.floor( floatvalue )
        hours = Math.floor(hours + extraHours);
        if (hours > 12) {
          hours = hours % 12;
          this.finalEstimatedAppointmentTime = hours + ':' + minsString + ' PM';
        }
        else {
          this.finalEstimatedAppointmentTime = hours + ':' + minsString + ' AM';
        }
        console.log("finalEstimatedTime - ", finalEstimatedTime);

        this.appointmentID = this.appointmentShortDate + '_' + this.data.doctorID + '_' + this.currentUserID + '_' + this.appointmentsCount;
        console.log("appointmentID - ", this.appointmentID);

        this.setFormData();

        // sessionStorage.setItem("appointmentNo",this.appointmentsCount);
        // sessionStorage.setItem("estimatedTime",finalEstimatedTime);
        // sessionStorage.setItem("appointmentDate",this.selectedAppointmentDate);

      }



      else {
        appoCount = 1;
        console.log("new appointmentsCount - ", appoCount);
        // sessionStorage.setItem("currentAppointmentsCount","0")
        console.log("No such document!");

        this.appointmentsCount = appoCount;

        this.selectedAppointmentDate = date;
        console.log("time - ", datex.getHours())

        hours = datex.getHours()
        let estTimeTotMins = (appoCount - 1) * avgTime;
        let extraHours = estTimeTotMins / 60;
        let mins = estTimeTotMins % 60;
        if (mins < 10) {
          minsString = '0' + mins;
        }
        else {
          minsString = mins;
        }
        // var intvalue = Math.floor( floatvalue )
        hours = Math.floor(hours + extraHours);
        if (hours > 12) {
          hours = hours % 12;
          this.finalEstimatedAppointmentTime = hours + ':' + minsString + ' PM';
        }
        else {
          this.finalEstimatedAppointmentTime = hours + ':' + minsString + ' AM';
        }
        console.log("finalEstimatedTime - ", finalEstimatedTime);

        this.appointmentID = this.appointmentShortDate + '_' + this.data.doctorID + '_' + this.currentUserID + '_' + this.appointmentsCount;
        console.log("appointmentID - ", this.appointmentID);

        this.setFormData();

        // sessionStorage.setItem("appointmentNo",this.appointmentsCount);
        // sessionStorage.setItem("estimatedTime",finalEstimatedTime);
        // sessionStorage.setItem("appointmentDate",this.selectedAppointmentDate);

      }
    });

  }

  setFormData(){

    var splitted = this.results.name.split(" ", 2);
    console.log("splitted names - ",splitted);

    this.appointmentForm.setValue({
      // appointmentID:this.appointmentID,
      first_name:splitted[0],
      last_name:splitted[1],
      city:'Nugegoda',
      country:'Sri Lanka',
      email:this.results.email,
      phone:this.results.telno,
      address:this.results.address,
      // merchant_id: "1214679",
      // return_url: "http://localhost:4200/payment-success",
      // cancel_url: "http://localhost:4200/payment-failed",
      // notify_url: "https://us-central1-onclinic-dd11a.cloudfunctions.net/paymentStatus",
      // order_id: "orderID123",
      // currency: "LKR",
      // items: "testPaymentAppointment",
      // amount: "1200",

      // patientID:this.results.patientID,
      // patientName:this.results.name,
      // doctorID:this.data.doctorID,
      // doctorName:this.data.name,
      // appointmentDate:this.selectedAppointmentDate,
      // appointmentTime:this.finalEstimatedAppointmentTime,
      // totalFee:this.data.doctorFee,
      // appointmentNo:this.appointmentsCount,
    })
  }

  doPayment() {
    const data = new Array<InputData>()
    data.push({ name: 'merchant_id', value: "1214922"  })
    data.push({ name: 'return_url', value: "http://localhost:4200/payment-completed" })
    data.push({ name: 'cancel_url', value: "http://localhost:4200/payment-failed" })
    data.push({ name: 'notify_url', value: "https://us-central1-onclinic-dd11a.cloudfunctions.net/paymentStatus" })
    data.push({ name: 'first_name', value: this.appointmentForm.controls['first_name'].value })
    data.push({ name: 'last_name', value: this.appointmentForm.controls['last_name'].value })
    data.push({ name: 'email', value: this.appointmentForm.controls['email'].value })
    data.push({ name: 'phone', value: this.appointmentForm.controls['phone'].value })
    data.push({ name: 'address', value: this.appointmentForm.controls['address'].value })
    data.push({ name: 'city', value: this.appointmentForm.controls['city'].value })
    data.push({ name: 'country', value: this.appointmentForm.controls['country'].value })
    data.push({ name: 'order_id', value: this.appointmentForm.controls['last_name'].value })
    data.push({ name: 'items', value: this.appointmentForm.controls['last_name'].value })
    data.push({ name: 'currency', value: "LKR" })
    data.push({ name: 'amount', value: this.data.doctorFee })
    data.push({ name: 'custom_1', value: this.appointmentID })
    data.push({ name: 'custom_2', value: localStorage.getItem("selectedDocID") })
    // data.push({ name: 'hash', value: `${pd.hash}` })

    this.payNow();

    const form = this.createForm({ inputData: data })
    // You have to create hidden(style="display:none") div element with this "submit-form-container" id (id="submit-form-container") in the component
    // <div style="display:none" id="submit-form-container"></div>
    document.querySelector('#submit-form-container').appendChild(form)
    form.submit()
  }

  createForm(data: FormInputData): HTMLFormElement {
    const form: HTMLFormElement = document.createElement('form')
    form.setAttribute('action', `https://sandbox.payhere.lk/pay/checkout`)
    form.setAttribute('method', 'POST')

    form.append(
      ...data.inputData.map((d) => {
        return this.createInput(d)
      })
    )

    return form
  }

  createInput(data: InputData): HTMLInputElement {
    const input = document.createElement('input')
    input.setAttribute('type', 'hidden')
    input.setAttribute('name', `${data.name}`)
    input.setAttribute('value', `${data.value}`)
    return input
  }

  payNow(){
    
    var appointmentDatex = this.datePipe.transform(this.selectedAppointmentDate, "yyyy-MM-dd");
    console.log("results from paynow() - ",this.results);
    if (this.results.role == 'doctor'){
      this.currentUserID = this.results.doctorID;

    }
    else if(this.results.role == 'patient'){
      this.currentUserID = this.results.patientID;
    }
    
    var data = {
      appointmentID:this.appointmentID,
      patientID:this.currentUserID,
      patientName:this.results.name,
      doctorID:this.data.doctorID,
      doctorName:this.data.name,
      appointmentDate:new Date(this.selectedAppointmentDate),
      doctorProPic:this.data.proPicURL,
      appointmentTime:this.finalEstimatedAppointmentTime,
      totalFee:this.totalFee,
      appointmentShortDate:this.appointmentShortDate,
      appointmentNo:this.appointmentsCount,
      doctorSpeciality:this.data.speciality,
      consultationStarted:"false",
      availabilityStatus:'Absent',
      paymentStatus:'Pending',
      status:'Active'
    }    

    this.db.collection('Appointments').doc(this.appointmentID).set(data)
    .then(()=>{
      console.log("successfully updated - Appointments")
      this.db.collection('Users').doc(localStorage.getItem("selectedDocID")).collection('appointmentCounts').doc(this.datePipe.transform(this.selectedAppointmentDate, "yyyy-MM-dd")).set({
        patientsCount:this.appointmentsCount
      }).then(()=>{
        console.log("successfully updated - doctor appointments count")
      });
    });

    // this.db.collection('Users').doc(localStorage.getItem('uid')).collection('Appointments').doc(this.appointmentID).set(data)
    // .then(()=>{
    //   console.log("successfully updated - patient Appointments")
    // })

    this.db.collection('Users').doc(localStorage.getItem('selectedDocID')).collection('Appointments').doc(appointmentDatex.toString()).collection('dayAppointments').doc(this.appointmentID).set(data)
    .then(()=>{
      console.log("successfully updated - doctor Appointments")
    })

    console.log("data to be saved from paynow() - ",data);
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
      if (offset > 6 && dateObjects.length == 0) return;
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