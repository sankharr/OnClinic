import { Component, OnInit } from '@angular/core';
import { ModeratorService } from 'src/app/services/moderator.service';

@Component({
  selector: 'app-view-patients',
  templateUrl: './view-patients.component.html',
  styleUrls: ['./view-patients.component.css']
})
export class ViewPatientsComponent implements OnInit {
  usersData: unknown[];

  constructor(
    private moderatorService: ModeratorService,
  ) { }

  ngOnInit(): void {
    this.moderatorService.getAllUsers().subscribe(res => {
      this.usersData = res;
      console.log(this.usersData)
    });

  }

}
