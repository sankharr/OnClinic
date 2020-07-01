import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { finalize, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
// import { setTimeout } from 'timers';

class Operation {
  operationDate: any;
  operationName: string; 
}

@Component({
  selector: 'app-patient-registration2',
  templateUrl: './patient-registration2.component.html',
  styleUrls: ['./patient-registration2.component.css']
})
export class PatientRegistration2Component implements OnInit {

  completeProfilePatientForm: FormGroup;

  longTermDiseasesList = ["", "ALS", "Alzheimer's Disease", "Arthritis", "Asthma", "Cancer", "Chronic kidney disease", "Dementia", "Depression", "Diabetes", "Eating Disorders", "Heart Disease", "Migraine", "Obesity", "Oral Health", "Osteoporosis", "Parkinson’s disease"]
  allergiesList = ["", "Food Allergy", "Skin Allergy", "Dust Allergy", "Insect Sting Allergy", "Pet Allergy", "Eye Allergy", "Mold Allergy", "Sinus Infection", "Cockroach Allergy"]
  selectedLTDs = [];
  selectedAllergies = [];
  tempOperationsList = [];
  finalOperationsList = [];

  last_doctorID: any;
  submitError: boolean = false;
  submitSuccess: boolean = false;
  ref: any;
  // task: any;
  uploadProgress: Observable<number>;
  downloadURL: Observable<string>;
  selectedFile: File = null;
  uid: any;
  fb;
  tempFileArray = [];
  tempArray = [];

  task: AngularFireUploadTask;

  percentage: Observable<number>;
  snapshot: Observable<any>;
  finalReportsList = [];
  // downloadURL: string;
  // selectedFile: File;
  // tempArray: any;

  constructor(
    private _formbuilder: FormBuilder,
    private db: AngularFirestore,
    private router: Router,
    private afStorage: AngularFireStorage
  ) { }

  ngOnInit(): void {

    this.completeProfilePatientForm = this._formbuilder.group({
      weight: ["", Validators.required],
      height: ["", Validators.required],
      longTermDiseases: ["", Validators.required],
      newLTDisease: ["", Validators.required],
      allergies: ["", Validators.required],
      newAllergy: ["", Validators.required],
      operationDate: ["", Validators.required],
      operationName: ["", Validators.required],
      reportDate: ["", Validators.required],
      reportName: ["", Validators.required],
    });

    this.uid = localStorage.getItem("uid");

  }

  updateProfilePatient() {

    var i;

    // var speciality = this.completeProfilePatientForm.controls["speciality"].value;
    // var doctorFee = this.completeProfilePatientForm.controls["doctorFee"].value;
    // var numberOfAppointments = this.completeProfilePatientForm.controls["numberOfAppointments"].value;
    // var averageConsulationTime = this.completeProfilePatientForm.controls["averageConsulationTime"].value;

    var newData = {
      weight: this.completeProfilePatientForm.controls["weight"].value,
      height: this.completeProfilePatientForm.controls["height"].value,
      longTermDiseases: this.selectedLTDs,
      allergies: this.selectedAllergies,
      operations: this.finalOperationsList   //<--------------assign this as an object   
      // doctorID:
    }

    if (localStorage.getItem("role") == "patient") {
      // this.submitError = false;
      console.log(newData);
      this.db.collection("Users").doc(this.uid).update(newData)
        .then(() => {
          this.submitSuccess = true;
          this.completeProfilePatientForm.reset();
          setTimeout(() => { this.router.navigate(['/patients/dashboard']) }, 2000);
        })
      
     
      // for(i = 0; i < this.finalOperationsList.length; i){
      //   this.db.collection('Users').doc(this.uid).collection('Operations').doc(`${this.finalOperationsList[i][0]}_${this.finalOperationsList[i][1]}`).set({
      //     operationDate: this.finalOperationsList[i][0],
      //     operationName: this.finalOperationsList[i][1]
      //   })
      // }
      
    }

    else {
      this.submitError = true
    }
  }

  selectedDisease(event) {
    console.log("selected disease - ", event.target.value);
    if (event.target.value == "Other") {

    }
    else {
      this.selectedLTDs.push(event.target.value);
      setTimeout(() => { this.completeProfilePatientForm.controls['longTermDiseases'].reset() }, 400)
    }
  }

  newLTDAddList(option) {
    console.log("selected disease DD - ", option);
    if(option == "" || option == null){
     
    }
    else{
      this.selectedLTDs.push(option);
    }
    this.completeProfilePatientForm.controls['longTermDiseases'].reset()
    this.completeProfilePatientForm.controls['newLTDisease'].reset()  
    // setTimeout(() => { this.completeProfilePatientForm.controls['longTermDiseases'].reset() }, 200)
    // this.completeProfilePatientForm.controls['longTermDiseases'].reset();
  }

  selectedAllergy(event) {
    console.log("selected allergy - ", event.target.value);
    if (event.target.value == "Other") {

    }
    else {
      this.selectedAllergies.push(event.target.value);
      setTimeout(() => { this.completeProfilePatientForm.controls['allergies'].reset() }, 400)
    }
  }

  newAllergyAddList(option) {
    console.log("selected disease DD - ", option);
    if(option == "" || option == null){
     
    }
    else{
      this.selectedAllergies.push(option);
    }
    this.completeProfilePatientForm.controls['allergies'].reset()
    this.completeProfilePatientForm.controls['newAllergy'].reset()  
    // setTimeout(() => { this.completeProfilePatientForm.controls['longTermDiseases'].reset() }, 200)
    // this.completeProfilePatientForm.controls['longTermDiseases'].reset();
  }

  addOperation(opDate,opName){
    console.log(opDate," ++  ",opName);
    // var tempOperation = [];
    // tempOperation.push(opDate,opName);
    let operationTemp = {
      operationDate: opDate,
      operationName: opName
    }             //<--------------assign parameters to an object
    // operationTemp.operationDate = opDate;
    // operationTemp.operationName = opName;
    this.finalOperationsList.push(operationTemp);
    this.completeProfilePatientForm.controls['operationDate'].reset()
    this.completeProfilePatientForm.controls['operationName'].reset()      
  }

  addFilesSessionStorage(event){
    const file = event.target.files[0];
    // var tempArray = []
    var retrievedData = localStorage.getItem("tempFileArray");
    console.log("retrievedData - ",retrievedData); 

    if (retrievedData.length != 0){
      this.tempArray = JSON.parse(retrievedData)
      console.log("parsed tempArray - ",this.tempArray); 
    }
   
    this.tempArray.push[file]
    localStorage.setItem("tempFileArray",JSON.stringify(this.tempArray));
    console.log("latest status of tempArray - ",this.tempArray); 
    // const file = event.target.files[0];
    // this.tempFileArray.push[file]
    // sessionStorage.setItem()
    console.log(event.target.files[0].name," added to tempFileArray")
  }

  // filesUpload(){
  //   console.log("Ready to upload - ",this.tempFileArray)
  //   var i = 0;
  //   for (i = 0; i < this.tempFileArray.length; i++ ) {
  //     this.upload(this.tempFileArray[i]);
  //     console.log("file ",i," uploaded!")
  //   }
  // }

  detectFiles(event){
    this.selectedFile = event.target.files[0];
  }

  addReport(rDate,rName){
    console.log(rDate," ++  ",rName);
    var tempReport = [];
    tempReport.push(rDate,rName);
    this.finalReportsList.push(tempReport);    
  }


  upload(repDate,repName) {

    // this.addReport(repDate,repName);
  
    // var n = Date.now();
    const file = this.selectedFile;
    const filePath = `${this.uid}/${repDate}_${repName}`;
    const fileRef = this.afStorage.ref(filePath);
    this.task = this.afStorage.upload(filePath, file);
    this.uploadProgress = this.task.percentageChanges();

    this.task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              this.fb = url;
            }
            console.log("url from finalize - ", this.fb);
            this.db.collection('Users').doc(this.uid).collection("Reports").doc(`${repDate}_${repName}`).set({
              reportDate: repDate,
              reportName: repName,
              reportURL:this.fb
            })
            setTimeout(()=>{
              this.completeProfilePatientForm.controls['reportDate'].reset();
              this.completeProfilePatientForm.controls['reportName'].reset();
              this.uploadProgress = null;
              this.addReport(repDate,repName);
            },500)
          });
        }),
      )
      .subscribe(url => {
        if (url) {
          console.log("url from subscribe - ", url);
        }
      });

      
  }

  deleteReport(repDate,repName) {

    let docRef = this.db.collection('Users').doc(this.uid).collection('Reports').doc(`${repDate}_${repName}`);

    docRef.valueChanges()
    .subscribe(docValues =>{
      console.log("url of the reported needed to be deleted - ",docValues)
    })

  }
  

}
