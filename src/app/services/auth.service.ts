import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore,AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject,Observable,of } from 'rxjs';

import { auth } from 'firebase/app';
import { switchMap } from 'rxjs/operators';
import { User } from './user.model';

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

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router:Router
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

   }

  //related to google login
   async googleSignin() {
     const provider = new auth.GoogleAuthProvider();
     const credential = await this.afAuth.signInWithPopup(provider);
     return this.updateUserData(credential.user);
   }

   async signOut() {
     await this.afAuth.signOut();
     return this.router.navigate(['/']);
   }

   private updateUserData({ uid, email, displayName, photoURL } : User) {
      const userRef: AngularFirestoreDocument<User> = this.db.doc(`Users/${uid}`);
      const data = {
        uid,
        email,
        displayName,
        photoURL
      };

      return userRef.set(data, {merge: true});
   }


  //related to email password login
  getUserState() {
    return this.afAuth.authState;
  }

  login( email: string, password: string) {
    this.afAuth.signInWithEmailAndPassword(email,password)
    .catch(error  => {
      this.eventAuthError.next(error);
    })
    .then(userCredential => {
      if(userCredential) {
        this.router.navigate(['/homepage']);
      }
    })
  }

  createUser(user) {
    this.afAuth.createUserWithEmailAndPassword( user.email, user.password)
    .then( userCredential => {
      this.newUser = user;
      console.log(userCredential)
      userCredential.user.updateProfile({
        displayName: user.name  //you can add a photo url as well here
        
      });

      this.insertUserData(userCredential)
      .then(() => {
        this.router.navigate(['/homepage']);
      });
    })
    .catch ( error => {
      this.eventAuthError.next(error);
    })
  }

  insertUserData(userCredential: firebase.auth.UserCredential) {
    return this.db.doc(`Users/${userCredential.user.uid}`).set({
      email: this.newUser.name,
      name: this.newUser.name,
      role: 'patient'
    })
  }

  logout() {
    return this.afAuth.signOut();
  }
  
}
