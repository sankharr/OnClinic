import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.css']
})
export class AdminSettingsComponent implements OnInit {

  @ViewChild("myDiv", { static: true })
  addModeratorsForm: FormGroup;
  allModerators: any[];

  // Plotly: any;
  
  

  constructor(
    private _formbuilder: FormBuilder,
    private db: AngularFirestore,
    private router: Router,
    private afAuth: AngularFireAuth,
  ) { }

  ngOnInit(): void {

    // this.barChart();

    this.addModeratorsForm = this._formbuilder.group({
      name: ["", Validators.required],
      telno: ["", Validators.required],
      email: ["", Validators.required],
    });

    this.db.collection('Users', ref => ref.where('role', '==', 'moderator')).valueChanges()
      .subscribe(output => {
        this.allModerators = output;
        console.log(this.allModerators)
      })

     

  }

  


  createModerator() {

    var name = this.addModeratorsForm.controls["name"].value;
    var email = this.addModeratorsForm.controls["email"].value;
    var telno = this.addModeratorsForm.controls["telno"].value;
    console.log(name,email,telno);

    this.afAuth.createUserWithEmailAndPassword(email, "123456")
      .then(userCredential => {
        // this.newUser = user;
        // console.log("uid in createUser - ",userCredential.user.uid)
        localStorage.setItem("uid", userCredential.user.uid);        
        this.db.collection('Users').doc(userCredential.user.uid).set({
          name: name,
          email: email,
          telno: telno,
          role: 'moderator',
          proPicURL: "https://firebasestorage.googleapis.com/v0/b/onclinic-dd11a.appspot.com/o/0oXHRomTcXfDvFEn0CzbZHkSwx82%2Fpropic?alt=media&token=df13c48e-28d2-47a7-b614-39d31e07cec4"
        })
      })
    
    this.addModeratorsForm.reset()

   
  }

}
