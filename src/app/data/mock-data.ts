import { Utils } from '../utils/utils'
import {Task} from "../models/itinerary.model";
const utils = new Utils();
export const MOCK_DATA: Array<Task> = [
  {
    activityId: utils.generateId(),
    title: 'Subida al cerro',
    type: "ACTIVITY",
    startDate: '2023-10-15 00:00:00',
    endDate: '2023-10-16 01:00:00',
    status: 'IN_PROGRESS'
  },
  {
    activityId: utils.generateId(),
    title: 'Fiesta de espuma',
    type: "PARTY",
    startDate: '2023-10-14 00:00:00',
    endDate: '2023-10-16 01:00:00',
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
    title: 'Fiesta de vaga',
    type: "PARTY",
    startDate: '2023-10-15 03:00:00',
    endDate: '2023-10-18 04:00:00',
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
    type: "PARTY",
    startDate: '2023-10-15 01:00:00',
    endDate: '2023-10-18 02:00:00',
    status: 'DONE'
  }
];
