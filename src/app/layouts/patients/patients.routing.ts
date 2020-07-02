import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { PatientDashboardComponent } from './patient-dashboard/patient-dashboard.component';
import { ProfileDoctorviewComponent } from './profile-doctorview/profile-doctorview.component';
import { PatientPaymentsComponent } from './patient-payments/patient-payments.component';
import { PatientsComponent } from './patients.component';
import { LiveConsultationComponent } from 'src/app/live-consultation/live-consultation.component';
import { WaitingRoomComponent } from './waiting-room/waiting-room.component';
import { ChannelingComponent } from './channeling/channeling.component';
import { MyhealthComponent } from './myhealth/myhealth.component';
import { ProfileComponent } from './profile/profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';


const routes: Routes =[

  { path: 'patients', component: PatientsComponent,
  children:[
     { path: 'dashboard', component: PatientDashboardComponent },
     { path: 'profileDoctorView', component: ProfileDoctorviewComponent },//path name calls on sidebar
     { path: 'payments', component: PatientPaymentsComponent },
     { path: 'waiting-room', component: WaitingRoomComponent },
     { path: 'channeling', component: ChannelingComponent },
     { path: 'lcp', component: LiveConsultationComponent },
     { path: 'myhealth', component: MyhealthComponent },
     { path: 'profile', component: ProfileComponent },
     { path: 'edit-profile', component: EditProfileComponent },
    ] },  
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
