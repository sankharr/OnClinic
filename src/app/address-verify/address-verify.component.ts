import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { VerifydoctorService } from '../services/verifydoctor.service';
import { CoreAuthService } from '../core/core-auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { trigger, transition, animate, style } from '@angular/animations';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-address-verify',
  templateUrl: './address-verify.component.html',
  styleUrls: ['./address-verify.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(2000, style({ opacity: 1 }))
      ])
    ])
  ]
})
export class AddressVerifyComponent implements OnInit {
  codeSubmission_form = new FormGroup({
    code: new FormControl(''),
  });
  touched:boolean = false
  user: firebase.User;
  send:boolean=true;
  sent:boolean=false;
  // div3:boolean=true;
  data: any;
  verificationCode: number;
  isAddressverified: boolean = true;
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

            console.log(this.data.addressTokenVerified)
          })
      })
  }
// uid,token,name,address
  sendToken(){
    var otp = Math.floor(1000000 + Math.random() * 9000000)
    this.doctorService.sendToken(this.user.uid,otp,this.user.displayName,['address']).subscribe(res=>{
      // console.log(res)
      this.verificationCode = otp
      console.log(this.verificationCode,otp)
    })
  }

  verifyToken(){
    var code = this.codeSubmission_form.value["code"];
    console.log(this.verificationCode)
    // this.doctorService.verifyAddress(this.user.uid);
    // this.router.navigate(['/welcomepage'])
    if (code == this.verificationCode) {
      this.doctorService.verifyAddress(this.user.uid);
      this.router.navigate(['/welcomepage'])

    }else{
      console.log("Invalid code")
      this.isAddressverified = false
    }

  }
_touched(){
  setTimeout(()=>{
    this.touched = true;
}, 2000);
  
}

}
