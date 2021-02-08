import { Component, OnInit } from '@angular/core';
import {MainserviceService} from '../mainservice.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {
  matchHasStarted: boolean;
  homeTeamName: string;
  awayTeamName: string;
  matchSettings: any;
  awayTeamPossesion: number;
  homeTeamPossesion: number;
  homeTeamAttempts: number;
  awayTeamAttempts: number;
  homeTeamShotsOnGoal: number;
  awayTeamShotsOnGoal: number;
  homeTeamFouls: number;
  awayTeamFouls: number;
  homeTeamYellowCards: number;
  awayTeamYellowCards: number;
  homeTeamRedCards: number;
  awayTeamRedCards: number;

  constructor(private _mainService:MainserviceService) {
    this.matchSettings = {
      awayTeam: {
        possesion: 0
      },
      homeTeam: {
        possesion: 0
      }
    }
    this._mainService.matchHasStarted$.subscribe(
      data => {
        this.matchHasStarted = data;
      }
    )
    this._mainService.homeTeamName$.subscribe(
      data => {
        this.homeTeamName = data;
      }
    );
    this._mainService.awayTeamName$.subscribe(
      data => {
        this.awayTeamName = data;
      }
    );

    this._mainService.matchSettings$.subscribe(
      data => {
        this.matchSettings = data;
        console.log(data)
        this.awayTeamPossesion = Math.round(this.matchSettings.awayTeam.possesion);
        this.homeTeamPossesion = Math.round(this.matchSettings.homeTeam.possesion);
        this.homeTeamAttempts = this.matchSettings.homeTeam.shots;
        this.awayTeamAttempts = this.matchSettings.awayTeam.shots,
        this.homeTeamShotsOnGoal = this.matchSettings.homeTeam.shotsOnTarget;
        this.awayTeamShotsOnGoal = this.matchSettings.awayTeam.shotsOnTarget;
        this.homeTeamFouls = this.matchSettings.homeTeam.fouls;
        this.awayTeamFouls = this.matchSettings.awayTeam.fouls;
        this.homeTeamYellowCards = this.matchSettings.homeTeam.yellowCards;
        this.awayTeamYellowCards = this.matchSettings.awayTeam.yellowCards;
        this.homeTeamRedCards = this.matchSettings.homeTeam.redCards;
        this.awayTeamRedCards = this.matchSettings.awayTeam.redCards;

      }
    )
  } 



  ngOnInit() {

  }

}
