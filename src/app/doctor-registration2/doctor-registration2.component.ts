import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctor-registration2',
  templateUrl: './doctor-registration2.component.html',
  styleUrls: ['./doctor-registration2.component.css']
})
export class DoctorRegistration2Component implements OnInit {

  completeProfileDoctorForm: FormGroup;

  doctorCategories = ["", "General Physician", "Family practice physician", "Pediatricians", "Allergists", "Dermatologists", "Infectious disease doctors", "Ophthalmologists", "Obstetrician/gynecologists", "Cardiologists", "Endocrinologists", "Gastroenterologists", "Nephrologists", "Urologists", "Pulmonologists", "Otolaryngologists", "Neurologists", "Psychiatrists", "Oncologists", "Radiologists", "Rheumatologists", "General surgeons", "Orthopedic surgeons", "Cardiac surgeons", "Anesthesiologists"];
  days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  times = ["Not Selected", "12.00 AM", "1.00 AM", "2.00 AM", "3.00 AM", "4.00 AM", "5.00 AM", "6.00 AM", "7.00 AM", "8.00 AM", "9.00 AM", "10.00 AM", "11.00 AM", "12.00 PM", "1.00 PM", "2.00 PM", "3.00 PM", "4.00 PM", "5.00 PM", "6.00 PM", "7.00 PM", "8.00 PM", "9.00 PM", "10.00 PM", "11.00 PM", "12.00 AM"];
  numberOfAppointments = ["", "No Limit", "5", "10", "15", "20", "30", "40"];
  qualificationsArray = []

  last_doctorID: any;
  submitError: boolean = false;
  submitSuccess: boolean = false;

  constructor(
    private _formbuilder: FormBuilder,
    private db: AngularFirestore,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.completeProfileDoctorForm = this._formbuilder.group({
      mondayTime: ["", Validators.required],
      tuesdayTime: ["", Validators.required],
      wednesdayTime: ["", Validators.required],
      thursdayTime: ["", Validators.required],
      fridayTime: ["", Validators.required],
      saturdayTime: ["", Validators.required],
      sundayTime: ["", Validators.required],
      speciality: ["", Validators.required],
      doctorFee: ["", Validators.required],
      numberOfAppointments: ["", Validators.required],
      averageConsulationTime: ["", Validators.required],
      eduQualifications: ["", Validators.required],
    });
    

    // this.db.collection("system_variables").doc("system_variables").snapshotChanges()
    //   .subscribe(result => {
    //     console.log("latest_doctorID - ", result.payload.get("last_doctorID"));
    //     this.last_doctorID = result.payload.get("last_doctorID");
    //     this.generateNewDoctorID(this.last_doctorID.toString());
    //   })

    // this.generateNewDoctorID();
  }

  addQualifications(qualifi){
    this.qualificationsArray.push(qualifi);
    this.completeProfileDoctorForm.controls['eduQualifications'].reset()  
  }

  removeQualifications(val){
    var index = this.qualificationsArray.indexOf(val);
    this.qualificationsArray.splice(index,1);
    console.log("from removeQualifications, val index qualificationsArray - ",val,index,this.qualificationsArray)
  }  

  updateProfileDoctor() {

    var finalQualiObjectsArray = [];

    this.qualificationsArray.forEach(function (value) {
      var temp = {
        qualification: value,
        status: 'Active'
      }
      finalQualiObjectsArray.push(temp);
      console.log(value);
    }); 

    var speciality = this.completeProfileDoctorForm.controls["speciality"].value;
    var doctorFee = this.completeProfileDoctorForm.controls["doctorFee"].value;
    var numberOfAppointments = this.completeProfileDoctorForm.controls["numberOfAppointments"].value;
    var averageConsulationTime = this.completeProfileDoctorForm.controls["averageConsulationTime"].value;

    var newData = {
      mondayTime: this.completeProfileDoctorForm.controls["mondayTime"].value,
      tuesdayTime: this.completeProfileDoctorForm.controls["tuesdayTime"].value,
      wednesdayTime: this.completeProfileDoctorForm.controls["wednesdayTime"].value,
      thursdayTime: this.completeProfileDoctorForm.controls["thursdayTime"].value,
      fridayTime: this.completeProfileDoctorForm.controls["fridayTime"].value,
      saturdayTime: this.completeProfileDoctorForm.controls["saturdayTime"].value,
      sundayTime: this.completeProfileDoctorForm.controls["sundayTime"].value,
      speciality: this.completeProfileDoctorForm.controls["speciality"].value,
      doctorFee: this.completeProfileDoctorForm.controls["doctorFee"].value,
      numberOfAppointments: this.completeProfileDoctorForm.controls["numberOfAppointments"].value,
      averageConsulationTime: this.completeProfileDoctorForm.controls["averageConsulationTime"].value,
      averageRating: ((Math.random() * 5) + 1).toFixed(1),
      qualifications: finalQualiObjectsArray
      // doctorID:
    }

    console.log(newData);

    if (localStorage.getItem("role") == "doctor" && speciality && doctorFee && numberOfAppointments && averageConsulationTime) {
      this.submitError = false;
      console.log(newData);
      this.db.collection("Users").doc(localStorage.getItem("uid")).update(newData)
        .then(() => {
          this.submitSuccess = true;
          this.completeProfileDoctorForm.reset();
          setTimeout(()=>{this.router.navigate(['/doctors/dashboard'])},2000);          
        })
    }

    else {
      this.submitError = true
    }
  }

}
