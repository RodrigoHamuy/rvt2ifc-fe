import {BoxGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer} from 'three';

export class Stage {

  protected camera: PerspectiveCamera;  
  protected scene: Scene;
  protected renderer: WebGLRenderer;  
  protected animateLoop: () => void;
  
  constructor(container: Element = document.body) {
    this.camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, .01, 1000)
    // this.camera.position.z = 1;

    this.scene = new Scene();

    this.renderer = new WebGLRenderer({antialias: true});
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0xa9a9a9, 1);
    container.appendChild(this.renderer.domElement);

    this.onMount();

    this.animateLoop = this.animate.bind(this);
    this.animate();
    
  }

  protected onMount() {}

  protected animate() {
    requestAnimationFrame(this.animateLoop);
    this.renderer.render(this.scene, this.camera);
  }

  protected onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}