import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorDashboardComponent } from './doctor-dashboard/doctor-dashboard.component';
import { DoctorProfileComponent } from './doctor-profile/doctor-profile.component';
import { DoctorsRoutingModule } from './doctors.routing';
import { DoctorPaymentsComponent } from './doctor-payments/doctor-payments.component';
import { CalendarModule } from '@syncfusion/ej2-angular-calendars';
import { ProfilePatientviewComponent } from './profile-patientview/profile-patientview.component';
import { DoctorChannelingComponent } from './doctor-channeling/doctor-channeling.component';
import { ReactiveFormsModule,FormsModule } from '@angular/forms'
import { WaitingroomDoctorviewComponent } from './waitingroom-doctorview/waitingroom-doctorview.component';
import { EditDoctorprofileComponent } from './edit-doctorprofile/edit-doctorprofile.component';

// import {MatTabsModule} from '@angular/material/tabs';


@NgModule({
  declarations: [DoctorDashboardComponent, DoctorProfileComponent, DoctorPaymentsComponent, ProfilePatientviewComponent, DoctorChannelingComponent, WaitingroomDoctorviewComponent, EditDoctorprofileComponent,],
  imports: [
    CommonModule,
    DoctorsRoutingModule,
    CalendarModule,
    FormsModule,
    ReactiveFormsModule,
    // MatTabsModule,

  ]
})
export class DoctorsModule { }
