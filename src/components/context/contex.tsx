import React, { createContext, FC, useEffect, useRef, useState } from "react";
import { IfcManager } from "../ifc-manager/ifc-manager";

const ifcViewer = new IfcManager();

export const R2iContext = createContext<R2IContextValue>({} as any);

export const R2iProvider : FC = ({children}) => {

    const [state, setState] = useState<R2iProviderState>({
        data: undefined,
    });
    const stateRef = useRef(state);
    stateRef.current = state;

    useEffect(()=>{
        ifcViewer.onPick(data=>setState({
            ...stateRef.current,
            data,
        }));
        ifcViewer.onUnpick(()=>{
            setState({
                ...stateRef.current,
                data: undefined,
            })
        })
    }, []);

    return <R2iContext.Provider value={{
        ...state,
        loadUrl: ifcViewer.loadUrl,
        loadFile: ifcViewer.loadFile,
        insertCanvas: ifcViewer.insertCanvas,
        find: ifcViewer.find.bind(ifcViewer),
    }}>{children}</R2iContext.Provider>
}

interface R2iProviderState {
    data?: any;
}

interface R2IContextValue extends R2iProviderState {
    loadUrl: (url: string) => void,
    loadFile: (file: File) => void,
    insertCanvas: (container: HTMLElement) => void,
    find: (filter: number[]) => void;

}