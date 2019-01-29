import { filter } from 'rxjs/operators';
import { Component, OnInit, ViewChild, Input, AfterViewInit } from '@angular/core';
import { OrdersService, Order } from '../models/orders.service';
import { NgbActiveModal, NgbModal, } from '@ng-bootstrap/ng-bootstrap';
import { Item, ItemsService } from '../models/items.service';
import { Tech, TechsService } from '../models/techs.service';
import { PrintService } from '../../print.service';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-current-orders',
  templateUrl: './current-orders.component.html',
  styleUrls: ['./current-orders.component.css']
})
export class CurrentOrdersComponent implements OnInit {
 
  @ViewChild (DataTableDirective)
  dtElement: DataTableDirective;

  @ViewChild('content')
  content: NgbActiveModal;

  @ViewChild('content_delete')
  content_delete: NgbActiveModal;

  @ViewChild('content_edit')
  content_edit: NgbActiveModal;

  dtOptions = {};

  order_list: Array<Order> = [{
    id:"", order_id: null, tech_id: "", order_date: " ", ship_date: null, 
    sub_items: [{item_id: "", item_desc: "", qty: 0}]
  }];

  full_order_list: Order[];
  
  tech_list: Tech[] = [{
    id:"", name: "", tech_id: "", email: "", service_id: "", active: false, 
    van_id: "", depot_id: "", login_detail: ""
  }];
   
  global_Order_list = [];
  
  item_list: Item[];
  item_list_sub: Item[];

  sel_idx;
  editing_no;

  add_name: Order = {
    id:"", order_id: 0, tech_id: "", order_date: " ", ship_date: null,
    sub_items: [{item_id: "", item_desc: "", qty: 0}]
  };
  
  edit_name: Order = {
    id:"", order_id: 0, tech_id: "", order_date: " ", ship_date: null,
    sub_items: [{item_id: "", item_desc: "", qty: 0}]
  };

  delete_name: Order = {
    id:"", order_id: 0, tech_id: "", order_date: " ", ship_date: null,
    sub_items: [{item_id: "", item_desc: "", qty: 0}]
  };

  selectedRowId; 

  searchString = "";
  active = 2;
  edit_active;
  order_number = 1001;

  private activeModalService: NgbActiveModal;

  date: {year: number, month: number};

  constructor(
    private os: OrdersService, 
    private is: ItemsService,
    private ts: TechsService,
    private modalService: NgbModal,
    private printService: PrintService
  ) { }

  ngOnInit() {
    const _self = this; 
    this.dtOptions = {
      dom: 'rtp',
      ordering: false      
    }

    this.ts.getTechs()
    .subscribe(data => {
      this.tech_list = data.filter(function(d) {
        return d['active'];
      });

      this.os.getOrders()
      .subscribe(data_order => {
        
        this.full_order_list = JSON.parse(JSON.stringify(data_order));
        this.order_list = data_order.filter(function(o) {
          return ( (!o['ship_date']) || (o['ship_date'] == '') )
        });

        const _self = this;
        _self.global_Order_list = [];
        this.tech_list.forEach(function(o) {
          let fil_van = _self.order_list.filter(function(v) {
            return o['tech_id'] == v['tech_id'];
          })[0];
          if(fil_van) {
            let item_count = 0;
            fil_van['sub_items'].forEach(function(a){
              item_count += a['qty'];
            });

            _self.global_Order_list.push({
              ...fil_van,
              tech_id: o['tech_id'],
              depot_id: o['depot_id'],
              service_id: o['service_id'],
              item_count: item_count,
              tech_idx: o['id'],
              name: o['name'],
              email: o['email'],
              van_id: o['van_id'],
              login_detail: o['login_detail']
            });

            // id:"", name: "", tech_id: "", email: "", service_id: "", active: false, 
            // van_id: "", depot_id: "", login_detail: ""
            // o['order_date'] = fil_van['order_date'];
            // o['sub_items'] = fil_van['sub_items'];
            // o['order_id'] = fil_van['order_id'] = _self.generateOrderNumber();
          } else {
            _self.global_Order_list.push({
              tech_id: o['tech_id'],
              depot_id: o['depot_id'],
              service_id: o['service_id'],
              order_id: _self.generateOrderNumber( o['tech_id']),
              tech_idx: o['id'],
              name: o['name'],
              email: o['email'],
              van_id: o['van_id'],
              login_detail: o['login_detail']
            });
          }
        
        });

        this.global_Order_list.sort(function(a, b){
          return a['order_id'] - b['order_id'];
        });
        this.filter();

    
      });
    });

    this.is.getItems() 
      .subscribe(data => {
        this.item_list = data;
      })
  }

