import { Component, OnInit } from '@angular/core';
import { Bracket } from 'src/app/models/bracket';
import { Group } from 'src/app/models/group';
import { Matchup } from 'src/app/models/matchup';
import { Pick } from 'src/app/models/pick';
import { ObjectKeyUtilityService } from 'src/app/services/object-key-utility.service';
import { BracketsService } from '../../services/brackets.service';

@Component({
  selector: 'app-bracket-menu',
  templateUrl: './bracket-menu.component.html',
  styleUrls: ['./bracket-menu.component.scss']
})
export class BracketMenuComponent implements OnInit {
  matchups: Matchup[];
  group: Group;
  selectedMatchup: Matchup;
  currentPicks: Pick[];
  year: string;
  groupId: string;
  errorMsg: string;

  constructor(private bracketsService: BracketsService,
    private objService: ObjectKeyUtilityService) { }

  ngOnInit(): void {
  }

  previewSummary(m: Matchup){
    this.selectedMatchup = m;
    this.currentPicks = this.group.brackets.map((b) => {
      return <Pick>{bracket:b,winningTeam:this.matchups.find(ma=>ma.id == m.id).teams.find(t => t.id == +b.picksString.split('|')[m.id]) }
    });
  }

  getData(){
    if (this.groupId && this.year){
      this.bracketsService.getBrackets(this.year,this.groupId).subscribe((data: any) => {
        this.group = this.objService.MapGroup(data.g);
      });
  
      this.bracketsService.getMatchups(this.year).subscribe((data: any) => {
        this.matchups = this.objService.MapMatchups(data.m);
      });
    } else {
      this.errorMsg = "Must provide year and groupId";
    }
  }
}
