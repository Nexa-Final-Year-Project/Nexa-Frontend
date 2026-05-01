export type Project = {
  _id: string;
  name: string;
  description: string;
  owner?: string;
  members?: ProjectMember[];
  starred?: boolean;
  status?: "Active" | "Archived" | "Completed";
  visibility?: "public" | "private";
  createdAt?: string;
  updatedAt?: string;
};

export type ProjectMember = {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
};
