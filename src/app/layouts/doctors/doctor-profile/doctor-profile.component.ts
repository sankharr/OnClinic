import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-doctor-profile',
  templateUrl: './doctor-profile.component.html',
  styleUrls: ['./doctor-profile.component.css']
})
export class DoctorProfileComponent implements OnInit {
  userId: any;
  result: any;
  

  constructor(
    private db: AngularFirestore
  ) { }

  ngOnInit(): void {
    this.userId = localStorage.getItem("uid");
    this.db.collection("Users").doc(this.userId).valueChanges()
    .subscribe(output=>{
      this.result = output;
      console.log(this.result);
    })
  }

}
