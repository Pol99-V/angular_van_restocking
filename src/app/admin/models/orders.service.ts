import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';
import firestore from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  ref = firebase.firestore().collection('orders');

  constructor() { }

  getOrders(): Observable<any> {
    return new Observable((observer) => {
      this.ref.onSnapshot((querySnapshot) => {
        let Orders = [];
        querySnapshot.forEach((doc) => {
          Orders.push({
            id: doc.id,
            ...doc.data()
          });
        });
        observer.next(Orders);
      });
    });
  }
  
  getOrder(id: string): Observable<any> {
    return new Observable((observer) => {
      this.ref.doc(id).get().then((doc) => {
        observer.next({
          id: doc.id,
          ...doc.data()
        });
      });
    });
  }
  
  postOrders(data): Observable<any> {
    return new Observable((observer) => {
      this.ref.add(data).then((doc) => {
        observer.next({
          id: doc.id,
        });
      });
    });
  }
  
  updateOrders(id: string, data): Observable<any> {
    return new Observable((observer) => {
      this.ref.doc(id).set(data).then(() => {
        observer.next();
      });
    });
  }
  
  deleteOrders(id: string): Observable<{}> {
    return new Observable((observer) => {
      this.ref.doc(id).delete().then(() => {
        observer.next();
      });
    });
  }
}

export class Order {
  id: string;
  order_id: number;
  tech_id: string;
  order_date: string;
  ship_date: string;
  sub_items: Array<{
    item_id: string,
    item_desc: string,
    qty: number
  }>
}