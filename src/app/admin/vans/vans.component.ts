import { Component, OnInit, ViewChild, Input, AfterViewInit } from '@angular/core';
import { VansService, Van } from '../models/vans.service';
import { TechsService, Tech } from '../models/techs.service';
import { KitsService, Kit } from '../models/kits.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { from } from 'rxjs';

@Component({
  selector: 'app-vans',
  templateUrl: './vans.component.html',
  styleUrls: ['./vans.component.css']
})
export class VansComponent implements OnInit, AfterViewInit {
 
  @ViewChild('content')
  content: NgbActiveModal;

  @ViewChild('content_delete')
  content_delete: NgbActiveModal;

  @ViewChild('content_edit')
  content_edit: NgbActiveModal;

  dtOptions = {};
  Van_list = [{
    id:"", description: "", van_id: "", reg: "", active: false, tech_id: "", depot_id: "", service_id: "", order_date: "",
    sub_kits: [{kit_id: "", kit_name: ""}]
  }];
  
  global_Van_list = [];
  
  tech_list: Tech[];
  kit_list: Kit[];
  kit_list_sub: Kit[];

  sel_idx;
  editing_no;

  add_name = {
    id:"", description: "", van_id: "", reg: "", active: false, tech_id: "", depot_id: "", service_id: "", order_date: "",
    sub_kits: [{kit_id: "", kit_name: ""}]
  };
  
  edit_name = {
    id:"", description: "", van_id: "", reg: "", active: false, tech_id: "", depot_id: "", service_id: "", order_date: "",
    sub_kits: [{kit_id: "", kit_name: ""}]
  };

  delete_name = {
    id:"", description: "", van_id: "", reg: "", active: false, tech_id: "", depot_id: "", service_id: "", order_date: "",
    sub_kits: [{kit_id: "", kit_name: ""}]
  };

  selectedRowId; 

  searchString = "";
  active = 2;
  edit_active;

  id_exits = false;
  private activeModalService: NgbActiveModal;

  constructor(
    private ds: VansService, 
    private ts: TechsService, 
    private ks: KitsService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    const _self = this;
    this.dtOptions = {
      dom: 'rtip',
      ordering: false      
    }

    this.getVans();

    this.ks.getKits()
      .subscribe(data => {
        // console.log(data);
        this.kit_list = data;
      });
       
  }

  ngAfterViewInit() {
    console.log('Values on ngAfterViewInit():');
  } 

