import { EventDispatcher, Intersection, Mesh, MeshLambertMaterial, Raycaster, Vector3 } from "three";
import { IFCManager } from "web-ifc-three/IFC/Components/IFCManager";
import { iListener } from "../../event/event";
import { Stage } from "../stage/stage";

export enum PICKER_EVENT {
  pick = 'pick',
  unpick = 'unpick',
};

export class Picker {
  
  private dispatcher = new EventDispatcher();

  private raycaster = new Raycaster();

  private preselectMat = new MeshLambertMaterial({
    transparent: true,
    opacity: .6,
    color: 0xff88ff,
    depthTest: false,
  })

  /** Current picked model ID */
  private modelID?: number;
  private expressID?: number;

  constructor(private stage: Stage, private ifc: IFCManager) {
    (this.raycaster as any).firstHitOnly = true;
    (globalThis as any).createSubset = this.createSubset.bind(this);    
  }

  cast(e: MouseEvent) {
    const bounds = this.stage.renderer.domElement.getBoundingClientRect();
    const x1 = e.clientX - bounds.left;
    const x2 = bounds.right - bounds.left;
    const x = (x1 / x2) * 2 - 1;

    const y1 = e.clientY - bounds.top;
    const y2 = bounds.bottom - bounds.top;
    const y = - (y1 / y2) * 2 + 1;

    this.raycaster.setFromCamera({ x, y }, this.stage.camera);

    const objs = this.raycaster.intersectObjects(this.stage.scene.children);

    return objs;
  }

  pick(e: MouseEvent) {
    const objs = this.cast(e);
    const found = objs[0];
    if (found) {
      const index = found.faceIndex!;
      const obj = found.object as (Mesh & { modelID: number });
      const geometry = obj.geometry;
      const expressID = this.ifc.getExpressId(geometry, index)!;
      if(expressID === this.expressID) return;
      this.createSubset(obj.modelID, expressID, found.face!.normal);
    } else {
      this.unpick();
    }
  }

  private createSubset(modelID: number, expressID: number, normal = new Vector3(.3,.3,.3).normalize()) {

    const data = {
      native: this.ifc.getItemProperties(modelID, expressID, true),
      material: this.ifc.getMaterialsProperties(modelID, expressID, true),
      type: this.ifc.getTypeProperties(modelID, expressID, true),
      quantity: this.ifc.getPropertySets(modelID, expressID, true),
    };

    console.log(data);    
    
    // if(!data.material.length) {
    //   console.log(`can't create subset`);
    //   return;
    // }
    
    this.modelID = modelID;
    this.expressID = expressID;


    const pickedObj = this.ifc.createSubset({
      modelID: this.modelID,
      ids: [this.expressID],
      material: this.preselectMat,
      scene: this.stage.scene,
      removePrevious: true,
    });

    if(!pickedObj) return;

    this.fire(PICKER_EVENT.pick, {
      normal: normal,
      object: pickedObj! as any,
      data,
    });

  }

  unpick = ()=> {
    if (this.modelID !== undefined) {
      console.log('unpick');
      this.ifc.removeSubset(this.modelID, this.stage.scene, this.preselectMat);
      this.modelID = undefined;
      this.expressID = undefined;
      this.fire(PICKER_EVENT.unpick);
    }
  }

  on(eventType: PICKER_EVENT, callback: iListener<PickEvent|undefined>) {
    this.dispatcher.addEventListener(eventType, callback as any);
  }

  private fire(eventType: PICKER_EVENT, data?: PickEvent) {
    this.dispatcher.dispatchEvent({type: eventType, data });
  }
}

export interface PickEvent {
  object: Mesh;
  normal: Vector3;
  data: any;
}