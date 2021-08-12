import { Box3, MathUtils, Object3D, Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Stage } from "../stage/stage";

export class CameraManager {

  protected controls: OrbitControls;

  constructor(private stage: Stage) {

    this.controls = new OrbitControls(this.stage.camera, this.stage.renderer.domElement);
    this.controls.enableDamping = false;
    this.controls.minDistance = 0.1;
    this.controls.maxDistance = 100;
    this.controls.target.set(0,0,0);
    this.stage.camera.position.set(0, .4, .7);
    this.controls.update();

    this.stage.onPreTick(()=>{
      this.controls.update();
    });
  }

  fitToFrame(obj: Object3D) {
    const camera = this.stage.camera;
    const box = new Box3().setFromObject(obj);
    const boxSize = box.getSize(new Vector3()).length();
    const boxCenter = box.getCenter(new Vector3());

    const halfSizeToFitOnScreen = boxSize * .5;
    const halfFovY = MathUtils.DEG2RAD * camera.fov * .5;
    const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);

    const direction = camera.position.clone()
    .sub(boxCenter)
    .multiply(new Vector3(1, 0, 1))
    .normalize();

    const position = direction.clone()
    .multiplyScalar(distance)
    .add(boxCenter);

    camera.position.copy(position);
    camera.updateProjectionMatrix();
    camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);

    console.log(distance);    

    this.stage.camera.far = distance * 2;
    this.stage.camera.near = distance / 100;

    this.controls.maxDistance = distance;
    this.controls.minDistance = distance/100;

    this.controls.target.copy(boxCenter);
    this.controls.update();
  }
}