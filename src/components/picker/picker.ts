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

  constructor(private stage: Stage, private ifc: IFCManager) {
    (this.raycaster as any).firstHitOnly = true;
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
      this.modelID = obj.modelID;
      const expressID = this.ifc.getExpressId(geometry, index)!;
      const pickedObj = this.ifc.createSubset({
        modelID: this.modelID,
        ids: [expressID],
        material: this.preselectMat,
        scene: this.stage.scene,
        removePrevious: true,
      });
      
      // console.log(obj.position);
      // console.log(geometry.toJSON());

      // console.log(expressID);
      // console.log('getItemProperties');
      const data = {
        native: this.ifc.getItemProperties(this.modelID, expressID, false),
        material: this.ifc.getMaterialsProperties(this.modelID, expressID, false),
        type: this.ifc.getTypeProperties(this.modelID, expressID, false),
        quantity: this.ifc.getPropertySets(this.modelID, expressID, false),
      };
      // console.log(data);      
      // console.log(JSON.stringify(data, undefined, 2));
      // console.log('getMaterialsProperties');
      // console.log(this.ifc.getMaterialsProperties(this.modelID, expressID));
      // console.log('getPropertySets');
      // console.log(this.ifc.getPropertySets(this.modelID, expressID));
      // console.log('getSpatialStructure');
      // console.log(this.ifc.getSpatialStructure(this.modelID));
      // console.log('getAttribute');
      // console.log(geometry.getAttribute('position'));

      this.fire(PICKER_EVENT.pick, {
        normal: found.face!.normal,
        object: pickedObj!,
        data,
      });
    } else {
      this.unpick();
    }
  }

  unpick = ()=> {
    if (this.modelID !== undefined) {
      console.log('unpick');
      this.ifc.removeSubset(this.modelID, this.stage.scene, this.preselectMat);
      this.modelID = undefined;
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