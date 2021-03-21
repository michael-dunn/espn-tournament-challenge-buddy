export class Bracket {
    id: number;
    name: string;
    username: string;
    points: number;
    picks = (): string[] => this.picksString.split('|');
    picksString: string;
}