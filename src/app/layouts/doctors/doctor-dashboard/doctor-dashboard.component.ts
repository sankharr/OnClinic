import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-doctor-dashboard',
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.css'],
})
export class DoctorDashboardComponent implements OnInit {
  @ViewChild('chart') el: ElementRef;
  @ViewChild('pieChart') el2: ElementRef;

  userid: string;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.getUserState().subscribe((res) => {
      this.userid = res.uid;
      this.auth.updateLastlogin(this.userid);
      this.lineChart();
      this.pieChart();
    });
   
  }

  lineChart() {
    const element = this.el.nativeElement;

    const data = [
      {
        x: ['7/1', '7/2', '7/3', '7/4', '7/5','7/6','7/7'],
        y: [10000, 15000, 16500, 9800, 11200, 13500, 9700],
      },
    ];

    const style = {
      margin: { t: 0 },
      title:'Daily Income',
      height: 240,
    
    };

    Plotly.newPlot(element, data, style);
  }

  pieChart(){
    const element = this.el2.nativeElement;

    const data = [{
      values: [19, 26],
      labels: ['Treated', 'All'],
      type: 'pie'
    }];

    var layout = {
      height: 300,
      width: 320,
    
    };

    Plotly.newPlot(element, data, layout);

  }
}
