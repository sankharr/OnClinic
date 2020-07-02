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
  constructor(
    private router:Router,
    private db:AngularFirestore) { }

  ngOnInit(): void {
    this.uid=localStorage.getItem("uid");
    this.db.collection("Users").doc(this.uid).valueChanges()
    .subscribe(output =>{
        this.result=output;
        console.log("result-",this.result)
    })
  }
  edit() {
    this.router.navigate(['/patients/edit-profile'])
  }
}
