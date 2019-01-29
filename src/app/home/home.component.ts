import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { MemberGuard } from './../auth/member.guard';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  name: any;
  role: string = '';

  constructor(public af: AngularFireAuth,
    private router: Router,
    private guard: MemberGuard
    ) {
      if(this.af.authState) {
        this.name = this.af;
      }
  }

  logout() {
     this.af.auth.signOut();
     this.router.navigateByUrl('/login-email');
  }

  ngOnInit() {
    this.role = this.guard.getCurrentRole();
    console.log(this.role);
  }
}
