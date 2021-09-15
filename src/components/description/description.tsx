import React, { useContext } from "react";
import { R2iContext } from "../context/contex";
import { Code2Ifc } from "../ifc-manager/IfcTypesMap";
import classes from './description.module.scss';

const getDataList = (data: any) => {
    const values: [string, any][] = [['IFC Type', data.constructor.name]];

    for (const k in data) {
        if (Object.prototype.hasOwnProperty.call(data, k)) {
            if (!data[k]) {
                console.log(k, data[k]);
                continue
            };
            if (typeof data[k] === 'object') {
                if (data[k].value) {
                    values.push([k, data[k].value]);
                } else {
                    console.log(k, data[k].value);
                }
            } else {
                values.push([k, data[k]]);
            }
        }
    }
    return values;
}

export const Description = () => {

    const { data } = useContext(R2iContext);

    // data && console.log(data);

    if (!data) return <></>;
    
    const rows : [string, string|number][] = [
        ['Name', data.native.Name.value],
        ['IFC type', Code2Ifc[data.native.type]],
        ['Object type', data.native.ObjectType.value],
    ];

    const dimensions = data.quantity.find((q:any)=>q.Name.value === 'Dimensions');

    if(dimensions) {
        const values = dimensions.HasProperties.map((v:any)=>[v.Name.value, v.NominalValue.value]);
        console.log(...values);        
        for (const v of values) {
            if(v[0] === 'Area') v[1] = Math.round(v[1]*10000)/10000;
            if(v[0] === 'Length') v[1] = Math.round(v[1]*10000);
            if(v[0] === 'Volume') v[1] = Math.round(v[1]*1000)/1000;
        }

        rows.push(...values)
    }

    if(data.material.length) {
        let layers;
        if(data.material[0].ForLayerSet) layers = data.material[0].ForLayerSet.MaterialLayers;
        if(data.material[0].MaterialLayers) layers = data.material[0].MaterialLayers;
        else if(data.material[0].Name) rows.push([`layer name`, data.material[0].Name.value])
        if(layers) {
            for (let i = 0; i < layers.length; i++) {
                const m = layers[i];
                rows.push([`layer ${i} name`, m.Material.Name.value])
                rows.push([`layer ${i} thickness`, m.LayerThickness.value])
            }
        }
    }
    

    return <div className={classes.panel}>
        <div className={classes.header}>extracted</div>
        <ul className={classes.ul}>
            {rows.map((v, i) => (
                <li key={i} className={classes.li}>
                    <div>{v[0]}</div>
                    <div className={classes.value}>{v[1]}</div>
                </li>
            ))}
        </ul>
        {/* <div className={classes.header}>native</div>
        <ul className={classes.ul}>
            {getDataList(data.native).map((v, i) => (
                <li key={i} className={classes.li}>
                    <div>{v[0]}</div>
                    <div className={classes.value}>{v[1]}</div>
                </li>
            ))}
        </ul>
        <div className={classes.header}>material</div>
        <ul className={classes.ul}>
            {data.material.flatMap((m: any) => getDataList(m).map((v, i) => (
                <li key={i} className={classes.li}>
                    <div>{v[0]}</div>
                    <div className={classes.value}>{v[1]}</div>
                </li>
            )))}
        </ul>
        <div className={classes.header}>quantity</div>
        <ul className={classes.ul}>
            {data.quantity.flatMap((m: any, x: number) => getDataList(m).map((v, i) => (
                <li key={`${x}${i}`} className={classes.li}>
                    <div>{v[0]}</div>
                    <div className={classes.value}>{v[1]}</div>
                </li>
            )))}
        </ul> */}
    </div>
}