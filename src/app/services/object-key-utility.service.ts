import { Injectable } from '@angular/core';
import { Group } from '../models/group';
import { Matchup } from '../models/matchup';

@Injectable({
  providedIn: 'root'
})
export class ObjectKeyUtilityService {

  private readonly matchupsDictionaryArray = [
    ['tv', 'network'],
    ['o', 'teams']
  ];
  private readonly teamsDictionaryArray = [
    ['n', 'name'],
    ['s', 'seed']
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

  public MapMatchups(matchups: any) : Matchup[] {
    var newM = matchups.map((m) => {
      this.matchupsDictionaryArray.forEach(nameCombo => {
        this.renameKey(m,nameCombo[0],nameCombo[1]);
      });
      m.teams.map((t) => {
        this.teamsDictionaryArray.forEach(nameCombo => {
          this.renameKey(t,nameCombo[0],nameCombo[1]);
        });
        return t;
      });
      return m;
    }).sort((a,b) => a.id - b.id).slice(0,32);

    let counter = 0;
    let counter2 = 0;
    newM.forEach(m => {
      m.id = counter2++;
      if (m.teams.length > 1){
        m.teams[0].id = ++counter;
        m.teams[1].id = ++counter;
      }
    });

    return newM;
  }

  public MapGroup(group: any) : Group {
      this.groupDictionaryArray.forEach(nameCombo => {
        this.renameKey(group,nameCombo[0],nameCombo[1]);
      });
      group.brackets.map((b) => {
        this.bracketsDictionaryArray.forEach(nameCombo => {
          this.renameKey(b,nameCombo[0],nameCombo[1]);
        });
        return b;
      });
      return group;
  }

  private renameKey(obj, oldName, newName){
    obj[newName] = obj[oldName];
    delete obj[oldName];
    return obj;
  }
}
