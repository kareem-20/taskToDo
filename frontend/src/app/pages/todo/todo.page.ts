import { Component, OnInit } from '@angular/core';
import { Todo } from 'src/app/interfaces/todo';
import { DataService } from '../../services/data.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.page.html',
  styleUrls: ['./todo.page.scss'],
})
export class TodoPage implements OnInit {

  todo: Todo;

  constructor(
    private dataService: DataService,
    private sharing: SocialSharing
  ) { }

  ngOnInit() {
    this.todo = this.dataService.getParams().todo;
  }

  ngOnDestroy() {
    this.dataService.setParams({});
  }



  /******************     [Social Sharing]    *****************/
  shareWhats() {
    this.sharing
      .shareViaWhatsApp(
        this.todo.title + ' : ' + this.todo.desc,
      )
      .catch(err => alert(err));
  }

  shareFacebook() {
    this.sharing
      .shareViaFacebook(
        this.todo.title + ' : ' + this.todo.desc
      ).catch(err => alert(err));
  }

  shareTwitter() {
    this.sharing
      .shareViaTwitter(
        this.todo.title + ' : ' + this.todo.desc
      )
      .catch(err => alert(err));
  }

  shareInsta() {
    this.sharing.shareViaInstagram(
      this.todo.title + ' : ' + this.todo.desc, null
    )
      .catch(err => alert(err));
  }
}
