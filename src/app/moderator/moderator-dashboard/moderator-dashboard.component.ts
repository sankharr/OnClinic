import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as _ from 'lodash'
import { ModeratorService } from 'src/app/services/moderator.service';
import { element } from 'protractor';

@Component({
  selector: 'app-moderator-dashboard',
  templateUrl: './moderator-dashboard.component.html',
  styleUrls: ['./moderator-dashboard.component.css']
})
export class ModeratorDashboardComponent implements OnInit {
  @ViewChild('chart') el: ElementRef;
  usersData: unknown[];


  constructor(private moderatorService: ModeratorService,) { }

  ngOnInit(): void {
    // this.baseChart()
    this.moderatorService.getAllUsers().subscribe(res => {
      this.usersData = res;
      this.baseChart()
      console.log(this.usersData)
    });
  }

  baseChart() {
    var element = this.el.nativeElement
    var trace1 = {
      x: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      y: [8, 7, 6, 5, 4, 3, 2, 1, 0],
      type: 'scatter'
    };

    var trace2 = {
      x: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      y: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      type: 'scatter'
    };

    var data = [trace1, trace2];

    var layout = {
      xaxis: {
        type: 'log',
        autorange: true
      },
      yaxis: {
        type: 'log',
        autorange: true
      }
    };

    // Plotly.plot(element, data, style)
    Plotly.newPlot(element, data, layout);
  }

}
