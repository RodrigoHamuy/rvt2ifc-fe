import { AmbientLight, DirectionalLight } from "three";
import {
  acceleratedRaycast,
  computeBoundsTree,
  disposeBoundsTree
} from 'three-mesh-bvh';
import { IFCModel } from "web-ifc-three/IFC/Components/IFCModel";
import { IFCLoader } from "web-ifc-three/IFCLoader";
import { CameraManager } from "../camera-manager/camera-manager";
import { Picker, PICKER_EVENT } from "../picker/picker";
import { Stage } from "../stage/stage";
import { StatsManager } from "../stats/stats";
import { Ifc2Code } from "./IfcTypesMap";

export class IfcManager {

  private stage = new Stage();
  private ifcLoader = new IFCLoader();
  private cameraManager: CameraManager;
  private picker: Picker;
  private model!: IFCModel;
  private ifcApi: any;

  constructor() {

    this.ifcLoader.ifcManager.setupThreeMeshBVH(
      computeBoundsTree,
      disposeBoundsTree,
      acceleratedRaycast);
    this.initLights();
    
    this.cameraManager = new CameraManager(this.stage);
    
    this.picker = new Picker(this.stage, this.ifcLoader.ifcManager);

    this.ifcApi = this.ifcLoader.ifcManager.ifcAPI;
    
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
      this.cameraManager.fitToFrame({ obj: this.model as any });
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
    // this.model.material = new MeshLambertMaterial({
    //   transparent: true,
    //   opacity: 0.1,
    //   color: 0x77aaff
    // });
    console.log(this.model.modelID);    
    this.stage.scene.add(this.model as any);
    this.cameraManager.fitToFrame({ obj: this.model as any, root: true });

    // this.getAll();
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

  find(filter: number[]) {
    // [
    //   Ifc2Code.IFCWALLSTANDARDCASE,
    //   Ifc2Code.IFCSLAB,
    //   Ifc2Code.IFCDOOR,
    //   Ifc2Code.IFCWINDOW,
    //   Ifc2Code.IFCBEAM,
    // ]
    const allItems = this.GetAllItems(this.model.modelID, filter)
    .filter(item=>item.customExtractedData.material.length);
    console.log(allItems);
    this.cameraManager.fitToFrame({ obj: this.model as any });
    if(!allItems.length) return;
    this.picker.createSubsets(
      this.model.modelID,
      allItems.map(a=>a.expressID)
    );
  }

  private getAll() {
    const allItems = this.GetAllItems(this.model.modelID, [])
    .filter(item=>item.customExtractedData.material.length);
    console.log(allItems);
    const wait = (seconds: number) => new Promise(resolve => setTimeout(resolve, seconds*100));
    (globalThis as any).loop = async ()=> {
      for (const item of allItems) {
        await wait(3);
        // console.log(item);        
        (globalThis as any).createSubset(this.model.modelID, item.expressID);
      }
    }

  }

  private GetAllItems(modelID: any, filter: number[]) {
    const allItems: any[] = [];
    const lines = this.ifcApi.GetAllLines(modelID);
    this.getAllItemsFromLines(modelID, lines, allItems, filter);
    return allItems;
}

  private getAllItemsFromLines(modelID: number, lines: any, allItems: any[], filter: number[]) {
      for (let i = 1; i <= lines.size(); i++) {
          try {
              this.saveProperties(modelID, lines, allItems, i, filter);
          } catch (e) {
              console.log(e);
          }
      }
  }

  private saveProperties(modelID: any, lines: any, allItems: any[], index: any, filter: number[]) {
      const itemID = lines.get(index);
      const props = this.ifcApi.GetLine(modelID, itemID);
      // if (!excludeGeometry || !geometryTypes.has(props.type)) {
      if (!filter.length || filter.includes(props.type)) {
        allItems.push(props);
        props.customExtractedData = {
          // native: this.ifcLoader.ifcManager.getItemProperties(modelID, props.expressID, true),
          material: this.ifcLoader.ifcManager.getMaterialsProperties(modelID, props.expressID, true),
          // type: this.ifcLoader.ifcManager.getTypeProperties(modelID, props.expressID, true),
          // quantity: this.ifcLoader.ifcManager.getPropertySets(modelID, props.expressID, true),
        };
      }
  }
}