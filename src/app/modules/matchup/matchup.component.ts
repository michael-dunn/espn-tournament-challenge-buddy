import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Matchup } from 'src/app/models/matchup';

@Component({
  selector: 'app-matchup',
  templateUrl: './matchup.component.html',
  styleUrls: ['./matchup.component.scss']
})
export class MatchupComponent implements OnInit {

  @Input() matchup: Matchup;
  @Output() selectedMatchup = new EventEmitter<Matchup>();

  constructor() { }

  ngOnInit(): void {
  }

  selectMatchup(m) {
    this.selectedMatchup.emit(m);
  }

}
