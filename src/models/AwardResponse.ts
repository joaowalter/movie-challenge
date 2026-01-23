export interface Interval {
    producer: string;
    interval: number;
    previousWin: number;
    followingWin: number;
}

export interface AwardResponse {
    min: Interval[];
    max: Interval[];
}
