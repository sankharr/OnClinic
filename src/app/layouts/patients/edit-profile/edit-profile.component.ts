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
  uid:any;
  result:any;
  lgdis:any[];
  alergies:any[];
  operations:any[];
  updateProfileForm: FormGroup;

  foods = ["Vegitarian", "Non-vegitarian"];
  longTermDiseasesList = ["", "ALS", "Alzheimer's Disease", "Arthritis", "Asthma", "Cancer", "Chronic kidney disease", "Dementia", "Depression", "Diabetes", "Eating Disorders", "Heart Disease", "Migraine", "Obesity", "Oral Health", "Osteoporosis", "Parkinson’s disease"]
  allergiesList = ["", "Food Allergy", "Skin Allergy", "Dust Allergy", "Insect Sting Allergy", "Pet Allergy", "Eye Allergy", "Mold Allergy", "Sinus Infection", "Cockroach Allergy"]
  viewcol1: boolean = false;
  viewcol2: boolean = false;
  submitError: boolean = false;
  submitSuccess: boolean = false;

  constructor(
    private _formbuilder: FormBuilder,
    private db: AngularFirestore,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.updateProfileForm = this._formbuilder.group({
      name: ["", Validators.required],
      address: ["", Validators.required],
      nic: ["", Validators.required],
      contact: ["", Validators.required],
      email: ["", Validators.required],
      height: ["", Validators.required],
      weight: ["", Validators.required],
      food: ["", Validators.required],
    });
    this.uid=localStorage.getItem("uid");
    this.db.collection("Users").doc(this.uid).valueChanges()

    .subscribe(output =>{
        this.result=output;
        this.lgdis=this.result.longTermDiseases;
        console.log("result-",this.result.longTermDiseases)
        this.alergies=this.result.allergies;
        console.log("result-",this.result.allergies)
        this.operations=this.result.operations;
        console.log("result-",this.result.operations)
        this.setResult(this.result)
    })

  }
  setResult(value){
    this.updateProfileForm.setValue({
      name:value.name,
      address:value.address,
      nic:"966623548v",
      contact:value.telno,
      email: value.email,
      height: value.height,
      weight: value.weight,
      food: "Vegitarian",
      long:value.lgdis
    })
  }
  // add1() {
  //   this.viewcol1 = true;
  // }
  // add2() {
  //   this.viewcol2 = true;
  // }
  back() {
    this.router.navigate(['/patients/profile'])
  }
  updateProfilePatient(){
    var weight= this.updateProfileForm.controls["weight"].value;
    var height= this.updateProfileForm.controls["height"].value;
    var bmi = weight / Math.pow((height/100),2);
    var upload = {
      name:this.updateProfileForm.controls["name"].value,
      address:this.updateProfileForm.controls["address"].value,
      telno:this.updateProfileForm.controls["contact"].value,
      email:this.updateProfileForm.controls["email"].value,
      height:this.updateProfileForm.controls["height"].value,
      weight:this.updateProfileForm.controls["weight"].value,
      bmi: bmi.toFixed(1) 
    }
    this.db.collection("Users").doc(this.uid).update(upload)
    .then(()=>{
      console.log("successfully updated")
      this.router.navigate(['/patients/profile'])
    })
    
  }
}
