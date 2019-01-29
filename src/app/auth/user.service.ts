import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  ref = firebase.firestore().collection('users');

  constructor() { }
  
  getUsers(): Observable<any> {
    return new Observable((observer) => {
      this.ref.onSnapshot((querySnapshot) => {
        let Users = [];
        querySnapshot.forEach((doc) => {
          Users.push({
            id: doc.id,
            ...doc.data()
          });
        });
        observer.next(Users);
      });
    });
  }
  
  getUser(id: string): Observable<any> {
    return new Observable((observer) => {
      this.ref.doc(id).get().then((doc) => {
        observer.next({
          id: doc.id,
          ...doc.data()
        });
      });
    });
  }
  
  postUsers(data): Observable<any> {
    return new Observable((observer) => {
      this.ref.add(data).then((doc) => {
        observer.next({
          id: doc.id,
        });
      });
    });
  }
  
  updateUsers(id: string, data): Observable<any> {
    return new Observable((observer) => {
      this.ref.doc(id).set(data).then(() => {
        observer.next();
      });
    });
  }
  
  deleteUsers(id: string): Observable<{}> {
    return new Observable((observer) => {
      this.ref.doc(id).delete().then(() => {
        observer.next();
      });
    });
  }
}

export class User {
  email: string;
  role: string;
  id: string;
}