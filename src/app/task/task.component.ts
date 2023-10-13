import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})

export class TaskComponent {
  @ViewChild('childModal', { static: false }) childModal?: ModalDirective;
  formData: { name: string, email: string, message: string, dateFrom:string } = { name: '', email: '', message: '', dateFrom: '' };
  todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];
  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];
  list: any[] = [];
  tasks: any[] = [
    {
      id: 1,
      title: 'Subida al cerro',
      type: "ACTIVITY",
      startDate: '2022-01-01 00:00:00',
      endDate: '2022-01-02 00:00:00',
      status: 'IN_PROGRESS'
    },
    {
      id: 2,
      title: 'Fiesta de espuma',
      type: "PARTY",
      startDate: '2022-01-01 00:00:00',
      endDate: '2022-01-03 00:00:00',
      status: 'DONE'
    },
    {
      id: 3,
      title: 'Desayuno',
      type: "FOOD",
      startDate: null,
      endDate: null,
      status: null
    },
    {
      id: 4,
      title: 'Fiesta de vaga',
      type: "PARTY",
      startDate: '2022-01-03 00:00:00',
      endDate: '2022-01-04 00:00:00',
      status: 'DONE'
    },
    {
      id: 5,
      title: 'Almuerzo',
      type: "FOOD",
      startDate: null,
      endDate: null,
      status: null
    },
  ];
  constructor() {}
  ngOnInit(): void {
    this.buildListTasks();
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log(this.list);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
  buildListTasks() {
    this.tasks.map((t, idx) => {
      const dateL = t.startDate;
      console.log(dateL);
      const taskTemp = {
        id: idx,
        title: dateL,
        task: [t]
      }
      const id = this.list.findIndex(li => li.title === t.startDate);
      if (id > -1)
        this.list[id].task.push(t);
      else
        this.list.push(taskTemp);
    })
    console.log(this.list);
  }

  submitForm() {
    // Aquí puedes manejar el envío del formulario
    console.log('Formulario enviado:', this.formData);
  }

  showChildModal(): void {
    this.childModal?.show();
  }

  hideChildModal(): void {
    this.childModal?.hide();
  }
}
