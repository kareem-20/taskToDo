import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { User } from '../interfaces/user';
import { Todo } from '../interfaces/todo';
import { ApiService } from '../services/api.service';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  todos: Todo[] = []
  userdata: User;
  constructor(
    private dataService: DataService,
    private apiService: ApiService,
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) { }

  async ngOnInit() {
    this.userdata = this.dataService.user

    this.dataService.gettodos().then(_ => {
      this.todos = this.dataService.todos;
      console.log(this.todos)
    });
  }

  ionViewCanEnter() {
    this.dataService.gettodos().then(_ => {
      this.todos = this.dataService.todos;
      console.log(this.todos)
    });
  }

  logOut() {
    this.dataService.logOut()
  }


  creatTodo() {
    this.navCtrl.navigateForward('/todo-config');
  }

  edit(index: number, todo: Todo) {
    this.dataService.setParams({
      index,
      todo
    });

    this.navCtrl.navigateForward('/todo-config');
  }

  async delete(todo, index) {
    let alert = await this.alertCtrl.create({
      header: 'Confirm Deleting',
      message: 'Are you sure for deleting ?',
      mode: 'ios',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'yes',
          handler: () => {
            console.log('delete todo');
            this.todos.splice(index, 1);
            this.dataService.deletetodo(todo, index)
          }
        }
      ]
    });

    await alert.present();
  }

  detail(todo: Todo) {
    this.dataService.setParams({
      todo
    });
    this.navCtrl.navigateForward('/todo');
  }





}
