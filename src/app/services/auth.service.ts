import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private eventAuthError = new BehaviorSubject<string>("");
  eventAuthErrors$ = this.eventAuthError.asObservable();

  newUser: any;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router:Router
  ) { }

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
