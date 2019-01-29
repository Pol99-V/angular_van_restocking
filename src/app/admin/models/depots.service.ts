import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';
import firestore from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class DepotsService {
  ref = firebase.firestore().collection('depots');

  constructor() { }

  getDepots(): Observable<any> {
    return new Observable((observer) => {
      this.ref.onSnapshot((querySnapshot) => {
        let Depots = [];
        querySnapshot.forEach((doc) => {
          Depots.push({
            id: doc.id,
            ...doc.data()
          });
        });
        observer.next(Depots);
      });
    });
  }
  
  getDepot(id: string): Observable<any> {
    return new Observable((observer) => {
      this.ref.doc(id).get().then((doc) => {
        observer.next({
          id: doc.id,
          ...doc.data()
        });
      });
    });
  }
  
  postDepots(data): Observable<any> {
    return new Observable((observer) => {
      this.ref.add(data).then((doc) => {
        observer.next({
          id: doc.id,
        });
      });
    });
  }
  
  updateDepots(id: string, data): Observable<any> {
    return new Observable((observer) => {
      this.ref.doc(id).set(data).then(() => {
        observer.next();
      });
    });
  }
  
  deleteDepots(id: string): Observable<{}> {
    return new Observable((observer) => {
      this.ref.doc(id).delete().then(() => {
        observer.next();
      });
    });
  }

}

export class Depot {
  id: string;
  description: string;
}