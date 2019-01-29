import { Component, OnInit, ViewChild, Input, AfterViewInit } from '@angular/core';
import { TechsService, Tech } from '../models/techs.service';
import { ServicesService, Service } from '../models/services.service';
import { VansService, Van } from '../models/vans.service';
import { Depot, DepotsService } from '../models/depots.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { from } from 'rxjs';

@Component({
  selector: 'app-techs',
  templateUrl: './techs.component.html',
  styleUrls: ['./techs.component.css']
})
export class TechsComponent implements OnInit, AfterViewInit {
 
  @ViewChild('content')
  content: NgbActiveModal;

  @ViewChild('content_delete')
  content_delete: NgbActiveModal;

  @ViewChild('content_edit') 
  content_edit: NgbActiveModal;

  dtOptions = {};
  Tech_list: Array<Tech> = [{
    id:"", name: "", tech_id: "", email: "", service_id: "", active: false, 
    van_id: "", depot_id: "", login_detail: ""
  }];
  
  global_Tech_list = [];
  
  service_list: Service[];
  van_list: Van[];
  depot_list: Depot[];

  add_name: Tech = {
    id:"", name: "", tech_id: "", email: "", service_id: "", active: false, 
    van_id: "", depot_id: "", login_detail: ""
  };
  
  edit_name: Tech = {
    id:"", name: "", tech_id: "", email: "", service_id: "", active: false, 
    van_id: "", depot_id: "", login_detail: ""
  };

  delete_name: Tech = {
    id:"", name: "", tech_id: "", email: "", service_id: "", active: false, 
    van_id: "", depot_id: "", login_detail: ""
  };

  selectedRowId; 

  searchString = "";
  active = 2;
  edit_active;
  id_exits = false;

  private activeModalService: NgbActiveModal;

  constructor(
    private ts: TechsService, 
    private ss: ServicesService, 
    private vs: VansService,
    private ds: DepotsService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    const _self = this;
    this.dtOptions = {
      dom: 'rtip',
      ordering: false      
    }

    this.getTechs();
    this.ss.getServices()
      .subscribe(data => {
        console.log(data);
        this.service_list = data;
      });

    this.vs.getVans()
      .subscribe(data => {
        console.log(data);
        this.van_list = data;
      });

    this.ds.getDepots()
      .subscribe(data => {
        console.log(data);
        this.depot_list = data;
      });
  }

  ngAfterViewInit() {
    console.log('Values on ngAfterViewInit():');
  } 

  getTechs() {
    this.ts.getTechs()
      .subscribe(data => {
        console.log(data);
        this.global_Tech_list = data;
        this.filter();
      });
  }

  openAdd() {
    this.add_name = {
      id:"", name: "", tech_id: "", email: "", service_id: "", active: true, 
      van_id: "", depot_id: "", login_detail: ""
      };
      this.id_exits = false;
      this.modalService.open(this.content, { centered: true });
  }

  add() {
    console.log(this.add_name);
    const _self = this;
    _self.modalService.dismissAll(_self.content);
    this.ts.postTechs(
      {         
        name: this.add_name['name'], 
        tech_id: this.add_name['tech_id'], 
        email: this.add_name['email'], 
        service_id: this.add_name['service_id'], 
        van_id: this.add_name['van_id'], 
        depot_id: this.add_name['depot_id'], 
        active: this.add_name['active'], 
        login_detail: this.add_name['login_detail']        
      }
    ).subscribe(data => {
      console.log(data);
    });
  }

  edit(i) {
    this.id_exits = false;
    this.selectedRowId = i;
    this.edit_name = JSON.parse(JSON.stringify(this.Tech_list[this.selectedRowId]));
    this.edit_active = this.edit_name['active'];
    this.modalService.open(this.content_edit, { centered: true });
  }

  save() {
    this.modalService.dismissAll();
    this.edit_name['active'] = this.edit_active;
    this.ts.updateTechs(this.Tech_list[this.selectedRowId].id, this.edit_name)
      .subscribe(data => {
        console.log(data)
      });
  }

  delete(i: number) {
    // console.log(i, this.Tech_list[i]);
    this.selectedRowId = i;
    this.delete_name = this.Tech_list[ this.selectedRowId ];
    this.modalService.open(this.content_delete, { centered: true });
  }

  deleteProcess() {
    const _self = this;
    _self.modalService.dismissAll();
    this.ts.deleteTechs(this.Tech_list[this.selectedRowId].id)
      .subscribe(data => {
        console.log(data)
      });
  }

  filter() {
    if(this.searchString == "")
      this.Tech_list = this.global_Tech_list;
    else {
      const se = this.searchString.toLowerCase();
      this.Tech_list =  this.global_Tech_list.filter(function(Tech) {
          if( 
            Tech['name'].toLowerCase().indexOf(se) != -1 ||
            Tech['id'].toLowerCase().indexOf(se) != -1 ||
            Tech['email'].toLowerCase().indexOf(se) != -1 ||
            Tech['van_id'].toLowerCase().indexOf(se) != -1 ||
            Tech['depot_id'].toLowerCase().indexOf(se) != -1 ||
            Tech['service_id'].toLowerCase().indexOf(se) != -1
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
        this.Tech_list = this.global_Tech_list.filter(function(Tech) {
          if ( Tech['active'] == false )
            return true;
        }); 
        break;
      case 1:
        this.Tech_list = this.global_Tech_list.filter(function(Tech) {
          if ( Tech['active'] == true )
            return true;
        }); 
        break;
      case 2:
        this.Tech_list = this.global_Tech_list;

    }
  }
  checkId(id) {
    let fil = this.global_Tech_list.filter(function(item) {
      return item['tech_id'] == id;
    });
    if(fil.length) this.id_exits = true;
    else this.id_exits = false;
  }
  edit_checkId(id) {
    let gol = JSON.parse(JSON.stringify(this.global_Tech_list));
    gol.splice(this.selectedRowId, 1);
    let fil = gol.filter(function(item) {
      return item['tech_id'] == id;
    });
    if(fil.length) this.id_exits = true;
    else this.id_exits = false;
  }
  // open_sub_add() {
  //   this.add_name.sub_item.push({item_id: "", item_desc: "", qty: 0});
  //   // this.activeModalService = this.modalService.open(_content, {centered: true});
  // }
  // open_sub_edit() {
  //   this.edit_name.sub_item.push({item_id: "", item_desc: "", qty: 0});
  //   // this.activeModalService = this.modalService.open(_content, {centered: true});
  // }

  // select_item_add(itemId) {
  //   const sel_item = this.item_list.filter( function(d) {
  //       return d['item_id'] == itemId;
  //     })[0];
      
  //   let sub_item = this.add_name.sub_item.filter( function(d) {
  //     return d['item_id'] == itemId;
  //   })[0];

  //   sub_item['item_desc'] = sel_item['Tech_name'];
  // }

  // select_item_edit(itemId) {
  //   const sel_item = this.item_list.filter( function(d) {
  //       return d['item_id'] == itemId;
  //     })[0];
      
  //   let sub_item = this.edit_name.sub_item.filter( function(d) {
  //     return d['item_id'] == itemId;
  //   })[0];

  //   sub_item['item_desc'] = sel_item['Tech_name'];
  // }

  // remove_item_add(idx) {
  //   this.add_name.sub_item.splice(idx, 1);
  // }

  // remove_item_edit(idx) {
  //   this.edit_name.sub_item.splice(idx, 1);
  // }

  // sub_insert() {
  //   this.activeModalService.dismiss();
  // }
}
