import { Box3, MathUtils, Object3D, Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Stage } from "../stage/stage";
import gsap from 'gsap';

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

  fitToFrame({ 
    obj, 
    root = false, 
    direction = this.stage.camera.getWorldDirection(new Vector3())
  }: FitToFrameParams) {

    const camera = this.stage.camera;

    const box = new Box3().setFromObject(obj);
    const boxSize = box.getSize(new Vector3()).length();
    const boxCenter = box.getCenter(new Vector3());    

    const halfSizeToFitOnScreen = boxSize * .5;
    const halfFovY = MathUtils.DEG2RAD * camera.fov * .5;
    const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);

    const position = direction.clone()
    .multiplyScalar(-distance)
    .add(boxCenter);
    
    if(root) {
      camera.far = distance * 4;
      camera.near = distance / 500;
      camera.updateProjectionMatrix();
  
      this.controls.maxDistance = distance * 2;
      this.controls.minDistance = distance/100;
    }   

    const targetFrom = this.controls.target.clone();
    const targetTo = boxCenter.clone();

    const postFrom = camera.position.clone();
    const posTo = position.clone();

    this.enableControls(false);

    const t = { v: 0 };
    
    gsap.to(t, {
      v: 1, 
      onUpdate: () => {
        camera.position.lerpVectors(postFrom, posTo, t.v);
        this.controls.target.lerpVectors(targetFrom, targetTo, t.v);
        this.controls.update();
      }, 
      onComplete: ()=> {
        this.enableControls(true);
      },
      duration: .5,
    }); 
  }

  private enableControls(value: boolean) {    
    this.controls.enableZoom = value;
    this.controls.enableKeys = value;
    this.controls.enablePan = value;
    this.controls.enableRotate = value;
  }
}

export interface FitToFrameParams { 
  obj: Object3D; 
  root?: boolean; 
  direction?: Vector3;
}