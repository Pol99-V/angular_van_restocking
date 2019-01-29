import { router } from './../app.routes';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { moveIn, fallIn } from '../router.animations';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css'],
  animations: [moveIn(), fallIn()],
  host: {'[@moveIn]': ''}
})
export class ForgotComponent implements OnInit {

  state: string = '';
  error: any;
  status: boolean = false;

  constructor(public af: AngularFireAuth,private router: Router) { }

  ngOnInit() {
        
  }
  onSubmit(formData) {
    const _ref = this;
    if(formData.valid) {
      console.log(formData.value);
      this.af.auth.sendPasswordResetEmail(formData.value.email).then(function() {
        _ref.status = true;
        _ref.error = false;
        // _ref.router.navigate(['/login-email']);
      }).catch(err => {
        console.log(err);
        this.error = err;
        this.status = false;
      })
    }
  }
}
