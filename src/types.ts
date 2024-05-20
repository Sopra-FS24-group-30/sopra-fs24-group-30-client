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
    playerId: number;
    userId: number;
    username: string;
    teammateId: number;
    cash: number;
    wincondition: string;
    ultimateattack: string;
    usables: string[];
};