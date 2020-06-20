// import * as $ from 'jquery';
import { VerifydoctorService } from './../services/verifydoctor.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CoreAuthService } from '../core/core-auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import * as $ from 'jquery';

@Component({
  selector: 'app-doctorverification',
  templateUrl: './doctorverification.component.html',
  styleUrls: ['./doctorverification.component.css']
})
export class DoctorverificationComponent implements OnInit {

  user: firebase.User;
  data: any;
  flag: any;
  mailFlag:any;

  constructor(
    private auth: AuthService,
    private verify: VerifydoctorService,
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
          this.verifyDoctor()
          console.log(this.data.slmcVerified+" :Slmc verification status")
        })
    })
    // $(document).ready(function(){
    //   $("#flip").click(function(){
    //     $("#panel").slideDown("slow");
    //   });
    // });
  }

  verifyDoctor(){
    this.verify.verifyDoctor(this.user.uid,this.data).subscribe(res=>{
      console.log(res)  
    })
  }
  sendEmail(){
    // $(document).ready(function(){
    //   $("#slmcok").click(function(){
    //     $("#slmcok_div").fadeOut();
    //   });
    // });

    // this.mailFlag = true;
    // this.verify.sendEmail(this.user.uid,this.data).subscribe(res=>{
    //   console.log(res)
    // })
    // this.hide();

    var otpCode           = '';
    length = 30;
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      otpCode += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    // console.log(otpCode)
    this.verify.sendEmail(this.user.uid,[otpCode,this.user.email]).subscribe(res=>{
      console.log(res)
    })
  }
  
  // hide(){
  //   console.log("Jq called")
  //   $(document).ready(function(){
  //     $("#slmcok").click(function(){
  //       $("#slmcok_div").fadeOut();
  //     })
  //   })
  // }

  onSubmit(otp){
    // if(this.data.OTP === )
    console.log(otp)
  }






}
