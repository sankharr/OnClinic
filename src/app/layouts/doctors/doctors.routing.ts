import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { DoctorDashboardComponent } from './doctor-dashboard/doctor-dashboard.component';
import { DoctorsComponent } from './doctors.component';
import { DoctorProfileComponent } from './doctor-profile/doctor-profile.component';
import { LiveConsultationComponent } from 'src/app/live-consultation/live-consultation.component';
import { DoctorPaymentsComponent } from './doctor-payments/doctor-payments.component';
import { DoctorLogComponent } from './doctor-log/doctor-log.component';
import { ProfilePatientviewComponent } from './profile-patientview/profile-patientview.component';

// import { PatientDashboardComponent } from './patient-dashboard/patient-dashboard.component';
// import { PatientsComponent } from './patients.component';

// import { HomeComponent } from './home/home.component';
// import { ProfileComponent } from './profile/profile.component';
// import { SignupComponent } from './signup/signup.component';
// import { LandingComponent } from './landing/landing.component';
// import { LoginComponent } from './login/login.component';
// import { HomepageComponent } from './homepage/homepage.component';
// import { PatientsComponent } from './layouts/patients/patients.component';
// import { AuthGuard } from './services/auth.guard';

const routes: Routes =[

    { path: 'doctors', component: DoctorsComponent,
     children:[
        { path: 'dashboard', component: DoctorDashboardComponent},
        { path: 'profile', component: DoctorProfileComponent},
        { path: 'lcd', component: LiveConsultationComponent},
        { path: 'payments', component: DoctorPaymentsComponent},
        { path: 'log', component: DoctorLogComponent},
        { path: 'ppv', component: ProfilePatientviewComponent},
        // { path: 'doctors', redirectTo: 'dashboard', pathMatch: 'full' }
     ] },  
    // { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes,{
      useHash: false //this was originally True. I edited this
    })
  ],
  exports: [
  ],
})
export class DoctorsRoutingModule { }