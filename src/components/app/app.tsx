import React, { ChangeEventHandler, useCallback, useContext, useEffect, useRef } from 'react';
import { Vector3 } from 'three';
import { R2iContext } from '../context/contex';
import { Description } from '../description/description';
import { Ifc2Code } from '../ifc-manager/IfcTypesMap';
import classes from './app.module.scss';

function getSizeA() {
  const vecs = [
    new Vector3(0,0,0),
    new Vector3(0,0,1),
    new Vector3(0,1,0),
    new Vector3(5,0,0),
  ];

  const maxX = Math.max(...vecs.map(v => v.x))
  const minX = Math.min(...vecs.map(v => v.x))

  const maxY = Math.max(...vecs.map(v => v.y))
  const minY = Math.min(...vecs.map(v => v.y))

  const maxZ = Math.max(...vecs.map(v => v.z))
  const minZ = Math.min(...vecs.map(v => v.z))

  const res = new Vector3(Math.abs(maxX - minX), Math.abs(maxY - minY), Math.abs(maxZ - minZ));

  console.log(res);
}

function getSizeB() {
  const vecs = [
    new Vector3(0,0,0),
    new Vector3(0,0,1),
    new Vector3(0,1,0),
    new Vector3(5,0,0),
  ];

  const res = vecs.reduce((res, v)=>res.add(v), new Vector3());

  console.log(res);
}

getSizeA();
getSizeB();

function App() {

  const ref = useRef<HTMLDivElement>(undefined as any);

  const {loadFile, loadUrl, insertCanvas, find} = useContext(R2iContext);

  const onFileChange = useCallback<ChangeEventHandler<HTMLInputElement>>(e=>{    
    const file = e.target.files![0];
    loadFile(file);
  }, []);

  const findWalls = useCallback(()=>find([Ifc2Code.IFCWALLSTANDARDCASE]), [])

  const findDoors = useCallback(()=>find([Ifc2Code.IFCDOOR]), [])

  const findWindows = useCallback(()=>find([Ifc2Code.IFCWINDOW]), [])

  const findLabs = useCallback(()=>find([Ifc2Code.IFCSLAB]), [])

  const findBeams = useCallback(()=>find([Ifc2Code.IFCBEAM]), [])

  const findRoofs = useCallback(()=>find([Ifc2Code.IFCROOF]), [])

  const findColumns = useCallback(()=>find([Ifc2Code.IFCCOLUMN]), [])
  

  useEffect(()=>{
    insertCanvas(ref.current);
    loadUrl('project.ifc');
  }, []);
  
  return <div className={classes.container} ref={ref}>
    <input className={classes.file} type="file" name="ifc-file" accept="ifc" onChange={onFileChange} />
    <Description />
    <div className={classes.float}>
      <button onClick={findWalls}>walls</button>
      <button onClick={findDoors}>doors</button>
      <button onClick={findWindows}>windows</button>
      <button onClick={findLabs}>labs</button>
      <button onClick={findBeams}>beams</button>
      <button onClick={findRoofs}>roofs</button>
      <button onClick={findColumns}>columns</button>
      {/* <button disabled>instancing test</button> */}
    </div>
  </div>
}

export default App
