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
  touched:boolean = false
  user: firebase.User;
  send:boolean=true;
  sent:boolean=false;
  // div3:boolean=true;
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
// uid,token,name,address
  sendToken(){
    var otp = Math.floor(1000000 + Math.random() * 9000000)
    this.doctorService.sendToken(this.user.uid,otp,this.user.displayName,['address']).subscribe(res=>{
      console.log(res)
    })
  }

  verifyToken(){
    this.doctorService.verifyAddress(this.user.uid);
    this.router.navigate(['/welcomepage'])

  }
_touched(){
  setTimeout(()=>{
    this.touched = true;
}, 2000);
  
}

}
