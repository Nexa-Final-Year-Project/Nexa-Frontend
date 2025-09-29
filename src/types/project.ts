export type Project = {
  _id: string;
  name: string;
  description: string;
  owner?: string;
  members?: ProjectMember[];
  starred?: boolean;
  createdAt?: string;
};

export type ProjectMember = {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
};
