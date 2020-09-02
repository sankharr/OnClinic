import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { CalendarModule } from '@syncfusion/ej2-angular-calendars';

import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { LandingComponent } from './landing/landing.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { DoctorsListComponent } from './doctors-list/doctors-list.component';
import { DoctorBookComponent } from './doctor-book/doctor-book.component';

import { HomeModule } from './home/home.module';
import { LoginComponent } from './login/login.component';
import { HomepageComponent } from './homepage/homepage.component';
import { DoctorsComponent } from './layouts/doctors/doctors.component';
import { PatientsComponent } from './layouts/patients/patients.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import {
  AngularFireStorageModule,
  AngularFireStorageReference,
  AngularFireUploadTask  
} from "@angular/fire/storage";
// import { StorageBucket } from "@angular/fire/"
// import { AuthService } from './services/auth.service';
import { CoreModule } from './core/core.module';

import { PatientsRoutingModule } from './layouts/patients/patients.routing';
import { TestingComponent } from './testing/testing.component';
import { CoreAuthService } from './core/core-auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { SidebarComponent } from './shared/sidebar/sidebar.component';

import { DoctorsModule } from './layouts/doctors/doctors.module';
import { PatientsModule } from './layouts/patients/patients.module';
import { DoctorsRoutingModule } from './layouts/doctors/doctors.routing';
import { LiveConsultationComponent } from './live-consultation/live-consultation.component';

import { environment } from 'src/environments/environment';
import { NgxAgoraModule } from 'ngx-agora';
import { PaymentComponent } from './payment/payment.component';
import { DoctorRegistration2Component } from './doctor-registration2/doctor-registration2.component';

import {HttpModule} from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { MlComponent } from './ml/ml.component';
import { DiseaseComponent } from './disease/disease.component';
import { ModeratorComponent } from './moderator/moderator.component';
import { DoctorverificationComponent } from './doctorverification/doctorverification.component';
import { MailVerificationComponent } from './mail-verification/mail-verification.component';
import { AddressVerifyComponent } from './address-verify/address-verify.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ModeratorNavbarComponent } from './shared/moderator-navbar/moderator-navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PatientRegistration2Component } from './patient-registration2/patient-registration2.component';

import {ModeratorPipe} from './pipes/moderator.pipe';
import { ViewPatientsComponent } from './moderator/view-patients/view-patients.component';
import { ModeratorPatientPipe } from './pipes/moderator-patient.pipe';
import { ModeratorDashboardComponent } from './moderator/moderator-dashboard/moderator-dashboard.component';
import { PatientverificationComponent } from './patientverification/patientverification.component';
import { SelectionPipe } from './pipes/selection.pipe';
import { AdminComponent } from './admin/admin.component';
import { SystemUsersComponent } from './admin/system-users/system-users.component';
import { PaymentCompletedComponent } from './payment-completed/payment-completed.component';
import { PaymentFailedComponent } from './payment-failed/payment-failed.component';
import {DatePipe} from '@angular/common';
import { EpidemicDetectionComponent } from './epidemic-detection/epidemic-detection.component';
import { InquiriesComponent } from './moderator/inquiries/inquiries.component';
import { SocialRespComponent } from './moderator/social-resp/social-resp.component';
import { RecordingService } from './services/recording.service';

import { ProfileDoctorviewComponent } from './profile-doctorview/profile-doctorview.component';

var firebaseConfig = {
  apiKey: "AIzaSyB64pNbCqJSKksiZrEdNLCDwPkyP554HpU",
  authDomain: "onclinic-dd11a.firebaseapp.com",
  databaseURL: "https://onclinic-dd11a.firebaseio.com",
  projectId: "onclinic-dd11a",
  storageBucket: "onclinic-dd11a.appspot.com",
  messagingSenderId: "431443097768",
  appId: "1:431443097768:web:a82ec860e388224d4fea9d",
  measurementId: "G-NEX6MKFZJY"
};

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LandingComponent,
    ProfileComponent,
    NavbarComponent,
    FooterComponent,
    LoginComponent,
    HomepageComponent,
    DoctorsComponent,
    PatientsComponent,
    TestingComponent,
    SidebarComponent,
    LiveConsultationComponent,
    DoctorsListComponent,
    DoctorBookComponent,
    PaymentComponent,
    MlComponent,
    DiseaseComponent,
    ModeratorComponent,
    DoctorverificationComponent,
    MailVerificationComponent,
    AddressVerifyComponent,
    WelcomeComponent,
    DoctorsListComponent,
    DoctorBookComponent,
    PaymentComponent,
    DoctorRegistration2Component,
    ModeratorNavbarComponent,
    ModeratorPipe,
    ViewPatientsComponent,
    ModeratorPatientPipe,
    ModeratorDashboardComponent,
    PatientverificationComponent,
    SelectionPipe,
    PatientRegistration2Component,
    AdminComponent,
    SystemUsersComponent,
    PaymentCompletedComponent,
    PaymentFailedComponent,
    EpidemicDetectionComponent,
    InquiriesComponent,
    SocialRespComponent,
    ProfileDoctorviewComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    RouterModule,
    AppRoutingModule,
    HomeModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    BrowserAnimationsModule,
    AngularFireStorageModule,
    CoreModule,
    PatientsRoutingModule,
    ReactiveFormsModule,
    DoctorsModule,
    PatientsModule,
    DoctorsRoutingModule,
    CalendarModule,
    NgxAgoraModule.forRoot({ AppID: environment.agora.appId }),
    HttpModule,
    HttpClientModule,
    BrowserAnimationsModule, 
    // MatTabsModule,
  ],
  providers: [DatePipe,RecordingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
