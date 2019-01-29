import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';
import firestore from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  ref = firebase.firestore().collection('services');

  constructor() { }

  getServices(): Observable<any> {
    return new Observable((observer) => {
      this.ref.onSnapshot((querySnapshot) => {
        let Services = [];
        querySnapshot.forEach((doc) => {
          Services.push({
            id: doc.id,
            ...doc.data()
          });
        });
        observer.next(Services);
      });
    });
  }
  
  getService(id: string): Observable<any> {
    return new Observable((observer) => {
      this.ref.doc(id).get().then((doc) => {
        observer.next({
          id: doc.id,
          ...doc.data()
        });
      });
    });
  }
  
  postServices(data): Observable<any> {
    return new Observable((observer) => {
      this.ref.add(data).then((doc) => { 
        observer.next({
          id: doc.id,
        });
      });
    });
  }
  
  updateServices(id: string, data): Observable<any> {
    return new Observable((observer) => {
      this.ref.doc(id).set(data).then(() => {
        observer.next();
      });
    });
  }
  
  deleteServices(id: string): Observable<{}> {
    return new Observable((observer) => {
      this.ref.doc(id).delete().then(() => {
        observer.next();
      });
    });
  }
}

export class Service {
  id: string;
  name: string;  
}