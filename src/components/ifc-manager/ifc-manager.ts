import { DirectionalLight, AmbientLight } from "three";
import { IFCModel } from "web-ifc-three/IFC/Components/IFCModel";
import { IFCLoader } from "web-ifc-three/IFCLoader";
import { CameraManager } from "../camera-manager/camera-manager";
import { Picker } from "../picker/picker";
import { Stage } from "../stage/stage";
import { StatsManager } from "../stats/stats";
import {
  acceleratedRaycast,
  computeBoundsTree,
  disposeBoundsTree
} from 'three-mesh-bvh';

export class IfcManager {

  private stage = new Stage();
  private ifcLoader = new IFCLoader();
  private cameraManager: CameraManager;
  private picker: Picker;

  constructor() {

    this.ifcLoader.ifcManager.setupThreeMeshBVH(
      computeBoundsTree,
      disposeBoundsTree,
      acceleratedRaycast);
    this.initLights();
    
    this.cameraManager = new CameraManager(this.stage);
    
    this.picker = new Picker(this.stage, this.ifcLoader.ifcManager);
    
    new StatsManager(this.stage);

    this.stage.renderer.domElement.addEventListener('dblclick', this.picker.pick.bind(this.picker));
  }

  async loadFile(file: File) {
    console.log('loading');
    const url = URL.createObjectURL(file);
    this.ifcLoader.ifcManager
    const model: IFCModel = await this.ifcLoader.loadAsync(url);
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