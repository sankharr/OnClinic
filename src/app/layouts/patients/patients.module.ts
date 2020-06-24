import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientDashboardComponent } from './patient-dashboard/patient-dashboard.component';
import { ProfileDoctorviewComponent } from './profile-doctorview/profile-doctorview.component';
import { PatientsRoutingModule } from './patients.routing';
import { PatientPaymentsComponent } from './patient-payments/patient-payments.component';
import { CalendarModule } from '@syncfusion/ej2-angular-calendars';
import { WaitingRoomComponent } from './waiting-room/waiting-room.component';
import { ChannelingComponent } from './channeling/channeling.component';
import { MyhealthComponent } from './myhealth/myhealth.component';



@NgModule({
  declarations: [PatientDashboardComponent , ProfileDoctorviewComponent, PatientPaymentsComponent, WaitingRoomComponent, ChannelingComponent, MyhealthComponent],
  imports: [
    CommonModule,
    CalendarModule
  ]
})
export class PatientsModule { }
