import { Utils } from '../utils/utils'
import {Activity, Status, Task} from "../models/itinerary.model";
const utils = new Utils();
export const MOCK_DATA: Array<Task> = [
  {
    activityId: utils.generateId(),
    title: 'Subida al cerro',
    type: "EXERCISE",
    startDate: '2023-10-17 00:00:00',
    endDate: '2023-10-18 01:00:00',
    status: 'IN_PROGRESS'
  },
  {
    activityId: utils.generateId(),
    title: 'Fiesta de espuma',
    type: "PARTY",
    startDate: '2023-10-16 00:00:00',
    endDate: '2023-10-18 01:00:00',
    status: 'DONE'
  },
  {
    activityId: utils.generateId(),
    title: 'Desayuno',
    type: "FOOD",
    startDate: null,
    endDate: null,
    status: null
  },
  {
    activityId: utils.generateId(),
    title: 'Fiesta de oficina',
    type: "PARTY",
    startDate: '2023-10-17 03:00:00',
    endDate: '2023-10-19 04:00:00',
    status: 'DONE'
  },
  {
    activityId: utils.generateId(),
    title: 'Almuerzo',
    type: "FOOD",
    startDate: null,
    endDate: null,
    status: null
  },
  {
    activityId: utils.generateId(),
    title: 'Junta Presidencial',
    type: "ACTIVITY",
    startDate: '2023-10-16 01:00:00',
    endDate: '2023-10-19 02:00:00',
    status: 'DONE'
  }
];

export const MOCK_ACTIVITIES: Array<Activity> = [
  {
    id: 1,
    name: 'OTHER',
    description: 'Otros',
    image: './assets/imgs/activities/help.png'
  },
  {
    id: 2,
    name: 'FOOD',
    description: 'Comida',
    image: './assets/imgs/activities/food.png'
  },
  {
    id: 3,
    name: 'ACTIVITY',
    description: 'Actividad',
    image: './assets/imgs/activities/list.png'
  },
  {
    id: 4,
    name: 'PARTY',
    description: 'Fiesta',
    image: './assets/imgs/activities/party.png'
  },
  {
    id: 5,
    name: 'WORK',
    description: 'Trabajo',
    image: './assets/imgs/activities/work.png'
  },
  {
    id: 6,
    name: 'EXERCISE',
    description: 'Ejercicio',
    image: './assets/imgs/activities/training.png'
  },
  {
    id: 7,
    name: 'TRANSPORT',
    description: 'Transporte',
    image: './assets/imgs/activities/transport.png'
  }
];

export const MOCK_STATUS: Array<Status> = [
  {
    id: 1,
    name: 'TO_DO',
    description: 'Por hacer'
  },
  {
    id: 2,
    name: 'IN_PROGRESS',
    description: 'En progreso'
  },
  {
    id: 3,
    name: 'DONE',
    description: 'Finalizado'
  }
];
