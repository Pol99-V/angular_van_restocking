import { Component, OnInit, ViewChild, Input, AfterViewInit } from '@angular/core';
import { OrdersService, Order } from '../models/orders.service';
import { NgbActiveModal, NgbModal, } from '@ng-bootstrap/ng-bootstrap';
import { Item, ItemsService } from '../models/items.service';
import { Tech, TechsService } from '../models/techs.service';
import { Van, VansService } from '../models/vans.service';
import { Kit, KitsService } from './../models/kits.service';
import { forkJoin } from 'rxjs';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  @ViewChild('content')
  content: NgbActiveModal;

  @ViewChild('content_delete')
  content_delete: NgbActiveModal;

  @ViewChild('content_edit')
  content_edit: NgbActiveModal;

  dtOptions = {};
  Order_list: Array<Order> = [{
    id:"", order_id: null, tech_id: "", order_date: " ", ship_date: null, 
    sub_items: [{item_id: "", item_desc: "", qty: 0}]
  }];
  
  tech_list: Tech[] = [{
    id:"", name: "", tech_id: "", email: "", service_id: "", active: false, 
    van_id: "", depot_id: "", login_detail: ""
  }];
   
  global_Order_list = [];
  
  item_list: Item[];
  van_list: Van[];
  kit_list: Kit[];

  add_name: Order = {
    id:"", order_id: null, tech_id: "", order_date: " ", ship_date: null, 
    sub_items: [{item_id: "", item_desc: "", qty: 0}]
  };
  
  edit_name: Order = {
    id:"", order_id: null, tech_id: "", order_date: " ", ship_date: null, 
    sub_items: [{item_id: "", item_desc: "", qty: 0}]
  };

  delete_name: Order = {
    id:"", order_id: null, tech_id: "", order_date: " ", ship_date: null, 
    sub_items: [{item_id: "", item_desc: "", qty: 0}]
  };

  selectedRowId; 

  searchString = "";
  active = 2;
  edit_active;

  private activeModalService: NgbActiveModal;

  date: {year: number, month: number};

  constructor(
    private ds: OrdersService, 
    private is: ItemsService,
    private ts: TechsService,
    private vs: VansService,
    private ks: KitsService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    const _self = this;
    this.dtOptions = {
      dom: 'rtip',
      ordering: false      
    }

    this.getOrders();
    // this.ts.getTechs()
    // .subscribe(data => {
    //   this.tech_list = data;
    //   this.global_Order_list = data.filter(function(d) {
    //     return d['active'];
    //   });
    //   console.log(this.global_Order_list);

    //   this.vs.getVans()
    //   .subscribe(data_van => {
    //     this.van_list = data_van;
    //     this.global_Order_list.forEach(function(o) {
    //       let fil_van = data_van.filter(function(v) {
    //         return o['name'] == v['tech_id'];
    //       })[0];
    //       if(fil_van) {
    //         o['order_date'] = fil_van['order_date'];
    //         o['sub_kits'] = fil_van['sub_kits'];
    //       }
    //     });
    //     this.filter();

    //     this.ks.getKits()
    //     .subscribe(data => {
    //       this.kit_list = data;
    //       this.global_Order_list.forEach(function(o) {
    //         o['item_count'] = 0;
    //         if('sub_kits' in o) {
    //           o['sub_items'] = [];
    //           o['sub_kits'].forEach(function(s) {
    //             let fil_kit = data.filter(function(d){
    //               return s['kit_id'] == d['kit_id'];
    //             })[0]; 
                
    //             if(fil_kit) {
    //               o['sub_items'] = o['sub_items'].concat( fil_kit['sub_item']);
    //               // fil_kit['sub_item'].forEach(function(a) {

    //               //     o['item_count'] += a['qty'];

    //               //     let fil_ = o['sub_items'].filter(function(b) {
    //               //       if( b['item_id'] == a['item_id'] ) {
    //               //         b['qty'] += a['qty'];
    //               //         return true;
    //               //       }
    //               //     })[0];
    //               //     if(!fil_) o['sub_items'] = o['sub_items'].concat(a);
    //               //   console.log(a);
    //               // })  ;
    //             } 
                
    //           });
    //         }
    //       });
    //       console.log(this.global_Order_list);
    //       let gol = this.global_Order_list;
    //       for(let i = 0; i < gol.length ; i++) {
    //         let rows = JSON.parse (JSON.stringify(gol[i]['sub_items'])), tmp = [];
    //         let count = 0;
    //         // console.log(rows);
    //         for (let j = 0; j < rows.length ; j++) {
    //           let c = -1;
    //           let fl = tmp.filter(function(f, idx) {
    //             if (f['item_id'] == rows[j]['item_id']) {
    //               c = idx;
    //               return true;
    //             }
    //           })[0];
    //           count += rows[j]['qty'];
    //           if(fl) {
    //             tmp[c]['qty'] += rows[j]['qty'];
    //           }
    //           else {
    //             tmp.push(rows[j]);
    //           }
    //         }
    //         // console.log('tmp', tmp);
    //         gol[i]['sub_items'] = tmp;
    //         gol[i]['item_count'] = count;
    //       }
    //     });
    
    //   });
    // });

 
  }

  ngAfterViewInit() {
    console.log('Values on ngAfterViewInit():');
  } 

  dateToString() { 
    let d = new Date();
    return ("0" + d.getDate()).slice(-2) + "/" + ("0"+(d.getMonth()+1)).slice(-2) + "/" +
    d.getFullYear()
    //  + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2)
     ;
  }

  getOrders() {
    this.ds.getOrders()
      .subscribe(data => {
        console.log(data);
        this.global_Order_list = data.filter(function(d) {
          return d['ship_date'] && d['ship_date'] !=='';
        });
        this.filter();
      });
  }

  openAdd() {
    this.add_name = {
      id:"", order_id: null, tech_id: "", order_date: " ", ship_date: null, 
      sub_items: [{item_id: "", item_desc: "", qty: 0}]
        };
    this.modalService.open(this.content, { centered: true });
  }

  add() {
    console.log(this.add_name);
    const _self = this;
    _self.modalService.dismissAll(_self.content);
    this.ds.postOrders(
      {         
        name: this.add_name['name'], 
        Order_id: this.add_name['Order_id'], 
        service_id: this.add_name['service_id'], 
        active: this.add_name['active'], 
        sub_item: this.add_name['sub_item']        
      }
    ).subscribe(data => {
      console.log(data);
    });
  }

  edit(i) {
    this.selectedRowId = i;
    this.edit_name = this.Order_list[this.selectedRowId];
    this.edit_active = this.edit_name['active'];
    this.modalService.open(this.content_edit, { centered: true });
  }

  save() {
    this.modalService.dismissAll();
    this.edit_name['active'] = this.edit_active;
    this.ds.updateOrders(this.Order_list[this.selectedRowId].id, this.edit_name)
      .subscribe(data => {
        console.log(data)
      });
  }

  delete(i: number) {
    // console.log(i, this.Order_list[i]);
    this.selectedRowId = i;
    this.delete_name = this.Order_list[ this.selectedRowId ];
    this.modalService.open(this.content_delete, { centered: true });
  }

  deleteProcess() {
    const _self = this;
    _self.modalService.dismissAll();
    this.ds.deleteOrders(this.Order_list[this.selectedRowId].id)
      .subscribe(data => {
        console.log(data)
      });
  }

  filter() {
    if(this.searchString == "")
      this.Order_list = this.global_Order_list;
    else {
      const se = this.searchString.toLowerCase();
      this.Order_list =  this.global_Order_list.filter(function(Order) {
          if( 
            Order['tech_id'].toLowerCase().indexOf(se) != -1 ||
            Order['order_date'].toLowerCase().indexOf(se) != -1 ||
            Order['depot_id'].toLowerCase().indexOf(se) != -1 ||
            Order['service_id'].toLowerCase().indexOf(se) != -1
          )
            return true;
          else
            return false;
        }); 
    } 
  }

  activeFilter() {
    this.active = (this.active + 1) % 3;
    switch(this.active) {
      case 0:
        this.Order_list = this.global_Order_list.filter(function(Order) {
          if ( Order['active'] == false )
            return true;
        }); 
        break;
      case 1:
        this.Order_list = this.global_Order_list.filter(function(Order) {
          if ( Order['active'] == true )
            return true;
        }); 
        break;
      case 2:
        this.Order_list = this.global_Order_list;

    }
  }

  open_sub_add() {
    this.add_name.sub_items.push({item_id: "", item_desc: "", qty: 0});
    // this.activeModalService = this.modalService.open(_content, {centered: true});
  }
  open_sub_edit() {
    this.edit_name.sub_items.push({item_id: "", item_desc: "", qty: 0});
    // this.activeModalService = this.modalService.open(_content, {centered: true});
  }

  select_item_add(itemId) {
    const sel_item = this.item_list.filter( function(d) {
        return d['item_id'] == itemId;
      })[0];
      
    let sub_item = this.add_name.sub_items.filter( function(d) {
      return d['item_id'] == itemId;
    })[0];

    sub_item['item_desc'] = sel_item['Order_name'];
  }

  select_item_edit(itemId) {
    const sel_item = this.item_list.filter( function(d) {
        return d['item_id'] == itemId;
      })[0];
      
    let sub_item = this.edit_name.sub_items.filter( function(d) {
      return d['item_id'] == itemId;
    })[0];

    sub_item['item_desc'] = sel_item['Order_name'];
  }

  remove_item_add(idx) {
    this.add_name.sub_items.splice(idx, 1);
  }

  remove_item_edit(idx) {
    this.edit_name.sub_items.splice(idx, 1);
  }

  sub_insert() {
    this.activeModalService.dismiss();
  }

  tech_change(tech_id) {
    let filtered_tech = this.tech_list.filter(function(e) {
      return e['name'] == tech_id;
    })[0];
    this.add_name['depot_id'] = filtered_tech['depot_id'];
    this.add_name['service_id'] = filtered_tech['service_id'];
  }

 

  open_clear_modal(content) {
    this.modalService.open(content, {centered: true});
  }

  clear_orders() {
    const _self = this;
    this.modalService.dismissAll();
    this.global_Order_list.forEach(function(d) {
      if(d['order_date']) {

        _self.ds.postOrders({
          tech_id: d['name'],
          order_date: d['order_date'],
          ship_date: _self.dateToString(), 
          depot_id: d['depot_id'],
          service_id: d['service_id'],
          sub_items: d['sub_items']
        })
        .subscribe(data => {
          console.log(data)
        });
        
        _self.ts.updateTechs(d['id'], {
          tech_id: d['tech_id'],
          name: d['name'],
          email: d['email'],
          service_id: d['service_id'],
          van_id: d['van_id'],
          depot_id: d['depot_id'],
          active: false,
          login_detail: d['login_detail']
        })
        .subscribe(data => console.log(data));
      }
    });

  }
}
