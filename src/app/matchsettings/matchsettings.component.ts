import { Component, OnInit } from '@angular/core';
import {MainserviceService} from '../mainservice.service';
import {MatchModel} from '../match-model'
import * as io from 'socket.io-client';
declare var $: any;

@Component({
  selector: 'app-matchsettings',
  templateUrl: './matchsettings.component.html',
  styleUrls: ['./matchsettings.component.css']
})

export class MatchsettingsComponent implements OnInit{
  private socket;
  private teamsList = [];
  private homeTeam = null;
  private awayTeam = null;
  private matchHasStarted = false;
  private fastForward = false;

  constructor (private _mainService: MainserviceService) {
    this._mainService.matchHasStarted$.subscribe(
      (data) => {
        this.matchHasStarted
      }
    )
  }

  ngOnInit() {
    this.socket = io.connect('https://soccer-simulator.herokuapp.com')

    this.socket.on('list', event => {
      this.teamsList = event.data;
    });
  }

  onChangeHomeTeam(event) {
    this.homeTeam = event.target.value;
    this._mainService.updateHomeTeam(this.homeTeam);
  }

  onChangeAwayTeam(event) {
    this.awayTeam = event.target.value;
    this._mainService.updateAwayTeam(this.awayTeam);
  }  

  onChangeFastForward(event) {
    this.fastForward = !this.fastForward;
    this._mainService.updateFastForward(this.fastForward);
  }  

  proceedToMatch() {
    if (this.homeTeam && this.awayTeam) {
      this.matchHasStarted = true;
      this._mainService.updateMatchHasStarted(this.matchHasStarted);
    }
  }
}
