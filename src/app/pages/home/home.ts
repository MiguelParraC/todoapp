import { Component, computed, effect, inject, Injector, signal } from '@angular/core';


import { Task } from '../../models/task.model';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  task = signal<Task[]>([]);


  filter = signal('all');
  tasksByFilter = computed(() => {
    const filter = this.filter();
    const tasks = this.task();
    if (filter === 'all') {
      return tasks;
    } else if (filter === 'completed') {
      return tasks.filter(task => task.completed);
    } else if (filter === 'pending') {
      return tasks.filter(task => !task.completed);
    }
    return tasks;
  });


  injector = inject(Injector)

  constructor() {
  }

  ngOnInit() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      this.task.set(JSON.parse(storedTasks));
    }
    this.trackTask();
  }

  trackTask() {
    effect(() => {
      const tasks = this.task();
      localStorage.setItem('tasks', JSON.stringify(tasks));
    },{ injector: this.injector });
  }

  newTaskCtrl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
    ],
  });

  changeHandler() {
    if (this.newTaskCtrl.valid && this.newTaskCtrl.value.trim()) {
      const value = this.newTaskCtrl.value.trim();
      this.addTask(value);
      this.newTaskCtrl.setValue('');
    }
  }

  addTask(title: string) {
    const newTask = {
      id: Date.now(),
      title: title,
      completed: false,
    }
    this.task.update((task) => [...task, newTask]);
  }

  deleteTask(index: number) {
    this.task.update((task) => task.filter((task, position) => position !== index));
  }

  updateTask(index: number) {
    this.task.update((task) => {
      const updatedTask = { ...task[index] };
      return task.map((task, position) => {
        if (position === index) {
          return {
            ...task,
            completed: !task.completed,
          };
        }
        return task;
      });
    });
  }

  editTask(index: number) {
    this.task.update(prevState => {
      const updatedTask = { ...prevState[index], editing: true };
      return prevState.map((task, position) => {
        if (position === index) {
          return {
            ...task,
            editing: true
          };
        }
        return {
          ...task,
          editing: false
        }
      });
    });
  }

  updateText(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    const newValue = input.value.trim();
    this.task.update((task) => {
      const updatedTask = { ...task[index] };
      return task.map((task, position) => {
        if (position === index) {
          return {
            ...task,
            title: newValue,
            editing: false,
          };
        }
        return task;
      });
    });
  }

  changeFilter(filter: string) {
    this.filter.set(filter);
  }

}
