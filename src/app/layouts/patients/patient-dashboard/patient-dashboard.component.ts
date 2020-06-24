import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.css']
})
export class PatientDashboardComponent implements OnInit {

  constructor(public auth:AuthService,
                      private router:Router) { 
  }

  ngOnInit(): void {
  }
  joinlc() {
    this.router.navigate(['/patients/waiting-room'])
  }

}

