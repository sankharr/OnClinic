import { Component, OnInit } from '@angular/core';
import { ModeratorService } from '../../services/moderator.service';

@Component({
  selector: 'app-social-resp',
  templateUrl: './social-resp.component.html',
  styleUrls: ['./social-resp.component.scss']
})
export class SocialRespComponent implements OnInit {

  constructor(private moderatorService: ModeratorService,) { }

  ngOnInit(): void {
  }

  broadcastMessage() {
    var data = { "bloodGroup": ['O+', 'A-', 'O-'], "contactPerson": "Maheema", "contactNo": "0713255247", "subject": "Need a blood donor!!", "SpecialNotes": "This Message sent from HospitalCore.If you're blood donor, and willing to donate your blood, then we need your assistance." }
    this.moderatorService.broadcast(data).subscribe(res => {
      // console.log(res)
      console.log("Okay")
    })
  }

}
