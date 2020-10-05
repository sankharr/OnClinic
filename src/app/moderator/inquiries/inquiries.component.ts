import { Component, OnInit } from '@angular/core';
import { ModeratorService } from 'src/app/services/moderator.service';

@Component({
  selector: 'app-inquiries',
  templateUrl: './inquiries.component.html',
  styleUrls: ['./inquiries.component.scss']
})
export class InquiriesComponent implements OnInit {
  inquries: any[];
  lastInquiry: any;

  constructor(private moderator:ModeratorService) { }

  ngOnInit(): void {
    this.moderator.getInquiries().subscribe(res=>{
      console.log(res)
      this.inquries = res;
      this.lastInquiry = res.slice(1)[0]
      console.log(this.lastInquiry)
    })
  }

}
