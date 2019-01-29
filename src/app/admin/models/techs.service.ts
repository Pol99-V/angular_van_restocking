import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';
import firestore from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class TechsService {
  ref = firebase.firestore().collection('techs');

  constructor() { }
  
  getTechs(): Observable<any> {
    return new Observable((observer) => {
      this.ref.onSnapshot((querySnapshot) => {
        let Techs = [];
        querySnapshot.forEach((doc) => {
          Techs.push({
            id: doc.id,
            ...doc.data()
          });
        });
        observer.next(Techs);
      });
    });
  }
  
  getTech(id: string): Observable<any> {
    return new Observable((observer) => {
      this.ref.doc(id).get().then((doc) => {
        observer.next({
          id: doc.id,
          ...doc.data()
        });
      });
    });
  }
  
  postTechs(data): Observable<any> {
    return new Observable((observer) => {
      this.ref.add(data).then((doc) => {
        observer.next({
          id: doc.id,
        });
      });
    });
  }
  
  updateTechs(id: string, data): Observable<any> {
    return new Observable((observer) => {
      this.ref.doc(id).set(data).then(() => {
        observer.next();
      });
    });
  }
  
  deleteTechs(id: string): Observable<{}> {
    return new Observable((observer) => {
      this.ref.doc(id).delete().then(() => {
        observer.next();
      });
    });
  }
}

export class Tech {
  id: string;
  tech_id: string;
  name: string;
  email: string;
  service_id: string;
  van_id: string;
  depot_id: string;
  active: boolean;
  login_detail: string;
}