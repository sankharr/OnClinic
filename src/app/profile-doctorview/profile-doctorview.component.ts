import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile-doctorview',
  templateUrl: './profile-doctorview.component.html',
  styleUrls: ['./profile-doctorview.component.css']
})
export class ProfileDoctorviewComponent implements OnInit {

  constructor(public auth:AuthService) { }

  ngOnInit(): void {
  }

}
