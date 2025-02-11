export interface Poll {
    id: number,
    title: string,
    status: string,
    cost: number,
    votes: number,
    deadline: Date,
    details: string,
    createdAt: Date
}