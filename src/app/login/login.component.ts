import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CoreAuthService } from '../core/core-auth.service'
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../services/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

// role: any
export class LoginComponent implements OnInit {
  focus;
  focus1;

  //related to email password login
  authError: any
  userk: firebase.User

  role: any

  constructor(
    private auth: AuthService,
    private coreAuth: CoreAuthService,
    private router: Router,
    private db: AngularFirestore
  ) { }

  ngOnInit() {
    //related to email password login
    this.auth.eventAuthErrors$.subscribe(data => {
      this.authError = data;
    })
  }

  //related to email password login
  login(frm) {
    this.auth.login(frm.value.email, frm.value.password)
  }

  googleLog() {
    // this.coreAuth.googleLogin();
    // this.auth.getUserState()
    //   .subscribe(user => {
    //     this.userk = user;
    //     console.log(user.uid)
    //     var docref = this.db.collection('Users').doc(this.userk.uid);
    //     docref.snapshotChanges()
    //       .subscribe(output => {
    //         var result = output.payload.data();
    //         console.log(result);
    //       })
    //   })

    this.coreAuth.googleLogin()
      .then(() => {
        this.coreAuth.getUserState()
          .subscribe(user => {
            this.userk = user;
            console.log("user doc id - ",user.uid)
            localStorage.setItem("uid",user.uid)
            var docref = this.db.collection('Users').doc(this.userk.uid);
            docref.snapshotChanges()
              .subscribe(output => {
                this.role = output.payload.get("role");
                console.log("role - ", this.role);
                localStorage.setItem("role",this.role);
                if (this.role == "patient") {
                  this.router.navigate(['/patients/dashboard']);
                }
                if (this.role == "doctor") {
                  this.router.navigate(['/doctors/dashboard']);
                }
              })


          })
        // console.log("fdfdfd ", this.userk.uid)
        // var docref = this.db.collection('Users').doc(this.userk.uid);
        // docref.snapshotChanges()
        //   .subscribe(output => {
        //     var result = output.payload.data();
        //     console.log(result);
        //   })
        // this.router.navigate(['/']);
      })
    // return this.router.navigate(['/']);
  }

}
