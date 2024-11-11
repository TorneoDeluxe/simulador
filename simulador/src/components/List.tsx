import { useState } from "react";
import Card from "./Card";

interface Props {
    data: string [];
    onSelect?: (element: string) => void;
}

function List({data, onSelect}: Props){
    function suma(num1: number, num2: number){
        return num1 + num2;
        
    }
    const [index, setIndex] = useState(-1);
    const handleClick = (i: number, element: string) => {
        setIndex(i);
        onSelect?.(element)
        return <>
        </>
    }
    return (
        <ul className="list-group">
        {data.map((element, i) => (
            <li onClick={ () => handleClick(i, element)} key={element}
            className= {`list-group-item ${index == i ? 'active': ''}`}>{element}</li>
        ))}
        </ul>
    )
}

export default List;