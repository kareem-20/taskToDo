import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  formData: FormGroup;

  constructor(
    private navCtrl: NavController,
    private fb: FormBuilder,
    private dataService: DataService
  ) {
  }

  createForm() {
    this.formData = this.fb.group({
      userName: ['', Validators.required],

      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }
  ngOnInit() {
    this.createForm();
  }

  register() {
    let user: User = {
      userName: this.formData.value.userName,
      email: this.formData.value.email,
      password: this.formData.value.password
    }
    this.dataService.register(user)
  }

}
