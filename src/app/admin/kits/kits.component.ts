import { Component, OnInit, ViewChild, Input, AfterViewInit } from '@angular/core';
import { KitsService, Kit } from '../models/kits.service';
import { ServicesService, Service } from '../models/services.service';
import { ItemsService, Item } from '../models/items.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { from } from 'rxjs';

@Component({
  selector: 'app-kits',
  templateUrl: './kits.component.html',
  styleUrls: ['./kits.component.css']
})
export class KitsComponent implements OnInit, AfterViewInit {
 
  @ViewChild('content')
  content: NgbActiveModal;

  @ViewChild('content_delete')
  content_delete: NgbActiveModal;

  @ViewChild('content_edit')
  content_edit: NgbActiveModal;

  dtOptions = {};
  Kit_list: Array<Kit> = [{
    id:"", name: "", kit_id: "", service_id: "", active: false, 
    sub_item: [{item_id: "", item_desc: "", qty: 0}]
  }];
  
  global_Kit_list = [];
  
  service_list: Service[];
  item_list: Item[];
  item_list_sub: Item[];

  sel_idx;
  editing_no;

  add_name: Kit = {
    id:"", name: "", kit_id: "", service_id: "", active: false, 
    sub_item: [{item_id: "", item_desc: "", qty: 0}]
  };
  
  edit_name: Kit = {
    id:"", name: "", kit_id: "", service_id: "", active: false, 
    sub_item: [{item_id: "", item_desc: "", qty: 0}]
  };

  delete_name: Kit = {
    id:"", name: "", kit_id: "", service_id: "", active: false, 
    sub_item: [{item_id: "", item_desc: "", qty: 0}]
  };

  selectedRowId; 

  searchString = "";
  active = 2;
  edit_active;
  id_exits = false;

  private activeModalService: NgbActiveModal;

  constructor(
    private ds: KitsService, 
    private ss: ServicesService, 
    private is: ItemsService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    const _self = this;
    this.dtOptions = {
      dom: 'rtip',
      ordering: false      
    }

    this.getKits();
    this.ss.getServices()
      .subscribe(data => {
        console.log(data);
        this.service_list = data;
      });

    this.is.getItems()
      .subscribe(data => {
        console.log(data);
        this.item_list = data;
      })
  }

  ngAfterViewInit() {
    console.log('Values on ngAfterViewInit():');
  } 

  getKits() {
    this.ds.getKits()
      .subscribe(data => {
        console.log(data);
        this.global_Kit_list = data;
        this.filter();
      });
  }

  openAdd() {
    this.add_name = {
      id:"", name: "", kit_id: "", service_id: "", active: true, 
      sub_item: [{item_id: "", item_desc: "", qty: 0}]
    };
    this.editing_no = 0;
    this.id_exits = false;
    this.item_list_sub = JSON.parse(JSON.stringify( this.item_list));
    this.modalService.open(this.content, { centered: true });
  }

  add() {
    // console.log(this.add_name);
//////////////////////////////
    this.add_name['sub_item'] = this.add_name['sub_item'].filter(function(s) {
      return s['item_id'] !== "";
    });
    if(this.add_name['sub_item'].length === 0) {
      alert ( "Please Insert Item Information." );
      return;
    }
    
//////////////////////////////////
    const _self = this;
    _self.modalService.dismissAll(_self.content);
    this.ds.postKits(
      {         
        name: this.add_name['name'], 
        kit_id: this.add_name['kit_id'], 
        service_id: this.add_name['service_id'], 
        active: this.add_name['active'], 
        sub_item: this.add_name['sub_item']        
      }
    ).subscribe(data => {
      console.log(data);
    });
  }

  edit(i) {
    this.id_exits = false;
    this.selectedRowId = i;
    this.item_list_sub = JSON.parse(JSON.stringify( this.item_list));
    this.edit_name = JSON.parse( JSON.stringify(this.Kit_list[this.selectedRowId]) ) ;
    
    let sub = this.item_list_sub;
    this.edit_name['sub_item'].forEach(function(e) {
      sub.forEach(function(s, idx) {
         if( s['item_id'] == e['item_id'] ) {
           sub.splice(idx, 1);
           return;
         } 
      });
    });
    this.item_list_sub.push({item_id: "", description: "", cost: 0, id: '', active: true});
    this.sel_idx = this.item_list_sub.length - 1;
    this.editing_no = this.edit_name['sub_item'].length ;
    this.edit_active = this.edit_name['active'];
    this.modalService.open(this.content_edit, { centered: true });
  }

  save() {
    //////////////////////////////
    this.edit_name['sub_item'] = this.edit_name['sub_item'].filter(function(s) {
      return s['item_id'] !== "";
    });
    if(this.edit_name['sub_item'].length === 0) {
      alert ( "Please Insert Item Information." );
      return;
    }
    
//////////////////////////////////
    this.modalService.dismissAll();
    this.edit_name['active'] = this.edit_active;
    this.ds.updateKits(this.Kit_list[this.selectedRowId].id, this.edit_name)
      .subscribe(data => {
        console.log(data)
      });
  }

