export interface Poll {
  id?: number;
  title: string;
  status?: string;
  cost: number;
  deadline: string;
  details: string;
  createdAt?: Date;
  votes?: { apartment: number; vote: string }[];
  isActive: boolean;
}
