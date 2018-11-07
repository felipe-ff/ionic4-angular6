import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { AlertController } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { UtilityService } from '../services/utility.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
    public alertCtrl: AlertController, public storage: Storage, private util: UtilityService) {

    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'List', component: ListPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      //console.log(window['plugins']);
      try {
        if ( !(this.platform.is('mobileweb') || this.platform.is('core')) )  {
          this.util.initialize();
          this.util.go();
        }
       /*  const status = window['getStatus']();
        status.then((val) => {
          window['setConfig']();
        }); */
      } catch(e) {
        //this.showAlert(e); Descomentar para build
      }

      /* Okay, so the platform is ready and our plugins are available.
       Here you can do any higher level native things you might need.
      this.statusBar.show(); */
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  showAlert(msg) {
    let alert = this.alertCtrl.create({
    title: 'error!',
    subTitle: msg,
    buttons: ['Dismiss']
    });
    alert.present();
  }
}
