import { Bracket } from "./bracket";
import { Team } from "./team";

export class Pick {
    bracket: Bracket;
    winningTeam: Team;
    points: number;
    pointDifferential: number;
}