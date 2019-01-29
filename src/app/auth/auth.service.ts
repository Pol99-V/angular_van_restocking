import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable, of, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<User>;
  private afs: AngularFirestore;

  constructor(private afAuth: AngularFireAuth,
              private router: Router) {
      //// Get auth data, then get firestore user document || null
      console.log('cccccccccccccccccccc')
      this.user$ = from(this.afAuth.authState).pipe(
        switchMap(user => {
          if (user) {
            console.log('aaaaaaaaaaaaaaaaaaaaaaa');
            return this.afs.doc<User>(`users/${user.uid}`).valueChanges()
          } else {
            console.log('bbbbbbbbbbbbbbbbbbbbbbbbbbbbb');
            return of(null)
          }
        })
      );
      
  }
  
  signOut() {
    this.afAuth.auth.signOut()
  }

  canRead(user: User): boolean {
    const allowed = ['admin', 'editor', 'subscriber']
    return this.checkAuthorization(user, allowed)
  }
  
  canEdit(user: User): boolean {
    const allowed = ['admin', 'editor']
    return this.checkAuthorization(user, allowed)
  }
  
  canDelete(user: User): boolean {
    const allowed = ['admin']
    return this.checkAuthorization(user, allowed)
  }
  
  
  
  // determines if user has matching role
  private checkAuthorization(user: User, allowedRoles: string[]): boolean {
    if (!user) return false
    for (const role of allowedRoles) {
      if ( user.roles[role] ) {
        return true
      }
    }
    return false
  }
}
