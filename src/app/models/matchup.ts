import { Team } from "./team";

export class Matchup {
    id: number;
    winnerId: number;
    network: string;
    pointPotential: number;
    teams: Team[];
}