  ngOnDestroy() {
  }

  ngAfterViewInit() {
    console.log('Values on ngAfterViewInit():');
  } 

  generateOrderNumber(tech_id) {
    if(!this.full_order_list || !this.full_order_list.length) {
      this.full_order_list.push({
        order_id: this.order_number,
        tech_id: tech_id,
        order_date: '',
        ship_date: '',
        sub_items: [],
        id: ''
      });
  
      return this.order_number;
    };
    this.full_order_list.sort(function(a, b) {
      return a['order_id'] - b['order_id'];
    });
    let lastIdx = this.full_order_list[this.full_order_list.length - 1]['order_id'];
    let order_id = lastIdx ? lastIdx + 1 : this.order_number;
    this.full_order_list.push({
      order_id: order_id,
      tech_id: tech_id,
      order_date: '',
      ship_date: '',
      sub_items: [],
      id: ''
    });
    return order_id;
  }

  dateToString() { 
    let d = new Date();
    return ("0" + d.getDate()).slice(-2) + "/" + ("0"+(d.getMonth()+1)).slice(-2) + "/" +
    d.getFullYear()
    //  + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2)
     ;
  }


  openAdd() {
    this.add_name = {
      id:"", order_id: 0, tech_id: "", order_date: null, ship_date: null, 
      sub_items: [{item_id: "", item_desc: "", qty: 0}]
      };
    this.modalService.open(this.content, { centered: true });
  }

