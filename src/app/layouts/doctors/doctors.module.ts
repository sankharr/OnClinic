import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorDashboardComponent } from './doctor-dashboard/doctor-dashboard.component';
import { DoctorProfileComponent } from './doctor-profile/doctor-profile.component';
import { DoctorsRoutingModule } from './doctors.routing';
import { DoctorPaymentsComponent } from './doctor-payments/doctor-payments.component';
import { DoctorLogComponent } from './doctor-log/doctor-log.component';
import { CalendarModule } from '@syncfusion/ej2-angular-calendars';
import { ProfilePatientviewComponent } from './profile-patientview/profile-patientview.component';
import { DoctorChannelingComponent } from './doctor-channeling/doctor-channeling.component';
// import {MatTabsModule} from '@angular/material/tabs';





@NgModule({
  declarations: [DoctorDashboardComponent, DoctorProfileComponent, DoctorPaymentsComponent, DoctorLogComponent, ProfilePatientviewComponent, DoctorChannelingComponent],
  imports: [
    CommonModule,
    DoctorsRoutingModule,
    CalendarModule,
    // MatTabsModule,

  ]
})
export class DoctorsModule { }
