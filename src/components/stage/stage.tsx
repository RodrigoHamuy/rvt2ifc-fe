import { EventDispatcher, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { iListener } from '../../event/event';

export enum STAGE_EVENT {
  tick = 'tick',
  preTick = 'preTick',
  postTick = 'postTick',
}

export class Stage {
  
  private dispatcher = new EventDispatcher();

  camera: PerspectiveCamera;  
  scene: Scene;
  renderer: WebGLRenderer;
  
  constructor() {
    this.camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, .01, 1000);

    this.scene = new Scene();

    this.renderer = new WebGLRenderer({antialias: true, logarithmicDepthBuffer: true});
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0xa9a9a9, 1);

    window.addEventListener('resize', this.onWindowResize);

    this.animate(0);    
  }

  insertCanvas = (container: HTMLElement) => {
    this.renderer.domElement.style.position = 'absolute';
    this.renderer.domElement.style.top = '0px';
    container.prepend(this.renderer.domElement);
  }

  private animate = (time: number) => {
    this.fire(STAGE_EVENT.preTick, time);
    requestAnimationFrame(this.animate);
    this.fire(STAGE_EVENT.tick, time);
    this.renderer.render(this.scene, this.camera);
    this.fire(STAGE_EVENT.postTick, time);
  }

  private onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  onPreTick(callback: iListener<number>) {
    this.on(STAGE_EVENT.preTick, callback);
  }
  
  onTick(callback: iListener<number>) {
    this.on(STAGE_EVENT.tick, callback);
  }

  onPostTick(callback: iListener<number>) {
    this.on(STAGE_EVENT.postTick, callback);
  }

  off(eventType: STAGE_EVENT, callback: iListener) {
    this.dispatcher.removeEventListener(eventType, callback as any);
  }

  private on(eventType: STAGE_EVENT, callback: any) {
    this.dispatcher.addEventListener(eventType, callback);
  }

  private fire(eventType: STAGE_EVENT, data: any) {
    this.dispatcher.dispatchEvent({type: eventType, data });
  }
}