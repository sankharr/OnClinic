import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientDashboardComponent } from './patient-dashboard/patient-dashboard.component';
import { ProfileDoctorviewComponent } from './profile-doctorview/profile-doctorview.component';
import { PatientsRoutingModule } from './patients.routing';
import { PatientPaymentsComponent } from './patient-payments/patient-payments.component';


@NgModule({
  declarations: [PatientDashboardComponent , ProfileDoctorviewComponent, PatientPaymentsComponent],
  imports: [
    CommonModule
  ]
})
export class PatientsModule { }
