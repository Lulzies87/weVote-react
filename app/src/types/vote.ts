export interface Vote {
    id?: number,
    pollID: number,
    apartment: number,
    vote: string,
    createdAt?: Date,
}