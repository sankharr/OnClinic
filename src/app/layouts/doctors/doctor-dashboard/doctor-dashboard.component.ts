import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth.service'

@Component({
  selector: 'app-doctor-dashboard',
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.css']
})
export class DoctorDashboardComponent implements OnInit {
  userid: string;

  constructor(private auth:AuthService) { }

  ngOnInit(): void {
    this.auth.getUserState().subscribe(res=>{
      this.userid = res.uid
      this.auth.updateLastlogin(this.userid)
    })
  }

}
