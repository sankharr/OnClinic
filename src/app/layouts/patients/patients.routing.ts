import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { PatientDashboardComponent } from './patient-dashboard/patient-dashboard.component';
import { PatientsComponent } from './patients.component';

// import { HomeComponent } from './home/home.component';
// import { ProfileComponent } from './profile/profile.component';
// import { SignupComponent } from './signup/signup.component';
// import { LandingComponent } from './landing/landing.component';
// import { LoginComponent } from './login/login.component';
// import { HomepageComponent } from './homepage/homepage.component';
// import { PatientsComponent } from './layouts/patients/patients.component';
// import { AuthGuard } from './services/auth.guard';

const routes: Routes =[

    { path: 'patients',             component: PatientsComponent,
     children:[
        { path: 'dashboard',             component: PatientDashboardComponent }
     ] },
    // { path: 'homepage',             component: HomepageComponent },
    // { path: 'user-profile',     component: ProfileComponent },
    // { path: 'register',           component: SignupComponent },
    // { path: 'landing',          component: LandingComponent },
    // { path: 'login',          component: LoginComponent },
    // { path: 'patients',          component: PatientsComponent, canActivate: [AuthGuard] },
    // { path: '', redirectTo: 'homepage', pathMatch: 'full' }
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
export class PatientsRoutingModule { }
