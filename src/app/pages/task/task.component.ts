import { Component, ViewChild, TemplateRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DateTime } from "luxon";
import { environment } from '../../../environments/environment';
import { AlertComponent } from 'ngx-bootstrap/alert';
import { Utils } from '../../utils/utils'
import { MOCK_DATA, MOCK_ACTIVITIES, MOCK_STATUS } from '../../data/mock-data'
import { CdkDragDrop, moveItemInArray, transferArrayItem,} from '@angular/cdk/drag-drop';
import {Activity, Task} from "../../models/itinerary.model";

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
  allTaskInv: any[] = [];
  utils: any;
  tasks: Array<Task> = [];
  minDate: Date;
  maxDate: Date;
  taskSelected: any;
  imgAdd: string = '';
  rowImage: string = '';
  imgMessage: string = '';
  modeModal: string = 'create';
  createUpdate: boolean = false;
  createInColumn: boolean = false;
  activities: any[] = [];
  selectedAct: string = '0';
  configDateTimePicker = {
    isAnimated: true,
    keepDatepickerOpened: true,
    withTimepicker: true,
    dateInputFormat: 'YYYY/MM/DD, HH:mm:ss',
    containerClass: 'theme-dark-blue'
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
    this.setMaxDate();
  }
  ngOnInit(): void {
    this.utils = new Utils();
    this.imgAdd = './assets/imgs/add-task.svg';
    this.rowImage = './assets/imgs/row-right.svg';
    this.imgMessage = './assets/imgs/message.png';
    this.activities = MOCK_ACTIVITIES;
    this.selectedAct = '0';
    let taskStorage = localStorage.getItem('tasks');
    if (taskStorage) {
      this.tasks = JSON.parse(taskStorage);
    } else {
      this.tasks = MOCK_DATA;
    }

    this.buildListTasks();
    this.getArrayDateList();
  }

  setMinDate(minDate: Date = new Date()) {
    this.minDate = minDate;
    // this.maxDate.setDate(this.minDate.getDate())
  }

  setMaxDate(numDays: number = environment.limitDaysTask, maxDate: Date = new Date()) {
    this.maxDate = maxDate;
    this.maxDate.setDate(this.maxDate.getDate() + numDays - 1);
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

  drop(event: CdkDragDrop<string[]>, item: any, template: TemplateRef<any>) {
    // console.log(event, item);
    const dropItem: any = event.previousContainer.data[event.previousIndex];
    // console.log(dropItem);
    const columnItems: any[] = event.container.data;
    const duplicateItem = columnItems.findIndex(i => i.id === dropItem.id);
    if (duplicateItem > -1) {
      this.openModalAlert(template)
      return;
    }
    const count = this.allTaskInv.filter(at => at.id === dropItem.id).length;
    if (!dropItem.dateTask || count === 1) {
      let taskEdit: Task | undefined = this.tasks.find(t => t.activityId === dropItem.id);
      if (taskEdit) {
        let {activityId} = taskEdit;
        taskEdit.startDate = item.title ? item.title + ' ' + (dropItem.hourTask ? dropItem.hourStart : '00:00:00') : item.title;
        taskEdit.endDate = item.title ? item.title + ' ' + (dropItem.hourTask ? dropItem.hourEnd : '00:00:00') : item.title;
        this.tasks.map((taskState: Task) => taskState.activityId === activityId ? taskEdit : taskState);
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        this.buildListTasks();
      }
    } else {}
    this.moveDragAndDrop(event)
  }

  moveDragAndDrop(event: CdkDragDrop<string[]>) {
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

  loadSelectActivity(type:string) {
    const activity = this.activities.find(ac => ac.name === type);
    this.selectedAct = activity.id;
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
        let hourEnd = '';
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
          hourEnd = t.endDate.split(' ')[1]
        }
        const newTask = {
          id: t.activityId,
          title: t.title,
          type: t.type,
          image: this.getImageByType(t.type),
          dateTask: t.startDate === null ? '' : t.startDate.split(' ')[0],
          fromDate: t.startDate,
          toDate: t.endDate,
          hourTask: hour,
          hourStart,
          hourEnd,
          status: this.getDescriptionByStatus(t.status)
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
          let hourEnd = '';
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
            hourEnd = t.endDate.split(' ')[1]
          }
          const newTask = {
            id: t.activityId,
            title: t.title,
            type: t.type,
            image: this.getImageByType(t.type),
            dateTask: dateT,
            hourTask: hour,
            fromDate: t.startDate,
            toDate: t.endDate,
            hourStart,
            hourEnd,
            status: this.getDescriptionByStatus(t.status)
          }
          allTask.push(newTask);
        });
      }
    })
    const tasksTemp = this.orderTask(allTask);
    this.allTaskInv = tasksTemp;
    this.buildListItinerary(tasksTemp);
  }

  getImageByType(type: string): string {
    const activity = MOCK_ACTIVITIES.find(act => act.name === type);
    return (activity ? activity.image : MOCK_ACTIVITIES[0].image);
  }

  getDescriptionByStatus(status: string | null): string {
    const description = MOCK_STATUS.find(mStatus => mStatus.name === status);
    return (description ? description.description : MOCK_STATUS[0].description);
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
    const activity = this.activities.find(ac => ac.id === parseInt(this.selectedAct));
    const newTask: Task = {
      activityId: this.utils.generateId(),
      title: name,
      type: activity ? activity.name : this.activities[0].name,
      startDate: startDate || null,
      endDate: endDate || null,
      status: startDate === '' ? null : 'TO_DO'
    };
    this.tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
    this.cleanForm();
    this.buildListTasks();
    this.hideModal();
  }

  viewTask(template: TemplateRef<any>, task: any) {
    this.setMinDate();
    this.setMaxDate();
    this.taskSelected = task;
    this.loadSelectActivity(task.type);
    if (task.dateTask) {
      this.createInColumn = false;
      this.modeModal = 'update';
      this.createUpdate = false;
      const fromDate = DateTime.fromFormat(task.fromDate, "yyyy-MM-dd HH:mm:ss");
      const from = new Date(fromDate.valueOf());
      const toDate = DateTime.fromFormat(task.toDate, "yyyy-MM-dd HH:mm:ss");
      const to = new Date(toDate.valueOf());
      this.formData  = { name: task.title, startDate: task.fromDate, endDate: task.toDate, startDateEdit: from, endDateEdit: to };
      this.openModal(template);
    } else {
      this.modeModal = 'create';
      this.createUpdate = true;
      this.createInColumn = false;
      this.formData  = { name: this.taskSelected.title, startDate: '', endDate: '', startDateEdit: new Date(), endDateEdit: new Date()};
      this.openModal(template);
    }
  }
  editTask() {
    const {name, startDate, endDate} = this.formData;
    const valid: boolean = this.validateForm(this.formData);
    if (!valid) return;
    let taskEdit: Task | undefined = this.tasks.find(t => t.activityId === this.taskSelected.id);
    if (taskEdit) {
      let {activityId} = taskEdit;
      const activity = this.activities.find(ac => ac.id === parseInt(this.selectedAct));
      taskEdit.title = name;
      taskEdit.startDate = startDate;
      taskEdit.endDate = endDate;
      taskEdit.type = activity.name;
      this.tasks.map((taskState) => taskState.activityId === activityId ? taskEdit : taskState);
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
      this.cleanForm();
      this.taskSelected = null;
      this.buildListTasks();
      this.hideModal();
    }
  }

  deleteTask(template: TemplateRef<any>, task: any) {
    this.taskSelected = task;
    this.openModalConfirm(template);
  }

  openModalConfirm(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  openModalAlert(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  confirmDelete(): void {
    this.modalRef?.hide();
    this.tasks = this.tasks.filter(t => t.activityId !== this.taskSelected.id);
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
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

  createTask(template: TemplateRef<any>) {
    this.cleanForm();
    this.setMinDate();
    this.setMaxDate();
    this.selectedAct = '0';
    this.modeModal = 'create';
    this.createUpdate = false;
    this.createInColumn = false;
    this.openModal(template);
  }

  createTaskInColumn(template: TemplateRef<any>, item: any) {
    this.selectedAct = '0';
    if (item.showDate) {
      this.modeModal = 'create';
      this.createUpdate = false;
      this.createInColumn = true;
      const hourCurrent = DateTime.local().toFormat('HH:mm:ss');
      const dateColumn = new Date(item.title + ' ' + hourCurrent);
      this.setMinDate(dateColumn);
      this.setMaxDate(1, dateColumn);
      this.formData  = { name: '', startDate: '', endDate: '', startDateEdit: dateColumn, endDateEdit: dateColumn};
      this.openModal(template);
    } else {
      this.createTask(template);
    }
  }

  openModal(template: TemplateRef<any>,) {
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
