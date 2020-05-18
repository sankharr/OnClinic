import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientDashboardComponent } from './patient-dashboard/patient-dashboard.component';
import { PatientsRoutingModule } from './patients.routing';


@NgModule({
  declarations: [PatientDashboardComponent],
  imports: [
    CommonModule
  ]
})
export class PatientsModule { }
