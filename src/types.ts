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
    username: string;
    wincondition: string;
    ultimateattack: string;
    coins: number;
    items: string[];
    cards: string[];
};