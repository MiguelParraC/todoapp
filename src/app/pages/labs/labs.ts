import { Component } from '@angular/core';
import { signal } from '@angular/core';

import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-labs',
  imports: [ReactiveFormsModule],
  templateUrl: './labs.html',
  styleUrl: './labs.css'
})
export class Labs {
  protected readonly welcome = signal('Hola Mundo!');

  task = signal([
    'Instalar Angular',
    'Tarea 2',
    'Tarea 3',
  ]);

  name = signal('Miguel');
  edad = 36;
  disabled = false;

  colorCtrl = new FormControl();
  widthCtrl = new FormControl(50, {
    nonNullable: true,

  });

  nameCtrl = new FormControl("miguel", {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(10),
    ]
  });


  constructor() {
    this.colorCtrl.valueChanges.subscribe( value => {
      console.log(value);
    });
  }

  clickHandler() {
    alert('Hola Mundo!');
  }

  changeHandler(event: Event) {
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    this.name.set(newValue);

  }
  keydownHandler(event: Event) {
    const input = event.target as HTMLInputElement;
    console.log(input.value);
  }
   
}
