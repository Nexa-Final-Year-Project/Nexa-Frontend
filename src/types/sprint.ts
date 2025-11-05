export type Sprint = {
  _id: string;
  sprintName: string;
  name: string;
  startDate: string;
  endDate: string;
  project: string;
  projectId?: string;
  goals: Array<string>;
};
