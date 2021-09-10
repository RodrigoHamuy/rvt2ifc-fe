import { DirectionalLight, AmbientLight } from "three";
import { IFCModel } from "web-ifc-three/IFC/Components/IFCModel";
import { IFCLoader } from "web-ifc-three/IFCLoader";
import { CameraManager } from "../camera-manager/camera-manager";
import { Picker, PICKER_EVENT } from "../picker/picker";
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
  private model!: IFCModel;

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
    
    // mobile double tap support in progress
    // (()=>{
    //   let lastTouchTime : number | undefined;
    //   let lastTouchPos: {x: number, y: number} | undefined;
    //   this.stage.renderer.domElement.addEventListener('touchstart', (e)=> {
    //     const touch = e.touches[0];
    //     if(!lastTouchTime) {
    //       lastTouchTime = Date.now();
    //       lastTouchPos = {x: touch.pageX, y: touch.pageY};
    //     } else {
    //       if(Date.now() - lastTouchTime > 1000) {
    //         lastTouchTime = undefined;
    //         return;
    //       }
    //       this.stage.renderer
    //     }

    //   })
    // })();


    this.picker.on(PICKER_EVENT.pick, e=>{
      this.cameraManager.fitToFrame({ 
        obj: e.data!.object, 
        direction: e.data!.normal.clone().negate()
      });
    })

    this.picker.on(PICKER_EVENT.unpick, ()=>{
      this.cameraManager.fitToFrame({ obj: this.model });
    })
  }  

  onPick = (callback: (data: any)=>void) => {
    this.picker.on(PICKER_EVENT.pick, (e)=>{
      if(e.data?.data) callback(e.data.data)
    });
  }

  onUnpick = (callback: ()=>void) => {
    this.picker.on(PICKER_EVENT.unpick, callback);
  }

  insertCanvas = this.stage.insertCanvas;

  loadFile = async (file: File) => {
    console.log('loading');
    const url = URL.createObjectURL(file);
    return this.loadUrl(url);
  }

  loadUrl = async (url: string) => {
    if(this.model) {
      this.picker.unpick();
      this.model.parent?.remove(this.model);
      // this.model.remove();
      // this.model.clear();
    }
    this.model = await this.ifcLoader.loadAsync(url);
    this.stage.scene.add(this.model);
    this.cameraManager.fitToFrame({ obj: this.model, root: true });
    // console.log(this.model);
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