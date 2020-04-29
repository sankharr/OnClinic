import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    providers: [AuthService]
})
export class SignupComponent implements OnInit {
    test : Date = new Date();
    focus;
    focus1;
    focus2;

    authError: any;

    constructor(private auth: AuthService) { }

    ngOnInit() {
        this.auth.eventAuthErrors$.subscribe( data => {
            this.authError = data;
        })
    }

    createUser(frm) {
        this.auth.createUser(frm.value)
    }
}
