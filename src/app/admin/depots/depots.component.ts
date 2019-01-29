import { Component, OnInit, ViewChild, Input, AfterViewInit } from '@angular/core';
import { DepotsService, Depot } from '../models/depots.service'
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-depots',
  templateUrl: './depots.component.html',
  styleUrls: ['./depots.component.css']
})
export class DepotsComponent implements OnInit, AfterViewInit {
 
  @ViewChild('content')
  content: NgbActiveModal;

  @ViewChild('content_delete')
  content_delete: NgbActiveModal;

  @ViewChild('content_edit')
  content_edit: NgbActiveModal;

  dtOptions = {};
  depot_list: Array<Depot> = [{id:"", description: ""}];
  global_depot_list = [];
  add_name = "";
  edit_name = "";
  delete_name = "";
  selectedRowId;

  searchString = "";

  id_exits = false;
  constructor(private ds: DepotsService, private modalService: NgbModal) { }

  ngOnInit() {
    const _self = this;
    this.dtOptions = {
      dom: 'rtip',
      ordering: false      
    }

    this.getDepots();
  }

  ngAfterViewInit() {
    console.log('Values on ngAfterViewInit():');
  } 

  getDepots() {
    this.ds.getDepots()
      .subscribe(data => {
        console.log(data);
        this.global_depot_list = data;
        this.filter();
      });
  }

  openAdd() {
    this.id_exits = false;
    this.add_name = "";
    this.modalService.open(this.content, { centered: true });
  }

  add() {
    console.log(this.add_name);
    const _self = this;
    _self.modalService.dismissAll(_self.content);
    this.ds.postDepots({
      "description": this.add_name
    }).subscribe(data => {
      console.log(data);
    });
  }
  
  edit(i) {
    this.id_exits = false;
    this.selectedRowId = i;
    this.edit_name = this.depot_list[this.selectedRowId].description;
    this.modalService.open(this.content_edit, { centered: true });
  }

  save() {
    this.modalService.dismissAll();
    this.ds.updateDepots(this.depot_list[this.selectedRowId].id, {"description": this.edit_name})
      .subscribe(data => {
        console.log(data)
      });
  }

  delete(i: number) {
    // console.log(i, this.depot_list[i]);
    this.selectedRowId = i;
    this.delete_name = this.depot_list[ this.selectedRowId ].description;
    this.modalService.open(this.content_delete, { centered: true });
  }

  deleteProcess() {
    const _self = this;
    _self.modalService.dismissAll();
    this.ds.deleteDepots(this.depot_list[this.selectedRowId].id)
      .subscribe(data => {
        console.log(data)
      });
  }

  filter() {
    if(this.searchString == "")
      this.depot_list = this.global_depot_list;
    else {
      const se = this.searchString.toLowerCase();
      this.depot_list =  this.global_depot_list.filter(function(item) {
          if( item['description'].toLowerCase().indexOf(se) != -1)
            return true;
          else
            return false;
        }); 
    }
  }
  
  checkId(id) {
    let fil = this.global_depot_list.filter(function(item) {
      return item['description'] == id;
    });
    if(fil.length) this.id_exits = true;
    else this.id_exits = false;
  }
  edit_checkId(id) {
    let gol = JSON.parse(JSON.stringify( this.global_depot_list));
    gol.splice(this.selectedRowId, 1);
    let fil = gol.filter(function(item) {
      return item['description'] == id;
    });
    if(fil.length) this.id_exits = true;
    else this.id_exits = false;
  }
}
