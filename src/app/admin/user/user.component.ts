import { UserService, User } from './../../auth/user.service';
import { Component,  ViewChild, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  @ViewChild('content')
  content: NgbActiveModal;

  @ViewChild('content_delete')
  content_delete: NgbActiveModal;

  @ViewChild('content_edit')
  content_edit: NgbActiveModal;

  dtOptions = {};
  user_list : User[] = [{email: '', role: '', id: ''}];

  add_name: User ;
  delete_name: User;

  id_exits = false;
  selectedRowId;
  constructor(private us: UserService, private modalService: NgbModal) { }

  ngOnInit() {
    this.dtOptions = {
      dom: 'rtip',
      ordering: false      
    }
    this.us.getUsers()
      .subscribe(data => {
        this.user_list = data;
      });
  }

  openAdd() {
    this.id_exits = false;
    this.add_name = {email: "", role: "", id: ""};
    this.modalService.open(this.content, { centered: true });
  }

  add() {
    const _self = this;
    _self.modalService.dismissAll(_self.content);
    this.us.postUsers({
      email: this.add_name['email'],
      role: 'member'
    }).subscribe(data => {
      console.log(data);
    });
  }

  delete(i: number) {
    // console.log(i, this.depot_list[i]);
    this.selectedRowId = i;
    this.delete_name = this.user_list[ this.selectedRowId ];
    this.modalService.open(this.content_delete, { centered: true });
  }

  deleteProcess() {
    const _self = this;
    _self.modalService.dismissAll();
    this.us.deleteUsers(this.user_list[this.selectedRowId].id)
      .subscribe(data => {
        console.log(data)
      });
  }

  checkId(id) {
    let fil = this.user_list.filter(function(item) {
      return item['email'] == id;
    });
    if(fil.length) this.id_exits = true;
    else this.id_exits = false;
  }
  edit_checkId(id) {
    let gol = JSON.parse(JSON.stringify( this.user_list));
    gol.splice(this.selectedRowId, 1);
    let fil = gol.filter(function(item) {
      return item['email'] == id;
    });
    if(fil.length) this.id_exits = true;
    else this.id_exits = false;
  }
}
