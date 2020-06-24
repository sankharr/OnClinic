import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { VerifydoctorService } from '../services/verifydoctor.service';
import { CoreAuthService } from '../core/core-auth.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-address-verify',
  templateUrl: './address-verify.component.html',
  styleUrls: ['./address-verify.component.css']
})
export class AddressVerifyComponent implements OnInit {
  user: firebase.User;
  data: any;
  constructor(
    private router: Router,
    private _router: ActivatedRoute,
    private doctorService: VerifydoctorService,
    private coreAuth: CoreAuthService,
    private db: AngularFirestore
  ) { }

  ngOnInit(): void {
    this.coreAuth.getUserState()    //getting the user data for the homepage
      .subscribe(user => {
        this.user = user;
        // console.log(this.user)
        var docRef = this.db.collection("Users").doc(this.user.uid);
        docRef.valueChanges()
          .subscribe(result => {
            this.data = result;
            console.log(result)
          })
      })
  }

  sendToken(){
    var otp = Math.floor(1000000 + Math.random() * 9000000)
    this.doctorService.sendToken(this.user.uid,otp,this.user.displayName).subscribe(res=>{
      console.log(res)
    })
  }

}
