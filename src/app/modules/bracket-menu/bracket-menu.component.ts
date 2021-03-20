import { Component, OnInit } from '@angular/core';
import { Matchup } from 'src/app/models/matchup';
import { ObjectKeyUtilityService } from 'src/app/services/object-key-utility.service';
import { BracketsService } from '../../services/brackets.service'

@Component({
  selector: 'app-bracket-menu',
  templateUrl: './bracket-menu.component.html',
  styleUrls: ['./bracket-menu.component.scss']
})
export class BracketMenuComponent implements OnInit {

  matchups: Matchup[];

  group: any;
  brackets: any;


  constructor(private bracketsService: BracketsService,
    private objService: ObjectKeyUtilityService) { }

  ngOnInit(): void {
    this.bracketsService.getBrackets().subscribe((data: any) => {
      this.group = data.g;
      this.brackets = this.group.e;
    });

    this.bracketsService.getMatchups().subscribe((data: any) => {
      this.matchups = this.objService.MapMatchups(data.m);
    });
  }

}
