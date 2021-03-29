import { Injectable } from '@angular/core';
import { Group } from '../models/group';
import { Matchup } from '../models/matchup';

@Injectable({
  providedIn: 'root'
})
export class ObjectKeyUtilityService {

  private readonly matchupsDictionaryArray = [
    ['tv', 'network'],
    ['o', 'teams'],
    ['d', 'date'],
    ['w', 'winnerId']
  ];
  private readonly teamsDictionaryArray = [
    ['n', 'name'],
    ['s', 'seed'],
    ['sc', 'score']
  ];

  private readonly groupDictionaryArray = [
    ['n', 'name'],
    ['e', 'brackets'],
  ];
  private readonly bracketsDictionaryArray = [
    ['n_e', 'name'],
    ['n_d', 'username'],
    ['p', 'points'],
    ['ps', 'picksString'],
  ];

  constructor() { }

  public MapMatchups(matchups: any): Matchup[] {
    var newM: Matchup[] = matchups.map((m) => {
      this.matchupsDictionaryArray.forEach(nameCombo => {
        this.renameKey(m, nameCombo[0], nameCombo[1]);
      });
      m.teams.map((t) => {
        this.teamsDictionaryArray.forEach(nameCombo => {
          this.renameKey(t, nameCombo[0], nameCombo[1]);
        });
        return t;
      });
      if (this.matchupHasScore(m)) {
        m.teams[0].won = +m.teams[0].score > +m.teams[1].score;
        m.teams[1].won = +m.teams[0].score < +m.teams[1].score;
      }
      m.date = new Date(m.date);
      return m;
    }).sort((a, b) => a.id - b.id);

    let counter = 0;
    let counter2 = 0;
    newM.forEach((m, i) => {
      m.id = counter2++;
      if (i < 32 && m.teams.length > 1) {
        m.teams[0].id = ++counter;
        m.teams[1].id = ++counter;
      }
    });

    return newM;
  }

  public MapGroup(group: any): Group {
    this.groupDictionaryArray.forEach(nameCombo => {
      this.renameKey(group, nameCombo[0], nameCombo[1]);
    });
    group.brackets.map((b) => {
      this.bracketsDictionaryArray.forEach(nameCombo => {
        this.renameKey(b, nameCombo[0], nameCombo[1]);
      });
      return b;
    });
    return group;
  }

  private renameKey(obj, oldName, newName) {
    obj[newName] = obj[oldName];
    delete obj[oldName];
    return obj;
  }

  private matchupHasScore(m) {
    return m.teams.length > 1 && m.teams[0] && m.teams[1] && typeof +m.teams[0].score == 'number' && typeof +m.teams[1].score == 'number';
  }
}
