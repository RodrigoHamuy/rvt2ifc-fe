import React, { useContext } from "react";
import { R2iContext } from "../context/contex";
import classes from './description.module.scss';

const getDataList = (data: any) => {
    const values: [string, any][] = [['IFC Type', data.constructor.name]];

    for (const k in data) {
        if (Object.prototype.hasOwnProperty.call(data, k)) {
            if(!data[k]) {
                console.log(k, data[k]); 
                continue
            };
            if(typeof data[k] === 'object') {
                if(data[k].value) {
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

    data && console.log(data);

    if (!data) return <></>;

    return <div className={classes.panel}>
        <ul className={classes.ul}>
            {getDataList(data).map((v, i) => (
                <li key={i} className={classes.li}>
                    <div>{v[0]}</div>
                    <div className={classes.value}>{v[1]}</div>
                </li>
            ))}
        </ul>
    </div>
}