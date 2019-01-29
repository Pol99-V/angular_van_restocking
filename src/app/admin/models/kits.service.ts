import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';
import firestore from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class KitsService {
  ref = firebase.firestore().collection('std_kits');

  constructor() { }

  getKits(): Observable<any> {
    return new Observable((observer) => {
      this.ref.onSnapshot((querySnapshot) => {
        let Kits = [];
        querySnapshot.forEach((doc) => {
          Kits.push({
            id: doc.id,
            ...doc.data()
          });
        });
        observer.next(Kits);
      });
    });
  }
  
  getKit(id: string): Observable<any> {
    return new Observable((observer) => {
      this.ref.doc(id).get().then((doc) => {
        observer.next({
          id: doc.id,
          ...doc.data()
        });
      });
    });
  }
  
  postKits(data): Observable<any> {
    return new Observable((observer) => {
      this.ref.add(data).then((doc) => {
        observer.next({
          id: doc.id,
        });
      });
    });
  }
  
  updateKits(id: string, data): Observable<any> {
    return new Observable((observer) => {
      this.ref.doc(id).set(data).then(() => {
        observer.next();
      });
    });
  }
  
  deleteKits(id: string): Observable<{}> {
    return new Observable((observer) => {
      this.ref.doc(id).delete().then(() => {
        observer.next();
      });
    });
  }
}

export class Kit {
  id: string;
  kit_id: string;
  name: string;
  service_id: string;
  active: boolean;
  sub_item: Array<{
    item_id: string;
    item_desc: string;
    qty: number;
  }>;
}