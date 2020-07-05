import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  uid:any;
  result:any;
  lgdis:any[];
  alergies:any[];
  constructor(
    private router:Router,
    private db:AngularFirestore) { }

  ngOnInit(): void {
    this.uid=localStorage.getItem("uid");
    this.db.collection("Users").doc(this.uid).valueChanges()
    .subscribe(output =>{
        this.result=output;
        this.lgdis=this.result.longTermDiseases;
        console.log("result-",this.result.longTermDiseases)
        this.alergies=this.result.allergies;
        console.log("result-",this.result.allergies)
    })
  }
  edit() {
    this.router.navigate(['/patients/edit-profile'])
  }
}
