import{O as e,V as t,B as s,M as i,g as n,E as o,R as a,a as r,P as c,S as h,W as l,b as d,I as m,c as p,d as g,e as f,D as w,A as u,C as k,f as b,h as y}from"./vendor.13f572cd.js";var v,E,T,D;class M{constructor(t){this.stage=t,this.controls=new e(this.stage.camera,this.stage.renderer.domElement),this.controls.enableDamping=!1,this.controls.minDistance=.1,this.controls.maxDistance=100,this.controls.target.set(0,0,0),this.stage.camera.position.set(0,.4,.7),this.controls.update(),this.stage.onPreTick((()=>{this.controls.update()}))}fitToFrame({obj:e,root:o=!1,direction:a=this.stage.camera.getWorldDirection(new t)}){const r=this.stage.camera,c=(new s).setFromObject(e),h=c.getSize(new t).length(),l=c.getCenter(new t),d=.5*h,m=i.DEG2RAD*r.fov*.5,p=d/Math.tan(m),g=a.clone().multiplyScalar(-p).add(l);o&&(r.far=4*p,r.near=p/500,r.updateProjectionMatrix(),this.controls.maxDistance=2*p,this.controls.minDistance=p/100);const f=this.controls.target.clone(),w=l.clone(),u=r.position.clone(),k=g.clone();this.enableControls(!1);const b={v:0};n.to(b,{v:1,onUpdate:()=>{r.position.lerpVectors(u,k,b.v),this.controls.target.lerpVectors(f,w,b.v),this.controls.update()},onComplete:()=>{this.enableControls(!0)},duration:.5})}enableControls(e){this.controls.enableZoom=e,this.controls.enableKeys=e,this.controls.enablePan=e,this.controls.enableRotate=e}}(E=v||(v={})).pick="pick",E.unpick="unpick";class j{constructor(e,t){this.stage=e,this.ifc=t,this.dispatcher=new o,this.raycaster=new a,this.preselectMat=new r({transparent:!0,opacity:.6,color:16746751,depthTest:!1}),this.raycaster.firstHitOnly=!0}cast(e){const t=this.stage.renderer.domElement.getBoundingClientRect(),s=(e.clientX-t.left)/(t.right-t.left)*2-1,i=-(e.clientY-t.top)/(t.bottom-t.top)*2+1;this.raycaster.setFromCamera({x:s,y:i},this.stage.camera);return this.raycaster.intersectObjects(this.stage.scene.children)}pick(e){const t=this.cast(e)[0];if(t){const e=t.faceIndex,s=t.object,i=s.geometry;this.modelID=s.modelID;const n=this.ifc.getExpressId(i,e),o=this.ifc.createSubset({modelID:this.modelID,ids:[n],material:this.preselectMat,scene:this.stage.scene,removePrevious:!0});console.log("getItemProperties"),console.log(this.ifc.getItemProperties(this.modelID,n),!0),this.fire(v.pick,{normal:t.face.normal,object:o})}else void 0!==this.modelID&&(console.log("unpick"),this.ifc.removeSubset(this.modelID,this.stage.scene,this.preselectMat),this.modelID=void 0,this.fire(v.unpick))}on(e,t){this.dispatcher.addEventListener(e,t)}fire(e,t){this.dispatcher.dispatchEvent({type:e,data:t})}}(D=T||(T={})).tick="tick",D.preTick="preTick",D.postTick="postTick";class C{constructor(e=document.body){this.dispatcher=new o,this.animate=e=>{this.fire(T.preTick,e),requestAnimationFrame(this.animate),this.fire(T.tick,e),this.renderer.render(this.scene,this.camera),this.fire(T.postTick,e)},this.onWindowResize=()=>{this.camera.aspect=window.innerWidth/window.innerHeight,this.camera.updateProjectionMatrix(),this.renderer.setSize(window.innerWidth,window.innerHeight)},this.camera=new c(70,window.innerWidth/window.innerHeight,.01,1e3),this.scene=new h,this.renderer=new l({antialias:!0,logarithmicDepthBuffer:!0}),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.setClearColor(11119017,1),e.appendChild(this.renderer.domElement),window.addEventListener("resize",this.onWindowResize),this.animate(0)}onPreTick(e){this.on(T.preTick,e)}onTick(e){this.on(T.tick,e)}onPostTick(e){this.on(T.postTick,e)}off(e,t){this.dispatcher.removeEventListener(e,t)}on(e,t){this.dispatcher.addEventListener(e,t)}fire(e,t){this.dispatcher.dispatchEvent({type:e,data:t})}}class I{constructor(e){this.stats=new d,document.body.appendChild(this.stats.dom),this.stats.showPanel(0),this.stats.dom.style.removeProperty("left"),this.stats.dom.style.right="0px",e.onPreTick(this.stats.begin),e.onPostTick(this.stats.end)}}const P=new class{constructor(){this.stage=new C,this.ifcLoader=new m,this.ifcLoader.ifcManager.setupThreeMeshBVH(p,g,f),this.initLights(),this.cameraManager=new M(this.stage),this.picker=new j(this.stage,this.ifcLoader.ifcManager),new I(this.stage),this.stage.renderer.domElement.addEventListener("dblclick",this.picker.pick.bind(this.picker)),this.picker.on(v.pick,(e=>{this.cameraManager.fitToFrame({obj:e.data.object,direction:e.data.normal.clone().negate()})})),this.picker.on(v.unpick,(()=>{this.cameraManager.fitToFrame({obj:this.model})}))}async loadFile(e){console.log("loading");const t=URL.createObjectURL(e);return this.loadUrl(t)}async loadUrl(e){this.model=await this.ifcLoader.loadAsync(e),this.stage.scene.add(this.model),this.cameraManager.fitToFrame({obj:this.model,root:!0}),console.log(this.model)}initLights(){const e=new w(16772863,.8);e.position.set(1,1,1),this.stage.scene.add(e);const t=new w(16777215,.8);t.position.set(-1,.5,-1),this.stage.scene.add(t);const s=new u(16777198,.25);this.stage.scene.add(s)}};function L(){const e=k.exports.useCallback((e=>{const t=e.target.files[0];P.loadFile(t)}),[]);return k.exports.useEffect((()=>{P.loadUrl("project.ifc")}),[]),b.createElement("div",{style:{position:"absolute"}},b.createElement("input",{type:"file",name:"ifc-file",accept:"ifc",onChange:e}))}y.render(b.createElement(b.StrictMode,null,b.createElement(L,null)),document.getElementById("root"));
