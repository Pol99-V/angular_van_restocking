import { Injectable } from '@angular/core';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PrintService {
  isPrinting = false;
  printData = [];

  constructor(private router: Router) { }
  
  printDocument(documentName: string, documentData: any[]) {
    this.printData = documentData;
    this.isPrinting = true;
    this.router.navigate(['/',
      { outlets: {
        'print': ['print', documentName, ['1','2'].join()]
      }}]);
  }

  getPrintData() {
    return this.printData;
  }

  onDataReady() {
    setTimeout(() => {
      window.print();
      this.isPrinting = false;
      this.router.navigate([{ outlets: { print: null }}]);
    });
  }
}
