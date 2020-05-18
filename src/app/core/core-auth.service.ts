import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';
import { User } from '../services/user'
import { of } from 'rxjs';
// import { exists } from 'fs';

@Injectable({
  providedIn: 'root'
})
export class CoreAuthService {

  user$: Observable<User>;
  role: any;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`Users/${user.uid}`).valueChanges();
        }
        else {
          return of(null);
        }
      })
    );
  }

  //  getRole(uid) {
  //    this.afs.collection('Users').doc(uid).snapshotChanges()
  //    .subscribe(output => {
  //      var result = output.payload.data();
  //    })
  //  }

  getUserState() {
    return this.afAuth.authState;
  }

  //related to role based authorization
  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider()
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider) {
    return this.afAuth.signInWithPopup(provider)
      .then((credential) => {
        var docRef = this.afs.collection('Users').doc(credential.user.uid);

        docRef.snapshotChanges()
          .subscribe(result => {
            if (!(result.payload.exists)) {
              console.log("doc not exists");
              this.router.navigate(['/register']);
            }
            else {
              console.log("doc exists");
              var docref = this.afs.collection('Users').doc(credential.user.uid);
              docref.snapshotChanges()
                .subscribe(output => {
                  this.role = output.payload.get("role");
                  console.log("role - ", this.role);

                  if (this.role == "patient") {
                    this.router.navigate(['/patients/dashboard']);
                  }
                  if (this.role == "doctor") {
                    this.router.navigate(['/doctors/dashboard']);
                  }
                })
            }
          })
        // this.updateUserData(credential.user);
        //  this.router.navigate(['/patients/dashboard']);
      })
  }

  signOut() {
    this.afAuth.signOut();
  }

  private createUserDoc(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`Users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email,
      roles: {
        admin: false,
        editor: false,
        subscriber: true
      }
    }
    return userRef.set(data, { merge: true })
  }

  private checkAuthorization(user: User, allowedRoles: string[]): boolean {
    if (!user) return false
    for (const role of allowedRoles) {
      if (user.roles[role]) {
        return true
      }
    }
    return false
  }

  canRead(user: User): boolean {
    const allowed = ['admin', 'editor', 'subscriber']
    return this.checkAuthorization(user, allowed)
  }

  canEdit(user: User): boolean {
    const allowed = ['admin', 'editor']
    return this.checkAuthorization(user, allowed)
  }

  canDelete(user: User): boolean {
    const allowed = ['admin']
    return this.checkAuthorization(user, allowed)
  }


}
