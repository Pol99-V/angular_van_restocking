import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';
import firestore from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class VansService {
  ref = firebase.firestore().collection('vans');

  constructor() { }

  getVans(): Observable<any> {
    return new Observable((observer) => {
      this.ref.onSnapshot((querySnapshot) => {
        let Vans = [];
        querySnapshot.forEach((doc) => {
          Vans.push({
            id: doc.id,
            ...doc.data()
          });
        });
        observer.next(Vans);
      });
    });
  }
  
  getVan(id: string): Observable<any> {
    return new Observable((observer) => {
      this.ref.doc(id).get().then((doc) => {
        observer.next({
          id: doc.id,
          ...doc.data()
        });
      });
    });
  }
  
  postVans(data): Observable<any> {
    return new Observable((observer) => {
      this.ref.add(data).then((doc) => {
        observer.next({
          id: doc.id,
        });
      });
    });
  }
  
  updateVans(id: string, data): Observable<any> {
    return new Observable((observer) => {
      this.ref.doc(id).set(data).then(() => {
        observer.next();
      });
    });
  }
  
  deleteVans(id: string): Observable<{}> {
    return new Observable((observer) => {
      this.ref.doc(id).delete().then(() => {
        observer.next();
      });
    });
  }
}

export class Van {
  id: string;
  van_id: string;
  description: string;
  reg: string;
  tech_id: string;
  order_date: string;
  active: boolean;
  sub_kits: Array<{
    kit_id: string;
    kit_name: string;
  }>
} 