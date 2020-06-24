import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRouteSnapshot , Params, ActivatedRoute} from '@angular/router';
import { VerifydoctorService } from '../services/verifydoctor.service';
// import {ActivatedRouteSnapshot} from ''

@Component({
  selector: 'app-mail-verification',
  templateUrl: './mail-verification.component.html',
  styleUrls: ['./mail-verification.component.css']
})
export class MailVerificationComponent implements OnInit {

  constructor(private _router: ActivatedRoute,private doctorService: VerifydoctorService) {}

  ngOnInit(): void {
    var id = this._router.snapshot.queryParams['key'];
    var code = this._router.snapshot.queryParams['secret']
    // console.log(id,code)
    this.doctorService.verifyEmail(id,code).subscribe(res=>{
      console.log(res)
    })
    // console.log(snapshot)
    // console.log(snapshot.queryParams);
    // this._router.queryParams.subscribe((params)=>{
    //   console.log(params)
    // })
    // this.activatedRoute.queryParams.subscribe(params => {
    //   const userId = params['key'];
    //   const code = params['secret']
    //   console.log(userId.url,code);
    // });
  }

}
