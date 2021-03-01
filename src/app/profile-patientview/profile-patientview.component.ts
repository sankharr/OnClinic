import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-profile-patientview',
  templateUrl: './profile-patientview.component.html',
  styleUrls: ['./profile-patientview.component.css']
})
export class ProfilePatientviewComponent implements OnInit {
  userId: any;
  result: any;
  docId: any;
  

  constructor(
    private db: AngularFirestore

  ) { }


  ngOnInit(): void {
    this.docId=localStorage.getItem("viewedDocId");
    console.log("viewedDocId",this.docId);

    // this.userId = localStorage.getItem("uid");
    this.db.collection("Users").doc(this.docId).valueChanges()
    .subscribe(output=>{
      this.result = output;
      console.log(this.result);
      const sr = this.result.averageRating ;
      // console.log(this.sr);

    }) 
  }

}
