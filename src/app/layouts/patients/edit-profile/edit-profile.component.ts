import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  uid: any;
  result: any;
  lgdis: any[];
  alergies: any[];
  operations: any[];
  updateBasicProfileForm: FormGroup;
  updateDAProfileForm: FormGroup;
  updateOperationForm: FormGroup;


  foods = ["Vegetarian", "Non - Vegetarian"];
  longTermDiseasesList = ["", "ALS", "Alzheimer's Disease", "Arthritis", "Asthma", "Cancer", "Chronic kidney disease", "Dementia", "Depression", "Diabetes", "Eating Disorders", "Heart Disease", "Migraine", "Obesity", "Oral Health", "Osteoporosis", "Parkinson’s disease"]
  allergiesList = ["", "Food Allergy", "Skin Allergy", "Dust Allergy", "Insect Sting Allergy", "Pet Allergy", "Eye Allergy", "Mold Allergy", "Sinus Infection", "Cockroach Allergy"]
  viewcol1: boolean = false;
  viewcol2: boolean = false;
  submitError: boolean = false;
  submitSuccess: boolean = false;
  selectedLTDs = [];
  selectedAllergies = [];
  tempOperationsList = [];
  finalOperationsList = [];

  constructor(
    private _formbuilder: FormBuilder,
    private db: AngularFirestore,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.updateBasicProfileForm = this._formbuilder.group({
      name: ["", Validators.required],
      address: ["", Validators.required],
      nic: ["", Validators.required],
      contact: ["", Validators.required],
      email: ["", Validators.required],
      height: ["", Validators.required],
      weight: ["", Validators.required],
      food: ["", Validators.required],
      // bloodGroup: ["", Validators.required],
    });
    this.updateDAProfileForm = this._formbuilder.group({
      longTermDiseases: ["", Validators.required],
      newLTDisease: ["", Validators.required],
      allergies: ["", Validators.required],
      newAllergy: ["", Validators.required],

    });
    this.updateOperationForm = this._formbuilder.group({
      operationDate: ["", Validators.required],
      operationName: ["", Validators.required],
    });
    this.uid = localStorage.getItem("uid");
    this.db.collection("Users").doc(this.uid).valueChanges()

      .subscribe(output => {
        this.result = output;
        this.lgdis = this.result.longTermDiseases;
        console.log("result-", this.result.longTermDiseases)
        this.alergies = this.result.allergies;
        console.log("result-", this.result.allergies)
        this.operations = this.result.operations;
        console.log("result-", this.result.operations)
        this.setResult(this.result)
      })

  }
  setResult(value) {
    this.updateBasicProfileForm.setValue({
      name: value.name,
      address: value.address,
      nic: value.nic,
      contact: value.telno,
      email: value.email,
      height: value.height,
      weight: value.weight,
      food: value.dietaryRestrictions,
    })
  }

  selectedDisease(event) {
    console.log("selected disease - ", event.target.value);
    if (event.target.value == "Other") {

    }
    else {
      this.lgdis.push(event.target.value);
      setTimeout(() => { this.updateDAProfileForm.controls['longTermDiseases'].reset() }, 400)
    }
  }

  newLTDAddList(option) {
    console.log("selected disease DD - ", option);
    if (option == "" || option == null) {

    }
    else {
      this.lgdis.push(option);
    }
    this.updateDAProfileForm.controls['longTermDiseases'].reset()
    this.updateDAProfileForm.controls['newLTDisease'].reset()
  }

  selectedAllergy(event) {
    console.log("selected allergy - ", event.target.value);
    if (event.target.value == "Other") {

    }
    else {
      this.alergies.push(event.target.value);
      setTimeout(() => { this.updateDAProfileForm.controls['allergies'].reset() }, 400)
    }
  }

  newAllergyAddList(option) {
    console.log("selected disease DD - ", option);
    if (option == "" || option == null) {

    }
    else {
      this.alergies.push(option);
    }
    this.updateDAProfileForm.controls['allergies'].reset()
    this.updateDAProfileForm.controls['newAllergy'].reset()
  }

  addOperation(opName, opDate) {
    console.log(opDate, " ++  ", opName);
    let operationTemp = {
      operationDate: opDate,
      operationName: opName
    }             
    this.operations.push(operationTemp);
    this.updateOperationForm.controls['operationDate'].reset()
    this.updateOperationForm.controls['operationName'].reset()
  }
  back() {
    this.router.navigate(['/patients/profile'])
  }
  updateProfilePatient() {
    var weight = this.updateBasicProfileForm.controls["weight"].value;
    var height = this.updateBasicProfileForm.controls["height"].value;
    var bmi = weight / Math.pow((height / 100), 2);
    var upload = {
      name: this.updateBasicProfileForm.controls["name"].value,
      address: this.updateBasicProfileForm.controls["address"].value,
      telno: this.updateBasicProfileForm.controls["contact"].value,
      email: this.updateBasicProfileForm.controls["email"].value,
      height: this.updateBasicProfileForm.controls["height"].value,
      weight: this.updateBasicProfileForm.controls["weight"].value,
      bmi: bmi.toFixed(1)
    }
    this.db.collection("Users").doc(this.uid).update(upload)
      .then(() => {
        console.log("successfully updated")
      })

  }
  updateDAProfilePatient() {
    var upload = {
      longTermDiseases: this.lgdis,
      allergies: this.alergies
    }
    this.db.collection("Users").doc(this.uid).update(upload)
      .then(() => {
        console.log("successfully updated")
      })
  }
  updateOperationPatient() {
    var upload = {
      operations: this.operations,
    }
    this.db.collection("Users").doc(this.uid).update(upload)
      .then(() => {
        console.log("successfully updated")
      })
  }
}
