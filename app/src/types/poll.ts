export interface Poll {
  id?: number;
  title: string;
  status?: string;
  cost: number;
  deadline: string;
  details: string;
  created_at?: Date;
  votedApartments?: number[];
  is_active: boolean;
}
