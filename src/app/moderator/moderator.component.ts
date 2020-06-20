import { ModeratorService } from './../services/moderator.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-moderator',
  templateUrl: './moderator.component.html',
  styleUrls: ['./moderator.component.css']
})
export class ModeratorComponent implements OnInit {
  usersData: Array<any>;

  constructor(
    private moderatorService: ModeratorService,

  ) { }

  ngOnInit(): void {
    this.moderatorService.getAllUsers().subscribe(res=>{
      this.usersData = res
      console.log(res)
    })
  }

}

