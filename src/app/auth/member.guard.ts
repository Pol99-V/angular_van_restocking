import { firebaseConfig } from './../app.module';
import { UserService } from './user.service';
import { AngularFireAuth } from 'angularfire2/auth';import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router  } from '@angular/router';
import { Observable, from, of } from 'rxjs';
import * as firebase from 'firebase';
import { tap, map, take, withLatestFrom, concatMap, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MemberGuard implements CanActivate {


  currentRole;

  constructor(
    private auth: AngularFireAuth, 
    private router: Router,
    private us: UserService
  ) {}

  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

     
      return this.us.getUsers().pipe(
        take(1),
        map( data => {
            if(!firebase.auth().currentUser) return false;
              let cuser = firebase.auth().currentUser.email;
              let fuser = data.filter(function(d) {
                return d['email'] == cuser;
              })[0];

              if( !fuser || ( fuser['role'] != 'member' && fuser['role'] != 'admin' ) ) {
                // this.auth.auth.signOut();
                // this.router.navigateByUrl('/login-email');
                return false
              }
              this.currentRole = fuser['role'];
              return true;
          })
        )
        
      // return this.auth.user$.pipe(
      //   take(1),
      //   map(user => user && user.roles.admin ? true : false),
      //   tap(isAdmin => {
      //     if (!isAdmin) {
      //       console.error('Access denied - Admins only')
      //     }
      //   })
      // );
  }

  getCurrentRole() {
    return this.currentRole;
  }
}
