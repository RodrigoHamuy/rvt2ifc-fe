import gsap from 'gsap';
import { Box3, MathUtils, Object3D, Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DEG2RAD } from "three/src/math/MathUtils";
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
    
    let speed = 0;
    const maxSpeed = 1;
    const acc = 0.01;
    const targetDist = 10;

    let rotSpeed = 0;
    const rotMaxSpeed = 10;
    const rotAcc = 0.1;

    document.addEventListener('keypress', e=> {
      
      if(['ArrowUp', 'KeyW'].includes(e.code)) {
        const dir = new Vector3(0,0,-1).applyQuaternion(this.stage.camera.quaternion);
        speed = Math.min(speed + acc, maxSpeed);
        this.controls.target.add(dir.clone().multiplyScalar(speed));
        this.stage.camera.position.add(dir.clone().multiplyScalar(speed));
        this.controls.update();
      } else if(['ArrowDown', 'KeyS'].includes(e.code)) {
        const dir = new Vector3(0,0,-1).applyQuaternion(this.stage.camera.quaternion);
        speed = Math.max(speed - acc, -maxSpeed);   
        this.controls.target.add(dir.clone().multiplyScalar(speed));
        this.stage.camera.position.add(dir.clone().multiplyScalar(speed));
        this.controls.update();
      } else if(['ArrowLeft', 'KeyA'].includes(e.code)) {
        rotSpeed = Math.min(rotSpeed+rotAcc, rotMaxSpeed);
        const dir = new Vector3(0,0,-1).applyQuaternion(this.stage.camera.quaternion);
        dir.applyAxisAngle(new Vector3(0,1,0), rotSpeed*DEG2RAD);
        this.controls.target.copy(this.stage.camera.position.clone().add(dir.clone().multiplyScalar(targetDist)));
      } else if(['ArrowRight', 'KeyD'].includes(e.code)) {
        rotSpeed = Math.max(rotSpeed-rotAcc, -rotMaxSpeed);
        const dir = new Vector3(0,0,-1).applyQuaternion(this.stage.camera.quaternion);
        dir.applyAxisAngle(new Vector3(0,1,0), rotSpeed*DEG2RAD);
        this.controls.target.copy(this.stage.camera.position.clone().add(dir.clone().multiplyScalar(targetDist)));
      }
    })

    document.addEventListener('keyup', e => {
      if(['ArrowUp', 'KeyW'].includes(e.code)) {
        speed = 0;
      } else if(['ArrowDown', 'KeyS'].includes(e.code)) {
        speed = 0;
      } else if(['ArrowLeft', 'KeyA'].includes(e.code)) {
        rotSpeed = 0;
      } else if(['ArrowRight', 'KeyD'].includes(e.code)) {
        rotSpeed = 0;
      }
    })

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