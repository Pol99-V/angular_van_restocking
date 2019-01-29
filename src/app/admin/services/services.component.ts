import { Component, OnInit, ViewChild, Input, AfterViewInit } from '@angular/core';
import { ServicesService, Service } from '../models/services.service'
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit, AfterViewInit {
 
  @ViewChild('content')
  content: NgbActiveModal;

  @ViewChild('content_delete')
  content_delete: NgbActiveModal;

  @ViewChild('content_edit')
  content_edit: NgbActiveModal;

  dtOptions = {};
  service_list: Array<Service> = [{id:"", name: ""}];
  global_service_list = [];
  add_name = "";
  edit_name = "";
  delete_name = "";
  selectedRowId;

  searchString = "";

  id_exits = false;
  constructor(private ds: ServicesService, private modalService: NgbModal) { }

  ngOnInit() {
    const _self = this;
    this.dtOptions = {
      dom: 'rtip',
      ordering: false      
    }

    this.getservices();
  }

  ngAfterViewInit() {
    console.log('Values on ngAfterViewInit():');
  } 

  getservices() {
    this.ds.getServices()
      .subscribe(data => {
        console.log(data);
        this.global_service_list = data;
        this.filter();
      });
  }

  openAdd() {
    this.add_name = "";
    this.id_exits = false;
    this.modalService.open(this.content, { centered: true });
  }

  add() {
    console.log(this.add_name);
    const _self = this;
    _self.modalService.dismissAll(_self.content);
    this.ds.postServices({
      "name": this.add_name
    }).subscribe(data => {
      console.log(data);
    });
  }
  
  edit(i) {
    this.selectedRowId = i;
    this.id_exits = false;
    this.edit_name = this.service_list[this.selectedRowId].name;
    this.modalService.open(this.content_edit, { centered: true });
  }

  save() {
    this.modalService.dismissAll();
    this.ds.updateServices(this.service_list[this.selectedRowId].id, {"name": this.edit_name})
      .subscribe(data => {
        console.log(data)
      });
  }

  delete(i: number) {
    // console.log(i, this.service_list[i]);
    this.selectedRowId = i;
    this.delete_name = this.service_list[ this.selectedRowId ].name;
    this.modalService.open(this.content_delete, { centered: true });
  }

  deleteProcess() {
    const _self = this;
    _self.modalService.dismissAll();
    this.ds.deleteServices(this.service_list[this.selectedRowId].id)
      .subscribe(data => {
        console.log(data)
      });
  }

  filter() {
    if(this.searchString == "")
      this.service_list = this.global_service_list;
    else {
      const se = this.searchString.toLowerCase();
      this.service_list =  this.global_service_list.filter(function(item) {
          if( item['name'].toLowerCase().indexOf(se) != -1)
            return true;
          else
            return false;
        }); 
    }
  }

  checkId(id) {
    let fil = this.global_service_list.filter(function(item) {
      return item['name'] == id;
    });
    if(fil.length) this.id_exits = true;
    else this.id_exits = false;
  }
  edit_checkId(id) {
    let gol = JSON.parse(JSON.stringify(this.global_service_list));
    gol.splice(this.selectedRowId, 1);
    let fil = gol.filter(function(item) {
      return item['name'] == id;
    });
    if(fil.length) this.id_exits = true;
    else this.id_exits = false;
  }
}
