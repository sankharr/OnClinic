import { DoctorverificationComponent } from './doctorverification/doctorverification.component';
import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import {MailVerificationComponent} from './mail-verification/mail-verification.component'
import { ProfileComponent } from './profile/profile.component';
import { SignupComponent } from './signup/signup.component';
// import {DashboardComponent} from './doctor/dashboard/dashboard.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { HomepageComponent } from './homepage/homepage.component';
import {WelcomeComponent} from './welcome/welcome.component'
import { PatientsComponent } from './layouts/patients/patients.component';
import { AuthGuard } from './services/auth.guard';
import { ModeratorComponent } from './moderator/moderator.component';
import { TestingComponent } from './testing/testing.component';
import { DoctorsComponent } from './layouts/doctors/doctors.component';
import { MlComponent } from './ml/ml.component';
import { DiseaseComponent } from './disease/disease.component';
import {AddressVerifyComponent} from './address-verify/address-verify.component'
// import { PatientDashboardComponent } from './patient/patient-dashboard/patient-dashboard.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'homepage', component: HomepageComponent },
  { path: 'user-profile', component: ProfileComponent },
  { path: 'register', component: SignupComponent },
  { path: 'landing', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'patients', component: PatientsComponent, canActivate: [AuthGuard] },
  { path: 'doctors', component: DoctorsComponent },
  { path: 'testing', component: TestingComponent },
  { path: 'ml', component: MlComponent },
  { path: 'disease', component: DiseaseComponent },
  { path: 'moderator', component:ModeratorComponent},
  { path: 'doctorverification',component:DoctorverificationComponent},
  // { path: 'doctordashboard',component:DashboardComponent},
  // { path: 'patientdashboard',component:PatientDashboardComponent},
  { path: 'emailverify',component:MailVerificationComponent},
  {path: 'addressverificatoin',component:AddressVerifyComponent},
  {path: 'welcomepage',component:WelcomeComponent},
  { path: '', redirectTo: 'homepage', pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: false //this was originally True. I edited this
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
