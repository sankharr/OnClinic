import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ModeratorService } from '../../services/moderator.service';

@Component({
  selector: 'app-social-resp',
  templateUrl: './social-resp.component.html',
  styleUrls: ['./social-resp.component.scss']
})
export class SocialRespComponent implements OnInit {
  sentMessages: any[];
  subject: FormControl;
  bloodGroup: FormControl;
  contactPerson: FormControl;
  contactNo: FormControl;
  url: FormControl;
  email: FormControl;
  SpecialNotes: FormControl;
  myform: FormGroup;

  constructor(private moderatorService: ModeratorService,) {
    this.createFormControls();
    this.createForm();
  }

  ngOnInit(): void {
    this.moderatorService.getBroadcasts().subscribe(res => {
      console.log(res);
      this.sentMessages = res
    })
  }

  broadcastMessage(broadcastForm) {
    var data = broadcastForm.value
    // var data = { "bloodGroup": ['O+', 'A-', 'O-'], "contactPerson": "Sankha", "contactNo": "4324243", "subject": "Need a blood donor!!", "SpecialNotes": "This Message sent from HospitalCore.If you're blood donor, and willing to donate your blood, then we need your assistance." }
    // console.log(data)
    this.moderatorService.broadcast(data).subscribe(res => {
      console.log("Okay",res)
    })
  }

  createFormControls() {
    this.subject = new FormControl('');
    this.bloodGroup = new FormControl('');
    this.contactPerson = new FormControl('');
    this.contactNo = new FormControl('');
    this.url = new FormControl('');
    this.email = new FormControl('');
    this.SpecialNotes = new FormControl('');

  }

  createForm() {
    this.myform = new FormGroup({
      subject: this.subject,
      bloodGroup: this.bloodGroup,
      contactPerson: this.contactPerson,
      contactNo: this.contactNo,
      url:this.url,
      email: this.email,
      SpecialNotes: this.SpecialNotes,
    });
  }

}
