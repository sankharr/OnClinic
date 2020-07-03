import { Component, OnInit } from '@angular/core';
import { ModeratorService } from 'src/app/services/moderator.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-view-patients',
  templateUrl: './view-patients.component.html',
  styleUrls: ['./view-patients.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(2000, style({ opacity: 1 }))
      ])
    ])
  ]
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
