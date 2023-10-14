import { Component, ViewChild, TemplateRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DateTime } from "luxon";
import { environment } from '../../../environments/environment';
import { AlertComponent } from 'ngx-bootstrap/alert';
import { Utils } from '../../utils/utils'
import {
  CdkDragDrop,
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
  formData: { name: string, startDate: string, endDate:string, startDateEdit:Date, endDateEdit:Date };
  alerts: any[] = [];
  list: any[] = [];
  utils: any;
  tasks: any[] = [];
  minDate: Date;
  maxDate: Date;
  taskSelected: any;
  imgAdd: string = '';
  modeModal: string = 'create';
  createUpdate: boolean = false;
  configDateTimePicker = {
    isAnimated: true,
    keepDatepickerOpened: true,
    withTimepicker: true,
    dateInputFormat: 'YYYY/MM/DD, HH:mm:ss'
  }
  modalRef?: BsModalRef;
  configModal = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-lg modal-full'
  };

  constructor(private modalService: BsModalService) {
    this.minDate = new Date();
    this.maxDate = new Date();
    this.formData = { name: '', startDate: '', endDate: '', startDateEdit: new Date(), endDateEdit: new Date()}
    this.maxDate.setDate(this.maxDate.getDate() + environment.limitDaysTask - 1);
  }
  ngOnInit(): void {
    this.utils = new Utils();
    this.imgAdd = './assets/imgs/add-task.svg';
    this.tasks = [
      {
        activityId: this.utils.generateId(),
        title: 'Subida al cerro',
        type: "ACTIVITY",
        startDate: '2023-10-15 00:00:00',
        endDate: '2023-10-16 01:00:00',
        status: 'IN_PROGRESS'
      },
      {
        activityId: this.utils.generateId(),
        title: 'Fiesta de espuma',
        type: "PARTY",
        startDate: '2023-10-14 00:00:00',
        endDate: '2023-10-16 01:00:00',
        status: 'DONE'
      },
      {
        activityId: this.utils.generateId(),
        title: 'Desayuno',
        type: "FOOD",
        startDate: null,
        endDate: null,
        status: null
      },
      {
        activityId: this.utils.generateId(),
        title: 'Fiesta de vaga',
        type: "PARTY",
        startDate: '2023-10-15 03:00:00',
        endDate: '2023-10-18 04:00:00',
        status: 'DONE'
      },
      {
        activityId: this.utils.generateId(),
        title: 'Almuerzo',
        type: "FOOD",
        startDate: null,
        endDate: null,
        status: null
      },
      {
        activityId: this.utils.generateId(),
        title: 'Junta Presidencial',
        type: "PARTY",
        startDate: '2023-10-15 01:00:00',
        endDate: '2023-10-18 02:00:00',
        status: 'DONE'
      }
    ];
    this.buildListTasks();
    this.getArrayDateList();
  }

  getArrayDateList() {
    const currentDate = DateTime.local();
    const nextDates = [];
    for (let i = 1; i <= environment.limitDaysTask; i++) {
      const nextDate = currentDate.plus({ days: i });
      nextDates.push(nextDate.toFormat("yyyy-MM-dd"));
    }
    nextDates.unshift('');
    return nextDates;
  }

  drop(event: CdkDragDrop<string[]>) {
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
    this.list = [];
    let allTask: any[] = [];
    const rangeDaysTask = this.getArrayDateList();
    this.tasks.map((t, idx) => {
      let dateS;
      let dateE;
      let diferenciaEnDias;
      if (t.startDate) {
        const startDate = t.startDate.split(' ')[0];
        dateS = DateTime.fromISO(startDate);
      }
      if (t.endDate) {
        const endDate = t.endDate.split(' ')[0];
        dateE = DateTime.fromISO(endDate);
      }
      if (dateS && dateE) {
        diferenciaEnDias = dateE.diff(dateS, "days").toObject().days;
      }
      if (diferenciaEnDias === 0 || diferenciaEnDias === undefined) {
        let hour = '';
        let hourStart = '';
        if (t.startDate) {
          const hora = DateTime.fromISO(t.startDate.split(' ')[1]);
          const horaFormateada = hora.toFormat("HH:mm");
          hour += horaFormateada;
          hourStart = t.startDate.split(' ')[1]
        }
        if (t.endDate) {
          const hora = DateTime.fromISO(t.endDate.split(' ')[1]);
          const horaFormateada = hora.toFormat("HH:mm");
          hour += ' - ' + horaFormateada;
        }
        const newTask = {
          id: t.activityId,
          title: t.title,
          type: "FOOD",
          dateTask: t.startDate === null ? '' : t.startDate.split(' ')[0],
          fromDate: t.startDate,
          toDate: t.endDate,
          hourTask: hour,
          hourStart,
          status: null
        }
        allTask.push(newTask);
      } else {
        const dateRange = [];
        for (let i = 0; i <= diferenciaEnDias; i++) {
          if (dateS) {
            const datesR = dateS.plus({ days: i });
            dateRange.push(datesR.toFormat("yyyy-MM-dd"));
          }
        }
        dateRange.map(dateT => {
          let hour = '';
          let hourStart = '';
          if (t.startDate) {
            const hora = DateTime.fromISO(t.startDate.split(' ')[1]);
            const horaFormateada = hora.toFormat("HH:mm");
            hour += horaFormateada
            hourStart = t.startDate.split(' ')[1]
          }
          if (t.endDate) {
            const hora = DateTime.fromISO(t.endDate.split(' ')[1]);
            const horaFormateada = hora.toFormat("HH:mm");
            hour += ' - ' + horaFormateada;
          }
          const newTask = {
            id: t.activityId,
            title: t.title,
            type: "FOOD",
            dateTask: dateT,
            hourTask: hour,
            fromDate: t.startDate,
            toDate: t.endDate,
            hourStart,
            status: null
          }
          allTask.push(newTask);
        });
      }
    })
    const tasksTemp = this.orderTask(allTask);
    this.buildListItinerary(tasksTemp);
  }

  buildListItinerary(tasks: any[]) {
    tasks.map((task: any, idx: number) => {
      const taskTemp = {
        id: idx,
        title: task.dateTask,
        task: [task]
      }
      const id = this.list.findIndex(li => li.title === task.dateTask);
      if (id > -1)
        this.list[id].task.push(task);
      else
        this.list.push(taskTemp);
    })
    this.list = this.orderTaskByHour(this.list);
    console.log(this.list);
  }

  orderTask (tasks: any[]) {
    tasks.sort((a, b) => {
      const fechaA = a.dateTask;
      const fechaB = b.dateTask;
      return fechaA.localeCompare(fechaB);
    });
    return tasks;
  }

  orderTaskByHour(tasks: any[]) {
    tasks.map(t => {
      t.task.sort((a: any, b: any) => {
        const horaA = a.hourStart;
        const horaB = b.hourStart;
        return horaA.localeCompare(horaB);
      });
      const dateFormat = DateTime.fromISO(t.title);
      t.count = t.task.length
      t.showDate = t.title ? dateFormat.toFormat("dd 'de' LLLL") : t.title
      t.showHour = t.title ? dateFormat.toFormat("dd 'de' LLLL") : t.title
    })
    return tasks;
  }

  validateForm(dataForm: any): boolean {
    const {name, startDate, endDate} = dataForm;
    if (!name) {
      this.alerts.push({
        type: 'warning',
        msg: 'El campo Nombre de la actividad es requerido',
        timeout: 2000
      });
      return false;
    }
    if (startDate && endDate) {
      const dateFrom = DateTime.fromFormat(startDate, "yyyy-MM-dd HH:mm:ss");
      const dateTo = DateTime.fromFormat(endDate, "yyyy-MM-dd HH:mm:ss");
      if (dateTo < dateFrom) {
        this.alerts.push({
          type: 'warning',
          msg: 'La fecha de finalización no puede ser menor a la fecha de inicio',
          timeout: 2000
        });
        return false;
      }
    }
    if (startDate && !endDate) {
      this.alerts.push({
        type: 'warning',
        msg: 'Seleccione la fecha de finalización para guardar',
        timeout: 2000
      });
      return false;
    }
    if (!startDate && endDate) {
      this.alerts.push({
        type: 'warning',
        msg: 'Seleccione la fecha de inicio para guardar',
        timeout: 2000
      });
      return false;
    }
    return true;
  }

  submitForm() {
    const {name, startDate, endDate} = this.formData;
    const valid: boolean = this.validateForm(this.formData);
    if (!valid) return;
    const newTask = {
      activityId: this.utils.generateId(),
      title: name,
      type: "FOOD",
      startDate: startDate || null,
      endDate: endDate || null,
      status: startDate === '' ? null : 'IN_PROGRESS'
    };
    this.tasks.push(newTask);
    this.cleanForm();
    this.buildListTasks();
    this.hideModal();
  }

  viewTask(template: TemplateRef<any>, task: any) {
    console.log(task);
    this.taskSelected = task;
    if (task.dateTask) {
      this.createUpdate = false;
      this.openModal(template);
      this.modeModal = 'update';
      const fromDate = DateTime.fromFormat(task.fromDate, "yyyy-MM-dd HH:mm:ss");
      const from = new Date(fromDate.valueOf());
      const toDate = DateTime.fromFormat(task.toDate, "yyyy-MM-dd HH:mm:ss");
      const to = new Date(toDate.valueOf());
      this.formData  = { name: task.title, startDate: task.fromDate, endDate: task.toDate, startDateEdit: from, endDateEdit: to };
    } else {
      this.createUpdate = true;
      this.openModal(template, this.createUpdate);
    }
  }
  editTask() {
    const {name, startDate, endDate} = this.formData;
    const valid: boolean = this.validateForm(this.formData);
    if (!valid) return;
    let taskEdit = this.tasks.find(t => t.activityId === this.taskSelected.id);
    taskEdit.title = name;
    taskEdit.startDate = startDate;
    taskEdit.endDate = endDate;
    this.tasks.map((taskState) => taskState.activityId === taskEdit.activityId ? taskEdit : taskState);
    this.cleanForm();
    this.buildListTasks();
    this.hideModal();
  }

  deleteTask(template: TemplateRef<any>, task: any) {
    this.taskSelected = task;
    this.openModalConfirm(template);
  }

  openModalConfirm(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  confirmDelete(): void {
    this.modalRef?.hide();
    this.tasks = this.tasks.filter(t => t.activityId !== this.taskSelected.id)
    this.buildListTasks();
    this.taskSelected = null;
  }

  declineDelete(): void {
    this.modalRef?.hide();
    this.taskSelected = null;
  }

  cleanForm() {
    this.formData  = { name: '', startDate: '', endDate: '', startDateEdit: new Date(), endDateEdit: new Date()};
  }

  onClosed(dismissedAlert: AlertComponent): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }

  openModal(template: TemplateRef<any>, flag: boolean = false) {
    this.modeModal = 'create';
    if (!flag)
      this.cleanForm();
    else
      this.formData  = { name: this.taskSelected.title, startDate: '', endDate: '', startDateEdit: new Date(), endDateEdit: new Date()};
    this.modalRef = this.modalService.show(template, this.configModal);
  }

  hideModal(): void {
    this.modalRef?.hide();
    this.alerts = [];
  }

  onDateChanged(event: Date, from: string) {
    const fechaLuxon = DateTime.fromJSDate(event);
    const formatDate = fechaLuxon.toFormat("yyyy-MM-dd HH:mm:ss");
    if (from === 'start')
      this.formData.startDate = formatDate;
    else
      this.formData.endDate = formatDate;
  }
}