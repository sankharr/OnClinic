import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-doctorprofile',
  templateUrl: './edit-doctorprofile.component.html',
  styleUrls: ['./edit-doctorprofile.component.css']
})
export class EditDoctorprofileComponent implements OnInit {
  uid:any;
  result:any;
  updateProfileForm: FormGroup;

  submitError: boolean = false;
  submitSuccess: boolean = false;

  constructor(
    private _formbuilder: FormBuilder,
    private db: AngularFirestore,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.updateProfileForm = this._formbuilder.group({
      name: ["", Validators.required],
      address: ["", Validators.required],
      email: ["", Validators.required],
      telno: ["", Validators.required],
      age: ["", Validators.required],
      
    });
    this.uid=localStorage.getItem("uid");
    this.db.collection("Users").doc(this.uid).valueChanges()
    .subscribe(output =>{
        this.result=output;
        console.log("result-",this.result)
        this.setResult(this.result)
    })
    
  }

  setResult(value){
    this.updateProfileForm.setValue({
      name:value.name,
      address:value.address,
      email: value.email,
      telno:value.telno,
      age:value.age,
      
    })
  }

  back() {
    this.router.navigate(['/doctors/profile'])
  }

  updateProfileDoctor(){
    var upload = {
      name:this.updateProfileForm.controls["name"].value,
      address:this.updateProfileForm.controls["address"].value,
      email:this.updateProfileForm.controls["email"].value,
      telno:this.updateProfileForm.controls["telno"].value,
      age:this.updateProfileForm.controls["age"].value,
      
    }
    this.db.collection("Users").doc(this.uid).update(upload)
    .then(()=>{
      console.log("successfully updated")
      this.router.navigate(['/doctors/profile']);
      
    })

    
  }



}
