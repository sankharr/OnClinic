import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { SignupComponent } from './signup/signup.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { HomepageComponent } from './homepage/homepage.component';
import { PatientsComponent } from './layouts/patients/patients.component';
import { AuthGuard } from './services/auth.guard';
import { TestingComponent } from './testing/testing.component';
import { DoctorsComponent } from './layouts/doctors/doctors.component';
import { DoctorsListComponent } from './doctors-list/doctors-list.component';
import { DoctorsRoutingModule } from './layouts/doctors/doctors.routing';
import { DoctorBookComponent } from './doctor-book/doctor-book.component';
import { PaymentComponent } from './payment/payment.component';
import { DoctorRegistration2Component } from './doctor-registration2/doctor-registration2.component';
import { MailVerificationComponent } from './mail-verification/mail-verification.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ViewPatientsComponent } from './moderator/view-patients/view-patients.component'
import { ModeratorDashboardComponent } from './moderator/moderator-dashboard/moderator-dashboard.component'

import { MlComponent } from './ml/ml.component';
import { DiseaseComponent } from './disease/disease.component';
import { DoctorverificationComponent } from './doctorverification/doctorverification.component';
import { ModeratorComponent } from './moderator/moderator.component';
import { AddressVerifyComponent } from './address-verify/address-verify.component';
import { PatientverificationComponent } from './patientverification/patientverification.component';




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
  { path: 'doctors-list', component: DoctorsListComponent },
  { path: 'doctor-book', component: DoctorBookComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'doctor-completeProfile', component: DoctorRegistration2Component },
  { path: 'ml', component: MlComponent },
  { path: 'patientverification',component:PatientverificationComponent },
  { path: 'disease', component: DiseaseComponent },
  { path: 'moderator/doctors', component: ModeratorComponent },
  { path: 'moderator/patients', component: ViewPatientsComponent },
  { path: 'moderator/dashboard', component: ModeratorDashboardComponent },
  { path: 'doctorverification', component: DoctorverificationComponent },
  { path: 'emailverify', component: MailVerificationComponent },
  { path: 'addressverificatoin', component: AddressVerifyComponent },
  { path: 'welcomepage', component: WelcomeComponent },
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
