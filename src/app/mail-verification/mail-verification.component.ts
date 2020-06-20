import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRouteSnapshot, Params, ActivatedRoute, RouterLinkActive } from '@angular/router';
import { VerifydoctorService } from '../services/verifydoctor.service';
import * as $ from 'jquery';
import { CoreAuthService } from '../core/core-auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';

// import {ActivatedRouteSnapshot} from ''

export interface IAlert {
  id: number;
  type: string;
  position?: string;
  strong?: string;
  message: string;
  icon?: string;
}

@Component({
  selector: 'app-mail-verification',
  templateUrl: './mail-verification.component.html',
  styleUrls: ['./mail-verification.component.css']
})
export class MailVerificationComponent implements OnInit {
  user: firebase.User;
  @Input()
  public alerts: Array<IAlert> = [];
  private backup: Array<IAlert>;
  data: any;
  flsg: false;
  // flag: true;

  constructor(
     private http: HttpClient,
    private router: Router,
    private _router: ActivatedRoute,
    private doctorService: VerifydoctorService,
    private coreAuth: CoreAuthService,
    private db: AngularFirestore) {
    this.alerts.push({
      id: 1,
      type: 'success',
      strong: 'hooray!',
      position: 'center',
      message: 'Your email successfuly verified!',
      icon: 'ni ni-like-2'
    });
    this.backup = this.alerts.map((alert: IAlert) => Object.assign({}, alert));
  }
  ngOnInit(): void {
    var id = this._router.snapshot.queryParams['key'];
    var code = this._router.snapshot.queryParams['secret']
    console.log(id, code);

    this.coreAuth.getUserState()    //getting the user data for the homepage
      .subscribe(user => {
        this.user = user;
        // console.log(this.user)
        var docRef = this.db.collection("Users").doc(this.user.uid);
        docRef.valueChanges()
          .subscribe(result => {
            this.data = result;
            console.log(result);
            // console.log(user.PhoneNumberVerified+"PhoneNumberVerified ")
            this.contunue(id,user.uid,code)
          })
      })

  }

  contunue(id, uid, code) {
    // if (id == uid) {
    //   console.log('Same user!')
    // }
    // else{
    //   console.log('Differ user')
    // }
    this.verifyEmail(uid, code)
  }
  verifyEmail(id, code) {
    console.log('verify')
    this.doctorService.verifyEmail(id, code).subscribe(res => {
      console.log(res)
    })
  }
  // phoneVerify(){
  //   var otp = 731892
  //   this.doctorService.verifyphone(this.user.uid,otp).subscribe(res=>{
  //     console.log(res+"phone")
  //   })
  // }

  phoneVerify() {
    // var otp = 731892
    // if(otp==) 
    this.doctorService.verifyphone(this.user.uid,true)
    this.router.navigate(['/addressverificatoin'])
  }


  phoneOtp() {
    var otp = Math.floor(100000 + Math.random() * 900000)
    this.doctorService.sendPhoneOtp(this.user.uid, otp).subscribe(res => {
      console.log(res)
    })
  }

  loadSomething() {
    this.http.get('https://www.mocky.io/v2/5ab2663b2e00003d044cc144?mocky-delay=1000ms')
      .subscribe(data => {
        console.log('Yo', data);
      });
  }
  // changeFlag(){
  //   this.flag = false
  // }

}