  add() {
    console.log(this.add_name);
    const _self = this;
    _self.modalService.dismissAll(_self.content);
    this.os.postOrders(
      {         
        name: this.add_name['name'], 
        order_id: this.add_name['Order_id'], 
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
    this.item_list_sub = JSON.parse(JSON.stringify( this.item_list));
    this.edit_name = JSON.parse(JSON.stringify(this.order_list[this.selectedRowId]));
 
    let sub = this.item_list_sub;
    if(!this.edit_name['sub_items']) {
      this.edit_name['sub_items'] = [{
        item_id: '', item_desc: '', qty: 0
      }];
      this.editing_no = 0;
    } else {
      this.edit_name['sub_items'].forEach(function(e) {
        sub.forEach(function(s, idx) {
           if( s['item_id'] == e['item_id'] ) {
             sub.splice(idx, 1);
             return;
           } 
        });
      });
      this.editing_no = this.edit_name['sub_items'].length ;
      this.item_list_sub.push({item_id: "", description: "", cost: 0, id: '', active: true});
    }
      
    this.sel_idx = this.item_list_sub.length - 1;
    this.edit_active = this.edit_name['active'];
    if(!this.edit_name['order_id'])
        this.edit_name['order_id'] = this.generateOrderNumber(this.edit_name['tech_id']);
    if(!this.edit_name['order_date']) 
        this.edit_name['order_date'] = this.dateToString();
    this.modalService.open(this.content_edit, { centered: true });
  }

  save() {
    // this.edit_name['active'] = this.edit_active;
    this.edit_name['sub_items'] = this.edit_name['sub_items'].filter(function(s) {
      return s['item_id'] !== "";
    });
    if( ! this.edit_name['sub_items'] || !this.edit_name['sub_items'].length) {
      alert("Please Insert Item Information");
      return;
    }

    this.modalService.dismissAll();

    if( !this.order_list[this.selectedRowId].id || this.order_list[this.selectedRowId].id == '') {
      this.os.postOrders({
        tech_id: this.edit_name['tech_id'],
        order_date: this.edit_name['order_date'],
        order_id: this.edit_name['order_id'],
        // ship_date: this.edit_name['ship_date'],
        sub_items: this.edit_name['sub_items']
      })
      .subscribe(data => {
        console.log(data)
      });
    } else {
      this.os.updateOrders(this.order_list[this.selectedRowId].id, {
        tech_id: this.edit_name['tech_id'],
        order_date: this.edit_name['order_date'],
        order_id: this.edit_name['order_id'],
        // ship_date: this.edit_name['ship_date'],
        sub_items: this.edit_name['sub_items']
      })
        .subscribe(data => {
          console.log(data)
        });

    }
  }

  
  delete(i: number) {
    // console.log(i, this.Order_list[i]);
    this.selectedRowId = i;
    this.delete_name = this.order_list[ this.selectedRowId ];
    this.modalService.open(this.content_delete, { centered: true });
  }

  deleteProcess() {
    const _self = this;
    _self.modalService.dismissAll();
    this.os.deleteOrders(this.order_list[this.selectedRowId].id)
      .subscribe(data => {
        console.log(data)
      });
  }

  filter() {
    if(this.searchString == "")
      this.order_list = this.global_Order_list;
    else {
      const se = this.searchString.toLowerCase();
      this.order_list =  this.global_Order_list.filter(function(Order) {
          if( 
            Order['tech_id'].toLowerCase().indexOf(se) != -1 ||
            // Order['order_date'].toLowerCase().indexOf(se) != -1 ||
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
        this.order_list = this.global_Order_list.filter(function(Order) {
          if ( Order['active'] == false )
            return true;
        }); 
        break;
      case 1:
        this.order_list = this.global_Order_list.filter(function(Order) {
          if ( Order['active'] == true )
            return true;
        }); 
        break;
      case 2:
        this.order_list = this.global_Order_list;

    }
  }

  open_sub_add() {
    this.add_name.sub_items.push({item_id: "", item_desc: "", qty: 0});
    // this.activeModalService = this.modalService.open(_content, {centered: true});
  }
  open_sub_edit() {
    if(this.edit_name['sub_items'].length)
    if( 
      this.item_list_sub.length === 0 || this.item_list_sub.length === 1 ||
      this.edit_name['sub_items'][this.edit_name['sub_items'].length-1]['item_id'] === ''
       ) return;
    this.edit_name.sub_items.push({item_id: "", item_desc: "", qty: 0});
    this.editing_no = this.edit_name['sub_items'].length-1;
    this.item_list_sub.splice(this.sel_idx, 1);

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
    const _self = this;
    const sel_item = this.item_list_sub.filter( function(d, idx) {
        if(d['item_id'] == itemId) {
          _self.sel_idx = idx;
          return true;
        }
      })[0];
      
    let sub_item = this.edit_name.sub_items.filter( function(d) {
      return d['item_id'] == itemId;
    })[0];

    sub_item['item_desc'] = sel_item['description'];
  }

  remove_item_add(idx) {
    this.add_name.sub_items.splice(idx, 1);
  }

  remove_item_edit(idx) {
    let re = JSON.parse( JSON.stringify( this.edit_name.sub_items.splice(idx, 1)[0] ) );

    if(re['item_id'])
    this.item_list_sub.push({
      item_id: re['item_id'],
      description: re['item_desc'],
      cost: 0,
      id: '',
      active: true
    });

    this.edit_qty_change();
  }

  sub_insert() {
    this.activeModalService.dismiss();
  }

  editTechChange(tech_id) {
    let filtered_tech = this.tech_list.filter(function(e) {
      return e['tech_id'] == tech_id;
    })[0];
    this.edit_name['depot_id'] = filtered_tech['depot_id'];
    this.edit_name['service_id'] = filtered_tech['service_id'];
  }

 

  open_clear_modal(content) {
    this.modalService.open(content, {centered: true});
  }

  edit_qty_change() {
    const _self = this;
    this.edit_name['item_count'] = 0;
    this.edit_name['sub_items'].forEach(function(e) {
      _self.edit_name['item_count'] += e['qty'];
    });
  }

  clear_orders() {
    const _self = this;
    this.modalService.dismissAll();

    // window.print();
    this.printService
      .printDocument('invoice', this.global_Order_list);

    this.global_Order_list.forEach(function(d) {
      if(d['order_date']) {

        _self.os.updateOrders(d['id'], {
          tech_id: d['tech_id'],
          order_date: d['order_date'],
          order_id: d['order_id'],
          ship_date: _self.dateToString(),
          depot_id: d['depot_id'],
          service_id: d['service_id'],
          item_count: d['item_count'],
          sub_items: d['sub_items']
        })
        .subscribe(data => {
          console.log(data)
        });        

        _self.ts.updateTechs(d['tech_idx'], {
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
