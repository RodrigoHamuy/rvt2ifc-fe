import React, { ChangeEventHandler, useCallback } from 'react';
import { IfcManager } from '../ifc-manager/ifc-manager';

type InputChange = ChangeEventHandler<HTMLInputElement>;

const ifcViewer = new IfcManager();

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
