import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.css']
})
export class PatientDashboardComponent implements OnInit {
  userid: string;

  constructor(public auth:AuthService,
                      private router:Router) { 
  }

  ngOnInit(): void {
    this.auth.getUserState().subscribe(res=>{
      this.userid = res.uid
      this.auth.updateLastlogin(this.userid)
    })
  }
  joinlc() {
    this.router.navigate(['/patients/waiting-room'])
  }

}

