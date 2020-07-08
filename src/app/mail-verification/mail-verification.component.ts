import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRouteSnapshot, Params, ActivatedRoute, RouterLinkActive } from '@angular/router';
import { VerifydoctorService } from '../services/verifydoctor.service';
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
  touched:boolean = false
  // response : {
  //   "MessageId": "3520243c-5554-534c-bb6f-734a3d22648e",
  //   "ResponseMetadata": {
  //     "HTTPHeaders": {
  //       "content-length": "294",
  //       "content-type": "text/xml",
  //       "date": "Wed, 01 Jul 2020 10:32:22 GMT",
  //       "x-amzn-requestid": "fd94acdb-7838-5998-8cba-fbad104efe5a"
  //     },
  //     "HTTPStatusCode": 200,
  //     "RequestId": "fd94acdb-7838-5998-8cba-fbad104efe5a",
  //     "RetryAttempts": 0
  //   }
  // }
  user: firebase.User;
  @Input()
  public alerts: Array<IAlert> = [];
  private backup: Array<IAlert>;
  data: any;
  flsg: false;
  status: Object;
  emailverify: boolean;
  metaData: Object;
  phoneVerified: boolean;
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
            console.log(this.data.telno);
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
      // this.status = res
      console.log(res)
      if(res=="email verified"){
        // console.log("verified")
        this.emailverify = true
      }else{
        console.log("Unverified")
        this.emailverify = false
      }
    })
  }
  // phoneVerify(){
  //   var otp = 731892
  //   this.doctorService.verifyphone(this.user.uid,otp).subscribe(res=>{
  //     console.log(res+"phone")
  //   })
  // }

  _touched(){
    setTimeout(()=>{
      this.touched = true;
 }, 2000);
    
  }

  phoneVerify() {
    // var otp = 731892
    // if(otp==) 
    this.doctorService.verifyphone(this.user.uid,true)
    // this.router.navigate(['/addressverificatoin'])
  }


  phoneOtp() {
    var otp = Math.floor(100000 + Math.random() * 900000)
    var message = "Hello this is your verification code: "+ otp;
    this.doctorService.sendPhoneOtp(this.user.uid,otp).subscribe(res=>{
      this.doctorService.sendOtpText(message,this.data.telno).subscribe(res=>{
        // this.metaData = res
        console.log(res["ResponseMetadata"]["HTTPStatusCode"])
        if (res["ResponseMetadata"]["HTTPStatusCode"]===200){
          this.phoneVerified = true
        }else{
          console.log("error")
          this.phoneVerified = false
        }
      })
    });
  }

}
