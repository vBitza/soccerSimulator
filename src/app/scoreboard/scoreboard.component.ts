import { Component, OnInit } from '@angular/core';
import {MainserviceService} from '../mainservice.service';
import * as io from 'socket.io-client';

declare var $: any;

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.css']
})
export class ScoreboardComponent implements OnInit {
  private socket;
  matchHasStarted: boolean;
  homeTeamName: string;
  awayTeamName: string;
  matchSettings: any;
  homeTeamLogoLarge: string;
  homeTeamGoals: number;
  awayTeamGoals: number;
  matchStatuses:string[] = ['1st half', 'Half time', '2nd half', 'Full time', 'Not started', 'Extra time', 'Penalty shootout'];
  matchStatus: string;
  fastForward: boolean;
  homeTeamGoalObjects: any[];
  awayTeamGoalObjects: any[];
  homeTeamFoulsObjects: any[];
  awayTeamFoulsObjects: any[];

  constructor(private _mainService:MainserviceService) {
    this.socket = io.connect('https://soccer-simulator.herokuapp.com');
    this.homeTeamGoals = 0;
    this.awayTeamGoals = 0;
    this.matchStatus = this.matchStatuses[4];
    this.matchSettings = {
      currentMinute: 0
    };
    this.homeTeamGoalObjects = [];
    this.awayTeamGoalObjects = [];
    this.homeTeamFoulsObjects = [];
    this.awayTeamFoulsObjects = [];
    this._mainService.matchHasStarted$.subscribe(
      data => {
        this.matchHasStarted = data;
      }
    );

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

    this._mainService.fastForward$.subscribe(
      data => {
        this.fastForward = data;
      }
    );

    this.socket.on('UPDATE', (data) => {
      console.log(this.matchSettings)
      this.matchSettings = data; 
      if (this.matchSettings.currentMinute === 45) {
        this.matchStatus = this.matchStatuses[1];
      } else if (this.matchSettings.currentMinute > 45 && this.matchSettings.currentMinute < 90) {
        this.matchStatus = this.matchStatuses[2];
      } else if (this.matchSettings.currentMinute === 90) {
        this.matchStatus = this.matchStatuses[3];
      }
      
      this._mainService.updateMatchSettings(this.matchSettings);
    });

    this.socket.on('HOME_TEAM_GOAL', (data) => {
      this.homeTeamGoals++;
      this.homeTeamGoalObjects.push(data);
    });

    this.socket.on('AWAY_TEAM_GOAL', (data) => {
      this.awayTeamGoals++;
      this.awayTeamGoalObjects.push(data);
    });

    this.socket.on('HOME_TEAM_FOUL', (data) => {
      console.log(data)
      this.homeTeamFoulsObjects.push(data);
    });

    this.socket.on('AWAY_TEAM_FOUL', (data) => {
      console.log(data)
      this.awayTeamFoulsObjects.push(data);
    });
  }
    

  playAnotherMatch() {
    location.reload();
  }

  startMatch() {
    this.matchStatus = this.matchStatuses[0];
    console.log(this.fastForward)
    this.socket.emit('START_MATCH', {
      homeTeamName: this.homeTeamName, 
      awayTeamName: this.awayTeamName,
      forceUpdate: this.fastForward
    });
  }

  ngOnInit() {
    var screenHeight = $(window).height();
    $(".scoreboard").css({"minHeight": screenHeight});
  }

}
