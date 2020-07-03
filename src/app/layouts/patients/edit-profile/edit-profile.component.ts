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
  UpdateProfileForm: FormGroup;

  foods = ["Vegitarian", "Non-vegitarian"];
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
    this.UpdateProfileForm = this._formbuilder.group({
      name: ["", Validators.required],
      address: ["", Validators.required],
      nic: ["", Validators.required],
      contact: ["", Validators.required],
      email: ["", Validators.required],
      height: ["", Validators.required],
      weight: ["", Validators.required],
      food: ["", Validators.required],
    });

  }
  add1() {
    this.viewcol1 = true;
  }
  add2() {
    this.viewcol2 = true;
  }
}
