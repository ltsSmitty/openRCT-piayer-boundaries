export interface ICompany {
    id: number;
    name: string;
    players: number[];
}

export class Company implements ICompany {
    id: number;
    name: string;
    players: number[] = [];

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}