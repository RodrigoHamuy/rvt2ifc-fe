import { Stage } from "../stage/stage";
import { IFCLoader } from "web-ifc-three/IFCLoader";
import { IFCModel } from "web-ifc-three/IFC/Components/IFCModel";
import { AmbientLight, BoxGeometry, DirectionalLight, Mesh, MeshBasicMaterial, MeshLambertMaterial } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";


export class IfcViewer extends Stage {

  protected ifcLoader = new IFCLoader();
  protected controls!: OrbitControls;
  
  onMount() {
    this.initLights();    

    const geo = new BoxGeometry(.01,.01,.01);
    const mat = new MeshLambertMaterial({color: 0x00ff00});
    const cube = new Mesh(geo, mat);
    cube.name = 'cube';
    this.scene.add(cube);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = false;
    this.controls.minDistance = 0.1;
    this.controls.maxDistance = 100;
    this.controls.target.set(0,0,0);
    this.camera.position.set(0, .4, .7);
    this.controls.update();
  }

  async loadFile(file: File) {
    console.log('loading');    
    const url = URL.createObjectURL(file);
    const model : IFCModel = await this.ifcLoader.loadAsync(url);
    this.scene.add(model);
    console.log(model);
  }

  protected animate() {
    this.controls.update();
    super.animate();
  }

  protected initLights() {
    const light1 = new DirectionalLight(0xffeeff, 0.8);
    light1.position.set(1, 1, 1);
    this.scene.add(light1);
    const light2 = new DirectionalLight(0xffffff, 0.8);
    light2.position.set(-1, 0.5, -1);
    this.scene.add(light2);
    const ambientLight = new AmbientLight(0xffffee, 0.25);
    this.scene.add(ambientLight);
  }
}