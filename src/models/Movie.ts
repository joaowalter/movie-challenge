export interface Movie {
    id: number;
    year: number;
    title: string;
    studios: string;
    winner: boolean;
    producerIds: number[];
}

export interface MovieToAdd {
    year: number;
    title: string;
    studios: string;
    winner: boolean;
    producerIds: number[];
}