  getVans() {
    this.ds.getVans()
      .subscribe(data => {
        console.log(data);
        this.global_Van_list = data;
        this.filter();

        this.ts.getTechs()
        .subscribe(data => {
          // console.log(data);
          this.tech_list = data;
          this.global_Van_list.forEach(function(e) {
            let filterTech = data.filter(function(f) {
              return f['tech_id'] == e['tech_id'];
            })[0];
            if(filterTech) {
              e['depot_id'] = filterTech['depot_id'];
              e['service_id'] = filterTech['service_id'];
            }
            
          });
        });
  
      });
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
      id:"", description: "", van_id: "", reg: "", active: true, tech_id: "", depot_id: "", service_id: "", order_date: this.dateToString(),
      sub_kits: [{ kit_id: "", kit_name: "" }]
      };
    this.editing_no = 0;
    this.id_exits = false;
    this.kit_list_sub = JSON.parse(JSON.stringify( this.kit_list));
    this.modalService.open(this.content, { centered: true });
  }

  add() {
    // console.log(this.add_name);
    //////////////////////////////
    this.add_name['sub_kits'] = this.add_name['sub_kits'].filter(function(s) {
      return s['kit_id'] !== "";
    });
    if(this.add_name['sub_kits'].length === 0) {
      alert ( "Please Insert Kit Information." );
      return;
    }
    
//////////////////////////////////
    const _self = this;
    _self.modalService.dismissAll(_self.content);
    this.ds.postVans(
      {         
        description: this.add_name['description'], 
        van_id: this.add_name['van_id'], 
        reg: this.add_name['reg'], 
        tech_id: this.add_name['tech_id'], 
        active: this.add_name['active'],
        order_date: this.dateToString(), 
        sub_kits: this.add_name['sub_kits']        
      }
    ).subscribe(data => {
      console.log(data);
    });

    this.save_tech(this.add_name);
  }

  save_tech(van_ext) {
    let f_tech = this.tech_list.filter(function(e) {
      return e['tech_id'] == van_ext['tech_id'];
    })[0];
    f_tech['van_id'] = van_ext['van_id'];
    this.ts.updateTechs(f_tech['id'], f_tech)
      .subscribe(data => console.log(data));
  }

  edit(i) {
    this.id_exits = false;
    this.selectedRowId = i;
    this.kit_list_sub = JSON.parse(JSON.stringify(this.kit_list));
    this.edit_name = JSON.parse(JSON.stringify(this.Van_list[this.selectedRowId]));

    let sub = this.kit_list_sub;
    this.edit_name['sub_kits'].forEach(function(e) {
      sub.forEach(function(s, idx) {
        if( s['kit_id'] == e['kit_id']) {
          sub.splice(idx, 1);
          return;
        }
      }); 
    });
    this.kit_list_sub.push({
      id:"", name: "", kit_id: "", service_id: "", active: false, 
      sub_item: [{item_id: "", item_desc: "", qty: 0}]
    });
    this.sel_idx = this.kit_list_sub.length - 1;
    this.editing_no = this.edit_name['sub_kits'].length;
    this.edit_active = this.edit_name['active'];
    this.edit_name['order_date'] = this.dateToString();
    this.modalService.open(this.content_edit, { centered: true });
  }

  save() {
    //////////////////////////////
    this.edit_name['sub_kits'] = this.edit_name['sub_kits'].filter(function(s) {
      return s['kit_id'] !== "";
    });
    if(this.edit_name['sub_kits'].length === 0) {
      alert ( "Please Insert Kit Information." );
      return;
    }
    
//////////////////////////////////    
    this.modalService.dismissAll();
    this.edit_name['active'] = this.edit_active;
    this.ds.updateVans(this.Van_list[this.selectedRowId].id, this.edit_name)
      .subscribe(data => {
        console.log(data)
      });
    
    this.save_tech(this.edit_name);
  }

  delete(i: number) {
    // console.log(i, this.Van_list[i]);
    this.selectedRowId = i;
    this.delete_name = this.Van_list[ this.selectedRowId ];
    this.modalService.open(this.content_delete, { centered: true });
  }

  deleteProcess() {
    const _self = this;
    _self.modalService.dismissAll();
    this.ds.deleteVans(this.Van_list[this.selectedRowId].id)
      .subscribe(data => {
        console.log(data)
      });
  }

  filter() {
    if(this.searchString == "")
      this.Van_list = this.global_Van_list;
    else {
      const se = this.searchString.toLowerCase();
      this.Van_list =  this.global_Van_list.filter(function(Van) {
          if( 
            Van['description'].toLowerCase().indexOf(se) != -1 ||
            Van['van_id'].toLowerCase().indexOf(se) != -1 ||
            Van['reg'].toLowerCase().indexOf(se) != -1 ||
            Van['tech_id'].toLowerCase().indexOf(se) != -1 ||
            Van['depot_id'].toLowerCase().indexOf(se) != -1 ||
            Van['service_id'].toLowerCase().indexOf(se) != -1
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
        this.Van_list = this.global_Van_list.filter(function(Van) {
          if ( Van['active'] == false )
            return true;
        }); 
        break;
      case 1:
        this.Van_list = this.global_Van_list.filter(function(Van) {
          if ( Van['active'] == true )
            return true;
        }); 
        break;
      case 2:
        this.Van_list = this.global_Van_list;

    }
  }

  open_sub_add() {
    if(this.add_name['sub_kits'].length)
    if( 
      this.kit_list_sub.length === 0 || this.kit_list_sub.length === 1 ||
      this.add_name['sub_kits'][this.add_name['sub_kits'].length-1]['kit_id'] === ''
       ) return;
    this.add_name.sub_kits.push({kit_id: "", kit_name: ""});
    this.editing_no = this.add_name['sub_kits'].length-1;
    // this.activeModalService = this.modalService.open(_content, {centered: true});
    this.kit_list_sub.splice(this.sel_idx, 1);
  }
  open_sub_edit() {
    if(this.edit_name['sub_kits'].length)
    if( 
      this.kit_list_sub.length === 0 || this.kit_list_sub.length === 1 ||
      this.edit_name['sub_kits'][this.edit_name['sub_kits'].length-1]['kit_id'] === ''
       ) return;
    this.edit_name.sub_kits.push({kit_id: "", kit_name: ""});
    this.editing_no = this.edit_name['sub_kits'].length-1;
    this.kit_list_sub.splice(this.sel_idx, 1);
  // this.activeModalService = this.modalService.open(_content, {centered: true});
  }

  select_item_add(itemId) {
    const _self = this;
    const sel_item = this.kit_list_sub.filter( function(d, idx) {
        if(d['kit_id'] == itemId) {
          _self.sel_idx = idx;
          return true;
        }
      })[0];
      
    let sub_item = this.add_name.sub_kits.filter( function(d) {
      return d['kit_id'] == itemId;
    })[0];

    sub_item['kit_name'] = sel_item['name'];
  }

  select_item_edit(itemId) {
    const _self = this;
    const sel_item = this.kit_list_sub.filter( function(d, idx) {
        if(d['kit_id'] == itemId) {
          _self.sel_idx = idx;
          return true;
        }
      })[0];
      
    let sub_item = this.edit_name.sub_kits.filter( function(d) {
      return d['kit_id'] == itemId;
    })[0];

    sub_item['kit_name'] = sel_item['name'];
  }

  remove_item_add(idx) {
    let re = JSON.parse( JSON.stringify( this.add_name.sub_kits.splice(idx, 1)[0] ) );
    if(re['kit_id'])
    this.kit_list_sub.push({
      kit_id: re['kit_id'],
      name: re['kit_name'],
      service_id: '',
      id: '',
      active: true,
      sub_item: []
    });
  }

  remove_item_edit(idx) {
    let re = JSON.parse( JSON.stringify( this.edit_name.sub_kits.splice(idx, 1)[0] ) );
  
    if(re['kit_id'])
    this.kit_list_sub.push({
      kit_id: re['kit_id'],
      name: re['kit_name'],
      service_id: '',
      id: '',
      active: true,
      sub_item: []
    });
  }

  sub_insert() {
    this.activeModalService.dismiss();
  }

  checkId(id) {
    let fil = this.global_Van_list.filter(function(item) {
      return item['van_id'] == id;
    });
    if(fil.length) this.id_exits = true;
    else this.id_exits = false;
  }
  edit_checkId(id) {
    let gol = JSON.parse(JSON.stringify(this.global_Van_list));
    gol.splice(this.selectedRowId, 1);
    let fil = gol.filter(function(item) {
      return item['van_id'] == id;
    });
    if(fil.length) this.id_exits = true;
    else this.id_exits = false;
  }
}