  delete(i: number) {
    // console.log(i, this.Kit_list[i]);
    this.selectedRowId = i;
    this.delete_name = this.Kit_list[ this.selectedRowId ];
    this.modalService.open(this.content_delete, { centered: true });
  }

  deleteProcess() {
    const _self = this;
    _self.modalService.dismissAll();
    this.ds.deleteKits(this.Kit_list[this.selectedRowId].id)
      .subscribe(data => {
        console.log(data)
      });
  }

  filter() {
    if(this.searchString == "")
      this.Kit_list = this.global_Kit_list;
    else {
      const se = this.searchString.toLowerCase();
      this.Kit_list =  this.global_Kit_list.filter(function(Kit) {
          if( 
            Kit['name'].toLowerCase().indexOf(se) != -1 ||
            Kit['kit_id'].toLowerCase().indexOf(se) != -1 ||
            Kit['service_id'].toLowerCase().indexOf(se) != -1
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
        this.Kit_list = this.global_Kit_list.filter(function(Kit) {
          if ( Kit['active'] == false )
            return true;
        }); 
        break;
      case 1:
        this.Kit_list = this.global_Kit_list.filter(function(Kit) {
          if ( Kit['active'] == true )
            return true;
        }); 
        break;
      case 2:
        this.Kit_list = this.global_Kit_list;

    }
  }

  open_sub_add() {

    if(this.add_name['sub_item'].length)
    if( 
      this.item_list_sub.length === 0 || this.item_list_sub.length === 1 ||
      this.add_name['sub_item'][this.add_name['sub_item'].length-1]['item_id'] === ''
       ) return;
    this.add_name.sub_item.push({item_id: "", item_desc: "", qty: 0});
    this.editing_no = this.add_name['sub_item'].length-1;
    // console.log(this.editing_no);
    // console.log(this.add_name.sub_item);
    this.item_list_sub.splice(this.sel_idx, 1);
    // console.log(this.sel_idx, this.item_list_sub);

    // this.activeModalService = this.modalService.open(_content, {centered: true});
  }
  open_sub_edit() {
    if(this.edit_name['sub_item'].length)
    if( 
      this.item_list_sub.length === 0 || this.item_list_sub.length === 1 ||
      this.edit_name['sub_item'][this.edit_name['sub_item'].length-1]['item_id'] === ''
       ) return;
    this.edit_name.sub_item.push({item_id: "", item_desc: "", qty: 0});
    this.editing_no = this.edit_name['sub_item'].length-1;
    this.item_list_sub.splice(this.sel_idx, 1);

    // this.activeModalService = this.modalService.open(_content, {centered: true});
  }

  select_item_add(itemId) {
    const _self = this;
    const sel_item = this.item_list_sub.filter( function(d, idx) {
        if(d['item_id'] == itemId) {
          _self.sel_idx = idx;
          return true;
        }
      })[0];
          
    let sub_item = this.add_name.sub_item.filter( function(d) {
      return d['item_id'] == itemId;
    })[0];

    sub_item['item_desc'] = sel_item['description'];

  }

  select_item_edit(itemId) {
    const _self = this;
    const sel_item = this.item_list_sub.filter( function(d, idx) {
        if(d['item_id'] == itemId) {
          _self.sel_idx = idx;
          return true;
        }
      })[0];
      
    let sub_item = this.edit_name.sub_item.filter( function(d) {
      return d['item_id'] == itemId;
    })[0];

    sub_item['item_desc'] = sel_item['description'];
  }

  remove_item_add(idx) {
    // console.log(this.item_list_sub);
    // console.log(this.add_name.sub_item);
    let re = JSON.parse( JSON.stringify( this.add_name.sub_item.splice(idx, 1)[0] ) );
    // console.log(re);
    if(re['item_id'])
    this.item_list_sub.push({
      item_id: re['item_id'],
      description: re['item_desc'],
      cost: 0,
      id: '',
      active: true
    });
    // console.log(this.item_list_sub);

  }

  remove_item_edit(idx) {
    let re = JSON.parse( JSON.stringify( this.edit_name.sub_item.splice(idx, 1)[0] ) );

    if(re['item_id'])
    this.item_list_sub.push({
      item_id: re['item_id'],
      description: re['item_desc'],
      cost: 0,
      id: '',
      active: true
    });
  }

  sub_insert() {
    this.activeModalService.dismiss();
  }

  checkId(id) {
    let fil = this.global_Kit_list.filter(function(item) {
      return item['kit_id'] == id;
    });
    if(fil.length) this.id_exits = true;
    else this.id_exits = false;
  }
  edit_checkId(id) {
    let gol = JSON.parse(JSON.stringify(this.global_Kit_list));
    gol.splice(this.selectedRowId, 1);
    let fil = gol.filter(function(item) {
      return item['kit_id'] == id;
    });
    if(fil.length) this.id_exits = true;
    else this.id_exits = false;
  }
}
