import { ModeratorService } from './../services/moderator.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'firebase';
import {AuthService} from '../services/auth.service'


@Component({
  selector: 'app-moderator',
  templateUrl: './moderator.component.html',
  styleUrls: ['./moderator.component.scss']
})
export class ModeratorComponent implements OnInit {
  slmcVerified = "all";
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
  getdata(id){
    
    // this.moderatorService.getDoctor(id).subscribe(res=>{
    //   console.log(res)
    // })
  }
}

