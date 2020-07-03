import { ModeratorService } from './../services/moderator.service';
import { Component, OnInit} from '@angular/core';
import { User } from 'firebase';
import { AuthService } from '../services/auth.service'


@Component({
  selector: 'app-moderator',
  templateUrl: './moderator.component.html',
  styleUrls: ['./moderator.component.scss']
})
export class ModeratorComponent implements OnInit {
  // @ViewChild('chart') el: ElementRef;
  slmcVerified = "all";
  usersData: unknown[];

  constructor(
    private moderatorService: ModeratorService,

  ) { }

  ngOnInit(): void {
    this.moderatorService.getAllUsers().subscribe(res => {
      this.usersData = res;
      // this.basicChart()
      console.log(this.usersData)
    });
  }
  getdata(id) {

    // this.moderatorService.getDoctor(id).subscribe(res=>{
    //   console.log(res)
    // })
  }
  // basicChart() {
  //   const element = this.el.nativeElement
  //   const data = [{
  //     // x:[1,2,3,4,5],
  //     // y:[1,2,3,4,5]
  //     x: ['jan', 'feb', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'octomber', 'november', 'december'],
  //     y: [1, 2, 6, 3, 9, 0, 6, 5, 7, 6, 5, 7]
  //   }]
  //   const style = {
  //     margin: { t: 0 }
  //   }
  //   Plotly.plot(element, data, style)
  // }
}

