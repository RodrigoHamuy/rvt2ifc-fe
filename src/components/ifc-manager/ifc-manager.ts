import { DirectionalLight, AmbientLight } from "three";
import { IFCModel } from "web-ifc-three/IFC/Components/IFCModel";
import { IFCLoader } from "web-ifc-three/IFCLoader";
import { CameraManager } from "../camera-manager/camera-manager";
import { Stage } from "../stage/stage";
import { StatsManager } from "../stats/stats";

export class IfcManager {
  
  private stage = new Stage();
  private cameraManager: CameraManager;
  private ifcLoader = new IFCLoader();

  constructor() {    
    this.initLights();
    this.cameraManager = new CameraManager(this.stage);
    new StatsManager(this.stage);
  }

  async loadFile(file: File) {
    console.log('loading');    
    const url = URL.createObjectURL(file);
    const model : IFCModel = await this.ifcLoader.loadAsync(url);
    this.stage.scene.add(model);
    this.cameraManager.fitToFrame(model);
    console.log(model);
  }

  private initLights() {
    const light1 = new DirectionalLight(0xffeeff, 0.8);
    light1.position.set(1, 1, 1);
    this.stage.scene.add(light1);
    const light2 = new DirectionalLight(0xffffff, 0.8);
    light2.position.set(-1, 0.5, -1);
    this.stage.scene.add(light2);
    const ambientLight = new AmbientLight(0xffffee, 0.25);
    this.stage.scene.add(ambientLight);
  }
}