export interface Poll {
    id?: number,
    title: string,
    status?: string,
    cost: number,
    votes?: number,
    deadline: string,
    details: string,
    createdAt?: Date
}