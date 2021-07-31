import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  formData: FormGroup;

  constructor(
    private navCtrl: NavController,
    private fb: FormBuilder,
    private dataService: DataService
  ) {
  }

  createForm() {
    this.formData = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }
  ngOnInit() {
    this.createForm();
  }

  login() {
    let user = {
      email: this.formData.value.email,
      password: this.formData.value.password
    }

    this.dataService
      .login(user.email, user.password).catch(e => console.error(e));

  }
}
