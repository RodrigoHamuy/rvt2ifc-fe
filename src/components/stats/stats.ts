import Stats from 'stats.js';
import { Stage } from '../stage/stage';

export class StatsManager {
  private stats = new Stats();

  constructor(stage: Stage) {
    document.body.appendChild(this.stats.dom);
    this.stats.showPanel(0);
    this.stats.dom.style.removeProperty('left');
    this.stats.dom.style.right = '0px';
    stage.onPreTick(this.stats.begin);
    stage.onPostTick(this.stats.end);
  }

}