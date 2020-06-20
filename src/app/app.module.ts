import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import {HttpModule} from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { LandingComponent } from './landing/landing.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';

import { HomeModule } from './home/home.module';
import { LoginComponent } from './login/login.component';
import { HomepageComponent } from './homepage/homepage.component';
import { DoctorsComponent } from './layouts/doctors/doctors.component';
import { PatientsComponent } from './layouts/patients/patients.component';


import { AngularFirestore } from '@angular/fire/firestore';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
// import { AuthService } from './services/auth.service';
import { CoreModule } from './core/core.module';

import { PatientsRoutingModule } from './layouts/patients/patients.routing';
import { TestingComponent } from './testing/testing.component';
import { CoreAuthService } from './core/core-auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MlComponent } from './ml/ml.component';
import { DiseaseComponent } from './disease/disease.component';
import { ModeratorComponent } from './moderator/moderator.component';
import { DoctorverificationComponent } from './doctorverification/doctorverification.component';
// import { DashboardComponent } from './doctor/dashboard/dashboard.component';
// import { PatientDashboardComponent } from './patient/patient-dashboard/patient-dashboard.component';
import { MailVerificationComponent } from './mail-verification/mail-verification.component';
import { AddressVerifyComponent } from './address-verify/address-verify.component';
import { WelcomeComponent } from './welcome/welcome.component';
// import { FirebaseListObservable } from '@angular/fire/database';


var firebaseConfig = {
  apiKey: "AIzaSyB64pNbCqJSKksiZrEdNLCDwPkyP554HpU",
  authDomain: "onclinic-dd11a.firebaseapp.com",
  databaseURL: "https://onclinic-dd11a.firebaseio.com",
  projectId: "onclinic-dd11a",
  storageBucket: "onclinic-dd11a.appspot.com",
  messagingSenderId: "431443097768",
  appId: "1:431443097768:web:a82ec860e388224d4fea9d",
  measurementId: "G-NEX6MKFZJY"
};

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LandingComponent,
    ProfileComponent,
    NavbarComponent,
    FooterComponent,
    LoginComponent,
    HomepageComponent,
    DoctorsComponent,
    PatientsComponent,
    TestingComponent,
    MlComponent,
    DiseaseComponent,
    ModeratorComponent,
    DoctorverificationComponent,
    MailVerificationComponent,
    AddressVerifyComponent,
    WelcomeComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    RouterModule,
    AppRoutingModule,
    HomeModule,
    HttpModule,
    HttpClientModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence(),
    CoreModule,
    PatientsRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
