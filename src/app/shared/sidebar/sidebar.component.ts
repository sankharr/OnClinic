import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

declare const $: any;

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

//doctor-routings
export const doctorROUTES: RouteInfo[] = [
  { path: '/doctors/dashboard', title: 'Dashboard', icon: 'dashboard', class: '' },
  { path: '/doctors/profile', title: 'Profile', icon: 'content_paste', class: '' },
  // { path: '/add-new-moderator', title: 'Add New Moderator', icon: 'add', class: '' },
  // { path: '/maps', title: 'Maps', icon: 'location_on', class: '' },
  // { path: '/admin-notifications', title: 'Notifications', icon: 'notifications', class: '' },
];

//patient routings
export const patientROUTES: RouteInfo[] = [
  { path: '/patients/dashboard', title: 'Dashboard', icon: 'dashboard', class: '' },
  { path: '/patients/profileDoctorView', title: 'Profile', icon: 'profile', class: '' },
  { path: '/patients/payments', title: 'Payments', icon: 'payments', class: '' },
  // { path: '/add-new-moderator', title: 'Add New Moderator', icon: 'add', class: '' },
  // { path: '/maps', title: 'Maps', icon: 'location_on', class: '' },
  // { path: '/admin-notifications', title: 'Notifications', icon: 'notifications', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  menuItems: any[];
  getUser: String = '';
  isAdmin: boolean = false;
  route_link: any;
  user_details: any = [];
  user: any;

  constructor(
    private db: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {
    // this.afAuth.authState
    // .subscribe(user => {
    //   this.user = user
    //   console.log(this.user.uid);
    // })
  }

  ngOnInit(): void {

    // this.db.collection("Users")
    // console.log(this.user.uid);

    if (localStorage.getItem('role') == 'doctor') {
      this.menuItems = doctorROUTES.filter(listTitle => listTitle);
      console.log("from localStorage - ",localStorage.getItem('role'));
      // this.route_link = "/artist-notifications";
    }

    else if (localStorage.getItem('role') == 'patient') {
      this.menuItems = patientROUTES.filter(listTitle => listTitle);
      console.log("from localStorage - ",localStorage.getItem('role'));
      // this.route_link = "/artist-notifications";
    }

  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;

  }

}
