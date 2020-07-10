import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.css']
})
export class PatientDashboardComponent implements OnInit {
  userid: string;
  uid:any;
  result:any;

  constructor(public auth:AuthService,
              private router:Router,
              private db:AngularFirestore) { 
  }

  ngOnInit(): void {
    this.auth.getUserState().subscribe(res=>{
      this.userid = res.uid
      this.auth.updateLastlogin(this.userid)
    })
    this.uid=localStorage.getItem("uid");
    this.db.collection("Users").doc(this.uid).valueChanges()
    .subscribe(output =>{
        this.result=output;
    })
  }
  joinlc() {
    this.router.navigate(['/patients/waiting-room'])
  }

}

