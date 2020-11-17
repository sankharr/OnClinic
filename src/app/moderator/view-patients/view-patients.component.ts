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
      console.log(this.usersData);
      this.showGraph();
    });

  }

  showGraph(){
    var trace1 = {
      x: [1, 2, 3, 4, 5,6],
      // y: [1, 3, 2, 3, 1],
      mode: 'lines',
      name: 'Solid',
      line: {
        dash: 'solid',
        width: 4
      }
    };
    
    // var trace2 = {
    //   x: [1, 2, 3, 4, 5],
    //   y: [6, 8, 7, 8, 6],
    //   mode: 'lines',
    //   name: 'dashdot',
    //   line: {
    //     dash: 'dashdot',
    //     width: 4
    //   }
    // };
    
    // var trace3 = {
    //   x: [1, 2, 3, 4, 5],
    //   y: [11, 13, 12, 13, 11],
    //   mode: 'lines',
    //   name: 'Solid',
    //   line: {
    //     dash: 'solid',
    //     width: 4
    //   }
    // };
    
    // var trace4 = {
    //   x: [1, 2, 3, 4, 5],
    //   y: [16, 18, 17, 18, 16],
    //   mode: 'lines',
    //   name: 'dot',
    //   line: {
    //     dash: 'dot',
    //     width: 4
    //   }
    // };
    
    var data = [trace1];
    
    var layout = {
      title: 'Line Dash',
      xaxis: {
        range: ['2016-07-01', '2016-12-31'],
        type: 'date',
        autorange: false,
      },
      yaxis: {
        range: [0, 18.5],
        autorange: false
      },
      legend: {
        y: 0.5,
        traceorder: 'reversed',
        font: {
          size: 16
        }
      }
    };
    
    Plotly.newPlot('myDiv', data, layout);
    
  }

}
