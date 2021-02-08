import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import { Http } from '@angular/http';

@Injectable()
export class MainserviceService {
  // base url
  baseUrl:string = "https://football-results-simulator.firebaseio.com";

  constructor(private http:Http){}
  getUEFAClubObjects(){
    return this.http.get (`${this.baseUrl}/uefa_clubs_nations/uefa_clubs.json`).map(res => res.json());
  }
  getUEFANationsObjects(){
    return this.http.get (`${this.baseUrl}/uefa_clubs_nations/uefa_nations.json`)
    .map(res => res.json());
  }

  matchHasStarted = new Subject<boolean>();
  matchHasStarted$ = this.matchHasStarted.asObservable();
  updateMatchHasStarted(data:any){
    this.matchHasStarted.next(data);
  }

  matchSettings = new Subject<any>();
  matchSettings$ = this.matchSettings.asObservable();
  updateMatchSettings(data:any){
    this.matchSettings.next(data);
  }

  // monitor tournament name change in settings
  tournamentName = new Subject<string>();
  tournamentName$ = this.tournamentName.asObservable();
  updateTournamentName(data:any){
    this.tournamentName.next(data);
  }

  homeTeamName = new Subject<string>();
  homeTeamName$ = this.homeTeamName.asObservable();
  updateHomeTeam(data:any){
    this.homeTeamName.next(data);
  }
  awayTeamName = new Subject<string>();
  awayTeamName$ = this.awayTeamName.asObservable();
  updateAwayTeam(data:any){
    this.awayTeamName.next(data);
  }

  fastForward = new Subject<boolean>();
  fastForward$ = this.fastForward.asObservable();
  updateFastForward(data:any){
    this.fastForward.next(data);
  }

  ngOnInit(){

  }
}
