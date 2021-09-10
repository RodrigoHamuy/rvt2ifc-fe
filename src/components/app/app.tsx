import React, { ChangeEventHandler, useCallback, useContext, useEffect, useRef } from 'react';
import { R2iContext } from '../context/contex';
import { Description } from '../description/description';
import classes from './app.module.scss';

function App() {

  const ref = useRef<HTMLDivElement>(undefined as any);

  const {loadFile, loadUrl, insertCanvas} = useContext(R2iContext);

  const onFileChange = useCallback<ChangeEventHandler<HTMLInputElement>>(e=>{    
    const file = e.target.files![0];
    loadFile(file);
  }, []);

  useEffect(()=>{
    insertCanvas(ref.current);
    loadUrl('project.ifc');
  }, []);
  
  return <div className={classes.container} ref={ref}>
    <input className={classes.file} type="file" name="ifc-file" accept="ifc" onChange={onFileChange} />
    <Description />
  </div>
}

export default App
