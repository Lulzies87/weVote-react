export interface Vote {
  id: number;
  poll_id: number;
  apartment: number;
  vote: string;
  created_at: string;
}

export interface Poll {
  id: number;
  title: string;
  cost: string;
  deadline: string;
  created_at: string;
  details: string;
  is_active: boolean;
}
