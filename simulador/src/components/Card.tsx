import { ReactNode } from "react";

interface Props{
    children: ReactNode
}

interface CardBodyProps{
    title: string;
    text: string;
}
//Tendría que definir un tamaño para los elementos de la card en el caso de que la card esté en la lista y
// en el caso de que la card esté seleccionada individualmente.

function Card(props: Props){
    const {children} = props;

    return <div className="card">{children}</div>
}

export function CardBody(props: CardBodyProps){
    const {title, text} = props;
    return (
        <>
            <h5 className="card-title">{title}</h5>
            <p className="card-text">{text}</p>
        </>
    )
}

export default Card;