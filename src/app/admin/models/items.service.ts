import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';
import firestore from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  ref = firebase.firestore().collection('items');

  constructor() { }

  getItems(): Observable<any> {
    return new Observable((observer) => {
      this.ref.onSnapshot((querySnapshot) => {
        let Items = [];
        querySnapshot.forEach((doc) => {
          Items.push({
            id: doc.id,
            ...doc.data()
          });
        });
        observer.next(Items);
      });
    });
  }
  
  getItem(id: string): Observable<any> {
    return new Observable((observer) => {
      this.ref.doc(id).get().then((doc) => {
        observer.next({
          id: doc.id,
          ...doc.data()
        });
      });
    });
  }
  
  postItems(data): Observable<any> {
    return new Observable((observer) => {
      this.ref.add(data).then((doc) => {
        observer.next({
          id: doc.id,
        });
      });
    });
  }
  
  updateItems(id: string, data): Observable<any> {
    return new Observable((observer) => {
      this.ref.doc(id).set(data).then(() => {
        observer.next();
      });
    });
  }
  
  deleteItems(id: string): Observable<{}> {
    return new Observable((observer) => {
      this.ref.doc(id).delete().then(() => {
        observer.next();
      });
    });
  }
}

export class Item {  
  id: string;
  item_id: string;
  description: string;
  cost: number;
  active: boolean;
}