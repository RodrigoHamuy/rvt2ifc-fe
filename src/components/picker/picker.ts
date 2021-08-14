import { Mesh, MeshLambertMaterial, Raycaster } from "three";
import { IFCManager } from "web-ifc-three/IFC/Components/IFCManager";
import { Stage } from "../stage/stage";

export class Picker {

  private raycaster = new Raycaster();

  private preselectMat = new MeshLambertMaterial({
    transparent: true,
    opacity: .6,
    color: 0xff88ff,
    depthTest: false,
  })

  private current?: number;

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

    this.raycaster.setFromCamera({x, y}, this.stage.camera);

    const objs = this.raycaster.intersectObjects(this.stage.scene.children);

    return objs;
  }

  pick(e: MouseEvent) {
    const objs = this.cast(e);
    const found = objs[0];
    if(found) {
      const index = found.faceIndex!;
      const obj = found.object as (Mesh & { modelID: number });
      const geometry = obj.geometry;
      this.current = obj.modelID;
      this.ifc.createSubset({
        modelID: this.current,
        ids: [this.ifc.getExpressId(geometry, index)!],
        material: this.preselectMat,
        scene: this.stage.scene,
        removePrevious: true,
      });
      this.ifc.useJSONData
    } else {
      if(this.current !== undefined) {
        console.log('unpick');        
        this.ifc.removeSubset(this.current, this.stage.scene, this.preselectMat);
        this.current = undefined;
      }
    }
  }
}