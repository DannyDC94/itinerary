export interface Activity {
  id: number,
  name: string
}
export interface Status {
  id: number,
  name: string,
  description: string
}
export interface Task {
  activityId: string,
  title: string,
  type: string,
  startDate: string | null,
  endDate: string | null,
  status: string | null
}


