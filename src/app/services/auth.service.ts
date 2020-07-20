import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { auth } from 'firebase/app';
import { switchMap } from 'rxjs/operators';
import { User } from './user.model';             //changed here
// import { User } from './user';
import * as firebase from 'firebase/app';

// interface User {
//   uid:string;
//   email: string;
//   photoURL?: string;
//   displayName?: string;
//   favoriteColor?: string;
// }

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //related to email password login
  private eventAuthError = new BehaviorSubject<string>("");
  eventAuthErrors$ = this.eventAuthError.asObservable();
  newUser: any;

  //related to google login
  user$: Observable<User>;
  // user: Observable<User>;
  role: any;
  last_doctorID: any;
  last_patientID: any;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router
  ) {
    //related to google login
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.db.doc<User>(`Users/${user.uid}`).valueChanges();
        }
        else {
          return of(null);
        }
      })
    );

    this.db.collection("system_variables").doc("system_variables").snapshotChanges()
      .subscribe(result => {
        console.log("latest_doctorID DATABASE - ", result.payload.get("last_doctorID"));
        console.log("latest_patientID DATABASE - ", result.payload.get("last_patientID"));
        this.last_doctorID = result.payload.get("last_doctorID");
        sessionStorage.setItem("last_doctorID", this.last_doctorID);
        sessionStorage.setItem("last_patientID", result.payload.get("last_patientID"));
      });

      // setTimeout(()=>{this.generateNewPatientID()},2000);

    // var temp = this.generateNewDoctorID();
    // console.log("temp - ",temp);
  }

  //related to role based authorization
  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider()
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider) {
    return this.afAuth.signInWithPopup(provider)
      .then((credentials) => {
        this.updateUserData(credentials.user);
        //  this.router.navigate(['/patients/dashboard']);
      })
  }

  //  private checkAuthorization(user: User, allowedRoles:string[]): boolean {
  //    if(!user) return false
  //    for (const role of allowedRoles) {
  //      if(user.) {
  //        return true
  //      }
  //    }
  //    return false
  //  }

  //  canRead(user: User): boolean {
  //    const allowed = ['admin','editor','subscriber']
  //    return this.checkAuthorization(user, allowed)
  //  }

  //  canEdit(user: User): boolean {
  //   const allowed = ['admin','editor']
  //   return this.checkAuthorization(user, allowed)
  // }

  // canDelete(user: User): boolean {
  //   const allowed = ['admin']
  //   return this.checkAuthorization(user, allowed)
  // }



  //related to google login
  async googleSignin() {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.signInWithPopup(provider);
    this.updateUserData(credential.user);
    return this.router.navigate(['/']);
  }

  async signOut() {
    await this.afAuth.signOut();
    return this.router.navigate(['/']);
  }

  private updateUserData({ uid, email, displayName, photoURL }: User) {
    const userRef: AngularFirestoreDocument<User> = this.db.doc(`Users/${uid}`);
    const data = {
      uid,
      email,
      displayName,
      photoURL
    };

    return userRef.set(data, { merge: true });
  }


  //related to email password login
  getUserState() {
    return this.afAuth.authState;
  }

  login(email: string, password: string) {
    this.afAuth.signInWithEmailAndPassword(email, password)
      .catch(error => {
        this.eventAuthError.next(error);
      })
      .then(userCredential => {
        if (userCredential) {
          // this.router.navigate(['/homepage']);
          console.log(userCredential.user.uid);
          localStorage.setItem("uid",userCredential.user.uid)    //saving uid to local storage
          var docref = this.db.collection('Users').doc(userCredential.user.uid);
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
              if (this.role == "admin") {
                this.router.navigate(['/admin/systemUsers']);
              }
            })
        }
      })
  }

  createUser(user, role) {
    console.log("at create user SERVICE");
    this.afAuth.createUserWithEmailAndPassword(user.email, user.password)
      .then(userCredential => {
        this.newUser = user;
        console.log("uid in createUser - ",userCredential.user.uid)
        localStorage.setItem("uid",userCredential.user.uid);
        userCredential.user.updateProfile({
          displayName: user.name  //you can add a photo url as well here

        });

        if (role == "patient") {
          this.insertPatientData(userCredential)
            .then(() => {
              localStorage.setItem("role","patient");
              console.log("From AUTH SERVICE - Data successfully saved")
              // setTimeout(this.router.navigate(['/patients/dashboard']),500);
              setTimeout(()=>{this.router.navigate(['/patients/dashboard'])},1000);
              // this.router.navigate(['/patients/dashboard']);
            });
        }

        if (role == "doctor") {
          this.insertDoctorData(userCredential)
            .then(() => {
              // this.router.navigate(['/doctor-completeProfile']);
              localStorage.setItem("role","doctor");
              // this.router.navigate(['/doctorverification']);
              setTimeout(()=>{this.router.navigate(['/doctorverification'])},1000);
            });
        }


      })
      .catch(error => {
        this.eventAuthError.next(error);
      })
  }

  insertPatientData(userCredential: firebase.auth.UserCredential) {
    return this.db.doc(`Users/${userCredential.user.uid}`).set({
      email: this.newUser.email,
      name: this.newUser.name,
      nic:this.newUser.nic,      
      dob: this.newUser.dob,
      telno: this.newUser.telno,
      address: this.newUser.address,
      role: 'patient',
      patientID: this.generateNewPatientID(),
    })    
  }

  insertGooglePatientData(formValue: any,uID: any) {
    return this.db.doc(`Users/${uID}`).set({
      email: formValue.email,
      name: formValue.name,
      nic:formValue.nic,    
      dob: formValue.dob,
      telno: formValue.telno,
      address: formValue.address,
      role: 'patient',
      patientID: this.generateNewPatientID()
    })
    
  }

  insertDoctorData(userCredential: firebase.auth.UserCredential) {
    localStorage.setItem("role","doctor");
    return this.db.doc(`Users/${userCredential.user.uid}`).set({
      email: this.newUser.email,
      name: this.newUser.name,
      age: this.newUser.age,
      telno: this.newUser.telno,
      address: this.newUser.address,
      docID: this.newUser.docID,
      role: 'doctor',
      doctorID: this.generateNewDoctorID()
    })
  }

  insertGoogleDoctorData(formValue: any,uID: any) {
    localStorage.setItem("role","doctor");
    return this.db.doc(`Users/${uID}`).set({
      email: formValue.email,
      name: formValue.name,
      actNumber: formValue.age,
      telno: formValue.telno,
      address: formValue.address,
      docID: formValue.docID,
      role: 'doctor',
      doctorID: this.generateNewDoctorID()
    })
    
  }

  logout() {
    return this.afAuth.signOut();
  }

  generateNewDoctorID(): string {

    this.last_doctorID = sessionStorage.getItem("last_doctorID");
    console.log("last_docID - ", this.last_doctorID);
    var i: number;
    var splitted = this.last_doctorID.split("d", 2);

    var lastIDInt: number = +splitted[1];
    var newDocIDString = (lastIDInt + 1).toString();
    for (i = 0; i < (7 - newDocIDString.length) + 4; i++) {
      newDocIDString = 0 + newDocIDString;
    }
    this.last_doctorID = "d" + newDocIDString;
    console.log(this.last_doctorID);

    this.db.collection("system_variables").doc("system_variables").update({
      last_doctorID: this.last_doctorID
    })
      .then(() => {
        console.log("Successfully updated system variables - last_doctorID");
      })

    console.log("sgdsddddddddddddddd - ", this.last_doctorID)
    return this.last_doctorID;
  }

  generateNewPatientID(): string {

    this.last_patientID = sessionStorage.getItem("last_patientID");
    console.log("last_docID - ", this.last_patientID);
    var i: number;
    var splitted = this.last_patientID.split("p", 2);

    var lastIDInt: number = +splitted[1];
    var newDocIDString = (lastIDInt + 1).toString();
    for (i = 0; i < (7 - newDocIDString.length) + 4; i++) {
      newDocIDString = 0 + newDocIDString;
    }
    this.last_patientID = "p" + newDocIDString;
    console.log(this.last_patientID);

    this.db.collection("system_variables").doc("system_variables").update({
      last_patientID: this.last_patientID
    })
      .then(() => {
        console.log("Successfully updated system variables - last_doctorID");
      })

    console.log("sgdsddddddddddddddd - ", this.last_patientID)
    return this.last_patientID;
  }

  updateLastlogin(uid){
    var datetime = new Date().toLocaleString();
    return this.db.doc(`Users/${uid}`).update({
      'lastlogin':datetime
    });
  }

  usersignupDetails(uid){
    var datetime = new Date().toLocaleString();
    return this.db.doc(`Users/${uid}`).update({
      'accountcreation':datetime
    });
  }


}
