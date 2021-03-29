import { Component, OnInit } from '@angular/core';
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
  round64: Matchup[];
  round32: Matchup[];
  round16: Matchup[];
  round8: Matchup[];
  round4: Matchup[];
  round2: Matchup[];
  teams: Team[] = [];
  group: Group;
  selectedMatchupSummary: GroupMatchupSummary;
  selectedBracket: Bracket;
  currentPicks: Pick[];
  year: string;
  groupId: string;
  errorMsg: string;

  constructor(private bracketsService: BracketsService,
    private objService: ObjectKeyUtilityService) { }

  ngOnInit(): void {
    this.groupId = '4046317';
    this.year = '2021';
    this.getData();
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
        this.round64 = this.matchups.slice(0, 32).map(m => { m.pointPotential = 10; return m; });
        this.round32 = this.matchups.slice(32, 48).map(m => { m.pointPotential = 20; return m; });
        this.round16 = this.matchups.slice(48, 56).map(m => { m.pointPotential = 40; return m; });
        this.round8 = this.matchups.slice(56, 60).map(m => { m.pointPotential = 80; return m; });
        this.round4 = this.matchups.slice(60, 62).map(m => { m.pointPotential = 160; return m; });
        this.round2 = this.matchups.slice(62).map(m => { m.pointPotential = 320; return m; });
        this.setupTeams(this.matchups.slice(0, 32));

        this.groupMatchupSummaries = this.createGroupMatchupSummaries();
      });
    } else {
      this.errorMsg = "Must provide year and groupId";
    }
  }
  createGroupMatchupSummaries(): GroupMatchupSummary[] {
    var s = [];
    this.matchups.forEach(m => {
      s.push(this.createSummary(m));
    });
    return s;
  }

  createSummary(m: Matchup) {
    return <GroupMatchupSummary>{
      matchup: m,
      groupPicks: this.group.brackets.map((b) => {
        var w = this.teams[+b.picksString.split('|')[m.id] - 1];
        return <Pick>{
          bracket: b,
          winningTeam: w,
          points: this.choseLoser(w.name,m) ? -m.pointPotential : m.pointPotential
        }
      })
    }
  }

  setSelectedUser(b: Bracket) {
    this.selectedBracket = b;
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
}
