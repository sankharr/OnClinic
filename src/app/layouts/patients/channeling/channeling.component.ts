import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-channeling',
  templateUrl: './channeling.component.html',
  styleUrls: ['./channeling.component.css']
})
export class ChannelingComponent implements OnInit {

  constructor(
    private router:Router
  ) { }

  ngOnInit(): void {
  }joinlc() {
    this.router.navigate(['/patients/waiting-room'])
  }
  upload() {
    this.router.navigate(['/patients/waiting-room/UploadDialogBox'])
  }
}
