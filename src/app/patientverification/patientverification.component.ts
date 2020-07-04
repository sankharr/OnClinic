import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { VerifydoctorService } from '../services/verifydoctor.service';
import { CoreAuthService } from '../core/core-auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-patientverification',
  templateUrl: './patientverification.component.html',
  styleUrls: ['./patientverification.component.scss'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(2000, style({ opacity: 1 }))
      ])
    ])
  ]
})
export class PatientverificationComponent implements OnInit {
  user: firebase.User;
  data: any;
  flag: any;
  mailFlag: any;

  constructor(
    private verify: VerifydoctorService,
    private coreAuth: CoreAuthService,
    private auth: AuthService,
    private db: AngularFirestore
  ) { }

  ngOnInit(): void {
    this.coreAuth.getUserState()    //getting the user data for the homepage
      .subscribe(user => {
        this.user = user;
        this.auth.usersignupDetails(this.user.uid)
        // console.log(this.user)
        var docRef = this.db.collection("Users").doc(this.user.uid);
        docRef.valueChanges()
          .subscribe(result => {
            this.data = result;
            // console.log(this.user.uid)

          })
      })
  }
  sendEmail() {
    var otpCode = '';
    length = 30;
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      otpCode += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    this.verify.sendEmail(this.user.uid, [otpCode, this.user.email]).subscribe(res => {
      console.log(res)
    })
  }

}
