import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BracketsService {

  constructor(private http: HttpClient) { }

  public getBrackets = () : Observable<any> => {
      return this.http.get("https://fantasy.espncdn.com/tournament-challenge-bracket/2021/en/api/v7/group?groupID=4046317&sort=-1&start=0&length=50&periodPoints=true");
  }

  public getMatchups = () : Observable<any> => {
    return this.http.get("https://fantasy.espncdn.com/tournament-challenge-bracket/2021/en/api/matchups");
  }
}
