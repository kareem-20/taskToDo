import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { DataService } from './services/data.service';
import { Storage } from '@ionic/storage-angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private navCtrl: NavController,
    private dataService: DataService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleBlackTranslucent()
      this.statusBar.backgroundColorByName('darkGray');
      this.splashScreen.hide();
    });
  }

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
