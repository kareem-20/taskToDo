import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { DataService } from './services/data.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(
    private router: Router,
    private storage: Storage,
    private navCtrl: NavController,
    private dataService: DataService
  ) { }

  async firstLoad() {
    await this.storage.create();
    await this.dataService.getTokens();
  }


  async ngOnInit() {

    this.firstLoad().finally(() => {
      const token = () => this.storage.get('accessToken').then(val => {
        console.log('from app componant ' + val)
        if (val) {
          this.dataService.accessToken = val;
          this.navCtrl.navigateRoot('home')
        } else {
          this.navCtrl.navigateRoot('login')
        }
      });
      token();
    });
  }

}
