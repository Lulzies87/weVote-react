export interface Vote {
  id: number;
  pollId: number;
  apartment: number;
  vote: string;
  createdAt: string;
}

export interface Poll {
  id: number;
  title: string;
  cost: string;
  deadline: string;
  createdAt: string;
  details: string;
  isActive: boolean;
}
