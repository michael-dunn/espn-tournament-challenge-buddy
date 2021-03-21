import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BracketsService {

  constructor(private http: HttpClient) { }

  public getBrackets = (year: string, groupId: string): Observable<any> => {
    return this.http.get(`https://fantasy.espncdn.com/tournament-challenge-bracket/${year}/en/api/v7/group?groupID=${groupId}&sort=-1&start=0&length=50&periodPoints=true`);
  }

  public getMatchups = (year: string): Observable<any> => {
    return this.http.get(`https://fantasy.espncdn.com/tournament-challenge-bracket/${year}/en/api/matchups`);
  }
}
