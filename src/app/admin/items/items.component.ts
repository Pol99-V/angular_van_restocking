import { Component, OnInit, ViewChild, Input, AfterViewInit } from '@angular/core';
import { ItemsService, Item } from '../models/items.service'
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit, AfterViewInit {
 
  @ViewChild('content')
  content: NgbActiveModal;

  @ViewChild('content_delete')
  content_delete: NgbActiveModal;

  @ViewChild('content_edit')
  content_edit: NgbActiveModal;

  dtOptions = {};
  Item_list: Array<Item> = [{id:"", description: "", item_id: "", cost: 0, active: false}];
  global_Item_list = [];
  add_name: Item = {id:"", description: "", item_id: "", cost: 0, active: false};
  edit_name: Item = {id:"", description: "", item_id: "", cost: 0, active: false};
  delete_name: Item = {id:"", description: "", item_id: "", cost: 0, active: false};
  selectedRowId;

  searchString = "";
  active = 2;
  edit_active;

  id_exits = false;
  constructor(private ds: ItemsService, private modalService: NgbModal) { }

  ngOnInit() {
    const _self = this;
    this.dtOptions = {
      dom: 'rtip',
      ordering: false      
    }

    this.getItems();
  }

  ngAfterViewInit() {
    console.log('Values on ngAfterViewInit():');
  } 

  getItems() {
    this.ds.getItems()
      .subscribe(data => {
        console.log(data);
        this.global_Item_list = data;
        this.filter();
      });
  }

  openAdd() {
    this.id_exits = false;
    this.add_name = {id:null, description: "", item_id: "", cost: 0, active: true};
    this.modalService.open(this.content, { centered: true });
  }

  add() {
    console.log(this.add_name);
    const _self = this;
    _self.modalService.dismissAll(_self.content);
    this.ds.postItems(
      { 
        item_id: this.add_name['item_id'],
        description: this.add_name['description'],
        cost: this.add_name['cost'],
        active: this.add_name['active']
      }
    ).subscribe(data => {
      console.log(data);
    });
  }

  edit(i) {
    this.id_exits = false;
    this.selectedRowId = i;
    this.edit_name = JSON.parse(JSON.stringify(this.Item_list[this.selectedRowId]));
    this.edit_active = this.edit_name['active'];
    this.modalService.open(this.content_edit, { centered: true });
  }

  save() {
    this.modalService.dismissAll();
    this.edit_name['active'] = this.edit_active;
    this.ds.updateItems(this.Item_list[this.selectedRowId].id, this.edit_name)
      .subscribe(data => {
        console.log(data)
      });
  }

  delete(i: number) {
    // console.log(i, this.Item_list[i]);
    this.selectedRowId = i;
    this.delete_name = this.Item_list[ this.selectedRowId ];
    this.modalService.open(this.content_delete, { centered: true });
  }

  deleteProcess() {
    const _self = this;
    _self.modalService.dismissAll();
    this.ds.deleteItems(this.Item_list[this.selectedRowId].id)
      .subscribe(data => {
        console.log(data)
      });
  }

  filter() {
    if(this.searchString == "")
      this.Item_list = this.global_Item_list;
    else {
      const se = this.searchString.toLowerCase();
      this.Item_list =  this.global_Item_list.filter(function(item) {
          if( 
            item['description'].toLowerCase().indexOf(se) != -1 ||
            item['item_id'].toLowerCase().indexOf(se) != -1 ||
            item['cost'].toString().indexOf(se) != -1
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
        this.Item_list = this.global_Item_list.filter(function(item) {
          if ( item['active'] == false )
            return true;
        }); 
        break;
      case 1:
        this.Item_list = this.global_Item_list.filter(function(item) {
          if ( item['active'] == true )
            return true;
        }); 
        break;
      case 2:
        this.Item_list = this.global_Item_list;

    }
  }

  setTwoNumberDecimal($event) {
    $event.target.value = parseFloat($event.target.value).toFixed(2);
  }

  checkId(id) {
    let fil = this.global_Item_list.filter(function(item) {
      return item['item_id'] == id;
    });
    if(fil.length) this.id_exits = true;
    else this.id_exits = false;
  }
  edit_checkId(id) {
    let gol = JSON.parse(JSON.stringify(this.global_Item_list));
    gol.splice(this.selectedRowId, 1);
    let fil = gol.filter(function(item) {
      return item['item_id'] == id;
    });
    if(fil.length) this.id_exits = true;
    else this.id_exits = false;
  }

}
