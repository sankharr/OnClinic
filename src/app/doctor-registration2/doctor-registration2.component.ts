import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { toPath } from 'lodash';
import { pathToFileURL } from 'url';
import { HttpClient } from '@angular/common/http';

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
  fb;

  selectedProPic: File = null;
  uploadProPicProgress: Observable<number>;
  taskProPic: AngularFireUploadTask;
  uid: any;
  downloadURL: Observable<string>;

  constructor(
    private _formbuilder: FormBuilder,
    private db: AngularFirestore,
    private router: Router,
    private afStorage: AngularFireStorage,
    private http: HttpClient
  ) { }

  ngOnInit(): void {

    this.uid = localStorage.getItem("uid");

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
      gender: ["", Validators.required],
    });


    // this.db.collection("system_variables").doc("system_variables").snapshotChanges()
    //   .subscribe(result => {
    //     console.log("latest_doctorID - ", result.payload.get("last_doctorID"));
    //     this.last_doctorID = result.payload.get("last_doctorID");
    //     this.generateNewDoctorID(this.last_doctorID.toString());
    //   })

    // this.generateNewDoctorID();
  }

  addQualifications(qualifi) {
    this.qualificationsArray.push(qualifi);
    this.completeProfileDoctorForm.controls['eduQualifications'].reset()
  }

  removeQualifications(val) {
    var index = this.qualificationsArray.indexOf(val);
    this.qualificationsArray.splice(index, 1);
    console.log("from removeQualifications, val index qualificationsArray - ", val, index, this.qualificationsArray)
  }

  updateProfileDoctor() {

    this.uploadProPic();

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
      gender: this.completeProfileDoctorForm.controls["gender"].value,
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
          setTimeout(() => { this.router.navigate(['/doctors/dashboard']) }, 2000);
        })
    }

    else {
      this.submitError = true
    }
  }

  detectFilesProPic(event) {
    this.selectedProPic = event.target.files[0];
  }

  // uploadDefaultProPic() {
  //   if(this.selectedProPic == null)
  // }

  uploadProPic() {


    // var file: File;
    if (this.selectedProPic == null) {                                              //uploading default-avatar pro pic
      this.http.get('./assets/img/default-avatar.jpg', { responseType: 'blob' })
        .subscribe(data => {
          const file = data;
          const filePath = `${this.uid}/propic`;
          const fileRef = this.afStorage.ref(filePath);
          this.taskProPic = this.afStorage.upload(filePath, file);
          this.uploadProPicProgress = this.taskProPic.percentageChanges();

          this.taskProPic
            .snapshotChanges()
            .pipe(
              finalize(() => {
                this.downloadURL = fileRef.getDownloadURL();
                this.downloadURL.subscribe(url => {
                  if (url) {
                    this.fb = url;
                  }
                  console.log("url from finalize - ", this.fb);
                  this.db.collection('Users').doc(this.uid).update({
                    proPicURL: this.fb,
                  })
                  setTimeout(() => {
                    this.uploadProPicProgress = null;
                  }, 500)
                });
              }),
            )
            .subscribe(url => {
              if (url) {
                console.log("url from subscribe - ", url);
              }
            });
        });
    }
    else {                                                              //uploading user selected pro pic
      const file = this.selectedProPic;
      const filePath = `${this.uid}/propic`;
      const fileRef = this.afStorage.ref(filePath);
      this.taskProPic = this.afStorage.upload(filePath, file);
      this.uploadProPicProgress = this.taskProPic.percentageChanges();

      this.taskProPic
        .snapshotChanges()
        .pipe(
          finalize(() => {
            this.downloadURL = fileRef.getDownloadURL();
            this.downloadURL.subscribe(url => {
              if (url) {
                this.fb = url;
              }
              console.log("url from finalize - ", this.fb);
              this.db.collection('Users').doc(this.uid).update({
                proPicURL: this.fb,
              })
              setTimeout(() => {
                this.uploadProPicProgress = null;
              }, 500)
            });
          }),
        )
        .subscribe(url => {
          if (url) {
            console.log("url from subscribe - ", url);
          }
        });
    }

  }

}
