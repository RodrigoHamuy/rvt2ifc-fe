import React, { ChangeEventHandler, useCallback } from 'react'
import { IfcViewer } from '../ifc-viewer/ifc-viewer';

type InputChange = ChangeEventHandler<HTMLInputElement>;

const ifcViewer = new IfcViewer();

function App() {

  const onFileChange = useCallback<InputChange>(e=>{
    const file = e.target.files![0];
    ifcViewer.loadFile(file);
  }, []);
  
  return <div style={{position: 'absolute'}}>
    <input type="file" name="ifc-file" accept="ifc" onChange={onFileChange} />
  </div>
}

export default App
