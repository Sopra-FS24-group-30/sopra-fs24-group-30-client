export type User = {
    username: string;
    name: string;
    id: number;
    birthday: string;
    creationDate: string;
    status: string;
    achievements: string[];
};

export type Player = {
    playerId: string;
    userId: number;
    username: string;
    teammateId: number;
    cash: number;
    usables: string[];
};