import { ModeratorService } from './../services/moderator.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'firebase';


@Component({
  selector: 'app-moderator',
  templateUrl: './moderator.component.html',
  styleUrls: ['./moderator.component.scss']
})
export class ModeratorComponent implements OnInit {
  usersData: unknown[];

  constructor(
    private moderatorService: ModeratorService,

  ) { }

  ngOnInit(): void {
    this.moderatorService.getAllUsers().subscribe(res => {
      this.usersData = res
      console.log(res)
    })
  }

}

