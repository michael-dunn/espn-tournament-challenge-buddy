import { Injectable } from '@angular/core';
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
    ['n', 'name']
  ]

  constructor() { }

  public MapMatchups(matchups: any) : Matchup[] {
    return matchups.map((m) => {
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
    });
  }

  private renameKey(obj,oldName,newName){
    obj[newName] = obj[oldName];
    delete obj[oldName];
    return obj;
  }
}
