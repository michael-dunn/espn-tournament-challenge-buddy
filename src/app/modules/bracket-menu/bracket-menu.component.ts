import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Bracket } from 'src/app/models/bracket';
import { Group } from 'src/app/models/group';
import { GroupMatchupSummary } from 'src/app/models/group-matchup-summary';
import { Matchup } from 'src/app/models/matchup';
import { Pick } from 'src/app/models/pick';
import { Team } from 'src/app/models/team';
import { ObjectKeyUtilityService } from 'src/app/services/object-key-utility.service';
import { BracketsService } from '../../services/brackets.service';

@Component({
  selector: 'app-bracket-menu',
  templateUrl: './bracket-menu.component.html',
  styleUrls: ['./bracket-menu.component.scss']
})
export class BracketMenuComponent implements OnInit {
  groupMatchupSummaries: GroupMatchupSummary[];
  matchups: Matchup[];
  round64: GroupMatchupSummary[];
  round32: GroupMatchupSummary[];
  round16: GroupMatchupSummary[];
  round8: GroupMatchupSummary[];
  round4: GroupMatchupSummary[];
  round2: GroupMatchupSummary[];
  teams: Team[] = [];
  group: Group;
  selectedMatchupSummary: GroupMatchupSummary;
  selectedBracket: Bracket;
  currentPicks: Pick[];
  year: string;
  groupId: string;
  errorMsg: string;

  constructor(private bracketsService: BracketsService,
    private objService: ObjectKeyUtilityService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.groupId = params.groupId;
      this.year = params.year;
      this.getData();
    });
  }

  previewSummary(m: Matchup) {
    this.selectedMatchupSummary = this.groupMatchupSummaries[m.id];
  }

  getData() {
    if (this.groupId && this.year) {
      forkJoin(
        [this.bracketsService.getBrackets(this.year, this.groupId),
        this.bracketsService.getMatchups(this.year)]
      ).subscribe(data => {
        this.group = this.objService.MapGroup(data[0].g);

        this.matchups = this.objService.MapMatchups(data[1].m);
        this.setupTeams(this.matchups.slice(0, 32));
        this.groupMatchupSummaries = this.createGroupMatchupSummaries();
        this.round64 = this.groupMatchupSummaries.slice(0, 32);
        this.round32 = this.groupMatchupSummaries.slice(32, 48);
        this.round16 = this.groupMatchupSummaries.slice(48, 56);
        this.round8 = this.groupMatchupSummaries.slice(56, 60);
        this.round4 = this.groupMatchupSummaries.slice(60, 62);
        this.round2 = this.groupMatchupSummaries.slice(62);
      });
    } else {
      this.errorMsg = "Must provide year and groupId";
    }
  }
  createGroupMatchupSummaries(): GroupMatchupSummary[] {
    var s: GroupMatchupSummary[] = [];
    this.matchups.forEach(m => {
      s.push(this.createSummary(m));
    });
    return s;
  }

  createSummary(m: Matchup): GroupMatchupSummary {
    var g = this.group.brackets.map((b) => {
      var w = this.teams[+b.picksString.split('|')[m.id] - 1];
      return <Pick>{
        bracket: b,
        winningTeam: w,
        points: this.choseLoser(w.name, m) ? -m.pointPotential : m.pointPotential
      }
    });
    g.forEach(gp => {
      gp.pointDifferential = g.filter(p => gp.winningTeam != p.winningTeam).map(p => m.pointPotential).reduce((a, b) => a + b, 0);
    });
    return <GroupMatchupSummary>{
      matchup: m,
      groupPicks: g
    }
  }

  setSelectedUser(b: Bracket) {
    this.groupMatchupSummaries.forEach(g => g.matchup.highlighted = false);
    this.selectedBracket = b;
    this.getTopGame(this.round64, b);
    this.getTopGame(this.round32, b);
    this.getTopGame(this.round16, b);
    this.getTopGame(this.round8, b);
    this.getTopGame(this.round4, b);
  }

  setupTeams(matchups: Matchup[]) {
    matchups.forEach(m => this.teams = this.teams.concat(m.teams));
    this.teams.forEach(t => {
      t.out = this.matchups.findIndex(m => m.winnerId && m.teams.findIndex(t1 => t1.name == t.name && !t1.won) != -1) != -1;
    });
  }

  choseLoser(teamChosen: string, m: Matchup) {
    return !this.choseRightTeam(teamChosen, m) && this.teamHasLost(teamChosen);
  }

  choseRightTeam(teamChosen: string, m: Matchup) {
    return m.winnerId && m.teams.find(t => t.won)?.name == teamChosen;
  }

  teamHasLost(teamChosen: string) {
    return this.teams.find(t => t.name == teamChosen)?.out;
  }

  getTopGame(summaries: GroupMatchupSummary[], b: Bracket) {
    var bestVal = -1;
    var bestMatchupIndex = -1;
    summaries.map(g => g.groupPicks.find(p => p.bracket == b).pointDifferential).forEach((p,i) => {
      if (p > bestVal){
        bestVal = p;
        bestMatchupIndex = i;
      }
    })
    summaries[bestMatchupIndex].matchup.highlighted = true;
  }
}
