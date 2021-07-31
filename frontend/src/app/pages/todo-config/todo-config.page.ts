import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { Todo } from 'src/app/interfaces/todo';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-todo-config',
  templateUrl: './todo-config.page.html',
  styleUrls: ['./todo-config.page.scss'],
})
export class TodoConfigPage implements OnInit, OnDestroy {

  form: FormGroup;
  todo: Todo;
  index: number;

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private dataService: DataService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.todo = this.dataService.getParams().todo;
    this.index = this.dataService.getParams().index;

    this.patchForm();
  }

  patchForm() {
    if (this.todo) {
      this.form.patchValue({
        title: this.todo.title,
        desc: this.todo.desc
      })
    }
  }


  createForm() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      desc: ['', Validators.required]
    });
  }

  save() {
    let todo: Todo = {
      title: this.form.value.title,
      desc: this.form.value.desc
    }

    this.loadingCtrl.create();

    if (this.todo) {
      let newtodo: Todo = {
        _id: this.todo._id,
        title: this.form.value.title,
        desc: this.form.value.desc,
        owner: this.todo.owner,
        time: Date.now()
      }
      this.dataService.update(newtodo).subscribe((res: any) => {
        this.loadingCtrl.dismiss()
        this.dataService.todos.splice(this.index, 1)
        this.dataService.todos.push(res)
        this.navCtrl.navigateBack('home')
      })
    } else {
      this.dataService.addTodo(todo)
    }

  }

  ngOnDestroy() {
    this.dataService.setParams({})
  }


}
