export type User = {
  id: string;
  name: string;
  image: string;
};

export type Task = {
  id: string;
  name: string;
  dateType: "due" | "start";
  date: Date;
  code: string;
  column: string;
  owner: User;
};

export type ColumnType = {
  id: string;
  name: string;
  color: string;
};
